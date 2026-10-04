/* =========================================================================
   MY HEALTH — shared app.js (sob page e include kora hoy)
   -------------------------------------------------------------------------
   EI FILE TA EKBAR EDIT KORLEI SOB PAGE E UPDATE HOY.
   1) CONFIG      -> default brand, phone, delivery fee (admin > Settings > Store
                     theke override hoy — code edit na korei)
   2) CATEGORIES  -> default category tree (admin > Categories theke override hoy)
   3) PRODUCTS    -> product.js (seed) / Firebase (live)
   ========================================================================= */

/* ---------------- CONFIG ----------------
   Ei value gula DEFAULT. Admin panel > Settings > "Store Settings" e kichu
   save korle Firebase 'settings' node theke oi value e boshe jay (sob page e). */
const CONFIG = {
  brand:            "My Health",
  tagline:          "Health, Beauty & Wellness",
  /* ⚠️ DOMAIN PLACEHOLDER — domain kena hole ekhane (ba admin > Settings e) real URL boshao (sese / chara). */
  siteUrl:          "https://YOUR-DOMAIN.com",
  currency:         "৳",
  hotline:          "16XXX",
  whatsapp:         "8801XXXXXXXXX",   // WhatsApp number (880 diye, + chara)
  email:            "support@YOUR-DOMAIN.com",
  address:          "Dhaka, Bangladesh",
  tradeLicense:     "",
  themeColor:       "#3BB77E",          // site-er main color (admin > Store Settings > Theme color)
  announcement:     "",                 // utilbar-e custom offer line (khali = free delivery line)
  footerAbout:      "Bangladesh's trusted store for authentic health, beauty & wellness products. Delivered to all 64 districts.",
  /* manual mobile payment — number boshale checkout-e number + TrxID field dekhabe */
  bkash:            "",  bkashType: "Personal",   // Personal = Send Money, Merchant = Payment
  nagad:            "",  nagadType: "Personal",
  /* social links — khali thakle footer e icon dekhabe na */
  facebook: "", instagram: "", youtube: "", tiktok: "",
  /* marketing/analytics — ID boshale nije theke chalu hobe */
  gaId:             "",   // Google Analytics 4 — "G-XXXXXXXXXX"
  fbPixel:          "",   // Facebook Pixel ID
  deliveryFee:      60,        // Dhaka-r bhitore (৳)
  deliveryFeeOuter: 120,       // Dhaka-r baire (৳)
  usdRate:          0,         // ৳ per $1 — 0 hole USD dam dekhabe na (e.g. 123)
  socialProof:      'on',      // 'on' = asol order theke "Someone in Sylhet just ordered…" popup
  freeDeliveryOver: 5000,      // ei amount er beshi hole free delivery (0 = free delivery off)
  storageKey:       "myhealth_cart",
  /* LEGACY coupon fallback — admin > Coupons e banano coupon age check hoy.
     Firebase-e same code thakle oitai cholbe (active/expiry/min order soho). */
  coupons: {
    "HEALTH10": 10,
    "FIT15":    15
  }
};
const CONFIG_DEFAULTS = JSON.parse(JSON.stringify(CONFIG));

/* ---------------- CATEGORIES ----------------
   Top-level category -> subcategories. Header nav, menu, homepage rows ar
   category.html filtering ei tree diye hoy. Product er `cats` (ba purono `goal`)
   e subcategory id (ba top-level id) thake. */
const CATEGORIES = [
  { id:"supplements", label:"Vitamins & Supplements", subs:[
      { id:"immunity", label:"Immunity",   note:"Vit C · Zinc" },
      { id:"energy",   label:"Energy",     note:"B-Complex" },
      { id:"muscle",   label:"Muscle",     note:"Whey · BCAA" },
      { id:"brain",    label:"Brain",      note:"Omega-3" },
      { id:"sleep",    label:"Sleep",      note:"Magnesium" },
      { id:"bones",    label:"Bones",      note:"Calcium · D3" },
      { id:"weight",   label:"Weight",     note:"Fat burner" },
      { id:"skin",     label:"Skin & Hair",note:"Biotin" },
  ]},
  { id:"facecare", label:"Face Care", subs:[
      { id:"cleanser",    label:"Cleanser",    note:"Face wash" },
      { id:"moisturizer", label:"Moisturizer", note:"Cream · Lotion" },
      { id:"sunscreen",   label:"Sunscreen",   note:"SPF protection" },
      { id:"serum",       label:"Serum",       note:"Targeted care" },
  ]},
  { id:"haircare", label:"Hair Care", subs:[
      { id:"shampoo",     label:"Shampoo",     note:"Cleanse & nourish" },
      { id:"hairoil",     label:"Hair Oil",    note:"Growth · Shine" },
      { id:"conditioner", label:"Conditioner", note:"Smooth & soft" },
  ]},
  { id:"bodycare", label:"Body Care", subs:[
      { id:"bodywash",  label:"Body Wash",  note:"Cleanse" },
      { id:"bodylotion",label:"Body Lotion",note:"Moisturize" },
      { id:"deodorant", label:"Deodorant",  note:"Fresh all day" },
  ]},
  { id:"makeup", label:"Makeup", subs:[
      { id:"face-makeup", label:"Face",  note:"Foundation · Powder" },
      { id:"lips",        label:"Lips",  note:"Lipstick · Gloss" },
      { id:"eyes",        label:"Eyes",  note:"Mascara · Liner" },
  ]},
  { id:"motherbaby", label:"Mother & Baby", subs:[
      { id:"babycare",  label:"Baby Care", note:"Gentle & safe" },
      { id:"maternity", label:"Maternity", note:"Pre & post natal" },
  ]},
  { id:"menscare", label:"Men's Care", subs:[
      { id:"beardcare", label:"Beard Care", note:"Oil · Wax" },
      { id:"shaving",   label:"Shaving",    note:"Razor · Foam" },
  ]},
  { id:"foods", label:"Foods", subs:[
      { id:"honey",    label:"Honey",     note:"Natural sweetener" },
      { id:"drygoods", label:"Dry Goods", note:"Nuts · Seeds" },
  ]},
];
const CATEGORIES_DEFAULTS = JSON.parse(JSON.stringify(CATEGORIES));

/* flattened subcategory list (goalObj, goalLabel, search, filters) —
   CATEGORIES bodlale rebuildGoals() abar banay */
const GOALS = [];
function rebuildGoals(){
  GOALS.length = 0;
  CATEGORIES.forEach(c => (c.subs||[]).forEach(s => GOALS.push({...s, parent: c.id})));
}
rebuildGoals();

function categoryOf(subId){ return CATEGORIES.find(c => c.id===subId || (c.subs||[]).some(s=>s.id===subId)); }
function categoryObj(id){ return CATEGORIES.find(c=>c.id===id); }

/* ---------------- CUSTOMER REVIEWS (homepage slider) ---------------- */
const REVIEWS = [
  { name:"Rafiul Islam",   area:"Dhaka",      rating:5, text:"Whey protein ta 100% original mone hoyeche — packaging, seal sob thik chilo. Same day delivery peyechi!", product:"Whey Protein Isolate" },
  { name:"Sadia Afrin",    area:"Chattogram", rating:5, text:"Vitamin C ar Zinc regular khacchi, shordi-kashi onek kome geche. Dam o onno jaygar cheye kom.", product:"Vitamin C + Zinc" },
  { name:"Mahmudul Hasan", area:"Sylhet",     rating:4, text:"Omega-3 er quality khub bhalo, fishy smell nei. Delivery 2 din legechilo, tobe packaging solid.", product:"Omega-3 Fish Oil" },
  { name:"Nusrat Jahan",   area:"Rajshahi",   rating:5, text:"Collagen powder 1 mash use korchi — skin onek soft hoyeche. Customer service o khub helpful.", product:"Collagen Peptides" },
  { name:"Tanvir Ahmed",   area:"Khulna",     rating:5, text:"Creatine ar pre-workout duitai nilam. Gym er performance e clear difference. Trusted shop!", product:"Creatine Monohydrate" },
  { name:"Farhana Akter",  area:"Dhaka",      rating:4, text:"Magnesium khawar por ghum onek better hoyeche. bKash payment o smooth chilo.", product:"Magnesium Glycinate" },
];

/* ---------------- INFO / POLICY PAGES (page.html?p=xxx) ----------------
   HTML lekha jabe (<h3>, <ul><li>). {brand}, {hotline} ityadi CONFIG theke boshe. */
