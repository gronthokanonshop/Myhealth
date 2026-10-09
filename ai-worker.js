/* =========================================================================
   MY HEALTH — AI Assistant Worker (Cloudflare Workers)
   -------------------------------------------------------------------------
   Website-er chat -> ei Worker -> Claude API -> JSON (reply + product ids).
   API key ekhane SECRET hisebe thake — website-er code-e kokhono jay na.

   Setup (SETUP-GUIDE.md section 7):
     Variables and Secrets:
       ANTHROPIC_API_KEY  (Secret)    — console.anthropic.com > API Keys
       FIREBASE_DB_URL    (Text)      — https://myhealth-6a311-default-rtdb.asia-southeast1.firebasedatabase.app
       ALLOWED_ORIGINS    (Text, optional) — https://www.yourshop.com,https://yourshop.com

   Product list, dokaner tottho ar admin-er AI setting (model, instructions,
   rules) Worker nije Firebase theke pore (public data) — browser shudhu
   customer-er prosno pathay, tai keu ei Worker ke onno kaje use korte pare na.

   NOTE: Anthropic SDK-er bodole sorasori fetch() — karon Cloudflare dashboard-e
   code paste kore deploy korle npm package bundle kora jay na.
   ========================================================================= */

const MODELS = ['claude-opus-5-5', 'claude-sonnet-5-5'];
const DEFAULT_MODEL = 'claude-opus-5-5';
// purono setting-e save kora model → notun model (Haiku 4.5 Oct 2026-er por bondho hote pare)
const LEGACY_MODELS = { 'claude-opus-5': 'claude-opus-5-5', 'claude-sonnet-5': 'claude-sonnet-5-5', 'claude-haiku-4-5': 'claude-sonnet-5-5' };
const STORE_TTL_MS = 5 * 60 * 1000;          // Firebase data 5 min cache
const RATE_LIMIT = 12, RATE_WINDOW_MS = 10 * 60 * 1000;   // IP prati 10 min-e 12 ta prosno
const MAX_MESSAGES = 12, MAX_CHARS = 1000;

/* default category label (Firebase 'categories' khali thakle) */
const DEFAULT_CATEGORY_LABELS = {
  immunity:'Immunity', energy:'Energy', muscle:'Muscle', brain:'Brain', sleep:'Sleep', bones:'Bones', weight:'Weight',
  skin:'Skin & Hair supplements', cleanser:'Face Cleanser', moisturizer:'Moisturizer', sunscreen:'Sunscreen', serum:'Serum',
  shampoo:'Shampoo', hairoil:'Hair Oil', conditioner:'Conditioner', bodywash:'Body Wash', bodylotion:'Body Lotion',
  deodorant:'Deodorant', 'face-makeup':'Face Makeup', lips:'Lips', eyes:'Eyes', babycare:'Baby Care', maternity:'Maternity',
  beardcare:'Beard Care', shaving:'Shaving', honey:'Honey', drygoods:'Dry Goods / Nuts'
};

const OUTPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    reply:               { type: 'string' },
    reply_en:            { type: 'string' },   // website-er "Translate to English" button-er jonno
    product_ids:         { type: 'array', items: { type: 'integer' } },
    follow_up_questions: { type: 'array', items: { type: 'string' } },
    see_doctor:          { type: 'boolean' }
  },
  required: ['reply', 'reply_en', 'product_ids', 'follow_up_questions', 'see_doctor']
};

