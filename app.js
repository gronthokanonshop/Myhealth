/* =========================================================================
   MY HEALTH — shared app.js (sob page e include kora hoy)
   -------------------------------------------------------------------------
   EI FILE TA EKBAR EDIT KORLEI SOB PAGE E UPDATE HOY.
   1) CONFIG   -> brand, phone, delivery fee
   2) GOALS    -> Shop by Goal cards
   3) PRODUCTS -> product list (tomar book.js pattern)
   ========================================================================= */

/* ---------------- CONFIG ---------------- */
const CONFIG = {
  brand:            "My Health",
  tagline:          "Supplements & Nutrition",
  currency:         "৳",
  hotline:          "16XXX",
  whatsapp:         "8801XXXXXXXXX",
  deliveryFee:      60,        // delivery charge (৳)
  deliveryFeeOuter: 120,       // Dhaka er baire (optional, checkout e use)
  freeDeliveryOver: 1500,      // ei amount er beshi hole free delivery
  storageKey:       "myhealth_cart",
  coupons: {                   // coupon code: percent off
    "HEALTH10": 10,
    "FIT15":    15
  }
};

/* ---------------- GOALS ---------------- */
const GOALS = [
  { id:"immunity", label:"Immunity",   emoji:"🛡️", note:"Vit C · Zinc" },
  { id:"energy",   label:"Energy",     emoji:"⚡",  note:"B-Complex" },
  { id:"muscle",   label:"Muscle",     emoji:"💪",  note:"Whey · BCAA" },
  { id:"brain",    label:"Brain",      emoji:"🧠",  note:"Omega-3" },
  { id:"sleep",    label:"Sleep",      emoji:"🌙",  note:"Magnesium" },
  { id:"bones",    label:"Bones",      emoji:"🦴",  note:"Calcium · D3" },
  { id:"weight",   label:"Weight",     emoji:"⚖️",  note:"Fat burner" },
  { id:"skin",     label:"Skin & Hair",emoji:"✨",  note:"Biotin" },
];