const PAGES = {
  about: {
    title: "About Us",
    html: `
      <p>{brand} is a trusted online store in Bangladesh for 100% authentic health, beauty and wellness products. Our goal is simple — genuine products at honest prices, delivered right to your door.</p>
      <div class="about-stats">
        <div><b>{productCount}+</b><span>Products</span></div>
        <div><b>{brandCount}+</b><span>Trusted brands</span></div>
        <div><b>{categoryCount}</b><span>Categories</span></div>
        <div><b>64</b><span>Districts delivered</span></div>
      </div>
      <h3>Why choose us?</h3>
      <ul>
        <li><b>100% Authentic</b> — sourced directly from brands and authorized importers.</li>
        <li><b>Quality checked</b> — every product is checked before it ships.</li>
        <li><b>Fast delivery</b> — same-day in Dhaka, 12–48 hours nationwide.</li>
        <li><b>Easy payment</b> — Cash on Delivery, bKash and Nagad.</li>
      </ul>
      <p>Have a question? Visit our <a href="page.html?p=contact">Contact page</a> — we're happy to help.</p>`
  },
  contact: {
    title: "Contact Us",
    html: `
      <p>For any question, complaint or order enquiry, please get in touch. We're open every day from 9:00 AM to 10:00 PM.</p>
      <ul>
        <li><b>Hotline:</b> <a href="tel:{hotline}">{hotline}</a></li>
        <li><b>WhatsApp:</b> <a href="{waLink}" target="_blank" rel="noopener">{whatsapp}</a></li>
        <li><b>Email:</b> <a href="mailto:{email}">{email}</a></li>
        <li><b>Address:</b> {address}</li>
      </ul>
      <p>To check your order status, use the <a href="track.html">Track Order</a> page.</p>`
  },
  delivery: {
    title: "Delivery Information",
    html: `
      <h3>Delivery charges</h3>
      <ul>
        <li>Inside Dhaka: <b>৳{deliveryFee}</b></li>
        <li>Outside Dhaka (nationwide): <b>৳{deliveryFeeOuter}</b></li>
        {freeDeliveryLine}
      </ul>
      <h3>Delivery time</h3>
      <ul>
        <li>Dhaka: same-day / next-day.</li>
        <li>Outside Dhaka: 12–48 hours (depending on area).</li>
      </ul>
      <p>After you place an order, we'll call to confirm it. With Cash on Delivery you can pay when the product reaches your hands.</p>`
  },
  return: {
    title: "Return & Refund Policy",
    html: `
      <p>Your satisfaction matters to us. Returns and replacements are accepted under the following conditions:</p>
      <ul>
        <li>Let us know within <b>24 hours</b> of receiving the product.</li>
        <li>Wrong, damaged or expired items qualify for a <b>free replacement</b> or a full refund.</li>
        <li>For safety reasons, products with a broken seal or opened packaging cannot be returned (unless the product itself is faulty).</li>
        <li>Refunds are processed to the original payment method within 3–7 working days.</li>
      </ul>
      <p>To start a return, <a href="page.html?p=contact">contact us</a> or message us on WhatsApp with your Order ID.</p>`
  },
  privacy: {
    title: "Privacy Policy",
    html: `
      <p>{brand} respects your privacy. This policy explains what information we collect and how we use it.</p>
      <h3>What we collect</h3>
      <ul>
        <li>Name, phone number and address — to process and deliver your order.</li>
        <li>Email (optional) — to send order updates and offers you sign up for.</li>
        <li>Questions you type into our AI assistant — stored without your name or phone number, only to improve suggestions. Please don't share personal details in the chat.</li>
      </ul>
      <h3>How we use it</h3>
      <ul>
        <li>Only for order confirmation, delivery and customer service.</li>
        <li>Your information is <b>never sold</b> to any third party.</li>
        <li>Couriers receive only the details needed for delivery (name, phone, address).</li>
      </ul>
      <p>To have your data removed or to learn more, please contact us.</p>`
  },
  terms: {
    title: "Terms & Conditions",
    html: `
      <p>By using this website, you agree to the following terms:</p>
      <ul>
        <li>Product prices and stock may change without prior notice.</li>
        <li>Orders are confirmed after our phone confirmation.</li>
        <li>Supplements are not a treatment for any disease and are <b>not a substitute for a balanced diet</b>. Consult a doctor if you are pregnant, nursing, or taking medication.</li>
        <li>We reserve the right to cancel any order if the information appears incorrect or suspicious.</li>
      </ul>
      <p>For any details, please <a href="page.html?p=contact">contact us</a>.</p>`
  },
  faq: {
    title: "Frequently Asked Questions",
    html: `
      <h3>Are the products genuine?</h3>
      <p>Yes — all our products are 100% authentic, sourced directly from brands or authorized suppliers and quality-checked.</p>
      <h3>How do I place an order?</h3>
      <p>Add your chosen products to the cart → go to Checkout and enter your name, phone and address → pick a payment method and place the order. We'll call to confirm.</p>
      <h3>What payment methods do you accept?</h3>
      <p>Cash on Delivery (pay when you receive the product), bKash and Nagad.</p>
      <h3>How long does delivery take?</h3>
      <p>Same-day/next-day in Dhaka, 12–48 hours outside Dhaka. See <a href="page.html?p=delivery">Delivery Info</a> for details.</p>
      <h3>How do I track my order?</h3>
      <p>Enter your Order ID and phone number on the <a href="track.html">Track Order</a> page to see its real-time status.</p>`
  }
};

/* ---------------- PRODUCTS ----------------
   Product list ALADA file e: product.js  (HTML e app.js er age load hoy)
------------------------------------------------------------------------- */

/* =========================================================================
   HELPERS
   ========================================================================= */
const money   = n => CONFIG.currency + Number(n||0).toLocaleString('en-IN');
const findP   = id => PRODUCTS.find(p => p.id === Number(id));
const goalObj = id => GOALS.find(g => g.id === id);
const goalLabel = id => (goalObj(id)?.label) || (categoryObj(id)?.label) || id;
const stars   = r => { const n = Math.max(0, Math.min(5, Math.round(Number(r)||0))); return "★".repeat(n) + "☆".repeat(5-n); };
const TIMING  = { morning:"Morning", postworkout:"Post-workout", night:"Before bed", anytime:"Anytime" };
const param   = key => new URLSearchParams(location.search).get(key);
const esc     = s => String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* stock:false = out of stock. Field na thakle in-stock dhora hoy (admin e notun product jate hariye na jay). */
const inStock = p => !!p && p.stock !== false && !(typeof p.qty === 'number' && p.qty <= 0);
/* stock quantity (admin e deya thakle) — cart-e er beshi neya jabe na */
const hasQty = p => !!p && typeof p.qty === 'number';
const maxQty = p => hasQty(p) ? Math.max(0, Math.min(99, p.qty)) : 99;
/* optional USD price (admin > Settings e rate deya thakle) */
const usdText = n => Number(CONFIG.usdRate) > 0 ? `($${(Number(n)/Number(CONFIG.usdRate)).toFixed(2)})` : '';
/* SKU — admin e deya thakle oita, na hole id theke */
const skuOf = p => p.sku || ('MH-' + String(p.id).padStart(5,'0'));
/* product-er sob category id — notun `cats` array, na thakle purono `goal` */
const getCats = p => (Array.isArray(p?.cats) && p.cats.length) ? p.cats : (p?.goal ? [p.goal] : []);
/* product ki ei filter (sub id / top-level id / 'all') er moddhe pore? */
function productInCat(p, filterId){
  if(!filterId || filterId === 'all') return true;
  const cats = getCats(p);
  if(cats.includes(filterId)) return true;
  const cat = categoryObj(filterId);
  return !!cat && (cat.subs||[]).some(s => cats.includes(s.id));
}
const discountPct = p => (p && p.oldPrice > p.price) ? Math.round((1 - p.price/p.oldPrice) * 100) : 0;
/* "+88 017-1234 5678" / bangla digit — sob ke 01XXXXXXXXX e anay */
function normalizePhone(s){
  let d = String(s||'').replace(/[০-৯]/g, c => '০১২৩৪৫৬৭৮৯'.indexOf(c)).replace(/\D/g,'');
  if(d.startsWith('880')) d = d.slice(2);
  if(d.length === 10 && d.startsWith('1')) d = '0' + d;
  return d;
}
function waNumber(){ const n = (CONFIG.whatsapp||'').replace(/[^0-9]/g,''); return /X/i.test(CONFIG.whatsapp||'') || n.length < 10 ? '' : n; }
const isPlaceholder = v => !v || /X{3,}|YOUR-DOMAIN/i.test(String(v));

/* Product source priority:  Firebase  ->  product.js seed (fallback).
   LIVE listener — admin e add/edit korlei khola page e sathe sathe update hoy.
   Checkout/track/account page e live re-render bondho (NO_LIVE_RERENDER). */
function bootProducts(done){
  if(window.fdb){
    let first = true;
    window.fdb.ref('products').on('value', snap=>{
      const val = snap.val();
      if(val){
        const arr = Object.values(val).filter(Boolean);
        if(arr.length){ PRODUCTS.length = 0; arr.forEach(p=>PRODUCTS.push(p)); }
      }
      if(first){ first = false; done(); return; }
      if(window.NO_LIVE_RERENDER) return;
      if(typeof initPage === 'function') initPage();
      updateCartUI(); updateWishUI(); refreshWishHearts(); refreshAddButtons();
    }, e=>{
      console.warn('Firebase products load failed, using seed:', e);
      if(first){ first = false; done(); }
    });
  } else {
    done();
  }
}

/* =========================================================================
   STORE SETTINGS + CATEGORIES (admin-editable, Firebase 'settings' / 'categories')
   Prothome localStorage cache diye render (instant), tarpor Firebase theke
   fresh value ene — bodlale header/footer abar render hoy.
   ========================================================================= */
const SETTING_TEXT = ['brand','tagline','siteUrl','hotline','whatsapp','email','address','tradeLicense','themeColor','socialProof','announcement',
  'footerAbout','bkash','bkashType','nagad','nagadType','facebook','instagram','youtube','tiktok','gaId','fbPixel'];
const SETTING_NUM  = ['deliveryFee','deliveryFeeOuter','freeDeliveryOver','usdRate'];
const STORE_CACHE  = 'myhealth_store';
let STORE_SIG = '';

function applySettings(s){
  Object.keys(CONFIG_DEFAULTS).forEach(k=>{ CONFIG[k] = JSON.parse(JSON.stringify(CONFIG_DEFAULTS[k])); });
  if(!s || typeof s !== 'object'){ applyTheme(CONFIG.themeColor); return; }
  SETTING_TEXT.forEach(k=>{
    if(typeof s[k] !== 'string') return;
    const v = s[k].trim();
    if(!v && (k==='brand' || k==='siteUrl')) return;   // ei duita khali rakha jabe na
    CONFIG[k] = v;
  });
  SETTING_NUM.forEach(k=>{
    if(s[k] === '' || s[k] == null) return;
    const n = Number(s[k]);
    if(isFinite(n) && n >= 0) CONFIG[k] = n;
  });
  CONFIG.siteUrl = CONFIG.siteUrl.replace(/\/+$/,'');
  applyTheme(CONFIG.themeColor);
}
/* theme color -> --leaf, --leaf-d (gaarho), --leaf-l (halka) ityadi CSS variable */
function applyTheme(hex){
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex||'').trim());
  if(!m) return;
  const n = parseInt(m[1], 16), rgb = [n >> 16 & 255, n >> 8 & 255, n & 255];
  const mix = (t, w) => '#' + rgb.map(c => Math.round(c + (t - c) * w).toString(16).padStart(2,'0')).join('');
  const root = document.documentElement.style;
  root.setProperty('--leaf', '#' + m[1]);
  root.setProperty('--leaf-d', mix(0, .14));
  root.setProperty('--leaf-dd', mix(0, .38));
  root.setProperty('--leaf-l', mix(255, .84));
  root.setProperty('--leaf-ll', mix(255, .94));
  root.setProperty('--brand-rgb', rgb.join(','));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#' + m[1]);
}
function applyCategories(list){
  const restore = () => { CATEGORIES.length = 0; JSON.parse(JSON.stringify(CATEGORIES_DEFAULTS)).forEach(c=>CATEGORIES.push(c)); rebuildGoals(); };
  if(list && !Array.isArray(list) && typeof list === 'object') list = Object.values(list);
  if(!Array.isArray(list)){ restore(); return; }
  const arr = v => Array.isArray(v) ? v : (v && typeof v === 'object' ? Object.values(v) : []);
  const clean = list.filter(c => c && c.id && c.label).map(c => ({
    id: String(c.id), label: String(c.label),
    subs: arr(c.subs).filter(s => s && s.id && s.label).map(s => ({ id:String(s.id), label:String(s.label), note:String(s.note||'') }))
  }));
  if(!clean.length){ restore(); return; }
  CATEGORIES.length = 0; clean.forEach(c=>CATEGORIES.push(c)); rebuildGoals();
}
/* page load-er shuru te cache theke apply (render-er age) */
(function applyCachedStore(){
  try{
    const raw = localStorage.getItem(STORE_CACHE);
    if(!raw) return;
    const c = JSON.parse(raw);
    applySettings(c.settings); applyCategories(c.categories);
    STORE_SIG = raw;
  }catch(e){}
})();
/* Firebase theke fresh settings — return: Promise<boolean> (kichu bodleche kina) */
function loadStoreConfig(){
  if(!window.fdb) return Promise.resolve(false);
  const get = path => window.fdb.ref(path).once('value').then(s=>s.val(), ()=>undefined);
  const timeout = new Promise(r => setTimeout(()=>r('timeout'), 5000));
  return Promise.race([Promise.all([get('settings'), get('categories')]), timeout]).then(res=>{
    if(res === 'timeout') return false;
    const [settings, categories] = res;
    if(settings === undefined && categories === undefined) return false;   // rules publish hoyni / offline
    const snap = JSON.stringify({ settings: settings||null, categories: categories||null });
    if(snap === STORE_SIG) return false;
    STORE_SIG = snap;
    try{ localStorage.setItem(STORE_CACHE, snap); }catch(e){}
    applySettings(settings); applyCategories(categories);
    return true;
  }).catch(()=>false);
}