let storeCache = { at: 0, data: null };
const hits = new Map();

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request.headers.get('Origin') || '', env);
    if (!cors) return json({ error: 'origin_not_allowed' }, 403, {});
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    // admin panel "Test connection"
    if (request.method === 'GET') {
      return json({ ok: true, configured: !!(env.ANTHROPIC_API_KEY && env.FIREBASE_DB_URL) }, 200, cors);
    }
    if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, cors);
    if (!env.ANTHROPIC_API_KEY || !env.FIREBASE_DB_URL) return json({ error: 'not_configured' }, 500, cors);

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (rateLimited(ip)) return json({ error: 'rate_limited' }, 429, cors);

    let body;
    try { body = await request.json(); } catch { return json({ error: 'bad_json' }, 400, cors); }
    const messages = cleanMessages(body && body.messages);
    if (!messages) return json({ error: 'bad_messages' }, 400, cors);

    const store = await loadStore(env);
    if (store.cfg.enabled === false) return json({ error: 'disabled' }, 503, cors);

    const wanted = LEGACY_MODELS[store.cfg.model] || store.cfg.model;
    const model = MODELS.includes(wanted) ? wanted : DEFAULT_MODEL;
    const maxProducts = Math.max(2, Math.min(6, Number(store.cfg.maxProducts) || 4));

    const req = {
      model,
      max_tokens: 8000,   // Opus/Sonnet 5.5-e thinking sob somoy chalu — thinking + uttor duto-i ei limit-er moddhe
      // stable prefix (instructions + catalog) cache hoy — barbar prosno-te kom khoroch
      system: [{ type: 'text', text: buildSystemPrompt(store, maxProducts), cache_control: { type: 'ephemeral' } }],
      messages,
      output_config: { format: { type: 'json_schema', schema: OUTPUT_SCHEMA } }
    };
    const headers = {
      'content-type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    };
    // chat-er moto choto kaj-e low effort-i jotheshto (kom thinking = kom khoroch, druto uttor)
    req.output_config.effort = 'low';
    // safety classifier decline korle Anthropic-er recommended model-e auto retry (Opus 5.5 / Sonnet 5.5 duto-tei)
    req.fallbacks = 'default';
    headers['anthropic-beta'] = 'server-side-fallback-2026-07-01';

    let res, data;
    try {
      res = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers, body: JSON.stringify(req) });
      data = await res.json();
    } catch (e) {
      return json({ error: 'upstream_unreachable' }, 502, cors);
    }
    if (!res.ok) {
      console.log('Anthropic error', res.status, JSON.stringify(data && data.error));
      const code = res.status === 429 || res.status === 529 ? 'busy' : res.status === 401 ? 'bad_api_key' : 'upstream_error';
      return json({ error: code }, res.status === 401 ? 500 : 503, cors);
    }

    if (data.stop_reason === 'refusal') {
      return json({ reply: 'দুঃখিত, এ বিষয়ে এখানে সাহায্য করতে পারছি না। স্বাস্থ্য, সৌন্দর্য বা সুস্থতা নিয়ে জিজ্ঞেস করুন, অথবা আমাদের টিমের সাথে যোগাযোগ করুন।',
        replyEn: "Sorry, I can't help with that here. Please ask about a health, beauty or wellness concern, or contact our team.", products: [], followups: [], seeDoctor: false }, 200, cors);
    }
    const textBlock = (data.content || []).find(b => b.type === 'text');
    let out;
    try { out = JSON.parse(textBlock ? textBlock.text : ''); }
    catch { return json({ error: 'bad_model_output', stop_reason: data.stop_reason }, 502, cors); }

    // shudhu catalog-e thaka + stock-e thaka product
    const valid = new Map(store.products.filter(p => p.stock !== false).map(p => [Number(p.id), p]));
    const products = [...new Set((out.product_ids || []).map(Number))].filter(id => valid.has(id)).slice(0, maxProducts);

    return json({
      reply: String(out.reply || '').slice(0, 2000),
      replyEn: String(out.reply_en || '').slice(0, 2000),
      products,
      followups: (out.follow_up_questions || []).map(String).filter(Boolean).slice(0, 3),
      seeDoctor: !!out.see_doctor
    }, 200, cors);
  }
};

/* ---------------- helpers ---------------- */
function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { ...headers, 'content-type': 'application/json; charset=utf-8' } });
}
function corsHeaders(origin, env) {
  const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim().replace(/\/+$/, '')).filter(Boolean);
  // ALLOWED_ORIGINS set thakle shudhu oi site (Origin header chara request-o bondho)
  if (allowed.length && !allowed.includes(origin)) return null;
  return {
    'Access-Control-Allow-Origin': allowed.length ? origin || allowed[0] : '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}
/* best-effort per-IP limit (Worker instance-er memory-te) */
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  if (list.length >= RATE_LIMIT) { hits.set(ip, list); return true; }
  list.push(now); hits.set(ip, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.length || now - v[v.length - 1] > RATE_WINDOW_MS) hits.delete(k);
  return false;
}
/* user/assistant palakrome, shuru user diye, length limit */
function cleanMessages(raw) {
  if (!Array.isArray(raw)) return null;
  const out = [];
  for (const m of raw.slice(-MAX_MESSAGES)) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') continue;
    const content = m.content.trim().slice(0, MAX_CHARS);
    if (!content) continue;
    if (!out.length && m.role !== 'user') continue;
    const last = out[out.length - 1];
    if (last && last.role === m.role) last.content += '\n' + content;
    else out.push({ role: m.role, content });
  }
  return out.length && out[out.length - 1].role === 'user' ? out : null;
}
async function loadStore(env) {
  if (storeCache.data && Date.now() - storeCache.at < STORE_TTL_MS) return storeCache.data;
  const base = String(env.FIREBASE_DB_URL).replace(/\/+$/, '');
  const get = p => fetch(`${base}/${p}.json`).then(r => (r.ok ? r.json() : null)).catch(() => null);
  const [cfg, products, settings, categories] = await Promise.all([get('aiConfig'), get('products'), get('settings'), get('categories')]);
  const list = v => (Array.isArray(v) ? v : v && typeof v === 'object' ? Object.values(v) : []).filter(Boolean);
  const data = { cfg: cfg || {}, products: list(products).filter(p => p.id != null && p.name), settings: settings || {}, categories: list(categories) };
  storeCache = { at: Date.now(), data };
  return data;
}