/* ---------------- PRODUCTS ----------------
   field: id, name, goal, emoji, img(URL optional), timing, rating, reviews,
          oldPrice, price, tags[], brand, size,
          desc, benefits[], use{dose,when,duration}
------------------------------------------------------------------------- */
const PRODUCTS = [
  { id:1, name:"Whey Protein Isolate 2kg — Chocolate", goal:"muscle", emoji:"🥤", timing:"postworkout",
    rating:4.8, reviews:412, oldPrice:5200, price:3400, tags:["flash","best"], brand:"NutriPro", size:"2 kg · 66 servings",
    desc:"Fast-absorbing 100% whey isolate with 27g protein per scoop. Low in carbs and sugar — ideal for lean muscle building and post-workout recovery.",
    benefits:["27g protein per serving","Supports muscle recovery & growth","Low carb, low sugar","Mixes easily, no clumps"],
    use:{dose:"1 scoop (30g) with 250ml water/milk", when:"Within 30 min after workout", duration:"Daily"} },

  { id:2, name:"Vitamin C 1000mg with Zinc, 60 Tablets", goal:"immunity", emoji:"🍊", timing:"morning",
    rating:4.7, reviews:289, oldPrice:850, price:599, tags:["best"], brand:"VitaLife", size:"60 tablets",
    desc:"High-strength Vitamin C with Zinc to support your immune system, skin health and natural defense — especially during seasonal changes.",
    benefits:["Boosts immune defense","Antioxidant support","Zinc for faster recovery","One-a-day dosing"],
    use:{dose:"1 tablet daily", when:"After breakfast", duration:"Ongoing"} },

  { id:3, name:"Omega-3 Fish Oil 1000mg, 120 Softgels", goal:"brain", emoji:"🐟", timing:"anytime",
    rating:4.9, reviews:531, oldPrice:1800, price:1290, tags:["best","flash"], brand:"OceanPure", size:"120 softgels",
    desc:"Premium fish oil rich in EPA & DHA for heart, brain and joint health. Molecularly distilled for purity, no fishy aftertaste.",
    benefits:["Supports heart & brain","EPA + DHA omega-3","Joint & eye health","Purified, no fishy burp"],
    use:{dose:"1–2 softgels daily", when:"With a meal", duration:"Ongoing"} },

  { id:4, name:"Magnesium Glycinate 400mg, 90 Capsules", goal:"sleep", emoji:"🌿", timing:"night",
    rating:4.6, reviews:174, oldPrice:1400, price:990, tags:["new"], brand:"CalmWell", size:"90 capsules",
    desc:"Highly absorbable magnesium glycinate to relax muscles, ease stress and promote deeper, more restful sleep.",
    benefits:["Promotes relaxation & sleep","Eases muscle cramps","Gentle on stomach","Supports nervous system"],
    use:{dose:"2 capsules", when:"30–60 min before bed", duration:"Daily"} },

  { id:5, name:"BCAA 2:1:1 Energy Powder — Mango, 30 Serv", goal:"muscle", emoji:"🥭", timing:"postworkout",
    rating:4.5, reviews:98, oldPrice:2200, price:1650, tags:["flash"], brand:"NutriPro", size:"300g · 30 servings",
    desc:"Branched-chain amino acids in the ideal 2:1:1 ratio to reduce muscle breakdown, fight fatigue and speed up recovery.",
    benefits:["Reduces muscle fatigue","Faster recovery","Refreshing mango flavor","Sugar-free"],
    use:{dose:"1 scoop with 300ml water", when:"During / after workout", duration:"Training days"} },

  { id:6, name:"Vitamin D3 2000 IU, 120 Softgels", goal:"bones", emoji:"☀️", timing:"morning",
    rating:4.8, reviews:362, oldPrice:900, price:650, tags:["best"], brand:"VitaLife", size:"120 softgels",
    desc:"Sunshine vitamin for strong bones, immunity and mood. Essential for anyone with limited sun exposure.",
    benefits:["Strengthens bones & teeth","Supports immunity","Improves mood","Aids calcium absorption"],
    use:{dose:"1 softgel daily", when:"With a meal", duration:"Ongoing"} },

  { id:7, name:"Ashwagandha KSM-66 600mg, 90 Caps", goal:"sleep", emoji:"🌱", timing:"night",
    rating:4.7, reviews:245, oldPrice:1600, price:1150, tags:["best","new"], brand:"HerbRoot", size:"90 capsules",
    desc:"Clinically-studied KSM-66 ashwagandha to lower stress, improve sleep quality and support energy & focus.",
    benefits:["Reduces stress & anxiety","Improves sleep quality","Supports stamina","Adaptogenic herb"],
    use:{dose:"1 capsule", when:"After dinner", duration:"Daily for 8+ weeks"} },

  { id:8, name:"Multivitamin for Men, 60 Tablets", goal:"energy", emoji:"💊", timing:"morning",
    rating:4.6, reviews:201, oldPrice:1200, price:849, tags:[], brand:"VitaLife", size:"60 tablets",
    desc:"Complete daily multivitamin with 24 essential vitamins and minerals to fill nutritional gaps and support all-day energy.",
    benefits:["24 vitamins & minerals","All-day energy support","Immunity & metabolism","Convenient one-a-day"],
    use:{dose:"1 tablet daily", when:"After breakfast", duration:"Ongoing"} },

  { id:9, name:"Biotin 10000mcg Hair & Skin, 60 Caps", goal:"skin", emoji:"✨", timing:"anytime",
    rating:4.5, reviews:156, oldPrice:1100, price:799, tags:["new"], brand:"GlowLab", size:"60 capsules",
    desc:"High-potency biotin to strengthen hair, support nail growth and promote healthy, glowing skin.",
    benefits:["Stronger hair & nails","Healthy glowing skin","Reduces hair fall","High 10000mcg dose"],
    use:{dose:"1 capsule daily", when:"With a meal", duration:"3+ months for best results"} },

  { id:10, name:"Vitamin B-Complex, 100 Tablets", goal:"energy", emoji:"⚡", timing:"morning",
    rating:4.7, reviews:188, oldPrice:700, price:520, tags:["flash"], brand:"VitaLife", size:"100 tablets",
    desc:"All 8 B vitamins in one tablet to convert food into energy, support brain function and reduce tiredness.",
    benefits:["Fights fatigue","Supports metabolism","Healthy nervous system","All 8 B-vitamins"],
    use:{dose:"1 tablet daily", when:"After breakfast", duration:"Ongoing"} },

  { id:11, name:"Calcium + Magnesium + Zinc, 90 Tabs", goal:"bones", emoji:"🦴", timing:"anytime",
    rating:4.6, reviews:142, oldPrice:950, price:699, tags:[], brand:"BoneStrong", size:"90 tablets",
    desc:"Triple-mineral formula for strong bones, muscle function and recovery — perfect for active adults and seniors.",
    benefits:["Strong bones & joints","Muscle function","Better mineral absorption","3-in-1 formula"],
    use:{dose:"1 tablet", when:"After dinner", duration:"Ongoing"} },

  { id:12, name:"L-Carnitine Fat Burner 500mg, 60 Caps", goal:"weight", emoji:"🔥", timing:"morning",
    rating:4.4, reviews:87, oldPrice:1500, price:1099, tags:["flash"], brand:"LeanFit", size:"60 capsules",
    desc:"Helps your body turn fat into energy. Great alongside exercise for weight management and workout performance.",
    benefits:["Supports fat metabolism","Boosts workout energy","Stimulant-free","Vegetarian capsule"],
    use:{dose:"1 capsule", when:"30 min before workout", duration:"Training days"} },

  { id:13, name:"Creatine Monohydrate 300g Micronized", goal:"muscle", emoji:"💪", timing:"postworkout",
    rating:4.9, reviews:476, oldPrice:1800, price:1290, tags:["best"], brand:"NutriPro", size:"300g · 60 servings",
    desc:"The most researched supplement for strength and power. Micronized for easy mixing — increases muscle volume and performance.",
    benefits:["More strength & power","Increases muscle volume","100% pure creatine","Unflavored, mixes easily"],
    use:{dose:"5g (1 scoop) with water/juice", when:"Post-workout or anytime", duration:"Daily"} },

  { id:14, name:"Elderberry + Vitamin C Immune Gummies", goal:"immunity", emoji:"🫐", timing:"anytime",
    rating:4.7, reviews:233, oldPrice:1300, price:950, tags:["new"], brand:"VitaLife", size:"60 gummies",
    desc:"Delicious elderberry gummies packed with Vitamin C and Zinc — immune support the whole family will enjoy.",
    benefits:["Tasty immune support","Elderberry + Vit C + Zinc","Great for kids & adults","No artificial colors"],
    use:{dose:"2 gummies daily", when:"Anytime", duration:"Ongoing"} },

  { id:15, name:"Green Tea Extract 500mg, 90 Caps", goal:"weight", emoji:"🍵", timing:"morning",
    rating:4.5, reviews:119, oldPrice:850, price:620, tags:[], brand:"HerbRoot", size:"90 capsules",
    desc:"Concentrated green tea extract rich in EGCG antioxidants to support metabolism and natural fat burning.",
    benefits:["Supports metabolism","Rich in antioxidants","Natural energy","Supports fat loss"],
    use:{dose:"1 capsule", when:"Before meals", duration:"Daily"} },

  { id:16, name:"Collagen Peptides Powder 250g", goal:"skin", emoji:"🌸", timing:"anytime",
    rating:4.8, reviews:301, oldPrice:2400, price:1790, tags:["best","flash"], brand:"GlowLab", size:"250g · 25 servings",
    desc:"Hydrolyzed collagen peptides for youthful skin, stronger hair & nails, and healthy joints. Unflavored — mix into anything.",
    benefits:["Smoother, firmer skin","Stronger hair & nails","Joint support","Dissolves clear, tasteless"],
    use:{dose:"1 scoop (10g)", when:"In coffee, water or smoothie", duration:"Daily for 8+ weeks"} },

  { id:17, name:"Probiotic 50 Billion CFU, 60 Caps", goal:"immunity", emoji:"🦠", timing:"morning",
    rating:4.6, reviews:167, oldPrice:1900, price:1450, tags:["new"], brand:"GutWell", size:"60 capsules",
    desc:"50 billion CFU across 12 strains to balance gut flora, improve digestion and strengthen immunity.",
    benefits:["Better digestion","Gut & immune health","12 probiotic strains","Reduces bloating"],
    use:{dose:"1 capsule daily", when:"Empty stomach, morning", duration:"Ongoing"} },

  { id:18, name:"Pre-Workout Energy — Blue Raspberry, 30 Serv", goal:"energy", emoji:"🚀", timing:"postworkout",
    rating:4.7, reviews:214, oldPrice:2500, price:1850, tags:["flash"], brand:"NutriPro", size:"300g · 30 servings",
    desc:"Explosive energy, focus and pumps. Caffeine, beta-alanine and citrulline to power through your hardest sessions.",
    benefits:["Intense energy & focus","Better pumps","Delays fatigue","Refreshing flavor"],
    use:{dose:"1 scoop with 300ml water", when:"20 min before workout", duration:"Training days"} },

  { id:19, name:"Mass Gainer 3kg — Banana", goal:"muscle", emoji:"🍌", timing:"postworkout",
    rating:4.5, reviews:132, oldPrice:4500, price:3200, tags:[], brand:"NutriPro", size:"3 kg",
    desc:"High-calorie gainer with protein and complex carbs to help hard-gainers build size and strength.",
    benefits:["High calories for bulking","Protein + carbs blend","Supports weight gain","Great taste"],
    use:{dose:"2 scoops with 400ml milk", when:"After workout / between meals", duration:"Daily"} },

  { id:20, name:"Melatonin 5mg Sleep Aid, 100 Tablets", goal:"sleep", emoji:"😴", timing:"night",
    rating:4.6, reviews:178, oldPrice:600, price:430, tags:["best"], brand:"CalmWell", size:"100 tablets",
    desc:"Helps you fall asleep faster and reset your sleep cycle — perfect for jet lag or irregular schedules.",
    benefits:["Fall asleep faster","Resets sleep cycle","Non-habit forming","Wake refreshed"],
    use:{dose:"1 tablet", when:"30 min before bed", duration:"As needed"} },

  { id:21, name:"Lion's Mane Mushroom 1000mg, 60 Caps", goal:"brain", emoji:"🍄", timing:"morning",
    rating:4.7, reviews:96, oldPrice:1700, price:1280, tags:["new"], brand:"HerbRoot", size:"60 capsules",
    desc:"Nootropic mushroom traditionally used to support memory, focus and mental clarity.",
    benefits:["Supports memory & focus","Mental clarity","Nervous system support","Natural nootropic"],
    use:{dose:"1 capsule", when:"With breakfast", duration:"Daily"} },

  { id:22, name:"Iron + Folic Acid for Women, 60 Tablets", goal:"energy", emoji:"🩸", timing:"morning",
    rating:4.5, reviews:143, oldPrice:550, price:399, tags:[], brand:"VitaLife", size:"60 tablets",
    desc:"Gentle iron with folic acid to fight tiredness and support healthy blood — formulated for women's needs.",
    benefits:["Fights fatigue & anemia","Gentle on stomach","With folic acid","Supports energy"],
    use:{dose:"1 tablet daily", when:"After a meal", duration:"As advised"} },
];

