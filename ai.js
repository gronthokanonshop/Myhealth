/* =========================================================================
   MY HEALTH — AI Health Assistant (ai.js) — app.js er PORE load hoy
   -------------------------------------------------------------------------
   Customer nijer somossa likhe (Bangla / English / Banglish) -> uporjukto
   product suggestion + choto tips. Duita mode:
     'ai'    -> Cloudflare Worker (ai-worker.js) -> Claude API (asol AI)
     'basic' -> browser-e built-in keyword matcher (free, kono key lage na)
   AI fail korle (net/limit/key) nije theke basic mode-e answer dey.
   Sob setting admin panel > AI Assistant theke (Firebase 'aiConfig').
   ========================================================================= */
const AI_DEFAULTS = {
  enabled: true,
  mode: 'basic',              // 'ai' | 'basic'
  workerUrl: '',
  floatingButton: true,       // homepage chara onno page-e bhashoman AI button
  assistantName: 'Health Assistant',
  title: 'Tell us your problem — get the right products',
  subtitle: "Describe what's bothering you in Bangla or English. Our assistant suggests suitable products and simple tips in seconds.",
  welcome: "Hi! 👋 Tell me what's bothering you — for example hair fall, low energy, acne or trouble sleeping. You can write in Bangla or English.",
  placeholder: 'Describe your problem… e.g. চুল পড়ছে / low energy',
  disclaimer: 'Suggestions are general wellness guidance, not medical advice. For serious or ongoing symptoms, please see a doctor.',
  chips: ['Hair fall', 'Low energy', 'ঘুম হয় না', 'Acne / pimples', 'Weak immunity', 'ওজন বাড়াতে চাই'],
  maxProducts: 4,
  rules: []                   // [{keywords:"chul pore, hair fall", note:"...", products:[ids]}]
};
let AI_CFG = { ...AI_DEFAULTS };
const AI_CFG_CACHE = 'myhealth_ai_cfg';
const AI_CHAT_KEY  = 'myhealth_ai_chat';

/* ---------------- config ---------------- */
function aiApplyCfg(c){
  const cfg = { ...AI_DEFAULTS };
  if(c && typeof c === 'object'){
    Object.keys(AI_DEFAULTS).forEach(k=>{
      const v = c[k];
      if(v === undefined || v === null) return;
      if(typeof AI_DEFAULTS[k] === 'string' && typeof v === 'string' && !v.trim() && k !== 'workerUrl') return;
      cfg[k] = v;
    });
  }
  const arr = v => Array.isArray(v) ? v : (v && typeof v === 'object' ? Object.values(v) : []);
  cfg.chips = arr(cfg.chips).map(String).filter(s=>s.trim()).slice(0, 8);
  cfg.rules = arr(cfg.rules).filter(r=>r && r.keywords).map(r=>({ keywords:String(r.keywords), note:String(r.note||''), products: arr(r.products).map(Number).filter(Boolean) }));
  cfg.maxProducts = Math.max(2, Math.min(6, Number(cfg.maxProducts)||4));
  cfg.workerUrl = String(cfg.workerUrl||'').trim();
  AI_CFG = cfg;
}
const aiUsesWorker = () => AI_CFG.mode === 'ai' && /^https:\/\//i.test(AI_CFG.workerUrl);

/* ---------------- chat state (tab bondho na hoa porjonto thake) ---------------- */
let aiChat = [];
function aiLoadChat(){
  try{ aiChat = JSON.parse(sessionStorage.getItem(AI_CHAT_KEY)) || []; }catch(e){ aiChat = []; }
  if(!Array.isArray(aiChat)) aiChat = [];
}
function aiSaveChat(){ try{ sessionStorage.setItem(AI_CHAT_KEY, JSON.stringify(aiChat.slice(-24))); }catch(e){} }
function aiResetChat(){ aiChat = []; aiSaveChat(); aiRenderAll(); aiFocusInput(); }

/* =========================================================================
   BASIC MODE — built-in knowledge (keyword -> category + tip)
   cats = subcategory id (admin category bodlale je id nei oita shudhu match korbe na)
   ========================================================================= */