/* -------- logo mark (heart + pulse) — ASOL logo-r rong (orange), theme color bodlaleo eta bodlay na -------- */
const BRAND_MARK = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="48" fill="#ffffff"/><path d="M50 76C31 59 21 47 21 37.5 21 29 27.5 23.5 35 23.5c6 0 11 4 15 10 4-6 9-10 15-10 7.5 0 14 5.5 14 14 0 9.5-10 21.5-29 38.5z" fill="#EA7317"/><polyline points="27,49 40,49 44,40 50,59 55,35 60,49 73,49" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/></svg>`;

/* -------- Branded placeholder (photo nai / load fail) -------- */
function placeholderHTML(){
  const parts = (CONFIG.brand||'My Health').split(' ');
  return `<span class="img-ph" aria-hidden="true">
    <span class="ph-mark">${BRAND_MARK}</span>
    <span class="ph-brand"><span class="ph-name"><span class="o">${esc(parts[0])}</span>${parts.length>1?' '+esc(parts.slice(1).join(' ')):''}</span><span class="ph-sub">${esc(CONFIG.tagline)}</span></span>
  </span>`;
}
function imgFallback(el){
  const s = document.createElement('span');
  s.className = 'img-emoji';
  s.innerHTML = placeholderHTML();
  el.replaceWith(s);
}
function brandWordmark(){
  const parts = (CONFIG.brand||'My Health').split(' ');
  const name = `<span class="o">${esc(parts[0])}</span>${parts.length>1?' '+esc(parts.slice(1).join(' ')):''}`;
  return `<span class="wm"><span class="wm-name">${name}</span><small>${esc(CONFIG.tagline)}</small></span>`;
}
function imgHTML(p, alt){
  return p.img
    ? `<img src="${esc(p.img)}" alt="${esc(alt||'')}" loading="lazy" onerror="imgFallback(this)">`
    : placeholderHTML();
}

/* =========================================================================
   ANALYTICS EVENTS — FB Pixel + GA4 (ID na thakle kichu hoy na)
   ViewContent / AddToCart / InitiateCheckout / Purchase — FB ad optimize er jonno
   ========================================================================= */
const GA_EVENT = { ViewContent:'view_item', AddToCart:'add_to_cart', InitiateCheckout:'begin_checkout', Purchase:'purchase' };
function trackEvent(name, data){
  try{
    data = Object.assign({ currency:'BDT' }, data||{});
    if(window.fbq) window.fbq('track', name, data);
    if(window.gtag) window.gtag('event', GA_EVENT[name]||name, { currency:'BDT', value:data.value, items:(data.content_ids||[]).map(id=>({item_id:String(id)})) });
  }catch(e){}
}

/* =========================================================================
   CART (localStorage — sob page e share kore)
   ========================================================================= */
let cart = loadCart();
let wishlist = loadWishlist();

function loadCart(){ try{ return JSON.parse(localStorage.getItem(CONFIG.storageKey)) || {}; }catch(e){ return {}; } }
function saveCart(){ try{ localStorage.setItem(CONFIG.storageKey, JSON.stringify(cart)); }catch(e){} }
function loadWishlist(){ try{ return new Set((JSON.parse(localStorage.getItem('myhealth_wishlist')) || []).map(Number)); }catch(e){ return new Set(); } }
function saveWishlist(){ try{ localStorage.setItem('myhealth_wishlist', JSON.stringify([...wishlist])); }catch(e){} }

/* ---- Recently viewed (product page e add hoy) ---- */
function getRecent(){ try{ return (JSON.parse(localStorage.getItem('myhealth_recent'))||[]).map(Number).filter(Boolean); }catch(e){ return []; } }
function pushRecent(id){
  id = Number(id);
  const r = getRecent().filter(x=>x!==id); r.unshift(id);
  try{ localStorage.setItem('myhealth_recent', JSON.stringify(r.slice(0,12))); }catch(e){}
}

/* ---- Coupon ----
   localStorage e {code,type,value,minOrder} rakhe. type: 'percent' | 'flat'.
   validateCoupon() Firebase coupons/{CODE} check kore (na pele CONFIG.coupons legacy). */
function getCoupon(){
  try{
    const raw = localStorage.getItem('myhealth_coupon');
    if(!raw) return null;
    if(raw.charAt(0) !== '{'){   // purono format: shudhu code string
      const code = raw.toUpperCase();
      return CONFIG.coupons[code] ? { code, type:'percent', value:CONFIG.coupons[code], minOrder:0 } : null;
    }
    const c = JSON.parse(raw);
    return c && c.code ? c : null;
  }catch(e){ return null; }
}
function setCoupon(c){
  try{
    if(c) localStorage.setItem('myhealth_coupon', JSON.stringify({ code:c.code, type:c.type, value:c.value, minOrder:c.minOrder||0 }));
    else localStorage.removeItem('myhealth_coupon');
  }catch(e){}
}
function couponDiscount(c, sub){
  if(!c || !sub) return 0;
  if(c.minOrder && sub < c.minOrder) return 0;
  if(c.type === 'flat') return Math.min(Math.round(Number(c.value)||0), sub);
  return Math.min(Math.round(sub * (Number(c.value)||0) / 100), sub);
}
const couponText = c => c.type === 'flat' ? `${money(c.value)} off` : `${c.value}% off`;
function validateCoupon(rawCode){
  const code = String(rawCode||'').trim().toUpperCase();
  if(!/^[A-Z0-9_-]{2,30}$/.test(code)) return Promise.reject(new Error('Invalid coupon code'));
  const legacy = () => CONFIG.coupons[code] ? { code, type:'percent', value:CONFIG.coupons[code], minOrder:0 } : null;
  if(!window.fdb){ const l = legacy(); return l ? Promise.resolve(l) : Promise.reject(new Error('Invalid coupon code')); }
  return window.fdb.ref('coupons/'+code).once('value').then(snap=>{
    const c = snap.val();
    if(!c){ const l = legacy(); if(l) return l; throw new Error('Invalid coupon code'); }
    if(c.active === false) throw new Error('This coupon is no longer active');
    if(c.expires && new Date().toISOString().slice(0,10) > c.expires) throw new Error('This coupon has expired');
    return { code, type: c.type==='flat' ? 'flat' : 'percent', value: Number(c.value)||0, minOrder: Number(c.minOrder)||0 };
  }, ()=>{ const l = legacy(); if(l) return l; throw new Error('Invalid coupon code'); });
}

function addToCart(id, qty){
  id = Number(id); qty = qty || 1;
  const p = findP(id);
  if(!p) return;
  if(!inStock(p)){ toast("Sorry, this item is out of stock"); return; }
  const max = maxQty(p);
  if((cart[id]||0) >= max){ toast(`Only ${max} available — already in your cart`); return; }
  const want = (cart[id]||0) + qty;
  cart[id] = Math.min(max, want);
  saveCart(); updateCartUI(); refreshAddButtons();
  toast(want > max ? `Only ${max} available — added ${max}` : "Added to cart ✓");
  trackEvent('AddToCart', { content_ids:[id], content_type:'product', value: p.price*qty });
}
function changeQty(id, delta){
  id = Number(id);
  const max = maxQty(findP(id));
  if(delta > 0 && (cart[id]||0) >= max){ toast(`Only ${max} available`); return; }
  cart[id] = Math.min(max, (cart[id]||0) + delta);
  if(cart[id] <= 0) delete cart[id];
  saveCart(); updateCartUI(); refreshAddButtons();
}
function removeItem(id){ delete cart[Number(id)]; saveCart(); updateCartUI(); refreshAddButtons(); }

const freeDeliveryOn = () => Number(CONFIG.freeDeliveryOver) > 0;
function cartTotals(){
  let count=0, sub=0;
  for(const id in cart){ const p=findP(id); if(!p) continue; count+=cart[id]; sub+=p.price*cart[id]; }
  const coupon = getCoupon();
  const discount = couponDiscount(coupon, sub);
  const delivery = (sub===0 || (freeDeliveryOn() && sub>=CONFIG.freeDeliveryOver)) ? 0 : CONFIG.deliveryFee;
  return { count, sub, coupon, discount, delivery, total: sub - discount + delivery };
}

function refreshAddButtons(){
  document.querySelectorAll('[data-add]').forEach(btn=>{
    const id = Number(btn.dataset.add);
    if(btn.disabled) return;
    const q = cart[id];
    if(btn.classList.contains('pc-add')){
      btn.classList.toggle('in', !!q);
      btn.innerHTML = q ? `✓ Added (${q})` : `${ICO.cart} Add`;
    }
  });
}

/* =========================================================================
   ICONS (inline SVG — sob jaygay ek style)
   ========================================================================= */
const ICO = {
  cart:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M6 6 5 3H2"/></svg>`,
  bolt:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>`,
  heart:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-4.6-9.3-9C1 8.5 2.5 5.5 5.5 5.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3 0 4.5 3 2.8 6.5C19 16.4 12 21 12 21z"/></svg>`,
  eye:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`,
  user:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>`,
  menu:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
  grid:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
  chev:   `<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`,
  left:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`,
  right:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`,
  arrow:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  up:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>`,
  phone:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>`,
  pin:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
  mail:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
  clock:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  tag:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>`,
  truck:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="13" height="10" rx="1"/><path d="M14 9h4l4 4v3h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>`,
  cash:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 10v4M18 10v4"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3.5v6c0 4.5-3.4 7.6-8 9-4.6-1.4-8-4.5-8-9v-6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>`,
  ret:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>`,
  spark:  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2zm7 11l.95 2.55L22.5 16.5l-2.55.95L19 20l-.95-2.55L15.5 16.5l2.55-.95L19 13z"/></svg>`,
  compare:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>`,
  bell:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
  home:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>`,
  bag:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1 14H5z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>`,
  share:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>`,
  heartPulse:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 1 1 12 6a5 5 0 1 1 7.5 6.6z"/><path d="M5 12h3l1.5-3 3 6 1.5-3h5"/></svg>`,
  mic:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>`,
  bellOn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0M4 2 2 4M20 2l2 2"/></svg>`,
  box:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>`,
  route:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H16a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h7.5"/></svg>`,
  star:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.6 7 .8-5.2 4.8 1.5 7L12 17.6 5.7 21.2l1.5-7L2 9.4l7-.8z"/></svg>`,
};

/* =========================================================================
   PRODUCT CARD (shared markup) — links to product.html?id=
   ========================================================================= */
