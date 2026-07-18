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
  tagline:          "Health, Beauty & Wellness",
  /* ⚠️ DOMAIN PLACEHOLDER — domain kena hole ekhane real URL boshao (sese / chara).
     Ei jaygata charao sitemap.xml, robots.txt ar admin.html er SITE_BASE_URL o bodlate hobe. */
  siteUrl:          "https://YOUR-DOMAIN.com",
  currency:         "৳",
  /* ⚠️ PLACEHOLDER — nicher jogajog tottho gula tomar ASOL info diye bodlao.
     Ei tottho footer, contact page, WhatsApp button, order confirmation e use hoy. */
  hotline:          "16XXX",
  whatsapp:         "8801XXXXXXXXX",   // WhatsApp number (deshi format, 880 diye, + chara)
  email:            "support@YOUR-DOMAIN.com",
  address:          "Dhaka, Bangladesh",     // dokaner asol thikana
  tradeLicense:     "",                 // thakle trade license number (footer e dekhabe)
  /* ⚠️ PLACEHOLDER — marketing/analytics. ID boshale nije theke chalu hobe, khali thakle kichu load hobe na. */
  gaId:             "",   // Google Analytics 4 — jemon "G-XXXXXXXXXX"
  fbPixel:          "",   // Facebook Pixel ID — jemon "1234567890"
  deliveryFee:      60,        // delivery charge (৳)
  deliveryFeeOuter: 120,       // Dhaka er baire (optional, checkout e use)
  freeDeliveryOver: 1500,      // ei amount er beshi hole free delivery
  storageKey:       "myhealth_cart",
  coupons: {                   // coupon code: percent off
    "HEALTH10": 10,
    "FIT15":    15
  }
};

/* ---------------- CATEGORIES ----------------
   Top-level category -> subcategories. Ei structure diye header dropdown menu,
   homepage "Shop by Category" tiles, ar category.html filtering hoy.
   Product er `goal` field ekhon EKTA SUBCATEGORY id (jemon "immunity", "shampoo").
   Purono 8ta "health goal" ekhon "Vitamins & Supplements" er sub — tai age-er
   34ta product-er data OPORIBORTITO thake, notun kichu bhangbe na. */
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

/* flattened subcategory list — purono GOALS-er moto e byabohar hoy (goalObj,
   goalLabel, search, filters, footer link ityadi kono poriborton lagbe na) */
const GOALS = CATEGORIES.flatMap(c => c.subs.map(s => ({...s, parent: c.id})));

/* subcategory id diye tar top-level category ta khuje deoa hoy (nav, breadcrumb) */
function categoryOf(subId){ return CATEGORIES.find(c => c.subs.some(s=>s.id===subId)); }
function categoryObj(id){ return CATEGORIES.find(c=>c.id===id); }

/* ---------------- CUSTOMER REVIEWS (homepage slider) ----------------
   Nijer ichha moto edit/add koro — rating 4 ba 5 rakhio. */
const REVIEWS = [
  { name:"Rafiul Islam",   area:"Dhaka",      rating:5, text:"Whey protein ta 100% original mone hoyeche — packaging, seal sob thik chilo. Same day delivery peyechi!", product:"Whey Protein Isolate" },
  { name:"Sadia Afrin",    area:"Chattogram", rating:5, text:"Vitamin C ar Zinc regular khacchi, shordi-kashi onek kome geche. Dam o onno jaygar cheye kom.", product:"Vitamin C + Zinc" },
  { name:"Mahmudul Hasan", area:"Sylhet",     rating:4, text:"Omega-3 er quality khub bhalo, fishy smell nei. Delivery 2 din legechilo, tobe packaging solid.", product:"Omega-3 Fish Oil" },
  { name:"Nusrat Jahan",   area:"Rajshahi",   rating:5, text:"Collagen powder 1 mash use korchi — skin onek soft hoyeche. Customer service o khub helpful.", product:"Collagen Peptides" },
  { name:"Tanvir Ahmed",   area:"Khulna",     rating:5, text:"Creatine ar pre-workout duitai nilam. Gym er performance e clear difference. Trusted shop!", product:"Creatine Monohydrate" },
  { name:"Farhana Akter",  area:"Dhaka",      rating:4, text:"Magnesium khawar por ghum onek better hoyeche. bKash payment o smooth chilo.", product:"Magnesium Glycinate" },
];