/* =========================================================================
   HELPERS
   ========================================================================= */
const money   = n => CONFIG.currency + Number(n).toLocaleString('en-IN');
const findP   = id => PRODUCTS.find(p => p.id === Number(id));
const goalObj = id => GOALS.find(g => g.id === id);
const goalLabel = id => (goalObj(id)?.label) || id;
const stars   = r => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
const TIMING  = { morning:"🌅 Morning", postworkout:"💪 Post-workout", night:"🌙 Before bed", anytime:"⏱️ Anytime" };
const param   = key => new URLSearchParams(location.search).get(key);

/* =========================================================================
   CART (localStorage — sob page e share kore)
   ========================================================================= */
let cart = loadCart();
let wishlist = loadWishlist();

function loadCart(){ try{ return JSON.parse(localStorage.getItem(CONFIG.storageKey)) || {}; }catch(e){ return {}; } }
function saveCart(){ try{ localStorage.setItem(CONFIG.storageKey, JSON.stringify(cart)); }catch(e){} }
function loadWishlist(){ try{ return new Set(JSON.parse(localStorage.getItem('myhealth_wishlist')) || []); }catch(e){ return new Set(); } }
function saveWishlist(){ try{ localStorage.setItem('myhealth_wishlist', JSON.stringify([...wishlist])); }catch(e){} }