function productCard(p){
  const off = discountPct(p);
  const q = cart[p.id];
  const oos = !inStock(p);
  const mainCat = getCats(p)[0];
  const tags = p.tags || [];
  const badge = oos ? `<span class="pc-badge oos">Sold out</span>`
    : off > 0 ? `<span class="pc-badge">-${off}%</span>`
    : tags.includes('new') ? `<span class="pc-badge new">New</span>`
    : tags.includes('best') ? `<span class="pc-badge hot">Hot</span>` : '';
  const r = Number(p.rating) || 0;
  return `
  <article class="pcard${oos?' is-oos':''}">
    <div class="pc-media">
      ${badge}
      <a class="pc-img" href="product.html?id=${p.id}" aria-label="${esc(p.name)}">${imgHTML(p, p.name)}</a>
      <div class="pc-actions">
        <button class="pc-act ${wishlist.has(p.id)?'on':''}" data-wish="${p.id}" onclick="toggleWish(${p.id})" aria-label="Add to wishlist" title="Wishlist">${ICO.heart}</button>
        <button class="pc-act ${compareList.includes(p.id)?'on':''}" data-cmp="${p.id}" onclick="toggleCompare(${p.id})" aria-label="Add to compare" title="Compare">${ICO.compare}</button>
        <button class="pc-act pc-qv" onclick="openQuickView(${p.id})" aria-label="Quick view" title="Quick view">${ICO.eye}</button>
      </div>
      ${!oos && hasQty(p) && p.qty <= 5 ? `<span class="pc-low">Only ${p.qty} left</span>` : ''}
    </div>
    <div class="pc-body">
      ${mainCat ? `<a class="pc-cat" href="category.html?goal=${encodeURIComponent(mainCat)}">${esc(goalLabel(mainCat))}</a>` : ''}
      <h3 class="pc-name"><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
      ${r ? `<div class="pc-rating"><span class="stars">${stars(r)}</span> (${r.toFixed(1)})</div>` : ''}
      ${p.brand ? `<div class="pc-brand">By <b>${esc(p.brand)}</b></div>` : ''}
      <div class="pc-foot">
        <div class="pc-price"><b>${money(p.price)}</b>${p.oldPrice>p.price ? `<s>${money(p.oldPrice)}</s>` : ''}${usdText(p.price) ? `<small class="pc-usd">${usdText(p.price)}</small>` : ''}</div>
        <div class="pc-btns">
          <button class="pc-add ${q?'in':''}" data-add="${p.id}" ${oos?'disabled':''} onclick="addToCart(${p.id})">${oos ? 'Sold out' : (q ? `✓ Added (${q})` : `${ICO.cart} Add`)}</button>
          ${oos ? `<a class="pc-buy pc-notify" href="product.html?id=${p.id}#back-in-stock" title="Get notified when it's back">${ICO.bell} Notify</a>`
                : `<button class="pc-buy" onclick="quickBuy(${p.id})">${ICO.bolt} Buy</button>`}
        </div>
      </div>
    </div>
  </article>`;
}
/* "Buy" — cart-e na thakle 1 ta add kore sorasori checkout */
function quickBuy(id){
  const p = findP(id);
  if(!p || !inStock(p)){ toast('Sorry, this item is out of stock'); return; }
  if(!cart[p.id]){ cart[p.id] = 1; saveCart(); trackEvent('AddToCart', { content_ids:[p.id], content_type:'product', value:p.price }); }
  location.href = 'checkout.html';
}
/* horizontal row-er arrow button */
function scrollRow(id, dir){
  const el = document.getElementById(id); if(!el) return;
  el.scrollBy({ left: dir * Math.max(240, el.clientWidth * .8), behavior:'smooth' });
}
/* listing e out-of-stock product sobar sheshe */
const stockFirst = (a,b) => (inStock(b) - inStock(a));

/* =========================================================================
   COMPARE — sorbochcho 4 ta product pasapasi (compare.html)
   ========================================================================= */
let compareList = (()=>{ try{ return (JSON.parse(localStorage.getItem('myhealth_compare'))||[]).map(Number).filter(Boolean).slice(0,4); }catch(e){ return []; } })();
function saveCompare(){ try{ localStorage.setItem('myhealth_compare', JSON.stringify(compareList)); }catch(e){} }
function toggleCompare(id){
  id = Number(id);
  if(compareList.includes(id)){
    compareList = compareList.filter(x=>x!==id);
    toast('Removed from compare');
  } else {
    if(compareList.length >= 4){ toastAction('You can compare up to 4 products', 'compare.html', 'Open compare'); return; }
    compareList.push(id);
    toastAction(`Added to compare (${compareList.length}/4)`, 'compare.html', 'Compare now →');
  }
  saveCompare(); refreshCompareUI();
  if(typeof onCompareChange === 'function') onCompareChange();
}
function refreshCompareUI(){
  const b = document.getElementById('cmpBadge'); if(b) b.textContent = compareList.length;
  document.querySelectorAll('[data-cmp]').forEach(el=> el.classList.toggle('on', compareList.includes(Number(el.dataset.cmp))));
}

function toggleWish(id){
  id = Number(id);
  wishlist.has(id) ? wishlist.delete(id) : wishlist.add(id);
  saveWishlist();
  refreshWishHearts();
  updateWishUI();
  toast(wishlist.has(id) ? "Added to wishlist ♥" : "Removed from wishlist");
}
function refreshWishHearts(){
  document.querySelectorAll('[data-wish]').forEach(el=>{
    el.classList.toggle('on', wishlist.has(Number(el.dataset.wish)));
  });
}
function moveToCart(id){ addToCart(id); wishlist.delete(Number(id)); saveWishlist(); refreshWishHearts(); updateWishUI(); }
function removeWish(id){ wishlist.delete(Number(id)); saveWishlist(); refreshWishHearts(); updateWishUI(); }

/* =========================================================================
   SHARED CHROME — header + nav + cart drawer + toast (inject into every page)
   ========================================================================= */
function topbarMsg(){
  if(CONFIG.announcement) return esc(CONFIG.announcement);
  return freeDeliveryOn()
    ? `🚚 <b>Free delivery</b> on orders over <b>${money(CONFIG.freeDeliveryOver)}</b> · Same-day in Dhaka`
    : `🚚 <b>Fast delivery</b> across Bangladesh · Same-day in Dhaka`;
}
/* category-r chobi: admin-er upload kora > oi category-r prothom product-er chobi > prothom okkhor */
let CAT_IMAGES = {};
function catThumb(c){
  if(CAT_IMAGES[c.id]) return `<img src="${esc(CAT_IMAGES[c.id])}" alt="" loading="lazy">`;
  const p = PRODUCTS.find(p=>p.img && productInCat(p, c.id));
  return p ? `<img src="${esc(p.img)}" alt="" loading="lazy">` : esc((c.label||'?').charAt(0));
}
const PASTELS = ['var(--p1)','var(--p2)','var(--p3)','var(--p4)','var(--p5)','var(--p6)','var(--p7)','var(--p8)'];
function browseDropHTML(){
  return CATEGORIES.map((c,i)=>`
    <div class="bd-cat">
      <a href="category.html?goal=${encodeURIComponent(c.id)}"><span class="bd-ico" style="background:${PASTELS[i%PASTELS.length]}">${catThumb(c)}</span>${esc(c.label)}</a>
      ${(c.subs||[]).length ? `<div class="bd-subs">${c.subs.map(s=>`<a href="category.html?goal=${encodeURIComponent(s.id)}">${esc(s.label)}</a>`).join('')}</div>` : ''}
    </div>`).join('') + `<a class="bd-all" href="category.html?goal=all">Browse all products →</a>`;
}
function fillBrowse(){ const d = document.getElementById('browseDrop'); if(d) d.innerHTML = browseDropHTML(); }
function toggleBrowse(e){
  e && e.stopPropagation();
  const b = document.getElementById('browse'); if(!b) return;
  const open = b.classList.toggle('open');
  b.querySelector('.browse-btn')?.setAttribute('aria-expanded', open);
}
document.addEventListener('click', e=>{ if(!e.target.closest('.browse')) document.getElementById('browse')?.classList.remove('open'); });

function buildHeader(){
  const user = window.currentUser;
  const hot = CONFIG.hotline ? esc(CONFIG.hotline) : '';
  return `
  <div class="topbar">
    <div class="wrap">
      <nav class="tb-links" aria-label="Quick links">
        <a href="page.html?p=about">About Us</a><a href="account.html">My Account</a><button onclick="openWish()">Wishlist</button><a href="track.html">Order Tracking</a>
      </nav>
      <div class="tb-msg">${topbarMsg()}</div>
      ${hot ? `<div class="tb-help">Need help? Call us: <a href="tel:${hot}">${hot}</a></div>` : ''}
    </div>
  </div>
  <header class="site">
    <div class="wrap head-main">
      <button class="menu-btn" onclick="openMenu()" aria-label="Open menu">${ICO.menu}</button>
      <a class="logo" href="index.html" aria-label="${esc(CONFIG.brand)} home">
        <span class="mark">${BRAND_MARK}</span>
        ${brandWordmark()}
      </a>
      <div class="search" role="search">
        <input id="globalSearch" type="search" autocomplete="off" placeholder="Search for products, brands, problems…" aria-label="Search products"
          oninput="liveSearch(this.value)"
          onkeydown="if(event.key==='Enter') goSearch(this.value); if(event.key==='Escape') closeSearch();" />
        ${SPEECH ? `<button class="search-mic" type="button" onclick="voiceSearch(this)" aria-label="Search by voice" title="Search by voice">${ICO.mic}</button>` : ""}
        <button class="search-go" onclick="goSearch(document.getElementById('globalSearch').value)" aria-label="Search">${ICO.search}</button>
        <div class="search-results" id="searchResults"></div>
      </div>
      <div class="head-actions">
        <a class="iconbtn hide-sm" href="compare.html" aria-label="Compare">${ICO.compare}<span class="badge" id="cmpBadge">${compareList.length}</span><span class="lbl">Compare</span></a>
        <div class="notify" id="notify">
          <button class="iconbtn" onclick="toggleNotify(event)" aria-label="Notifications">${ICO.bell}<span class="badge" id="ntBadge" style="display:none">0</span><span class="lbl">Notify</span></button>
          <div class="nt-drop" id="ntDrop"></div>
        </div>
        <button class="iconbtn" onclick="openWish()" aria-label="Wishlist">${ICO.heart}<span class="badge" id="wishBadge">${wishlist.size}</span><span class="lbl">Wishlist</span></button>
        <button class="iconbtn" onclick="openCart()" aria-label="Cart">${ICO.cart}<span class="badge" id="cartBadge">0</span><span class="lbl">Cart</span></button>
        <a class="iconbtn acct-btn" href="account.html" aria-label="Account">${ICO.user}<span class="lbl" id="acctLabel">${user ? esc(user.displayName || 'My Account') : 'Account'}</span></a>
      </div>
    </div>
  </header>
  <nav class="mainnav" id="mainNav" aria-label="Main">
    <div class="wrap">
      <div class="browse" id="browse">
        <button class="browse-btn" onclick="toggleBrowse(event)" aria-expanded="false">${ICO.grid} Browse All Categories ${ICO.chev}</button>
        <div class="browse-drop" id="browseDrop">${browseDropHTML()}</div>
      </div>
      <div class="nav-links">
        <a href="index.html" data-nav="index">Home</a>
        <a class="nav-ai" href="index.html#aiSection" data-ai-link onclick="if(window.openAI){event.preventDefault();openAI();}">${ICO.spark} Ask AI</a>
        <a class="nav-flash" href="category.html?goal=all&tag=flash">${ICO.bolt} Flash Sales</a>
        <a href="category.html?goal=all" data-nav="category">Shop</a>
        <a class="nav-tools" href="health-tools.html" data-nav="health-tools">${ICO.heartPulse} Health Tools <i class="free-tag">ফ্রি</i></a>
        <a href="track.html" data-nav="track">Track Order</a>
        <a href="blog.html" data-nav="blog">Blog</a>
        <a href="page.html?p=contact">Contact Us</a>
      </div>
      ${hot ? `<a class="nav-hot" href="tel:${hot}">${ICO.phone}<div><b>${hot}</b><small>24/7 Support Center</small></div></a>` : ''}
    </div>
  </nav>`;
}