/* ---------------- INFO / POLICY PAGES (page.html?p=xxx) ----------------
   Ei content gula sohoje edit kora jay. HTML lekha jabe (heading er jonno <h3>,
   list er jonno <ul><li>). ⚠️ jekhane [PLACEHOLDER] ase seta tomar asol info diye bodlao. */
const PAGES = {
  about: {
    title: "About Us",
    html: `
      <p>{brand} is a trusted online store in Bangladesh for 100% authentic supplements, vitamins and nutrition products. Our goal is simple — genuine products at honest prices, delivered right to your door.</p>
      <h3>Why choose us?</h3>
      <ul>
        <li><b>100% Authentic</b> — sourced directly from brands and authorized importers.</li>
        <li><b>Lab-verified quality</b> — every product is quality-checked.</li>
        <li><b>Fast delivery</b> — same-day in Dhaka, 12–48 hours nationwide.</li>
        <li><b>Secure payment</b> — bKash, Nagad, Card and Cash on Delivery.</li>
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
        <li><b>FREE delivery</b> on orders over <b>৳{freeDeliveryOver}</b> — anywhere in Bangladesh.</li>
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
        <li>For safety reasons, supplements with a broken seal or opened packaging cannot be returned (unless the product itself is faulty).</li>
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
        <li>Email (optional) — to send order updates.</li>
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
      <p>bKash, Nagad, Card or Cash on Delivery (pay when you receive the product).</p>
      <h3>How long does delivery take?</h3>
      <p>Same-day/next-day in Dhaka, 12–48 hours outside Dhaka. See <a href="page.html?p=delivery">Delivery Info</a> for details.</p>
      <h3>How do I track my order?</h3>
      <p>Enter your Order ID on the <a href="track.html">Track Order</a> page to see its real-time status.</p>`
  }
};

/* ---------------- PRODUCTS ----------------
   field: id, name, goal, emoji, img(URL optional), timing, rating, reviews,
          oldPrice, price, tags[], brand, size,
          desc, benefits[], use{dose,when,duration}
------------------------------------------------------------------------- */
/* ---------------- PRODUCTS ----------------
   Product list ekhon ALADA file e: product.js  (HTML e app.js er age load hoy)
------------------------------------------------------------------------- */

/* =========================================================================
   HELPERS
   ========================================================================= */
const money   = n => CONFIG.currency + Number(n).toLocaleString('en-IN');
const findP   = id => PRODUCTS.find(p => p.id === Number(id));
const goalObj = id => GOALS.find(g => g.id === id);
const goalLabel = id => (goalObj(id)?.label) || id;
const stars   = r => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
const TIMING  = { morning:"Morning", postworkout:"Post-workout", night:"Before bed", anytime:"Anytime" };
const param   = key => new URLSearchParams(location.search).get(key);
/* stock check — admin er stockToggle ekhane match kore (stock:false = out) */
const inStock = p => !!p && p.stock !== false && p.stock != null;

/* Product source priority:  Firebase  ->  product.js seed (fallback).
   Admin panel product gula Firebase e rakhe; storefront LIVE listener diye pore —
   admin e add/edit korlei khola page e sathe sathe update hoy (reload lagbe na).
   Checkout page e live re-render bondho (form reset hoye jeto), tai NO_LIVE_RERENDER flag. */
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

/* -------- Branded placeholder (photo nai / load fail) --------
   Emoji na, saiter nijer logo mark + brand name diye placeholder —
   Boro container e (card/detail) full branding, choto thumb e sudhu mark
   (CSS diye .ph-brand hide kora hoy). */