function addToCart(id, qty){
  id = Number(id); qty = qty || 1;
  cart[id] = (cart[id]||0) + qty;
  saveCart(); updateCartUI(); refreshAddButtons();
  toast("Added to cart 🛒");
}
function changeQty(id, delta){
  id = Number(id);
  cart[id] = (cart[id]||0) + delta;
  if(cart[id] <= 0) delete cart[id];
  saveCart(); updateCartUI(); refreshAddButtons();
}
function removeItem(id){ delete cart[Number(id)]; saveCart(); updateCartUI(); refreshAddButtons(); }

function cartTotals(){
  let count=0, sub=0;
  for(const id in cart){ const p=findP(id); if(!p) continue; count+=cart[id]; sub+=p.price*cart[id]; }
  const delivery = (sub===0 || sub>=CONFIG.freeDeliveryOver) ? 0 : CONFIG.deliveryFee;
  return { count, sub, delivery, total: sub+delivery };
}

/* re-sync any "Add" buttons on the page after cart changes */
function refreshAddButtons(){
  document.querySelectorAll('[data-add]').forEach(btn=>{
    const id = Number(btn.dataset.add);
    const q = cart[id];
    if(btn.classList.contains('add')){
      btn.classList.toggle('in', !!q);
      btn.innerHTML = q ? `✓ In cart (${q})` : "＋ Add to cart";
    }
  });
}