const AI_CONCERNS = [
  { label:'hair fall', bn:'চুল পড়া', cats:['hairoil','shampoo','conditioner','skin'],
    kw:['hair fall','hairfall','hair loss','losing hair','hair falling','thin hair','thinning hair','bald','chul pore','chul pora','chul porche','chul pre','chul jhore','চুল পড়','চুল ঝরে','চুল কম','টাক'],
    tip:'Eat enough protein, oil your scalp 2–3 times a week and avoid very hot water. Biotin and a gentle shampoo help many people.',
    tipBn:'পর্যাপ্ত প্রোটিন খান, সপ্তাহে ২–৩ বার মাথায় তেল দিন আর খুব গরম পানি এড়িয়ে চলুন। বায়োটিন ও মাইল্ড শ্যাম্পু অনেকের উপকারে আসে।' },
  { label:'dandruff', bn:'খুশকি', cats:['shampoo','hairoil'],
    kw:['dandruff','itchy scalp','flaky scalp','khushki','khuski','khoski','খুশকি','মাথা চুলকা'],
    tip:'Wash your hair 2–3 times a week with an anti-dandruff shampoo and keep your comb and pillow cover clean.',
    tipBn:'সপ্তাহে ২–৩ বার অ্যান্টি-ড্যানড্রাফ শ্যাম্পু দিয়ে চুল ধুয়ে নিন, চিরুনি ও বালিশের কভার পরিষ্কার রাখুন।' },
  { label:'acne & pimples', bn:'ব্রণ', cats:['cleanser','serum','sunscreen','moisturizer'],
    kw:['acne','pimple','pimples','breakout','blackhead','whitehead','oily skin','brone','bron','bron hoy','bron uthe','ব্রণ','ফুসকুড়ি','তৈলাক্ত','তেলতেলে'],
    tip:'Wash your face twice a day with a gentle cleanser, don\'t pop pimples, and use a light non-oily moisturizer and sunscreen.',
    tipBn:'দিনে দুইবার মাইল্ড ফেসওয়াশ ব্যবহার করুন, ব্রণ খুঁটবেন না, আর হালকা অয়েল-ফ্রি ময়েশ্চারাইজার ও সানস্ক্রিন দিন।' },
  { label:'dry skin', bn:'শুষ্ক ত্বক', cats:['moisturizer','bodylotion','serum'],
    kw:['dry skin','rough skin','flaky skin','skin dry','cracked','khoskhose','khoshkhoshe','shushko','sushko','শুষ্ক','খসখসে','ফাটা','টান টান'],
    tip:'Moisturize right after bathing while the skin is still a little damp, and drink enough water.',
    tipBn:'গোসলের পর ত্বক হালকা ভেজা থাকতেই ময়েশ্চারাইজার লাগান এবং পর্যাপ্ত পানি পান করুন।' },
  { label:'sun tan & dark spots', bn:'রোদে পোড়া ও কালো দাগ', cats:['sunscreen','serum'],
    kw:['sunburn','sun burn','tan','tanning','sun damage','dark spot','dark spots','pigmentation','melasma','uneven skin','kalo dag','rode pora','রোদে পোড়া','কালো দাগ','মেছতা','দাগ'],
    tip:'Use SPF 30+ sunscreen every morning (reapply when outdoors) — it\'s the most effective way to fade and prevent dark spots.',
    tipBn:'প্রতিদিন সকালে SPF 30+ সানস্ক্রিন দিন (বাইরে থাকলে আবার দিন) — দাগ কমানো ও ঠেকানোর সবচেয়ে কার্যকর উপায়।' },
  { label:'skin glow & anti-aging', bn:'ত্বকের উজ্জ্বলতা', cats:['serum','skin','moisturizer'],
    kw:['glow','glowing','dull skin','brighten','fairness','radiant','anti aging','anti-aging','wrinkle','fine lines','collagen','uzzol','ujjol','উজ্জ্বল','বলিরেখা','ফর্সা'],
    tip:'Consistency matters most: cleanse, apply a serum, moisturize and wear sunscreen daily. Collagen and vitamin C support skin from inside.',
    tipBn:'নিয়মিত যত্নই আসল: ফেসওয়াশ, সিরাম, ময়েশ্চারাইজার আর প্রতিদিন সানস্ক্রিন। কোলাজেন ও ভিটামিন সি ভেতর থেকে সাহায্য করে।' },
  { label:'low energy & tiredness', bn:'দুর্বলতা ও ক্লান্তি', cats:['energy','immunity'],
    kw:['tired','tiredness','fatigue','weakness','weak','low energy','no energy','exhausted','lethargic','durbol','durbolota','klanto','kilanto','shokti nai','dur bol','দুর্বল','ক্লান্ত','শক্তি পাই না','অবসাদ','vitamin b','b complex'],
    tip:'Sleep 7–8 hours, drink enough water and don\'t skip breakfast. A B-complex can help if your diet is low in vitamins.',
    tipBn:'৭–৮ ঘণ্টা ঘুমান, পর্যাপ্ত পানি পান করুন আর সকালের নাস্তা বাদ দেবেন না। খাবারে ভিটামিন কম হলে বি-কমপ্লেক্স সাহায্য করতে পারে।' },
  { label:'weak immunity', bn:'রোগ প্রতিরোধ ক্ষমতা', cats:['immunity','honey'],
    kw:['immunity','immune','cold','flu','cough','frequently sick','get sick','sore throat','sordi','shordi','kashi','kashi','sickly','রোগ প্রতিরোধ','সর্দি','কাশি','ঠান্ডা','বারবার অসুস্থ','vitamin c','zinc'],
    tip:'Vitamin C, zinc and vitamin D support immunity, together with good sleep, fruits and vegetables.',
    tipBn:'ভিটামিন সি, জিঙ্ক ও ভিটামিন ডি রোগ প্রতিরোধে সাহায্য করে — সাথে ভালো ঘুম, ফল ও সবজি খান।' },
  { label:'poor sleep', bn:'ঘুমের সমস্যা', cats:['sleep'],
    kw:['sleep','insomnia','cant sleep','can\'t sleep','cannot sleep','sleepless','restless night','ghum','ghum hoy na','ghum ase na','ঘুম','অনিদ্রা'],
    tip:'Keep a fixed bedtime, avoid tea/coffee after evening and screens 1 hour before bed. Magnesium helps many people relax.',
    tipBn:'নির্দিষ্ট সময়ে ঘুমাতে যান, সন্ধ্যার পর চা-কফি আর ঘুমের ১ ঘণ্টা আগে মোবাইল এড়িয়ে চলুন। ম্যাগনেসিয়াম অনেককে রিল্যাক্স হতে সাহায্য করে।' },
  { label:'stress & anxiety', bn:'মানসিক চাপ', cats:['sleep','brain'],
    kw:['stress','stressed','anxiety','anxious','tension','overthinking','mood','chinta','tension','দুশ্চিন্তা','টেনশন','মানসিক চাপ','অস্থির'],
    tip:'Short walks, regular sleep and less caffeine make a real difference. Magnesium and omega-3 support a calmer mind.',
    tipBn:'অল্প হাঁটা, নিয়মিত ঘুম আর কম ক্যাফেইন সত্যিই পার্থক্য আনে। ম্যাগনেসিয়াম ও ওমেগা-৩ মনকে শান্ত রাখতে সাহায্য করে।' },
  { label:'memory & focus', bn:'মনোযোগ ও স্মৃতি', cats:['brain'],
    kw:['memory','focus','concentration','forget','forgetful','study','exam','brain','mone thake na','mone rakhte','monojog','smriti','মনোযোগ','স্মৃতি','মনে থাকে না','ভুলে যাই','পড়া মনে','omega'],
    tip:'Omega-3, good sleep and short study breaks help focus and memory.',
    tipBn:'ওমেগা-৩, পর্যাপ্ত ঘুম আর পড়ার মাঝে ছোট বিরতি মনোযোগ ও স্মৃতিশক্তিতে সাহায্য করে।' },
  { label:'muscle building', bn:'মাসল বিল্ডিং', cats:['muscle'],
    kw:['muscle','gym','protein','workout','body building','bodybuilding','bodybuilder','whey','creatine','bcaa','pesi','body banate','পেশী','জিম','প্রোটিন','বডি বানা'],
    tip:'Aim for about 1.6 g of protein per kg of body weight daily and train consistently. Whey after workouts makes this easier.',
    tipBn:'প্রতিদিন শরীরের ওজনের প্রতি কেজিতে প্রায় ১.৬ গ্রাম প্রোটিন নিন এবং নিয়মিত ব্যায়াম করুন। ওয়ার্কআউটের পর হুই প্রোটিন সহজ সমাধান।' },
  { label:'weight loss', bn:'ওজন কমানো', cats:['weight'],
    kw:['weight loss','lose weight','losing weight','fat loss','belly fat','burn fat','overweight','obese','obesity','mota','motai','moti','ojon komano','ojon kombe','ওজন কমা','মোটা','ভুঁড়ি','চর্বি','মেদ'],
    tip:'A small calorie deficit, daily walking and more protein & vegetables work best — supplements only support this.',
    tipBn:'অল্প ক্যালরি কম খাওয়া, প্রতিদিন হাঁটা আর বেশি প্রোটিন ও সবজি — এটাই সবচেয়ে কার্যকর; সাপ্লিমেন্ট শুধু সহায়ক।' },
  { label:'weight gain', bn:'ওজন বাড়ানো', cats:['muscle','energy'],
    kw:['weight gain','gain weight','put on weight','too thin','skinny','underweight','mass gainer','chikon','rogha','roga','ojon barano','ojon barbe','ওজন বাড়','রোগা','চিকন','শুকনা'],
    tip:'Eat 300–500 extra calories a day with protein in every meal, and do strength training so the weight goes to muscle.',
    tipBn:'প্রতিদিন ৩০০–৫০০ ক্যালরি বেশি খান, প্রতি বেলায় প্রোটিন রাখুন আর ব্যায়াম করুন যেন ওজনটা মাসলে যায়।' },
  { label:'bones & joints', bn:'হাড় ও জয়েন্ট', cats:['bones'],
    kw:['bone','bones','joint','joints','knee','back pain','calcium','vitamin d','arthritis','hari','harer','gira','girar betha','komor betha','হাড়','জয়েন্ট','গিরা','হাঁটু','কোমর','ক্যালসিয়াম'],
    tip:'Calcium with vitamin D3, some morning sunlight and light exercise keep bones and joints stronger.',
    tipBn:'ভিটামিন ডি৩ সহ ক্যালসিয়াম, সকালের রোদ আর হালকা ব্যায়াম হাড় ও জয়েন্ট মজবুত রাখে।' },
  { label:'baby care', bn:'শিশুর যত্ন', cats:['babycare'],
    kw:['baby','babies','infant','newborn','toddler','diaper','rash','bachcha','bachar','shishu','বাচ্চা','শিশু','নবজাতক','ডায়াপার'],
    tip:'Choose mild, fragrance-free products for babies and patch-test anything new first.',
    tipBn:'শিশুর জন্য মাইল্ড ও সুগন্ধিমুক্ত পণ্য বেছে নিন, নতুন কিছু আগে অল্প জায়গায় লাগিয়ে দেখুন।' },
  { label:'pregnancy & new mothers', bn:'গর্ভাবস্থা ও নতুন মা', cats:['maternity'], caution:true,
    kw:['pregnant','pregnancy','prenatal','maternity','folic','breastfeeding','new mom','stretch mark','gorbho','gorbhoboti','গর্ভ','গর্ভবতী','বুকের দুধ','স্ট্রেচ মার্ক'],
    tip:'Folic acid and iron are important during pregnancy — please follow your doctor\'s advice on any supplement.',
    tipBn:'গর্ভাবস্থায় ফলিক অ্যাসিড ও আয়রন গুরুত্বপূর্ণ — যেকোনো সাপ্লিমেন্টের ব্যাপারে আপনার ডাক্তারের পরামর্শ মেনে চলুন।' },
  { label:'beard care', bn:'দাড়ির যত্ন', cats:['beardcare'],
    kw:['beard','patchy beard','moustache','mustache','dari','dari gojay','দাড়ি','গোঁফ'],
    tip:'Wash your beard gently and use beard oil daily to keep it soft and reduce itchiness.',
    tipBn:'দাড়ি আলতো করে ধুয়ে প্রতিদিন বিয়ার্ড অয়েল দিন — নরম থাকবে, চুলকানি কমবে।' },
  { label:'shaving', bn:'শেভিং', cats:['shaving'],
    kw:['shave','shaving','razor','razor burn','after shave','sheving','শেভ'],
    tip:'Shave after a warm wash, go with the grain and use a fresh blade to avoid irritation.',
    tipBn:'গরম পানিতে মুখ ধুয়ে, লোমের দিকে শেভ করুন আর ধারালো নতুন ব্লেড ব্যবহার করুন।' },
  { label:'body odor & sweat', bn:'ঘাম ও গায়ের গন্ধ', cats:['deodorant','bodywash'],
    kw:['body odor','body odour','smell','sweat','sweating','bad odor','ghaam','gham','gaye gondho','ঘাম','গন্ধ','দুর্গন্ধ'],
    tip:'Shower daily with an antibacterial body wash and apply deodorant on clean, dry skin.',
    tipBn:'প্রতিদিন অ্যান্টিব্যাকটেরিয়াল বডিওয়াশ দিয়ে গোসল করুন আর শুকনো ত্বকে ডিওডোরেন্ট লাগান।' },
  { label:'lip care', bn:'ঠোঁটের যত্ন', cats:['lips'],
    kw:['dry lips','chapped','dark lips','lip','lips','thot','thot fata','ঠোঁট'],
    tip:'Use a lip balm several times a day and drink enough water; exfoliate gently once a week.',
    tipBn:'দিনে কয়েকবার লিপবাম দিন, পর্যাপ্ত পানি পান করুন আর সপ্তাহে একবার আলতো স্ক্রাব করুন।' },
  { label:'makeup', bn:'মেকআপ', cats:['face-makeup','eyes','lips'],
    kw:['makeup','make up','foundation','concealer','powder','mascara','eyeliner','kajal','lipstick','মেকআপ','কাজল','লিপস্টিক'],
    tip:'Start with a moisturizer and primer for a smoother, longer-lasting look.',
    tipBn:'মসৃণ ও দীর্ঘস্থায়ী লুকের জন্য আগে ময়েশ্চারাইজার ও প্রাইমার দিন।' },
  { label:'healthy food', bn:'স্বাস্থ্যকর খাবার', cats:['honey','drygoods'],
    kw:['healthy food','healthy snack','honey','nuts','dry fruit','breakfast','diet food','modhu','badam','মধু','বাদাম','স্বাস্থ্যকর খাবার'],
    tip:'Natural honey and nuts are great swaps for sugary snacks — a small handful a day is enough.',
    tipBn:'চিনিযুক্ত খাবারের বদলে প্রাকৃতিক মধু ও বাদাম খান — দিনে এক মুঠো যথেষ্ট।' },
];
/* jeigulote product na — sorasori daktar */
const AI_RED_FLAGS = ['chest pain','heart attack','stroke','cant breathe','can\'t breathe','cannot breathe','difficulty breathing','shortness of breath',
  'unconscious','fainted','fainting','seizure','suicide','kill myself','self harm','overdose','poison','vomiting blood','blood in','severe bleeding',
  'buke betha','buke batha','shash koshto','shas koshto','sash kosto','ojnan','অজ্ঞান','বুকে ব্যথা','শ্বাসকষ্ট','আত্মহত্যা','খিঁচুনি','রক্ত বমি','রক্তক্ষরণ','বিষ খে'];