function placeholderHTML(){
  return `<span class="img-ph" aria-hidden="true">
    <span class="mark ph-mark"></span>
    <span class="ph-brand"><span class="ph-name"><span class="o">My</span> Health</span><span class="ph-sub">${CONFIG.tagline}</span></span>
  </span>`;
}
/* image load fail korle giant alt-text na dekhiye branded placeholder dekhabe */
function imgFallback(el){
  const s = document.createElement('span');
  s.className = 'img-emoji';
  s.innerHTML = placeholderHTML();
  el.replaceWith(s);
}
/* two-tone wordmark: prothom word orange, baki context color */
function brandWordmark(){
  const parts = (CONFIG.brand||'My Health').split(' ');
  const name = `<span class="o">${parts[0]}</span>${parts.length>1?' '+parts.slice(1).join(' '):''}`;
  return `<span class="wm"><span class="wm-name">${name}</span><small>${CONFIG.tagline}</small></span>`;
}
function imgHTML(p, alt){
  return p.img
    ? `<img src="${p.img}" alt="${alt||''}" loading="lazy" onerror="imgFallback(this)">`
    : placeholderHTML();
}

/* =========================================================================
   CART (localStorage — sob page e share kore)
   ========================================================================= */
let cart = loadCart();
let wishlist = loadWishlist();

function loadCart(){ try{ return JSON.parse(localStorage.getItem(CONFIG.storageKey)) || {}; }catch(e){ return {}; } }
function saveCart(){ try{ localStorage.setItem(CONFIG.storageKey, JSON.stringify(cart)); }catch(e){} }
function loadWishlist(){ try{ return new Set(JSON.parse(localStorage.getItem('myhealth_wishlist')) || []); }catch(e){ return new Set(); } }
function saveWishlist(){ try{ localStorage.setItem('myhealth_wishlist', JSON.stringify([...wishlist])); }catch(e){} }

/* ---- Coupon (drawer + checkout share kore, localStorage e thake) ---- */
function getCoupon(){
  try{
    const c = (localStorage.getItem('myhealth_coupon')||'').toUpperCase();
    return CONFIG.coupons[c] ? c : '';
  }catch(e){ return ''; }
}
function setCoupon(code){
  try{
    if(code) localStorage.setItem('myhealth_coupon', code.toUpperCase());
    else localStorage.removeItem('myhealth_coupon');
  }catch(e){}
}

function addToCart(id, qty){
  id = Number(id); qty = qty || 1;
  const p = findP(id);
  if(p && !inStock(p)){ toast("Out of stock"); return; }
  cart[id] = (cart[id]||0) + qty;
  saveCart(); updateCartUI(); refreshAddButtons();
  toast("Added to cart");
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
  const coupon = getCoupon();
  const discount = coupon ? Math.round(sub * CONFIG.coupons[coupon] / 100) : 0;
  const delivery = (sub===0 || sub>=CONFIG.freeDeliveryOver) ? 0 : CONFIG.deliveryFee;
  return { count, sub, coupon, discount, delivery, total: sub - discount + delivery };
}

/* re-sync any "Add" buttons on the page after cart changes */
function refreshAddButtons(){
  document.querySelectorAll('[data-add]').forEach(btn=>{
    const id = Number(btn.dataset.add);
    if(btn.disabled) return; /* out-of-stock button — leave as is */
    const q = cart[id];
    if(btn.classList.contains('add')){
      btn.classList.toggle('in', !!q);
      btn.innerHTML = q ? `✓ In cart (${q})` : "Add to cart";
    }
  });
}

/* =========================================================================
   PRODUCT CARD (shared markup) — links to product.html?id=
   ========================================================================= */
