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
const TIMING  = { morning:"🌅 Morning", postworkout:"💪 Post-workout", night:"🌙 Before bed", anytime:"⏱️ Anytime" };
const param   = key => new URLSearchParams(location.search).get(key);

/* image load fail korle giant alt-text na dekhiye emoji dekhabe */
function imgFallback(el, emoji){
  const s = document.createElement('span');
  s.className = 'img-emoji';
  s.textContent = emoji || '💊';
  el.replaceWith(s);
}
function imgHTML(p, alt){
  return p.img
    ? `<img src="${p.img}" alt="${alt||''}" loading="lazy" onerror="imgFallback(this,'${p.emoji||''}')">`
    : (p.emoji || '💊');
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
  const img = imgHTML(p, p.name);
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
    const img = imgHTML(p);
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
    const img = imgHTML(p);
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