const SOCIAL_ICONS = {
  facebook:  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v9h4v-9H17l.5-4h-4V8.8c0-.5.3-.8.5-.8z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>`,
  youtube:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 0 0 1 7.5 31 31 0 0 0 .6 12a31 31 0 0 0 .4 4.5 3 3 0 0 0 2.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 0 0 2.1-2.1c.3-1.5.4-3 .4-4.5s-.1-3-.4-4.5zM9.7 15V9l5.6 3-5.6 3z"/></svg>`,
  tiktok:    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 2h-3.3v13.2a2.9 2.9 0 1 1-2-2.8V9a6.3 6.3 0 1 0 5.3 6.2V8.6a7.9 7.9 0 0 0 4.5 1.4V6.7a4.6 4.6 0 0 1-4.5-4.7z"/></svg>`,
};
function payBadges(){ return ['COD','bKash','Nagad']; }
function buildFooter(){
  const socials = ['facebook','instagram','youtube','tiktok'].filter(k=>CONFIG[k] && /^https?:\/\//i.test(CONFIG[k]));
  const wa = waNumber();
  const hot = CONFIG.hotline ? esc(CONFIG.hotline) : '';
  const feats = [
    [ICO.tag,    'Best prices & offers', 'Coupons & daily deals'],
    [ICO.truck,  freeDeliveryOn() ? 'Free delivery' : 'Fast delivery', freeDeliveryOn() ? `On orders over ${money(CONFIG.freeDeliveryOver)}` : 'To all 64 districts'],
    [ICO.cash,   'Cash on Delivery', 'Pay when you receive'],
    [ICO.shield, '100% Authentic', 'Direct from brands'],
    [ICO.ret,    'Easy returns', 'Hassle-free policy'],
  ];
  return `
  <div class="wrap">
    <div class="foot-feats">${feats.map(([ic,t,s])=>`<div class="ff-item"><span class="ff-ico">${ic}</span><div><b>${t}</b><small>${s}</small></div></div>`).join('')}</div>
  </div>
  <div class="foot-main">
    <div class="wrap foot-grid">
      <div>
        <a class="logo" href="index.html"><span class="mark">${BRAND_MARK}</span>${brandWordmark()}</a>
        <p class="foot-about">${esc(CONFIG.footerAbout)}</p>
        <div class="foot-contact">
          ${CONFIG.address ? `<div>${ICO.pin}<span><b>Address:</b> ${esc(CONFIG.address)}</span></div>` : ''}
          ${hot ? `<div>${ICO.phone}<span><b>Call us:</b> <a href="tel:${hot}">${hot}</a></span></div>` : ''}
          ${CONFIG.email ? `<div>${ICO.mail}<span><b>Email:</b> <a href="mailto:${esc(CONFIG.email)}">${esc(CONFIG.email)}</a></span></div>` : ''}
          <div>${ICO.clock}<span><b>Hours:</b> 9:00 AM – 10:00 PM, every day</span></div>
        </div>
      </div>
      <div><h4>Company</h4><ul>
        <li><a href="page.html?p=about">About Us</a></li>
        <li><a href="page.html?p=delivery">Delivery Information</a></li>
        <li><a href="page.html?p=privacy">Privacy Policy</a></li>
        <li><a href="page.html?p=terms">Terms &amp; Conditions</a></li>
        <li><a href="page.html?p=contact">Contact Us</a></li>
        <li><a href="page.html?p=faq">FAQ</a></li>
        <li><a href="blog.html">Blog</a></li>
        <li><a href="health-tools.html">Health Tools</a></li>
      </ul></div>
      <div><h4>Account</h4><ul>
        <li><a href="account.html">Sign In</a></li>
        <li><button onclick="openCart()">View Cart</button></li>
        <li><button onclick="openWish()">My Wishlist</button></li>
        <li><a href="track.html">Track My Order</a></li>
        <li><a href="page.html?p=return">Return Policy</a></li>
      </ul></div>
      <div><h4>Popular</h4><ul>
        ${CATEGORIES.slice(0,6).map(c=>`<li><a href="category.html?goal=${encodeURIComponent(c.id)}">${esc(c.label)}</a></li>`).join('')}
      </ul></div>
      <div><h4>Secure Payment</h4>
        <p style="font-size:14px;margin:0 0 4px">Pay the way you like — cash when the parcel arrives, or bKash / Nagad.</p>
        <div class="foot-pay"><span>💵 COD</span><span class="bk">bKash</span><span class="ng">Nagad</span></div>
        ${CONFIG.tradeLicense ? `<p class="tag-mini" style="margin-top:14px">Trade Licence: ${esc(CONFIG.tradeLicense)}</p>` : ''}
      </div>
    </div>
  </div>
  <div class="wrap foot-bottom">
    <span>© ${new Date().getFullYear()} <b style="color:var(--leaf)">${esc(CONFIG.brand)}</b>. All rights reserved.</span>
    ${hot ? `<a class="foot-hot" href="tel:${hot}">${ICO.phone}<div><b>${hot}</b><small>24/7 Support Center</small></div></a>` : ''}
    ${socials.length || wa ? `<div class="socials"><span>Follow us</span>
      ${socials.map(k=>`<a href="${esc(CONFIG[k])}" target="_blank" rel="noopener" aria-label="${k}">${SOCIAL_ICONS[k]}</a>`).join('')}
      ${wa ? `<a href="${waLink('Hi!')}" target="_blank" rel="noopener" aria-label="WhatsApp">${WA_ICON}</a>` : ''}
    </div>` : ''}
  </div>`;
}

function buildDrawer(){
  return `
  <div class="overlay" id="overlay" onclick="closeCart()"></div>
  <aside class="drawer" id="drawer" aria-label="Shopping cart">
    <div class="drawer-head"><h3>Your Cart (<span id="cartCount">0</span>)</h3><button onclick="closeCart()" aria-label="Close">×</button></div>
    <div class="fd-progress" id="fdProg"></div>
    <div class="drawer-body" id="cartBody"></div>
    <div class="drawer-foot" id="cartFoot" style="display:none">
      <div class="sumline"><span>Subtotal</span><span id="dSub">৳0</span></div>
      <div class="sumline" id="dDiscRow" style="display:none; color:var(--leaf-d)">
        <span>Discount (<span id="dCoupName"></span>) <button class="coup-x" onclick="removeDrawerCoupon()" aria-label="Remove coupon">×</button></span>
        <span id="dDisc">-৳0</span>
      </div>
      <div class="sumline"><span>Delivery <small style="opacity:.75">(Dhaka)</small></span><span id="dDel">৳60</span></div>
      <div class="sumline total"><span>Total</span><span id="dTotal">৳0</span></div>
      <button class="checkout" onclick="location.href='checkout.html'">Proceed to Checkout</button>
      <div class="pay-note" id="drawerPayNote">${payBadges().join(' · ')}</div>
    </div>
  </aside>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

function buildMenu(){
  return `
  <div class="overlay" id="menuOverlay" onclick="closeMenu()"></div>
  <aside class="menu-drawer" id="menuDrawer" aria-label="Main menu">
    <div class="menu-head">
      <a class="logo" href="index.html"><span class="mark">${BRAND_MARK}</span>${brandWordmark()}</a>
      <button onclick="closeMenu()" aria-label="Close">×</button>
    </div>
    <nav class="menu-nav">
      <a href="index.html">Home</a>
      <a class="menu-ai" href="index.html#aiSection" data-ai-link onclick="if(window.openAI){event.preventDefault();closeMenu();openAI();}">✦ Ask AI Health Assistant</a>
      <a href="category.html?goal=all">All Products</a>
      <a class="menu-flash" href="category.html?goal=all&tag=flash">Offers &amp; Flash Sale</a>
      <a href="category.html?goal=all&tag=new">New Arrivals</a>
      <div class="menu-label">Shop by Category</div>
      ${CATEGORIES.map(c=>`
        <details class="menu-cat">
          <summary>${esc(c.label)}</summary>
          <div class="menu-cat-subs">
            <a href="category.html?goal=${encodeURIComponent(c.id)}"><b>View all ${esc(c.label)}</b></a>
            ${(c.subs||[]).map(s=>`<a href="category.html?goal=${encodeURIComponent(s.id)}">${esc(s.label)}</a>`).join('')}
          </div>
        </details>`).join('')}
      <div class="menu-label">Help</div>
      <a href="account.html">My Account</a>
      <a href="track.html">Track Order</a>
      <a href="compare.html">Compare Products</a>
      <a href="health-tools.html" class="mm-tools">Health Tools — BMI, পানি, প্রোটিন <i class="free-tag">ফ্রি</i></a>
      <a href="blog.html">Blog</a>
      <a href="page.html?p=delivery">Delivery Info</a>
      <a href="page.html?p=about">About Us</a>
      <a href="page.html?p=contact">Contact</a>
    </nav>
    ${CONFIG.hotline ? `<div class="menu-foot">
      <a class="btn btn-green" href="tel:${esc(CONFIG.hotline)}">Call ${esc(CONFIG.hotline)}</a>
    </div>` : ''}
  </aside>`;
}

/* ---- overlay open/close + body scroll lock + Esc key ---- */
function syncScrollLock(){
  document.body.classList.toggle('no-scroll', !!document.querySelector('.overlay.open'));
}
function openPanel(panelId, overlayId){
  document.getElementById(panelId)?.classList.add('open');
  document.getElementById(overlayId)?.classList.add('open');
  syncScrollLock();
}
function closePanel(panelId, overlayId){
  document.getElementById(panelId)?.classList.remove('open');
  document.getElementById(overlayId)?.classList.remove('open');
  syncScrollLock();
}
function openMenu(){ openPanel('menuDrawer','menuOverlay'); }
function closeMenu(){ closePanel('menuDrawer','menuOverlay'); }
document.addEventListener('keydown', e=>{
  if(e.key !== 'Escape') return;
  closeCart(); closeWish(); closeMenu(); closeQuickView(); closeSearch();
  if(typeof closeFilterDrawer === 'function') closeFilterDrawer();
});

function buildWishDrawer(){
  return `
  <div class="overlay" id="wishOverlay" onclick="closeWish()"></div>
  <aside class="drawer" id="wishDrawer" aria-label="Wishlist">
    <div class="drawer-head"><h3>Wishlist (<span id="wishCount">0</span>)</h3><button onclick="closeWish()" aria-label="Close">×</button></div>
    <div class="drawer-body" id="wishBody"></div>
  </aside>`;
}

/* =========================================================================
   QUICK VIEW — card hover-e "Quick View" -> page na chere modal-e product dekha
   ========================================================================= */
function buildQuickView(){
  return `
  <div class="overlay" id="qvOverlay" onclick="closeQuickView()"></div>
  <div class="qv-modal" id="qvModal" role="dialog" aria-label="Quick view">
    <button class="qv-close" onclick="closeQuickView()" aria-label="Close">×</button>
    <div class="qv-body" id="qvBody"></div>
  </div>`;
}
let qvQty = 1, qvProductId = null;
function openQuickView(id){
  const p = findP(id); if(!p) return;
  qvProductId = id; qvQty = 1;
  const off = discountPct(p);
  const oos = !inStock(p);
  const img = imgHTML(p, p.name);
  document.getElementById('qvBody').innerHTML = `
    <div class="qv-media">${off>0?`<span class="disc">${off}% OFF</span>`:''}${img}</div>
    <div class="qv-detail">
      <span class="pd-goal">${esc(goalLabel(getCats(p)[0]))}${p.brand?' · '+esc(p.brand):''}</span>
      <h2>${esc(p.name)}</h2>
      <div class="pd-rating"><span class="stars">${stars(p.rating)}</span> <b>${p.rating||'-'}</b> · ${p.reviews||0} reviews</div>
      <div class="pd-price">
        <span class="price">${money(p.price)}</span>
        ${p.oldPrice>p.price?`<span class="old">${money(p.oldPrice)}</span>`:''}
      </div>
      <p class="qv-desc">${esc(p.desc||'')}</p>
      <div class="pd-buy">
        <div class="qtybox">
          <button onclick="qvSetQty(-1)" aria-label="Decrease">−</button><span id="qvQty">1</span><button onclick="qvSetQty(1)" aria-label="Increase">＋</button>
        </div>
        <button class="btn btn-green" ${oos?'disabled style="opacity:.45;cursor:not-allowed"':''} onclick="${oos?'':`addToCart(${p.id}, qvQty); closeQuickView();`}">${oos?'Out of stock':'Add to Cart'}</button>
      </div>
      <a class="qv-full-link" href="product.html?id=${p.id}">View full details →</a>
    </div>`;
  openPanel('qvModal','qvOverlay');
}
function closeQuickView(){ closePanel('qvModal','qvOverlay'); }
function qvSetQty(d){
  qvQty = Math.max(1, Math.min(99, qvQty + d));
  const el = document.getElementById('qvQty'); if(el) el.textContent = qvQty;
}

/* =========================================================================
   CUSTOMER ACCOUNT (Firebase Auth) — header "Account" label
   ========================================================================= */
window.currentUser = null;
function initAccountState(){
  if(!window.fauth) return;
  window.fauth.onAuthStateChanged(user=>{
    window.currentUser = user;
    const label = document.getElementById('acctLabel');
    if(label) label.textContent = user ? (user.displayName || 'My Account') : 'Account';
  });
}
function logoutAccount(){ if(window.fauth) window.fauth.signOut(); }
function updateWishUI(){
  const ids = [...wishlist];
  const wb = document.getElementById('wishBadge'); if(wb) wb.textContent = ids.length;
  const wc = document.getElementById('wishCount'); if(wc) wc.textContent = ids.length;
  const body = document.getElementById('wishBody'); if(!body) return;
  if(ids.length===0){
    body.innerHTML = `<div class="cart-empty">Your wishlist is empty.<br><small>Tap the ♥ on any product to save it here.</small></div>`;
    return;
  }
  body.innerHTML = ids.map(id=>{
    const p=findP(id); if(!p) return "";
    const oos = !inStock(p);
    return `<div class="cart-item">
      <a class="ci-img" href="product.html?id=${p.id}">${imgHTML(p)}</a>
      <div class="ci-info">
        <a href="product.html?id=${p.id}" class="nm" style="display:block">${esc(p.name)}</a>
        <div class="pr">${money(p.price)}</div>
        ${oos ? `<div class="tag-mini" style="color:var(--rose);margin-top:6px">Out of stock</div>`
              : `<button class="wish-add" onclick="moveToCart(${p.id})">Add to cart</button>`}
      </div>
      <button class="ci-remove" onclick="removeWish(${p.id})" aria-label="Remove">×</button>
    </div>`;
  }).join('');
}
function openWish(){ updateWishUI(); openPanel('wishDrawer','wishOverlay'); }
function closeWish(){ closePanel('wishDrawer','wishOverlay'); }

/* coupon shudhu checkout page-e deya jay; cart-e age deya coupon thakle shudhu discount line dekhay */
function removeDrawerCoupon(){ setCoupon(null); updateCartUI(); toast("Coupon removed"); }

function updateCartUI(){
  const {count, sub, coupon, discount, delivery, total} = cartTotals();
  const badge = document.getElementById('cartBadge'); if(badge) badge.textContent = count;
  const mb = document.getElementById('mnCart'); if(mb){ mb.textContent = count; mb.style.display = count ? '' : 'none'; }
  const cc = document.getElementById('cartCount'); if(cc) cc.textContent = count;
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  const prog = document.getElementById('fdProg');
  if(!body) return;
  if(prog){
    if(count && freeDeliveryOn()){
      const left = CONFIG.freeDeliveryOver - sub;
      const pct = Math.min(100, Math.round(sub / CONFIG.freeDeliveryOver * 100));
      prog.innerHTML = `<div class="fd-text">${left > 0 ? `Add <b>${money(left)}</b> more for <b>FREE delivery</b>` : `🎉 You've unlocked <b>FREE delivery</b>`}</div>
        <div class="fd-bar"><span style="width:${pct}%"></span></div>`;
      prog.style.display = 'block';
    } else prog.style.display = 'none';
  }
  if(count===0){
    body.innerHTML = `<div class="cart-empty">Your cart is empty.<br><small>Add products to get started.</small><br><a class="btn btn-green" style="margin-top:16px" href="category.html?goal=all">Start shopping</a></div>`;
    if(foot) foot.style.display = "none"; return;
  }
  if(foot) foot.style.display = "block";
  body.innerHTML = Object.keys(cart).map(id=>{
    const p=findP(id); if(!p) return ""; const q=cart[id];
    const oos = !inStock(p);
    return `<div class="cart-item">
      <a class="ci-img" href="product.html?id=${p.id}">${imgHTML(p)}</a>
      <div class="ci-info">
        <a class="nm" href="product.html?id=${p.id}" style="display:block">${esc(p.name)}</a>
        <div class="pr">${money(p.price)}</div>
        ${oos ? `<div class="tag-mini" style="color:var(--rose);margin-top:4px">Out of stock — please remove</div>` : ''}
        <div class="qty"><button onclick="changeQty(${p.id},-1)" aria-label="Decrease">−</button><span>${q}</span><button onclick="changeQty(${p.id},1)" aria-label="Increase">＋</button></div>
      </div>
      <button class="ci-remove" onclick="removeItem(${p.id})" aria-label="Remove">×</button>
    </div>`;
  }).join('');
  const set = (id,v)=>{ const e=document.getElementById(id); if(e) e.textContent=v; };
  set('dSub', money(sub));
  set('dDel', delivery===0 ? "FREE" : money(delivery));
  set('dTotal', money(total));
  const dr = document.getElementById('dDiscRow');
  if(dr){
    if(coupon && discount>0){
      dr.style.display = 'flex';
      set('dCoupName', coupon.code);
      set('dDisc', "-"+money(discount));
    } else dr.style.display = 'none';
  }
}

function openCart(){ updateCartUI(); openPanel('drawer','overlay'); }
function closeCart(){ closePanel('drawer','overlay'); }
function goSearch(q){ location.href = "category.html?q=" + encodeURIComponent(q||""); }

/* search haystack — naam, brand, sob category/parent label */
function searchText(p){
  const cats = getCats(p);
  return [p.name, p.brand, ...cats.map(goalLabel), ...cats.map(id=>categoryOf(id)?.label)].filter(Boolean).join(' ').toLowerCase();
}
/* Bangla / Banglish shobdo → product-er English shobdo ("চুল" → hair, "modhu" → honey) */
const SEARCH_SYN = {
  'চুল':'hair','চুলের':'hair','ত্বক':'skin','ত্বকের':'skin','স্কিন':'skin','মুখ':'face','মুখের':'face','ফেস':'face','ভিটামিন':'vitamin',
  'প্রোটিন':'protein','মধু':'honey','শ্যাম্পু':'shampoo','তেল':'oil','সানস্ক্রিন':'sunscreen','বাচ্চা':'baby','বাচ্চার':'baby','শিশু':'baby',
  'শিশুর':'baby','ঘুম':'sleep','হাড়':'bone','দাড়ি':'beard','লিপস্টিক':'lip','ঠোঁট':'lip','ক্রিম':'cream','ফেসওয়াশ':'wash','সাবান':'wash',
  'লোশন':'lotion','ওমেগা':'omega','ক্যালসিয়াম':'calcium','জিঙ্ক':'zinc','বাদাম':'nut','চোখ':'eye','বডি':'body','সিরাম':'serum','মেকআপ':'makeup',
  'chul':'hair','chuler':'hair','tok':'skin','toker':'skin','mukh':'face','modhu':'honey','tel':'oil','bachcha':'baby','bacha':'baby','dari':'beard'
};
/* search: naam/brand/category + Bangla shobdo + shomossa ("chul pore", "ব্রণ", "gastric" — AI-er concern list theke) */
function searchProducts(q){
  q = (q||'').toLowerCase().trim();
  if(!q) return [];
  const words = q.split(/\s+/).map(w => SEARCH_SYN[w] || w);
  const direct = PRODUCTS.filter(p => { const t = searchText(p); return words.every(w=>t.includes(w)); });
  let extra = [];
  if(typeof AI_CONCERNS !== 'undefined' && typeof aiHas === 'function'){
    const norm = aiNorm(q);
    const hits = AI_CONCERNS.filter(c => c.kw.some(k => aiHas(norm, k)));
    if(hits.length) extra = PRODUCTS.filter(p => hits.some(c =>
      (c.cats||[]).some(id => productInCat(p, id)) || (c.match||[]).some(w => aiPText(p).includes(w))));
  }
  return [...new Set([...direct, ...extra])];
}
function liveSearch(q){
  const box = document.getElementById('searchResults');
  if(!box) return;
  q = (q||'').toLowerCase().trim();
  if(q.length < 1){ closeSearch(); return; }
  const matches = searchProducts(q).sort(stockFirst).slice(0, 6);
  if(!matches.length){
    box.innerHTML = `<div class="sr-empty">No products found for “${esc(q)}”</div>`;
    box.classList.add('open'); return;
  }
  box.innerHTML = matches.map(p=>{
    const off = discountPct(p);
    return `<a class="sr-row" href="product.html?id=${p.id}">
      <span class="sr-img">${imgHTML(p)}</span>
      <span class="sr-info">
        <span class="sr-name">${esc(p.name)}</span>
        <span class="sr-meta">
          <span class="sr-price">${money(p.price)}</span>
          ${p.oldPrice>p.price?`<span class="sr-old">${money(p.oldPrice)}</span>`:''}
          ${off>0?`<span class="sr-off">${off}% OFF</span>`:''}
          ${!inStock(p)?`<span class="sr-old" style="text-decoration:none">Out of stock</span>`:''}
        </span>
      </span>
    </a>`;
  }).join('') + `<a class="sr-all" href="category.html?q=${encodeURIComponent(q)}">See all results for “${esc(q)}” →</a>`;
  box.classList.add('open');
}
function closeSearch(){ const b=document.getElementById('searchResults'); if(b){ b.classList.remove('open'); b.innerHTML=''; } }
document.addEventListener('click', e=>{ if(!e.target.closest('.search')) closeSearch(); });

/* =========================================================================
   REVIEW SLIDER (homepage) — auto-play, dots, touch-scroll friendly
   ========================================================================= */
let rvTimer = null, rvIdx = 0;
function initReviewSlider(){
  const track = document.getElementById('rvTrack');
  const dots  = document.getElementById('rvDots');
  if(!track || typeof REVIEWS === 'undefined' || !REVIEWS.length) return;
  track.innerHTML = REVIEWS.map(r=>`
    <div class="rv-card">
      <div class="rv-stars">${stars(r.rating)}</div>
      <p class="rv-text">“${esc(r.text)}”</p>
      <div class="rv-who">
        <span class="rv-avatar">${esc(r.name.trim().charAt(0))}</span>
        <span><b>${esc(r.name)}</b><small>${esc(r.area)} · ${esc(r.product)}</small></span>
        <span class="rv-verified">✔ Verified</span>
      </div>
    </div>`).join('');
  if(dots){
    dots.innerHTML = REVIEWS.map((_,i)=>`<button data-rv="${i}" ${i===0?'class="on"':''} onclick="rvGo(${i},true)" aria-label="Review ${i+1}"></button>`).join('');
  }
  rvIdx = 0;
  clearInterval(rvTimer);
  rvTimer = setInterval(()=> rvGo(rvIdx+1, false), 4500);
  /* manual scroll korle dot sync — listener ekbar-i lagai (initPage bar bar chole) */
  if(!track.dataset.bound){
    track.dataset.bound = '1';
    track.addEventListener('scroll', ()=>{
      const card = track.querySelector('.rv-card'); if(!card) return;
      const i = Math.round(track.scrollLeft / (card.offsetWidth + 14));
      if(i !== rvIdx){ rvIdx = Math.min(i, REVIEWS.length-1); rvDots(); }
    }, {passive:true});
  }
}
function rvGo(i, manual){
  const track = document.getElementById('rvTrack'); if(!track) return;
  const card = track.querySelector('.rv-card'); if(!card) return;
  rvIdx = ((i % REVIEWS.length) + REVIEWS.length) % REVIEWS.length;
  track.scrollTo({ left: rvIdx * (card.offsetWidth + 14), behavior:'smooth' });
  rvDots();
  if(manual){ clearInterval(rvTimer); rvTimer = setInterval(()=> rvGo(rvIdx+1,false), 4500); }
}
function rvDots(){
  document.querySelectorAll('[data-rv]').forEach(d=> d.classList.toggle('on', Number(d.dataset.rv)===rvIdx));
}

let toastTimer;
function toast(msg, ms){
  const t = document.getElementById('toast'); if(!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(()=> t.classList.remove('show'), ms || 2000);
}
/* toast + link (e.g. "Added to compare — Compare now →") */
function toastAction(msg, href, label){
  const t = document.getElementById('toast'); if(!t) return;
  t.innerHTML = `${esc(msg)} <a href="${esc(href)}" class="toast-link">${esc(label)}</a>`;
  t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(()=> t.classList.remove('show'), 3200);
}

/* =========================================================================
   NOTIFICATION BELL — admin > Banners > "Notifications" theke (Firebase 'notices')
   ========================================================================= */
let NOTICES = [];
const NOTICE_SEEN = 'myhealth_notice_seen';
function loadNotices(){
  if(!window.fdb) return Promise.resolve();
  return window.fdb.ref('notices').once('value').then(s=>{
    const v = s.val() || {};
    NOTICES = Object.values(v).filter(n=>n && n.title && n.active !== false).sort((a,b)=>(b.ts||0)-(a.ts||0)).slice(0,12);
    renderNotices();
  }, ()=>{});
}
function timeAgo(ts){
  const s = Math.max(1, (Date.now() - Number(ts||0)) / 1000);
  if(s < 3600) return Math.round(s/60) + ' min ago';
  if(s < 86400) return Math.round(s/3600) + ' h ago';
  return Math.round(s/86400) + ' d ago';
}
function renderNotices(){
  let seen = 0; try{ seen = Number(localStorage.getItem(NOTICE_SEEN)) || 0; }catch(e){}
  const unread = NOTICES.filter(n=>(n.ts||0) > seen).length;
  const b = document.getElementById('ntBadge');
  if(b){ b.textContent = unread; b.style.display = unread ? '' : 'none'; }
  const d = document.getElementById('ntDrop'); if(!d) return;
  d.innerHTML = `<div class="nt-head">Notifications</div>` + (NOTICES.length ? NOTICES.map(n=>{
    const inner = `<b>${esc(n.title)}</b>${n.text ? `<span>${esc(n.text)}</span>` : ''}<small>${timeAgo(n.ts)}</small>`;
    return /^(https?:\/\/|[a-z0-9_-]+\.html)/i.test(n.link||'') ? `<a class="nt-item${(n.ts||0)>seen?' new':''}" href="${esc(n.link)}">${inner}</a>` : `<div class="nt-item${(n.ts||0)>seen?' new':''}">${inner}</div>`;
  }).join('') : `<div class="nt-empty">No notifications yet — offers and news will show up here.</div>`);
}
function toggleNotify(e){
  e && e.stopPropagation();
  const w = document.getElementById('notify'); if(!w) return;
  const open = w.classList.toggle('open');
  if(open){
    renderNotices();
    try{ localStorage.setItem(NOTICE_SEEN, String(Date.now())); }catch(e){}
    const b = document.getElementById('ntBadge'); if(b) b.style.display = 'none';
  }
}
document.addEventListener('click', e=>{ if(!e.target.closest('#notify')) document.getElementById('notify')?.classList.remove('open'); });

/* mobile bottom bar-er Search — upore search box-e focus */
function mobileSearch(){
  window.scrollTo({ top:0, behavior:'smooth' });
  setTimeout(()=> document.getElementById('globalSearch')?.focus(), 350);
}

/* =========================================================================
   NEWSLETTER — Firebase 'subscribers' e email save (admin > Customers e dekha jay)
   ========================================================================= */
function subscribeNewsletter(form){
  const inp = form.querySelector('input[type=email]');
  const btn = form.querySelector('button');
  const email = (inp?.value||'').trim().toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ toast('Please enter a valid email'); return false; }
  if(!window.fdb){ toast('Could not subscribe right now — please try later'); return false; }
  if(btn){ btn.disabled = true; }
  window.fdb.ref('subscribers').push({ email, ts: Date.now() })
    .then(()=>{ form.reset(); toast('Subscribed ✓ — thank you!'); })
    .catch(()=> toast('Could not subscribe right now — please try later'))
    .finally(()=>{ if(btn) btn.disabled = false; });
  return false;
}

/* =========================================================================
   WhatsApp floating button
   ========================================================================= */
const WA_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38c1.45.79 3.08 1.21 4.76 1.21 5.46 0 9.9-4.44 9.9-9.9S17.5 2 12.04 2m0 18.06c-1.5 0-2.97-.4-4.25-1.16l-.3-.18-3.13.82.84-3.05-.2-.31a8.2 8.2 0 0 1-1.26-4.35c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.24 8.24m4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43-.14-.01-.31-.01-.48-.01a.9.9 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29"/></svg>`;
function waLink(text){
  return `https://wa.me/${waNumber()}?text=${encodeURIComponent(text||'')}`;
}
function buildWhatsApp(){
  if(!waNumber()) return ''; /* placeholder thakle dekhabo na */
  return `<a class="wa-float" href="${waLink('Hi! I have a question about a product.')}" target="_blank" rel="noopener" aria-label="WhatsApp chat">${WA_ICON}</a>`;
}

/* =========================================================================
   Analytics — CONFIG/Settings e ID boshale nije theke load hoy
   ========================================================================= */
let gaLoaded = false, pixelLoaded = false;
function injectAnalytics(){
  if(!gaLoaded && CONFIG.gaId && /^G-[A-Z0-9]+$/i.test(CONFIG.gaId)){
    gaLoaded = true;
    const s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(CONFIG.gaId);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag; gtag('js', new Date()); gtag('config', CONFIG.gaId);
  }
  if(!pixelLoaded && CONFIG.fbPixel && /^[0-9]{6,20}$/.test(CONFIG.fbPixel)){
    pixelLoaded = true;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', CONFIG.fbPixel); window.fbq('track', 'PageView');
  }
}

/* =========================================================================
   PRODUCT REVIEWS (Firebase: reviews/{productId}/{reviewId})
   ========================================================================= */
function loadReviews(productId, done){
  if(!window.fdb){ done([]); return; }
  window.fdb.ref('reviews/'+productId).once('value').then(snap=>{
    const val = snap.val() || {};
    const arr = Object.values(val).filter(Boolean).sort((a,b)=> (b.ts||0)-(a.ts||0));
    done(arr);
  }).catch(()=> done([]));
}
function submitReview(productId, data){
  if(!window.fdb) return Promise.reject(new Error('Firebase off'));
  return window.fdb.ref('reviews/'+productId).push({
    name: data.name, rating: data.rating, text: data.text, ts: Date.now()
  });
}

/* =========================================================================
   VOICE SEARCH — search box-er mic (product naam bolle khuje dey)
   ========================================================================= */
/* Facebook/Instagram/Messenger-er bhitorer browser (Android WebView) e mic kaj kore na — oikhane button-i dekhai na */
const IN_APP_BROWSER = /FBAN|FBAV|FB_IAB|FBIOS|Instagram|Messenger|Line\/|; wv\)/i.test(navigator.userAgent);
const SPEECH = !IN_APP_BROWSER && (window.SpeechRecognition || window.webkitSpeechRecognition) || null;
const IS_TOUCH = window.matchMedia && matchMedia('(pointer:coarse)').matches;
/* kon karone mic kaj korlo na — customer-ke ki korte hobe bole dey */
function micError(code){
  return ({
    'not-allowed':         'Microphone is blocked. Tap the 🔒 icon next to the website address → allow Microphone → try again.',
    'service-not-allowed': 'Voice input does not work in this browser. Please open the site in Chrome (or turn on Dictation on iPhone).',
    'no-speech':           "Didn't hear anything — tap the mic and speak clearly.",
    'audio-capture':       'No microphone found on this device.',
    'network':             'Voice input needs internet — please check your connection.',
    'language-not-supported': 'This language is not supported for voice on your phone — please type instead.'
  })[code] || 'Could not hear you — please type instead.';
}
/* result theke lekha (iPhone Safari kokhono ager tukro abar pathay — duplicate bad) */
function speechText(e){
  const parts = [...e.results].map(r => (r[0] && r[0].transcript || '').trim()).filter(Boolean);
  const last = parts[parts.length-1] || '';
  return (parts.length > 1 && last.startsWith(parts[parts.length-2]) ? last : parts.join(' ')).replace(/[.?!।]+$/,'');
}
let searchRec = null;
function voiceSearch(btn){
  if(!SPEECH) return;
  if(searchRec){ searchRec.stop(); return; }
  const inp = document.getElementById('globalSearch');
  const ph = inp.placeholder;
  searchRec = new SPEECH();
  searchRec.lang = 'en-IN'; searchRec.interimResults = true; searchRec.continuous = false; searchRec.maxAlternatives = 1;
  btn.classList.add('rec'); inp.value = ''; inp.placeholder = 'Listening… say a product name';
  searchRec.onresult = e => { inp.value = speechText(e); liveSearch(inp.value); };
  searchRec.onerror = e => { if(e.error !== 'aborted') toast(micError(e.error), 5500); };
  searchRec.onend = () => {
    btn.classList.remove('rec'); searchRec = null; inp.placeholder = ph;
    if(inp.value.trim()) liveSearch(inp.value);
    if(!IS_TOUCH) inp.focus();   // phone e keyboard khule result dheke dey — tai focus na
  };
  try{ searchRec.start(); }catch(err){ btn.classList.remove('rec'); searchRec = null; inp.placeholder = ph; toast(micError(), 4000); }
}

/* =========================================================================
   BANGLADESH DISTRICTS + delivery date (product page "Deliver to")
   ========================================================================= */
const BD_DISTRICTS = ['Dhaka','Bagerhat','Bandarban','Barguna','Barishal','Bhola','Bogura','Brahmanbaria','Chandpur','Chapainawabganj','Chattogram','Chuadanga',
  "Cox's Bazar",'Cumilla','Dinajpur','Faridpur','Feni','Gaibandha','Gazipur','Gopalganj','Habiganj','Jamalpur','Jashore','Jhalokathi','Jhenaidah','Joypurhat',
  'Khagrachari','Khulna','Kishoreganj','Kurigram','Kushtia','Lakshmipur','Lalmonirhat','Madaripur','Magura','Manikganj','Meherpur','Moulvibazar','Munshiganj',
  'Mymensingh','Naogaon','Narail','Narayanganj','Narsingdi','Natore','Netrokona','Nilphamari','Noakhali','Pabna','Panchagarh','Patuakhali','Pirojpur','Rajbari',
  'Rajshahi','Rangamati','Rangpur','Satkhira','Shariatpur','Sherpur','Sirajganj','Sunamganj','Sylhet','Tangail','Thakurgaon'];
/* Dhaka: 1–2 kaj-er din, baire: 2–4 (shukrobar chuti dhora) */
function deliveryEstimate(district, subtotal){
  const inDhaka = district === 'Dhaka';
  const addDays = n => { const d = new Date(); let left = n; while(left > 0){ d.setDate(d.getDate()+1); if(d.getDay() !== 5) left--; } return d; };
  const fmt = d => d.toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short' });
  const [a, b] = inDhaka ? [1, 2] : [2, 4];
  const free = freeDeliveryOn() && (subtotal||0) >= CONFIG.freeDeliveryOver;
  return { from: fmt(addDays(a)), to: fmt(addDays(b)), fee: free ? 0 : (inDhaka ? CONFIG.deliveryFee : CONFIG.deliveryFeeOuter) };
}
function savedDistrict(){
  try{ return localStorage.getItem('myhealth_district') || (JSON.parse(localStorage.getItem('myhealth_checkout_info')||'{}').district) || ''; }catch(e){ return ''; }
}

/* =========================================================================
   LIVE PURCHASE POPUP — shudhu ASOL order theke ("Someone in Sylhet ordered…")
   Firebase 'recentSales' e checkout shudhu district + product id rakhe (naam/phone na)
   ========================================================================= */
function logSale(order){
  if(!window.fdb || !order || !order.items || !order.items[0]) return;
  const d = BD_DISTRICTS.find(x => x.toLowerCase() === String(order.customer?.district||'').trim().toLowerCase()) || 'Bangladesh';
  window.fdb.ref('recentSales').push({ d, p: Number(order.items[0].id)||0, ts: Date.now() }).then(null, ()=>{});   // compat push-e .catch kaj kore na
}
let SALES = [], spIdx = 0, spShown = 0;
function startSocialProof(){
  if(CONFIG.socialProof === 'off' || !window.fdb || /checkout\.html|admin\.html/.test(location.pathname)) return;
  window.fdb.ref('recentSales').limitToLast(25).once('value').then(s=>{
    const week = Date.now() - 7*864e5;
    SALES = Object.values(s.val()||{}).filter(x=>x && x.ts > week && findP(x.p) && findP(x.p).img)
      .map(x=>({ ...x, d: BD_DISTRICTS.includes(x.d) ? x.d : 'Bangladesh' })).sort((a,b)=>b.ts-a.ts);
    if(!SALES.length) return;
    setTimeout(showSaleToast, 12000);
  }, ()=>{});
}
function showSaleToast(){
  if(!SALES.length || spShown >= 4) return;
  if(document.hidden){ setTimeout(showSaleToast, 28000); return; }   // tab dekha na gele pore abar
  const s = SALES[spIdx++ % SALES.length], p = findP(s.p); if(!p) return;
  spShown++;
  document.getElementById('spToast')?.remove();
  document.body.insertAdjacentHTML('beforeend', `
    <a class="sp-toast" id="spToast" href="product.html?id=${p.id}">
      <span class="sp-img">${imgHTML(p, '')}</span>
      <span class="sp-txt"><small>Someone in <b>${esc(s.d)}</b> ordered</small><b>${esc(p.name)}</b><small>${timeAgo(s.ts)} · ✓ Verified purchase</small></span>
      <button class="sp-x" onclick="event.preventDefault();this.parentElement.remove()" aria-label="Close">×</button>
    </a>`);
  requestAnimationFrame(()=> document.getElementById('spToast')?.classList.add('show'));
  setTimeout(()=>{ const t = document.getElementById('spToast'); if(t){ t.classList.remove('show'); setTimeout(()=>t.remove(), 400); } }, 6500);
  setTimeout(showSaleToast, 28000);
}

/* =========================================================================
   INIT — chrome inject, settings + products load, tarpor page-er initPage()
   ========================================================================= */
function renderChrome(){
  const h = document.getElementById('site-header');
  if(h){
    const q = document.getElementById('globalSearch')?.value || '';
    h.innerHTML = buildHeader();
    if(q) document.getElementById('globalSearch').value = q;
  }
  const f = document.getElementById('site-footer'); if(f) f.innerHTML = buildFooter();
  const m = document.getElementById('chrome-menu'); if(m) m.innerHTML = buildMenu();
  const w = document.getElementById('chrome-wa'); if(w) w.innerHTML = buildWhatsApp();
  const pn = document.getElementById('drawerPayNote'); if(pn) pn.textContent = payBadges().join(' · ');
  // current page-er nav link highlight
  const page = (location.pathname.split('/').pop() || 'index.html').replace('.html','') || 'index';
  const tag = param('tag');
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const on = tag ? a.getAttribute('href').includes('tag='+tag) : a.dataset.nav === page;
    a.classList.toggle('on', !!on);
  });
  document.querySelectorAll('.mnav [data-mn]').forEach(a=> a.classList.toggle('on', a.dataset.mn === page));
  renderNotices();
  refreshCompareUI();
}
/* mobile-er niche fixed menu (Home / Shop / Search / Cart / Account) */
/* computer-e bam pashe bhasoman "ফ্রি হেলথ চেক" tab (phone-e na — okhane Ask AI / WhatsApp / bottom bar ache) */
function buildToolsTab(){
  if(/health-tools|checkout|admin/.test(location.pathname)) return '';
  return `<a class="tools-tab" href="health-tools.html" title="Free BMI, water, protein & calorie calculators">${ICO.heartPulse}<span>ফ্রি হেলথ চেক</span></a>`;
}
function buildMobileNav(){
  return `
  <nav class="mnav" aria-label="Mobile navigation">
    <a href="index.html" data-mn="index">${ICO.home}<span>Home</span></a>
    <a href="category.html?goal=all" data-mn="category">${ICO.bag}<span>Shop</span></a>
    <button onclick="mobileSearch()">${ICO.search}<span>Search</span></button>
    <button onclick="openCart()">${ICO.cart}<span>Cart</span><i class="mn-badge" id="mnCart" style="display:none">0</i></button>
    <a href="account.html" data-mn="account">${ICO.user}<span>Account</span></a>
  </nav>`;
}
/* category chobi (admin > Banners > Category Images) — menu + homepage tile */
function loadCatImages(){
  if(!window.fdb) return Promise.resolve();
  return window.fdb.ref('categoryImages').once('value').then(s=>{ CAT_IMAGES = s.val() || {}; }, ()=>{});
}
/* scroll: sticky nav-e shadow + back-to-top button */
let scrollTick = false;
window.addEventListener('scroll', ()=>{
  if(scrollTick) return; scrollTick = true;
  requestAnimationFrame(()=>{
    scrollTick = false;
    document.getElementById('mainNav')?.classList.toggle('stuck', scrollY > 160);
    document.getElementById('toTop')?.classList.toggle('show', scrollY > 700);
  });
}, { passive:true });
document.addEventListener('DOMContentLoaded', ()=>{
  document.body.insertAdjacentHTML('beforeend',
    buildDrawer() + `<div id="chrome-menu"></div>` + buildWishDrawer() + buildQuickView() + `<div id="chrome-wa"></div>`
    + `<button class="to-top" id="toTop" onclick="window.scrollTo({top:0,behavior:'smooth'})" aria-label="Back to top">${ICO.up}</button>`
    + buildMobileNav() + buildToolsTab());
  document.body.classList.add('has-mnav');
  renderChrome();
  injectAnalytics();
  initAccountState();
  updateCartUI();
  updateWishUI();
  loadNotices();
  Promise.all([loadStoreConfig(), new Promise(r=>bootProducts(r)), loadCatImages()]).then(([changed])=>{
    if(changed){ renderChrome(); injectAnalytics(); }
    else fillBrowse();   // product/chobi ese gele category menu-te chobi
    updateCartUI(); updateWishUI();
    if(typeof initPage === 'function') initPage();
    startSocialProof();
  });
});