function productCard(p){
  const off = Math.round((1 - p.price/p.oldPrice) * 100);
  const q = cart[p.id];
  const oos = !inStock(p);
  const img = imgHTML(p, p.name);
  return `
  <article class="card${oos?' is-oos':''}">
    <div class="card-img">
      ${oos ? `<span class="disc oos">Out of stock</span>` : (off>0 ? `<span class="disc">${off}% OFF</span>` : "")}
      <button class="wish ${wishlist.has(p.id)?'on':''}" data-wish="${p.id}" onclick="toggleWish(${p.id},this)" aria-label="Wishlist">♥</button>
      <a href="product.html?id=${p.id}">${img}</a>
      <button class="qv-btn" onclick="openQuickView(${p.id})">Quick View</button>
    </div>
    <div class="card-body">
      ${p.brand ? `<span class="card-brand">${p.brand}</span>` : ""}
      <div class="card-name"><a href="product.html?id=${p.id}">${p.name}</a></div>
      <div class="price-row">
        <span class="price">${money(p.price)}</span>
        ${p.oldPrice>p.price ? `<span class="old">${money(p.oldPrice)}</span>` : ""}
      </div>
      <button class="add ${q?'in':''}" data-add="${p.id}" ${oos?'disabled':''} onclick="${oos?'':`addToCart(${p.id})`}">
        ${oos ? "Out of stock" : (q ? `✓ In cart (${q})` : "Add to cart")}
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
      <div class="u-left"><b>Free delivery</b> over <span class="lime">${money(CONFIG.freeDeliveryOver)}</span> &nbsp;·&nbsp; Same-day in Dhaka</div>
      <div class="u-right">Hotline: <b>${CONFIG.hotline}</b> &nbsp;·&nbsp; 9am–10pm</div>
    </div>
  </div>
  <header class="site">
    <div class="wrap head-main">
      <a class="logo" href="index.html">
        <span class="mark"></span>
        ${brandWordmark()}
      </a>
      <div class="search">
        <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg></span>
        <input id="globalSearch" type="search" autocomplete="off" placeholder="Search vitamins, protein, omega-3…"
          oninput="liveSearch(this.value)"
          onkeydown="if(event.key==='Enter') goSearch(this.value); if(event.key==='Escape') closeSearch();" />
        <div class="search-results" id="searchResults"></div>
      </div>
      <div class="head-actions">
        <button class="iconbtn" onclick="openMenu()" aria-label="Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>Menu
        </button>
        <a class="iconbtn" href="account.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>
          <span id="acctLabel">Account</span>
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
  </header>`;
}

function buildFooter(){
  return `
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="logo" href="index.html"><span class="mark"></span>${brandWordmark()}</a>
        <p style="font-size:14px; max-width:280px;">Bangladesh's trusted store for authentic supplements, vitamins and nutrition. Delivered to all 64 districts.</p>
        <div class="foot-contact">
          <a href="tel:${CONFIG.hotline}">${CONFIG.hotline}</a>
          <a href="mailto:${CONFIG.email}">${CONFIG.email}</a>
          <span>${CONFIG.address}</span>
          ${CONFIG.tradeLicense ? `<span>Trade Licence: ${CONFIG.tradeLicense}</span>` : ''}
        </div>
        <div class="foot-pay"><span>bKash</span><span>Nagad</span><span>Card</span><span>COD</span></div>
      </div>
      <div><h4>Shop</h4><ul>
        <li><a href="category.html?goal=all">All Products</a></li>
        <li><a href="category.html?goal=supplements">Vitamins & Supplements</a></li>
        <li><a href="category.html?goal=facecare">Face Care</a></li>
        <li><a href="category.html?goal=haircare">Hair Care</a></li>
        <li><a href="category.html?goal=makeup">Makeup</a></li>
        <li><a href="category.html?goal=motherbaby">Mother & Baby</a></li>
      </ul></div>
      <div><h4>Help</h4><ul>
        <li><a href="track.html">Track Order</a></li><li><a href="page.html?p=delivery">Delivery Info</a></li>
        <li><a href="page.html?p=return">Return Policy</a></li><li><a href="page.html?p=faq">FAQ</a></li>
      </ul></div>
      <div><h4>Company</h4><ul>
        <li><a href="page.html?p=about">About Us</a></li><li><a href="page.html?p=privacy">Privacy Policy</a></li>
        <li><a href="page.html?p=terms">Terms & Conditions</a></li><li><a href="page.html?p=contact">Contact Us</a></li>
      </ul></div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 ${CONFIG.brand}. All rights reserved.</span>
      <div class="socials"><a href="#" aria-label="Facebook">FB</a><a href="#" aria-label="Instagram">IG</a><a href="#" aria-label="YouTube">YT</a><a href="#" aria-label="WhatsApp">WA</a></div>
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
      <div class="drawer-coupon" id="drawerCouponBox">
        <input id="drawerCoupon" placeholder="Coupon code (e.g. HEALTH10)"
          onkeydown="if(event.key==='Enter') applyDrawerCoupon()" />
        <button onclick="applyDrawerCoupon()">Apply</button>
      </div>
      <div class="sumline"><span>Subtotal</span><span id="dSub">৳0</span></div>
      <div class="sumline" id="dDiscRow" style="display:none; color:var(--leaf-d)">
        <span>Discount (<span id="dCoupName"></span>) <button class="coup-x" onclick="removeDrawerCoupon()" aria-label="Remove coupon">×</button></span>
        <span id="dDisc">-৳0</span>
      </div>
      <div class="sumline"><span>Delivery</span><span id="dDel">৳60</span></div>
      <div class="sumline total"><span>Total</span><span id="dTotal">৳0</span></div>
      <button class="checkout" onclick="location.href='checkout.html'">Proceed to Checkout</button>
      <div class="pay-note">bKash · Nagad · Cash on Delivery</div>
    </div>
  </aside>
  <div class="toast" id="toast"></div>`;
}