/* product dewa jay, kintu daktarer sathe kotha bolar notice */
const AI_CAUTION = ['diabetes','diabetic','sugar','blood pressure','bp ','hypertension','kidney','liver','thyroid','cancer','heart','medicine','medication','tablet khai',
  'dibetis','daibetis','pressure','oshudh','osudh','ডায়াবেটিস','প্রেসার','কিডনি','লিভার','থাইরয়েড','ক্যান্সার','হার্ট','ওষুধ','pregnan','গর্ভ','breastfeed'];
const AI_STOP = new Set(['the','and','for','with','have','has','my','is','am','are','i','me','a','an','to','of','in','on','it','its','this','that','what','which','need','want','please','some','good','best','any','can','you','your','do','does','help','problem','issue','amar','ami','ki','kon','valo','bhalo','bhai','apu','ache','hoy','hocche','korbo','khabo','dorkar','jonno','er','r','o','te','ta','ti','আমার','আমি','কি','কোন','ভালো','জন্য','হচ্ছে','করবো','দরকার','আছে','হয়','টা','টি','সমস্যা']);

const aiIsBn = t => /[ঀ-৿]/.test(t);
function aiNorm(t){ return ' ' + String(t||'').toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s']/gu,' ').replace(/\s+/g,' ').trim() + ' '; }
/* keyword match — "chul pore" "amar chul onek pore"-teo milbe (sob shobdo thaklei) */
function aiHas(norm, kw){
  kw = kw.toLowerCase().trim();
  if(norm.includes(' ' + kw)) return true;
  const parts = kw.split(/\s+/);
  return parts.length > 1 && parts.every(w => norm.includes(' ' + w));
}

function aiPickProducts(catIds, words, max, pinned){
  const seen = new Set(), out = [];
  const add = p => { if(p && inStock(p) && !seen.has(p.id) && out.length < max){ seen.add(p.id); out.push(p.id); } };
  (pinned||[]).forEach(id=>add(findP(id)));
  const score = p => {
    const t = searchText(p) + ' ' + String(p.desc||'').toLowerCase() + ' ' + (p.benefits||[]).join(' ').toLowerCase();
    let s = (Number(p.rating)||0) + ((p.tags||[]).includes('best') ? 1 : 0);
    words.forEach(w=>{ if(t.includes(w)) s += 2; });
    return s;
  };
  // protita category theke paloy paloy — ek dhoroner product e sob na hoy
  const lists = catIds.map(c => PRODUCTS.filter(p=>productInCat(p, c) && inStock(p)).sort((a,b)=>score(b)-score(a)));
  for(let round=0; out.length<max && lists.some(l=>l.length>round); round++) lists.forEach(l=> add(l[round]));
  return out;
}

function aiBasicAnswer(text){
  const bn = aiIsBn(text);
  const norm = aiNorm(text);
  const max = AI_CFG.maxProducts;
  const words = norm.trim().split(' ').filter(w=>w.length>2 && !AI_STOP.has(w));

  // 1) emergency / red flag
  if(AI_RED_FLAGS.some(k=>aiHas(norm, k))){
    return { products:[], seeDoctor:true, followups:[],
      reply: bn ? `এটা জরুরি হতে পারে। **দয়া করে এখনই ডাক্তার দেখান বা নিকটস্থ হাসপাতালে যান** (জরুরি নম্বর: **999**)। এমন অবস্থায় কোনো সাপ্লিমেন্ট সমাধান নয়।`
                : `This could be serious. **Please see a doctor or go to the nearest hospital right away** (emergency: **999**). Supplements are not the right answer for this.` };
  }

  // 2) "kivabe khabo / how to use" — ager suggestion er use info
  if(/how (do i|to|should i) (use|take)|dose|dosage|kivabe|kibhabe|কিভাবে|কীভাবে|নিয়ম|খাওয়ার/.test(norm)){
    const lastBot = [...aiChat].reverse().find(m=>m.role==='assistant' && (m.products||[]).length);
    const ps = (lastBot ? lastBot.products : []).map(findP).filter(Boolean);
    if(ps.length){
      const lines = ps.map(p=>`• **${p.name}** — ${p.use && p.use.dose ? p.use.dose + (p.use.when ? ' · ' + p.use.when : '') : (bn ? 'প্যাকেটের নির্দেশনা অনুযায়ী' : 'follow the pack instructions')}`).join('\n');
      return { products: ps.map(p=>p.id), seeDoctor:false, followups:[],
        reply: (bn ? 'ব্যবহারের নিয়ম:\n' : 'How to use them:\n') + lines + (bn ? '\n\nকোনো রোগ বা ওষুধ চললে আগে ডাক্তারের পরামর্শ নিন।' : '\n\nIf you have a health condition or take medicine, check with your doctor first.') };
    }
  }

  // 3) admin-er nijer rule (keyword -> product)
  const ruleHits = AI_CFG.rules.filter(r => r.keywords.split(',').map(s=>s.trim()).filter(Boolean).some(k=>aiHas(norm, k)));
  const pinned = ruleHits.flatMap(r=>r.products);
  const notes = ruleHits.map(r=>r.note).filter(Boolean);

  // 4) built-in concerns
  const hits = AI_CONCERNS.filter(c => c.kw.some(k=>aiHas(norm, k)));
  const caution = hits.some(c=>c.caution) || AI_CAUTION.some(k=>aiHas(norm, k));
  const cats = [...new Set(hits.flatMap(c=>c.cats))];
  let products = aiPickProducts(cats, words, max, pinned);
  const cautionLine = caution ? (bn ? '\n\n⚠️ আপনার কোনো রোগ থাকলে, ওষুধ চললে বা গর্ভবতী হলে সাপ্লিমেন্ট শুরুর আগে ডাক্তারের পরামর্শ নিন।'
                                     : '\n\n⚠️ If you have a medical condition, take medicines or are pregnant, please check with your doctor before starting supplements.') : '';
  const otherChips = AI_CFG.chips.filter(c=>!aiHas(norm, c.toLowerCase().split(' ')[0])).slice(0,2);

  if(hits.length || products.length){
    const labels = hits.slice(0,2).map(c => bn ? c.bn : c.label);
    const tip = notes[0] || (hits[0] ? (bn ? hits[0].tipBn : hits[0].tip) : '');
    const head = labels.length
      ? (bn ? `**${labels.join(' ও ')}** এর জন্য আমার পরামর্শ:` : `Here are my picks for **${labels.join(' & ')}**:`)
      : (bn ? 'আপনার জন্য কিছু পরামর্শ:' : 'Here are some suggestions for you:');
    return { products, seeDoctor: caution, followups: [bn ? 'কিভাবে খাবো?' : 'How do I use these?', ...otherChips],
      reply: head + (tip ? `\n\n💡 ${tip}` : '') + (products.length ? '' : (bn ? '\n\nএই মুহূর্তে মানানসই প্রোডাক্ট স্টকে নেই — শিগগিরই আসবে।' : '\n\nMatching products are out of stock right now — please check back soon.')) + cautionLine };
  }

  // 5) sadharon product search (naam / brand / category)
  const found = words.length ? PRODUCTS.filter(p=>inStock(p) && words.some(w=>searchText(p).includes(w)))
    .sort((a,b)=> words.filter(w=>searchText(b).includes(w)).length - words.filter(w=>searchText(a).includes(w)).length).slice(0, max).map(p=>p.id) : [];
  if(found.length){
    return { products: found, seeDoctor: caution, followups: otherChips,
      reply: (bn ? `“${text}” — এর জন্য যা পেলাম:` : `Here's what I found for “${text}”:`) + cautionLine };
  }

  // 6) bujhte pari nai
  return { products:[], seeDoctor: caution, followups: AI_CFG.chips.slice(0,4),
    reply: (bn ? 'আমি ঠিক বুঝতে পারিনি 🙏 একটু বিস্তারিত বলবেন? যেমন: “চুল পড়ছে”, “শক্তি পাই না”, “ত্বক শুষ্ক”।'
               : "I'm not sure I understood 🙏 Could you describe it a little more? For example: “hair fall”, “low energy”, “dry skin”.")
      + (CONFIG.hotline && !isPlaceholder(CONFIG.hotline) ? (bn ? ` চাইলে আমাদের কল করুন: ${CONFIG.hotline}` : ` Or call us at ${CONFIG.hotline}.`) : '') + cautionLine };
}

/* =========================================================================
   AI MODE — Cloudflare Worker -> Claude. Fail korle basic mode.
   ========================================================================= */
async function aiAnswer(text){
  if(aiUsesWorker()){
    const history = aiChat.slice(-10).map(m => ({
      role: m.role,
      content: m.role === 'assistant'
        ? m.text + ((m.products||[]).length ? `\n[Suggested product ids: ${m.products.join(', ')}]` : '')
        : m.text
    }));
    const ctrl = new AbortController();
    const timer = setTimeout(()=>ctrl.abort(), 45000);
    try{
      const res = await fetch(AI_CFG.workerUrl, { method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ messages: history }), signal: ctrl.signal });
      const j = await res.json().catch(()=>({}));
      if(res.ok && typeof j.reply === 'string' && j.reply.trim()){
        const ids = (Array.isArray(j.products) ? j.products : []).map(Number).filter(id=>inStock(findP(id))).slice(0, AI_CFG.maxProducts);
        return { reply: j.reply, products: ids, followups: (j.followups||[]).map(String).slice(0,3), seeDoctor: !!j.seeDoctor, mode:'ai' };
      }
      console.warn('AI worker error:', res.status, j.error);
    }catch(e){ console.warn('AI worker unreachable:', e.message); }
    finally{ clearTimeout(timer); }
    return { ...aiBasicAnswer(text), mode:'basic-fallback' };
  }
  await new Promise(r=>setTimeout(r, 450));   // choto "typing" anubhuti
  return { ...aiBasicAnswer(text), mode:'basic' };
}