function buildSystemPrompt(store, maxProducts) {
  const s = store.settings, cfg = store.cfg;
  const brand = s.brand || 'My Health';
  const labels = { ...DEFAULT_CATEGORY_LABELS };
  store.categories.forEach(c => {
    if (!c || !c.id) return;
    labels[c.id] = c.label;
    (Array.isArray(c.subs) ? c.subs : Object.values(c.subs || {})).forEach(sub => { if (sub && sub.id) labels[sub.id] = `${c.label} > ${sub.label}`; });
  });
  const catOf = p => (Array.isArray(p.cats) && p.cats.length ? p.cats : p.goal ? [p.goal] : []).map(id => labels[id] || id).join(', ');
  const oneLine = v => String(v || '').replace(/\s+/g, ' ').trim();

  const catalog = [...store.products].sort((a, b) => Number(a.id) - Number(b.id)).map(p => {
    const desc = oneLine(p.desc).slice(0, 180);
    const ben = (Array.isArray(p.benefits) ? p.benefits : []).slice(0, 3).map(oneLine).join('; ');
    const use = p.use && p.use.dose ? ` | use: ${oneLine(p.use.dose)}${p.use.when ? ', ' + oneLine(p.use.when) : ''}` : '';
    return `#${p.id} | ${oneLine(p.name)} | ${oneLine(p.brand) || '-'} | ${catOf(p)} | ৳${p.price} | ${p.stock === false ? 'OUT OF STOCK' : 'in stock'} | ${desc}${ben ? ' | benefits: ' + ben : ''}${use}`;
  }).join('\n');

  const rules = (Array.isArray(cfg.rules) ? cfg.rules : Object.values(cfg.rules || {})).filter(r => r && r.keywords).map(r => {
    const ids = (Array.isArray(r.products) ? r.products : Object.values(r.products || {})).map(Number).filter(Boolean);
    return `- When the customer mentions "${oneLine(r.keywords)}": prefer products ${ids.map(i => '#' + i).join(', ') || '(none)'}${r.note ? `. Owner's advice: ${oneLine(r.note)}` : ''}`;
  }).join('\n');

  const free = Number(s.freeDeliveryOver) > 0 ? `, free delivery on orders over ৳${s.freeDeliveryOver}` : '';
  const contact = [s.hotline && !/X{3}/.test(s.hotline) ? `hotline ${s.hotline}` : '', s.whatsapp && !/X{3}/.test(s.whatsapp) ? `WhatsApp +${s.whatsapp}` : ''].filter(Boolean).join(', ');

  return `You are "${oneLine(cfg.assistantName) || 'Health Assistant'}", the shopping assistant on the website of ${brand}, an online health, beauty and wellness store in Bangladesh. Customers describe a problem or need; you recommend suitable products from the catalog below and give short, practical tips.

How to reply:
- Always write "reply" in simple, natural Bangla (Bangla script), whatever language the customer writes in — Bangla, Banglish or English. Keep common product words like shampoo, serum or protein as they are.
- Also write "reply_en": the same reply translated into plain English, with the same meaning and **bold** parts. The website shows it only when the customer taps "Translate to English".
- Be warm and brief: 2–5 sentences, plus up to 3 short "•" bullet tips when helpful. Plain text only; **bold** is allowed, no headings, tables or links.
- Recommend only catalog products, through product_ids (up to ${maxProducts}, best match first). Never recommend items marked OUT OF STOCK. The website shows each recommended product as a card with name, price and an Add-to-cart button, so don't repeat product names or prices in the reply — refer to them generally (for example "the biotin capsules below"). Never invent products, prices, discounts or health claims beyond the catalog descriptions.
- If nothing in the catalog fits, say so honestly and return an empty product_ids.
- If the request is vague, ask one short clarifying question; still suggest products when a reasonable match exists.
- If the message is unrelated to health, beauty, wellness or this shop, politely say what you can help with and return an empty product_ids.
- follow_up_questions: 0–3 short questions the customer might tap next, written in Bangla from the customer's point of view (for example "কিভাবে খাবো?").

Safety — you are a shop assistant, not a doctor:
- Never diagnose, never suggest prescription medicine, never promise a cure.
- Red-flag symptoms (chest pain, breathing difficulty, fainting, seizures, severe or sudden pain, high or long-lasting fever, bleeding, blood in vomit or stool, sudden unexplained weight loss, thoughts of self-harm): tell them to see a doctor or go to hospital now (Bangladesh emergency number 999), set see_doctor to true and return no products.
- For pregnancy, breastfeeding, children under 12, chronic illness (diabetes, high blood pressure, heart, kidney, liver, thyroid) or anyone on regular medicine: suggest checking with their doctor before taking supplements and set see_doctor to true. Gentle cosmetics and food items are fine to suggest.

Shop facts (use only when asked): delivery ৳${s.deliveryFee ?? 60} inside Dhaka and ৳${s.deliveryFeeOuter ?? 120} outside Dhaka${free}; Cash on Delivery, bKash and Nagad accepted; 100% authentic products${contact ? `; contact: ${contact}` : ''}. For order status, ask them to use the "Track Order" page with their Order ID and phone number.
${cfg.instructions ? `\nInstructions from the shop owner (follow these):\n${String(cfg.instructions).trim()}\n` : ''}${rules ? `\nThe owner's preferred products for common problems:\n${rules}\n` : ''}
CATALOG — one product per line: #id | name | brand | category | price | stock | description | benefits | usage
${catalog}`;
}