function buildMenu(){
  return `
  <div class="overlay" id="menuOverlay" onclick="closeMenu()"></div>
  <aside class="menu-drawer" id="menuDrawer" aria-label="Main menu">
    <div class="menu-head">
      <a class="logo" href="index.html"><span class="mark"></span>${brandWordmark()}</a>
      <button onclick="closeMenu()" aria-label="Close">×</button>
    </div>
    <nav class="menu-nav">
      <a href="index.html">Home</a>
      <a href="category.html?goal=all">All Products</a>
      <a class="menu-flash" href="category.html?goal=all">Flash Sale</a>
      <div class="menu-label">Shop by Category</div>
      ${CATEGORIES.map(c=>`
        <details class="menu-cat">
          <summary>${c.label}</summary>
          <div class="menu-cat-subs">
            <a href="category.html?goal=${c.id}"><b>View all ${c.label}</b></a>
            ${c.subs.map(s=>`<a href="category.html?goal=${s.id}">${s.label}</a>`).join('')}
          </div>
        </details>`).join('')}
      <div class="menu-label">Help</div>
      <a href="account.html">My Account</a>
      <a href="track.html">Track Order</a>
      <a href="page.html?p=delivery">Delivery Info</a>
      <a href="page.html?p=about">About Us</a>
      <a href="page.html?p=contact">Contact</a>
    </nav>
    <div class="menu-foot">
      <a class="btn btn-green" href="tel:${CONFIG.hotline}">Call ${CONFIG.hotline}</a>
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
  const off = Math.round((1 - p.price/p.oldPrice) * 100);
  const oos = !inStock(p);
  const img = imgHTML(p, p.name);
  document.getElementById('qvBody').innerHTML = `
    <div class="qv-media">${off>0?`<span class="disc">${off}% OFF</span>`:''}${img}</div>
    <div class="qv-detail">
      <span class="pd-goal">${goalLabel(p.goal)}${p.brand?' · '+p.brand:''}</span>
      <h2>${p.name}</h2>
      <div class="pd-rating"><span class="stars">${stars(p.rating)}</span> <b>${p.rating}</b> · ${p.reviews} reviews</div>
      <div class="pd-price">
        <span class="price">${money(p.price)}</span>
        ${p.oldPrice>p.price?`<span class="old">${money(p.oldPrice)}</span>`:''}
      </div>
      <p class="qv-desc">${p.desc||''}</p>
      <div class="pd-buy">
        <div class="qtybox">
          <button onclick="qvSetQty(-1)">−</button><span id="qvQty">1</span><button onclick="qvSetQty(1)">＋</button>
        </div>
        <button class="btn btn-green" ${oos?'disabled style="opacity:.45;cursor:not-allowed"':''} onclick="${oos?'':`addToCart(${p.id}, qvQty); closeQuickView();`}">${oos?'Out of stock':'Add to Cart'}</button>
      </div>
      <a class="qv-full-link" href="product.html?id=${p.id}">View full details →</a>
    </div>`;
  document.getElementById('qvModal')?.classList.add('open');
  document.getElementById('qvOverlay')?.classList.add('open');
}
function closeQuickView(){
  document.getElementById('qvModal')?.classList.remove('open');
  document.getElementById('qvOverlay')?.classList.remove('open');
}
function qvSetQty(d){
  qvQty = Math.max(1, qvQty + d);
  const el = document.getElementById('qvQty'); if(el) el.textContent = qvQty;
}

/* =========================================================================
   CUSTOMER ACCOUNT (Firebase Auth) — header "Account" label reflects
   logged-in state. Full login/signup/profile/order-history UI lives in
   account.html; ei function-gula shared header-e run kore SOB page e.
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
    const img = imgHTML(p);
    return `<div class="cart-item">
      <a class="ci-img" href="product.html?id=${p.id}">${img}</a>
      <div class="ci-info">
        <a href="product.html?id=${p.id}" class="nm" style="display:block">${p.name}</a>
        <div class="pr">${money(p.price)}</div>
        <button class="wish-add" onclick="moveToCart(${p.id})">Add to cart</button>
      </div>
      <button class="ci-remove" onclick="removeWish(${p.id})" aria-label="Remove">×</button>
    </div>`;
  }).join('');
}
function openWish(){ updateWishUI(); document.getElementById('wishDrawer')?.classList.add('open'); document.getElementById('wishOverlay')?.classList.add('open'); }
function closeWish(){ document.getElementById('wishDrawer')?.classList.remove('open'); document.getElementById('wishOverlay')?.classList.remove('open'); }

function applyDrawerCoupon(){
  const inp = document.getElementById('drawerCoupon');
  const code = (inp?.value||'').trim().toUpperCase();
  if(!code) return;
  if(CONFIG.coupons[code]){
    setCoupon(code);
    toast(`Coupon ${code} applied · ${CONFIG.coupons[code]}% off ✓`);
  } else {
    setCoupon('');
    toast("Invalid coupon code");
  }
  updateCartUI();
}
function removeDrawerCoupon(){ setCoupon(''); const i=document.getElementById('drawerCoupon'); if(i) i.value=''; updateCartUI(); toast("Coupon removed"); }

function updateCartUI(){
  const {count, sub, coupon, discount, delivery, total} = cartTotals();
  const badge = document.getElementById('cartBadge'); if(badge) badge.textContent = count;
  const cc = document.getElementById('cartCount'); if(cc) cc.textContent = count;
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  if(!body) return;
  if(count===0){
    body.innerHTML = `<div class="cart-empty">Your cart is empty.<br><small>Add products to get started.</small></div>`;
    if(foot) foot.style.display = "none"; return;
  }
  if(foot) foot.style.display = "block";
  body.innerHTML = Object.keys(cart).map(id=>{
    const p=findP(id); if(!p) return ""; const q=cart[id];
    const img = imgHTML(p);
    return `<div class="cart-item">
      <div class="ci-img">${img}</div>
      <div class="ci-info">
        <div class="nm">${p.name}</div>
        <div class="pr">${money(p.price)}</div>
        <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${q}</span><button onclick="changeQty(${p.id},1)">＋</button></div>
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
      set('dCoupName', coupon);
      set('dDisc', "-"+money(discount));
      const ci = document.getElementById('drawerCoupon'); if(ci && !ci.value) ci.value = coupon;
    } else dr.style.display = 'none';
  }
}