/* admin > AI Assistant e "Recent questions" — naam/phone chara, shudhu prosno */
function aiLog(q, res){
  if(!window.fdb) return;
  window.fdb.ref('aiLogs').push({
    q: q.slice(0,500), ts: Date.now(), mode: String(res.mode||'').slice(0,20),
    products: (res.products||[]).join(',').slice(0,200)
  }).catch(()=>{});
}

let aiBusy = false;
async function aiSend(raw){
  const text = String(raw||'').trim().slice(0,500);
  if(!text || aiBusy) return;
  aiBusy = true;
  aiChat.push({ role:'user', text });
  aiSaveChat(); aiRenderAll(true);
  let res;
  try{ res = await aiAnswer(text); }
  catch(e){ console.warn(e); res = { ...aiBasicAnswer(text), mode:'basic-fallback' }; }
  aiChat.push({ role:'assistant', text: res.reply, products: res.products||[], followups: res.followups||[], seeDoctor: !!res.seeDoctor });
  aiBusy = false;
  aiSaveChat(); aiRenderAll();
  aiLog(text, res);
}

/* =========================================================================
   UI — ekta-i chat component: homepage-e inline, onno page-e floating
   ========================================================================= */
const AI_SPARK = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2zm7 11l.95 2.55L22.5 16.5l-2.55.95L19 20l-.95-2.55L15.5 16.5l2.55-.95L19 13zM5 15l.7 1.8L7.5 17.5l-1.8.7L5 20l-.7-1.8L2.5 17.5l1.8-.7L5 15z"/></svg>`;
function aiFormat(t){
  return esc(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>');
}
function aiProdRow(p){
  const q = cart[p.id];
  return `<div class="ai-prod">
    <a class="ai-pimg" href="product.html?id=${p.id}">${imgHTML(p, p.name)}</a>
    <div class="ai-pinfo">
      <a class="ai-pname" href="product.html?id=${p.id}">${esc(p.name)}</a>
      <div class="ai-pprice">${money(p.price)}${p.oldPrice>p.price?` <s>${money(p.oldPrice)}</s>`:''}</div>
    </div>
    <button class="ai-padd${q?' in':''}" data-ai-add="${p.id}" aria-label="Add ${esc(p.name)} to cart">${q ? '✓ Added' : '+ Add'}</button>
  </div>`;
}
function aiMsgHTML(m, isLast){
  if(m.role === 'user') return `<div class="ai-msg me"><div class="ai-bubble">${esc(m.text)}</div></div>`;
  const prods = (m.products||[]).map(findP).filter(Boolean);
  return `<div class="ai-msg bot">
    <span class="ai-av">${AI_SPARK}</span>
    <div class="ai-body">
      <div class="ai-bubble">${aiFormat(m.text)}</div>
      ${m.seeDoctor ? `<div class="ai-doc">🩺 ${aiIsBn(m.text) ? 'প্রয়োজনে ডাক্তারের পরামর্শ নিন' : 'Please consult a doctor if symptoms are serious or don\'t improve'}</div>` : ''}
      ${prods.length ? `<div class="ai-prods">${prods.map(aiProdRow).join('')}</div>` : ''}
      ${isLast && (m.followups||[]).length ? `<div class="ai-chips">${m.followups.map(f=>`<button class="ai-chip" data-ai-q="${esc(f)}">${esc(f)}</button>`).join('')}</div>` : ''}
    </div>
  </div>`;
}
function aiMessagesHTML(){
  const welcome = { role:'assistant', text: AI_CFG.welcome, products:[], followups: aiChat.length ? [] : AI_CFG.chips };
  const all = [welcome, ...aiChat];
  return all.map((m,i)=>aiMsgHTML(m, i===all.length-1)).join('')
    + (aiBusy ? `<div class="ai-msg bot"><span class="ai-av">${AI_SPARK}</span><div class="ai-body"><div class="ai-bubble"><span class="ai-typing"><i></i><i></i><i></i></span></div></div></div>` : '');
}
const aiSpeech = window.SpeechRecognition || window.webkitSpeechRecognition;
function aiShellHTML(floating){
  return `<div class="ai-chat${floating?' is-float':''}">
    <div class="ai-head">
      <span class="ai-av big">${AI_SPARK}</span>
      <div class="ai-who"><b>${esc(AI_CFG.assistantName)}</b><small><span class="ai-live"></span>${aiUsesWorker() ? 'AI-powered' : 'Smart assistant'} · replies instantly</small></div>
      <button class="ai-ico" data-ai-reset title="Start a new chat" aria-label="Start a new chat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg></button>
      ${floating ? `<button class="ai-ico" data-ai-close aria-label="Close">×</button>` : ''}
    </div>
    <div class="ai-msgs" role="log" aria-live="polite">${aiMessagesHTML()}</div>
    <form class="ai-form" data-ai-form>
      <input type="text" maxlength="500" autocomplete="off" placeholder="${esc(AI_CFG.placeholder)}" aria-label="Describe your problem">
      ${aiSpeech ? `<button type="button" class="ai-mic" data-ai-mic title="Speak (Bangla)" aria-label="Speak your question"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg></button>` : ''}
      <button type="submit" class="ai-send" aria-label="Send"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4 21 12 3.4 3.6l.1 6.5L15 12l-11.5 1.9z"/></svg></button>
    </form>
    <div class="ai-disc">${esc(AI_CFG.disclaimer)}</div>
  </div>`;
}
function aiRenderAll(keepInput){
  document.querySelectorAll('.ai-msgs').forEach(box=>{
    box.innerHTML = aiMessagesHTML();
    box.scrollTop = box.scrollHeight;
  });
  document.querySelectorAll('.ai-send').forEach(b=> b.disabled = aiBusy);
  if(!keepInput) aiFocusInput(true);
}
function aiFocusInput(onlyIfFocused){
  const inp = document.querySelector('.ai-float.open .ai-form input') || document.querySelector('#aiInline .ai-form input');
  if(inp && (!onlyIfFocused || document.activeElement?.closest('.ai-chat'))) inp.focus({ preventScroll:true });
}

/* ---- homepage inline section ---- */
function aiMountInline(){
  const sec = document.getElementById('aiSection'), host = document.getElementById('aiInline');
  if(!sec || !host) return;
  if(!AI_CFG.enabled){ sec.style.display = 'none'; return; }
  sec.style.display = '';
  const t = document.getElementById('aiTitle'), s = document.getElementById('aiSub');
  if(t){
    const parts = AI_CFG.title.split(/\s+[—–-]\s+/);
    t.innerHTML = parts.length > 1 ? `${esc(parts[0])} — <em>${esc(parts.slice(1).join(' — '))}</em>` : esc(AI_CFG.title);
  }
  if(s) s.textContent = AI_CFG.subtitle;
  const tryBox = document.getElementById('aiTry');
  if(tryBox) tryBox.innerHTML = AI_CFG.chips.slice(0,6).map(c=>`<button class="ai-try-chip" data-ai-q="${esc(c)}">${esc(c)}</button>`).join('');
  host.innerHTML = aiShellHTML(false);
  const box = host.querySelector('.ai-msgs'); if(box) box.scrollTop = box.scrollHeight;
}

/* ---- floating "Ask AI" button — homepage-e AI section-e scroll kore, onno page-e chat panel khole ---- */
let aiFabObserver = null;
function aiMountFloating(){
  document.getElementById('aiFab')?.remove();
  document.getElementById('aiFloat')?.remove();
  aiFabObserver?.disconnect();
  if(!AI_CFG.enabled || !AI_CFG.floatingButton) return;
  const inline = document.getElementById('aiInline');
  document.body.insertAdjacentHTML('beforeend', `
    <button class="ai-fab${waNumber() ? ' has-wa' : ''}" id="aiFab" aria-label="Ask our ${esc(AI_CFG.assistantName)}">${AI_SPARK}<span>Ask AI</span></button>
    <div class="ai-float" id="aiFloat" role="dialog" aria-label="${esc(AI_CFG.assistantName)}">${aiShellHTML(true)}</div>`);
  // homepage: AI section screen-e thakle button lukai
  const sec = document.getElementById('aiSection');
  if(inline && sec && window.IntersectionObserver){
    aiFabObserver = new IntersectionObserver(([en])=> document.getElementById('aiFab')?.classList.toggle('hide', en.isIntersecting), { threshold:.25 });
    aiFabObserver.observe(sec);
  }
}
/* sob "Ask AI" link/button eta-i dake */
function openAI(){
  const sec = document.getElementById('aiSection'), inline = document.getElementById('aiInline');
  if(inline && sec && sec.style.display !== 'none'){
    sec.scrollIntoView({ behavior:'smooth', block:'start' });
    setTimeout(()=> inline.querySelector('.ai-form input')?.focus({ preventScroll:true }), 700);
    return;
  }
  if(document.getElementById('aiFloat')){ aiOpenFloat(); return; }
  location.href = 'index.html#aiSection';
}
function aiOpenFloat(){
  const f = document.getElementById('aiFloat'); if(!f) return;
  f.classList.add('open'); document.getElementById('aiFab')?.classList.add('hide');
  document.body.classList.add('ai-open');
  const box = f.querySelector('.ai-msgs'); if(box) box.scrollTop = box.scrollHeight;
  setTimeout(()=> f.querySelector('.ai-form input')?.focus(), 80);
}
function aiCloseFloat(){
  document.getElementById('aiFloat')?.classList.remove('open');
  document.getElementById('aiFab')?.classList.remove('hide');
  document.body.classList.remove('ai-open');
}
function aiMountAll(){
  aiMountInline(); aiMountFloating();
  // AI bondho thakle menu-r "Ask AI" link o lukai
  document.querySelectorAll('[data-ai-link]').forEach(a=> a.style.display = AI_CFG.enabled ? '' : 'none');
}

/* ---- voice input (Bangla) ---- */
let aiRec = null;
function aiToggleMic(btn){
  if(!aiSpeech) return;
  if(aiRec){ aiRec.stop(); return; }
  const form = btn.closest('form'), inp = form.querySelector('input');
  aiRec = new aiSpeech();
  aiRec.lang = 'bn-BD'; aiRec.interimResults = true; aiRec.maxAlternatives = 1;
  btn.classList.add('rec');
  aiRec.onresult = e => { inp.value = [...e.results].map(r=>r[0].transcript).join(' '); };
  aiRec.onend = () => { btn.classList.remove('rec'); aiRec = null; if(inp.value.trim()){ aiSend(inp.value); inp.value=''; } };
  aiRec.onerror = () => { btn.classList.remove('rec'); aiRec = null; toast('Could not hear you — please type instead'); };
  aiRec.start();
}

/* ---- event delegation (sob instance er jonno ekbar) ---- */
document.addEventListener('submit', e=>{
  const form = e.target.closest('[data-ai-form]'); if(!form) return;
  e.preventDefault();
  const inp = form.querySelector('input');
  const v = inp.value; inp.value = '';
  aiSend(v);
});
document.addEventListener('click', e=>{
  const q = e.target.closest('[data-ai-q]');
  if(q){
    if(q.classList.contains('ai-try-chip')) document.getElementById('aiInline')?.scrollIntoView({ behavior:'smooth', block:'center' });
    aiSend(q.dataset.aiQ); return;
  }
  const add = e.target.closest('[data-ai-add]');
  if(add){ addToCart(Number(add.dataset.aiAdd)); add.classList.add('in'); add.textContent = '✓ Added'; return; }
  if(e.target.closest('[data-ai-reset]')){ aiResetChat(); return; }
  if(e.target.closest('[data-ai-close]')){ aiCloseFloat(); return; }
  if(e.target.closest('#aiFab')){ aiOpenFloat(); return; }   // sob page-e chat window khole
  const mic = e.target.closest('[data-ai-mic]'); if(mic){ aiToggleMic(mic); return; }
});
document.addEventListener('keydown', e=>{ if(e.key === 'Escape') aiCloseFloat(); });

/* ---- boot: cache diye sathe sathe, tarpor Firebase theke fresh ---- */
document.addEventListener('DOMContentLoaded', ()=>{
  try{ aiApplyCfg(JSON.parse(localStorage.getItem(AI_CFG_CACHE)||'null')); }catch(e){ aiApplyCfg(null); }
  aiLoadChat();
  aiMountAll();
  if(!window.fdb) return;
  window.fdb.ref('aiConfig').once('value').then(snap=>{
    const val = snap.val();
    const sig = JSON.stringify(val||null);
    let old = null; try{ old = localStorage.getItem(AI_CFG_CACHE); }catch(e){}
    if(sig === (old||'null')) return;
    try{ localStorage.setItem(AI_CFG_CACHE, sig); }catch(e){}
    aiApplyCfg(val);
    aiMountAll();
  }).catch(()=>{ /* rules publish hoyni — default diye chole */ });
});