/* =========================================================================
   PRODUCT CARD (shared markup) — links to product.html?id=
   ========================================================================= */
function productCard(p){
  const off = Math.round((1 - p.price/p.oldPrice) * 100);
  const q = cart[p.id];
  const img = p.img ? `<img src="${p.img}" alt="${p.name}">` : p.emoji;
  return `
  <article class="card">
    <div class="card-img">
      ${off>0 ? `<span class="disc">${off}% OFF</span>` : ""}
      <button class="wish ${wishlist.has(p.id)?'on':''}" data-wish="${p.id}" onclick="toggleWish(${p.id},this)" aria-label="Wishlist">♥</button>
      <a href="product.html?id=${p.id}">${img}</a>
      <span class="timing">${TIMING[p.timing]||TIMING.anytime}</span>
    </div>
    <div class="card-body">
      <span class="goal-tag">${goalLabel(p.goal)}</span>
      <div class="card-name"><a href="product.html?id=${p.id}">${p.name}</a></div>
      <div class="rating"><span class="stars">${stars(p.rating)}</span> ${p.rating} <span>(${p.reviews})</span></div>
      <div class="price-row">
        <span class="price">${money(p.price)}</span>
        ${p.oldPrice>p.price ? `<span class="old">${money(p.oldPrice)}</span>` : ""}
      </div>
      <button class="add ${q?'in':''}" data-add="${p.id}" onclick="addToCart(${p.id})">
        ${q ? `✓ In cart (${q})` : "＋ Add to cart"}
      </button>
    </div>
  </article>`;
}