function openCart(){ document.getElementById('drawer')?.classList.add('open'); document.getElementById('overlay')?.classList.add('open'); }
function closeCart(){ document.getElementById('drawer')?.classList.remove('open'); document.getElementById('overlay')?.classList.remove('open'); }
function goSearch(q){ location.href = "category.html?q=" + encodeURIComponent(q||""); }

/* live search dropdown — product cards with price + discount badge */
function liveSearch(q){
  const box = document.getElementById('searchResults');
  if(!box) return;
  q = (q||'').toLowerCase().trim();
  if(q.length < 1){ closeSearch(); return; }
  const matches = PRODUCTS.filter(p =>
    (p.name||'').toLowerCase().includes(q) ||
    goalLabel(p.goal).toLowerCase().includes(q) ||
    (p.brand||'').toLowerCase().includes(q)
  ).slice(0, 6);
  if(!matches.length){
    box.innerHTML = `<div class="sr-empty">No products found for “${q}”</div>`;
    box.classList.add('open'); return;
  }
  box.innerHTML = matches.map(p=>{
    const off = p.oldPrice>p.price ? Math.round((1 - p.price/p.oldPrice)*100) : 0;
    return `<a class="sr-row" href="product.html?id=${p.id}">
      <span class="sr-img">${imgHTML(p)}</span>
      <span class="sr-info">
        <span class="sr-name">${p.name}</span>
        <span class="sr-meta">
          <span class="sr-price">${money(p.price)}</span>
          ${p.oldPrice>p.price?`<span class="sr-old">${money(p.oldPrice)}</span>`:''}
          ${off>0?`<span class="sr-off">${off}% OFF</span>`:''}
        </span>
      </span>
    </a>`;
  }).join('') + `<a class="sr-all" href="category.html?q=${encodeURIComponent(q)}">See all results for “${q}” →</a>`;
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
      <div class="rv-stars">${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)}</div>
      <p class="rv-text">“${r.text}”</p>
      <div class="rv-who">
        <span class="rv-avatar">${r.name.trim().charAt(0)}</span>
        <span><b>${r.name}</b><small>${r.area} · ${r.product}</small></span>
        <span class="rv-verified">✔ Verified</span>
      </div>
    </div>`).join('');
  if(dots){
    dots.innerHTML = REVIEWS.map((_,i)=>`<button data-rv="${i}" ${i===0?'class="on"':''} onclick="rvGo(${i},true)" aria-label="Review ${i+1}"></button>`).join('');
  }
  rvIdx = 0;
  clearInterval(rvTimer);
  rvTimer = setInterval(()=> rvGo(rvIdx+1, false), 4500);
  /* manual scroll korle dot sync */
  track.addEventListener('scroll', ()=>{
    const card = track.querySelector('.rv-card'); if(!card) return;
    const i = Math.round(track.scrollLeft / (card.offsetWidth + 14));
    if(i !== rvIdx){ rvIdx = Math.min(i, REVIEWS.length-1); rvDots(); }
  }, {passive:true});
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
function toast(msg){
  const t = document.getElementById('toast'); if(!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(()=> t.classList.remove('show'), 1800);
}

/* =========================================================================
   WhatsApp floating button — customer chate proshno korte pare
   ========================================================================= */
function waLink(text){
  const num = (CONFIG.whatsapp||'').replace(/[^0-9]/g,'');
  return `https://wa.me/${num}?text=${encodeURIComponent(text||'')}`;
}
function buildWhatsApp(){
  if(!CONFIG.whatsapp || CONFIG.whatsapp.includes('X')) return ''; /* placeholder thakle dekhabo na */
  return `<a class="wa-float" href="${waLink('Hi! I have a question about a product.')}" target="_blank" rel="noopener" aria-label="WhatsApp chat">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38c1.45.79 3.08 1.21 4.76 1.21 5.46 0 9.9-4.44 9.9-9.9S17.5 2 12.04 2m0 18.06c-1.5 0-2.97-.4-4.25-1.16l-.3-.18-3.13.82.84-3.05-.2-.31a8.2 8.2 0 0 1-1.26-4.35c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.24 8.24m4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43-.14-.01-.31-.01-.48-.01a.9.9 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29"/></svg>
  </a>`;
}

/* =========================================================================
   Analytics — CONFIG e ID boshale nije theke load hoy (khali thakle kichu na)
   ========================================================================= */
function injectAnalytics(){
  if(CONFIG.gaId && !CONFIG.gaId.includes('X')){
    const s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.gaId;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag; gtag('js', new Date()); gtag('config', CONFIG.gaId);
  }
  if(CONFIG.fbPixel && !CONFIG.fbPixel.includes('X')){
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
   INIT — inject chrome, then page-specific init() runs (if defined)
   ========================================================================= */
document.addEventListener('DOMContentLoaded', ()=>{
  const h = document.getElementById('site-header'); if(h) h.innerHTML = buildHeader();
  const f = document.getElementById('site-footer'); if(f) f.innerHTML = buildFooter();
  document.body.insertAdjacentHTML('beforeend', buildDrawer());
  document.body.insertAdjacentHTML('beforeend', buildMenu());
  document.body.insertAdjacentHTML('beforeend', buildWishDrawer());
  document.body.insertAdjacentHTML('beforeend', buildQuickView());
  document.body.insertAdjacentHTML('beforeend', buildWhatsApp());
  injectAnalytics();
  initAccountState();
  updateCartUI();
  updateWishUI();
  bootProducts(()=>{ if(typeof initPage === 'function') initPage(); });
});