function toggleWish(id, el){
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
   SHARED CHROME — header + cart drawer + toast (inject into every page)
   ========================================================================= */
function buildHeader(){
  return `
  <div class="utilbar">
    <div class="wrap">
      <div class="u-left">🚚 <b>Free delivery</b> over <span class="lime">${money(CONFIG.freeDeliveryOver)}</span> &nbsp;·&nbsp; Same-day in Dhaka</div>
      <div class="u-right">📞 Hotline: <b>${CONFIG.hotline}</b> &nbsp;·&nbsp; 9am–10pm</div>
    </div>
  </div>
  <header class="site">
    <div class="wrap head-main">
      <a class="logo" href="index.html">
        <span class="mark"></span>
        <span>${CONFIG.brand}<small>${CONFIG.tagline}</small></span>
      </a>
      <div class="search">
        <span class="ico">🔍</span>
        <input id="globalSearch" type="search" placeholder="Search vitamins, protein, omega-3…"
          onkeydown="if(event.key==='Enter') goSearch(this.value)" />
      </div>
      <div class="head-actions">
        <button class="iconbtn" onclick="openMenu()" aria-label="Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>Menu
        </button>
        <a class="iconbtn" href="#">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>Account
        </a>
        <button class="iconbtn" onclick="openWish()" aria-label="Wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-4.6-9.3-9C1 8.5 2.5 5.5 5.5 5.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3 0 4.5 3 2.8 6.5C19 16.4 12 21 12 21z"/></svg>
          Wishlist<span class="badge" id="wishBadge">0</span>
        </button>
        <button class="iconbtn" onclick="openCart()" aria-label="Cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M6 6 5 3H2"/></svg>
          Cart<span class="badge" id="cartBadge">0</span>
        </button>
      </div>
    </div>
    <nav class="catnav">
      <div class="wrap">
        <a class="catpill flash" href="category.html?goal=all">Flash Sale</a>
        <a class="catpill" href="category.html?goal=all">All Supplements</a>
        ${GOALS.map(g=>`<a class="catpill" href="category.html?goal=${g.id}">${g.label}</a>`).join('')}
      </div>
    </nav>
  </header>`;
}

function buildFooter(){
  return `
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="logo" href="index.html"><span class="mark"></span><span>${CONFIG.brand}<small>${CONFIG.tagline}</small></span></a>
        <p style="font-size:14px; max-width:280px;">Bangladesh's trusted store for authentic supplements, vitamins and nutrition. Delivered to all 64 districts.</p>
        <div class="foot-pay"><span>bKash</span><span>Nagad</span><span>Card</span><span>COD</span></div>
      </div>
      <div><h4>Shop</h4><ul>
        <li><a href="category.html?goal=all">All Supplements</a></li>
        <li><a href="index.html#goals">Shop by Goal</a></li>
        <li><a href="category.html?goal=muscle">Protein & Muscle</a></li>
        <li><a href="category.html?goal=immunity">Immunity</a></li>
      </ul></div>
      <div><h4>Help</h4><ul>
        <li><a href="#">Track Order</a></li><li><a href="#">Delivery Info</a></li>
        <li><a href="#">Return Policy</a></li><li><a href="#">FAQ</a></li>
      </ul></div>
      <div><h4>Company</h4><ul>
        <li><a href="#">About Us</a></li><li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Terms & Conditions</a></li><li><a href="#">Careers</a></li>
      </ul></div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 ${CONFIG.brand}. All rights reserved.</span>
      <div class="socials"><a href="#">f</a><a href="#">📷</a><a href="#">▶</a><a href="#">in</a></div>
    </div>
  </div>`;
}

function buildDrawer(){
  return `
  <div class="overlay" id="overlay" onclick="closeCart()"></div>
  <aside class="drawer" id="drawer" aria-label="Shopping cart">
    <div class="drawer-head"><h3>Your Cart (<span id="cartCount">0</span>)</h3><button onclick="closeCart()" aria-label="Close">×</button></div>
    <div class="drawer-body" id="cartBody"></div>
    <div class="drawer-foot" id="cartFoot" style="display:none">
      <div class="sumline"><span>Subtotal</span><span id="dSub">৳0</span></div>
      <div class="sumline"><span>Delivery</span><span id="dDel">৳60</span></div>
      <div class="sumline total"><span>Total</span><span id="dTotal">৳0</span></div>
      <button class="checkout" onclick="location.href='checkout.html'">Proceed to Checkout</button>
      <div class="pay-note">🔒 bKash · Nagad · Cash on Delivery</div>
    </div>
  </aside>
  <div class="toast" id="toast"></div>`;
}

function buildMenu(){
  return `
  <div class="overlay" id="menuOverlay" onclick="closeMenu()"></div>
  <aside class="menu-drawer" id="menuDrawer" aria-label="Main menu">
    <div class="menu-head">
      <a class="logo" href="index.html"><span class="mark"></span><span>${CONFIG.brand}<small>${CONFIG.tagline}</small></span></a>
      <button onclick="closeMenu()" aria-label="Close">×</button>
    </div>
    <nav class="menu-nav">
      <a href="index.html">🏠 Home</a>
      <a href="category.html?goal=all">🛒 All Supplements</a>
      <a class="menu-flash" href="category.html?goal=all">⚡ Flash Sale</a>
      <div class="menu-label">Shop by Goal</div>
      ${GOALS.map(g=>`<a href="category.html?goal=${g.id}">${g.emoji} ${g.label}</a>`).join('')}
      <div class="menu-label">Help</div>
      <a href="#">📦 Track Order</a>
      <a href="#">🚚 Delivery Info</a>
      <a href="#">ℹ️ About Us</a>
      <a href="#">📞 Contact</a>
    </nav>
    <div class="menu-foot">
      <a class="btn btn-green" href="tel:${CONFIG.hotline}">📞 Call ${CONFIG.hotline}</a>
    </div>
  </aside>`;
}
function openMenu(){ document.getElementById('menuDrawer')?.classList.add('open'); document.getElementById('menuOverlay')?.classList.add('open'); }
function closeMenu(){ document.getElementById('menuDrawer')?.classList.remove('open'); document.getElementById('menuOverlay')?.classList.remove('open'); }

function buildWishDrawer(){
  return `
  <div class="overlay" id="wishOverlay" onclick="closeWish()"></div>
  <aside class="drawer" id="wishDrawer" aria-label="Wishlist">
    <div class="drawer-head"><h3>Wishlist (<span id="wishCount">0</span>)</h3><button onclick="closeWish()" aria-label="Close">×</button></div>
    <div class="drawer-body" id="wishBody"></div>
  </aside>`;
}
function updateWishUI(){
  const ids = [...wishlist];
  const wb = document.getElementById('wishBadge'); if(wb) wb.textContent = ids.length;
  const wc = document.getElementById('wishCount'); if(wc) wc.textContent = ids.length;
  const body = document.getElementById('wishBody'); if(!body) return;
  if(ids.length===0){
    body.innerHTML = `<div class="cart-empty"><div class="ce">♡</div>Your wishlist is empty.<br><small>Tap the ♥ on any product to save it here.</small></div>`;
    return;
  }
  body.innerHTML = ids.map(id=>{
    const p=findP(id); if(!p) return "";
    const img = p.img ? `<img src="${p.img}" alt="">` : p.emoji;
    return `<div class="cart-item">
      <a class="ci-img" href="product.html?id=${p.id}">${img}</a>
      <div class="ci-info">
        <a href="product.html?id=${p.id}" class="nm" style="display:block">${p.name}</a>
        <div class="pr">${money(p.price)}</div>
        <button class="wish-add" onclick="moveToCart(${p.id})">＋ Add to cart</button>
      </div>
      <button class="ci-remove" onclick="removeWish(${p.id})" aria-label="Remove">🗑</button>
    </div>`;
  }).join('');
}
function openWish(){ updateWishUI(); document.getElementById('wishDrawer')?.classList.add('open'); document.getElementById('wishOverlay')?.classList.add('open'); }
function closeWish(){ document.getElementById('wishDrawer')?.classList.remove('open'); document.getElementById('wishOverlay')?.classList.remove('open'); }

function updateCartUI(){
  const {count, sub, delivery, total} = cartTotals();
  const badge = document.getElementById('cartBadge'); if(badge) badge.textContent = count;
  const cc = document.getElementById('cartCount'); if(cc) cc.textContent = count;
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  if(!body) return;
  if(count===0){
    body.innerHTML = `<div class="cart-empty"><div class="ce">🛒</div>Your cart is empty.<br><small>Add supplements to get started.</small></div>`;
    if(foot) foot.style.display = "none"; return;
  }
  if(foot) foot.style.display = "block";
  body.innerHTML = Object.keys(cart).map(id=>{
    const p=findP(id); if(!p) return ""; const q=cart[id];
    const img = p.img ? `<img src="${p.img}" alt="">` : p.emoji;
    return `<div class="cart-item">
      <div class="ci-img">${img}</div>
      <div class="ci-info">
        <div class="nm">${p.name}</div>
        <div class="pr">${money(p.price)}</div>
        <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${q}</span><button onclick="changeQty(${p.id},1)">＋</button></div>
      </div>
      <button class="ci-remove" onclick="removeItem(${p.id})" aria-label="Remove">🗑</button>
    </div>`;
  }).join('');
  const set = (id,v)=>{ const e=document.getElementById(id); if(e) e.textContent=v; };
  set('dSub', money(sub));
  set('dDel', delivery===0 ? "FREE" : money(delivery));
  set('dTotal', money(total));
}

function openCart(){ document.getElementById('drawer')?.classList.add('open'); document.getElementById('overlay')?.classList.add('open'); }
function closeCart(){ document.getElementById('drawer')?.classList.remove('open'); document.getElementById('overlay')?.classList.remove('open'); }
function goSearch(q){ location.href = "category.html?q=" + encodeURIComponent(q||""); }

let toastTimer;
function toast(msg){
  const t = document.getElementById('toast'); if(!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(()=> t.classList.remove('show'), 1800);
}

/* =========================================================================
   INIT — inject chrome, then page-specific init() runs (if defined)
   ========================================================================= */
document.addEventListener('DOMContentLoaded', ()=>{
  const h = document.getElementById('site-header'); if(h) h.innerHTML = buildHeader();
  const f = document.getElementById('site-footer'); if(f) f.innerHTML = buildFooter();
  document.body.insertAdjacentHTML('beforeend', buildDrawer());
  document.body.insertAdjacentHTML('beforeend', buildMenu());
  document.body.insertAdjacentHTML('beforeend', buildWishDrawer());
  updateCartUI();
  updateWishUI();
  if(typeof initPage === 'function') initPage();
});