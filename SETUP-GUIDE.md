# My Health — সেটআপ গাইড (বাংলা)

## ০) ⚠️ সবার আগে: নতুন Firebase Rules Publish করুন (v2 আপডেটের পর বাধ্যতামূলক)

নতুন ফিচারগুলো (Store Settings, Categories, Coupons, Newsletter, AI Assistant, Messages, Blog, Notifications, Back-in-stock alert, Live purchase popup) Firebase-এ নতুন
জায়গায় ডেটা রাখে। নতুন rules Publish না করা পর্যন্ত:

- Admin panel-এ ওই ট্যাবগুলোতে হলুদ সতর্কবার্তা দেখাবে এবং Save হবে না
- হোমপেজের Newsletter "Could not subscribe" দেখাবে
- বাকি সাইট (প্রোডাক্ট, অর্ডার, ট্র্যাকিং) আগের মতোই কাজ করবে — কিছু ভাঙবে না

নিচের **১) নম্বর ধাপ** অনুযায়ী `firebase-rules.json`-এর পুরোটা কপি করে Publish করুন।

---

## ১) Firebase Security Rules বসানোর নিয়ম

এই ফোল্ডারে **firebase-rules.json** ফাইলটা আছে। বসাতে হবে এভাবে:

1. ব্রাউজারে যাও: https://console.firebase.google.com
2. **myhealth-6a311** প্রজেক্টে ঢোকো
3. বাম পাশের মেনু থেকে **Build → Realtime Database** এ যাও
4. উপরের **Rules** ট্যাবে ক্লিক করো
5. ওখানে যা লেখা আছে সব মুছে দাও
6. `firebase-rules.json` ফাইলটা Notepad-এ খুলে **পুরোটা কপি** করে ওখানে **পেস্ট** করো
7. উপরের **Publish** বাটনে ক্লিক করো — ব্যস!

### এই rules কী করে?

| ডেটা | কে পড়তে পারবে | কে লিখতে পারবে |
|------|----------------|-----------------|
| `products`, `banners`, `heroImage`, `categoryImages` | সবাই | শুধু admin |
| `settings` (দোকানের নাম, ফোন, ডেলিভারি চার্জ, bKash…) | সবাই | শুধু admin — Settings → Store Settings |
| `categories` | সবাই | শুধু admin — Categories ট্যাব |
| `coupons` | কাস্টমার **শুধু নির্দিষ্ট কোড** চেক করতে পারে (পুরো তালিকা দেখতে পারে না) | শুধু admin — Coupons ট্যাব |
| `subscribers` (newsletter ইমেইল) | শুধু admin | কাস্টমার শুধু নতুন ইমেইল যোগ করতে পারে |
| `aiConfig` (AI assistant সেটিং) | সবাই | শুধু admin — AI Assistant ট্যাব |
| `aiLogs` (কাস্টমার AI-কে কী জিজ্ঞেস করলো — নাম/ফোন ছাড়া) | শুধু admin | কাস্টমার শুধু নতুন প্রশ্ন যোগ করতে পারে |
| `messages` (Contact ফর্ম) | শুধু admin | কাস্টমার শুধু নতুন মেসেজ পাঠাতে পারে (ফোন ভ্যালিডেশন সহ) |
| `posts` (Blog), `notices` (🔔 bell) | সবাই | শুধু admin |
| `orders` | শুধু admin (তালিকা) · Order ID জানলে সেই একটা অর্ডার | কাস্টমার **নতুন** অর্ডার (status=pending) দিতে পারে — কিন্তু নিজে "PAID" বা ট্র্যাকিং কোড বসাতে পারে না |
| `reviews` | সবাই | কাস্টমার নতুন রিভিউ (নাম≤৬০, লেখা≤২০০০, rating ১–৫); মুছতে পারে শুধু admin |
| `couriers`, `pickups`, `adminConfig` | শুধু admin | শুধু admin |

অর্ডারের প্রতিটা ঘর যাচাই হয় (ফোন 01 দিয়ে ১১ ডিজিট, Order ID ফরম্যাট, item-এর qty/price সংখ্যা)
— ভুয়া বা ক্ষতিকর ডেটা ঢোকানো যায় না।

> **Track Order:** নতুন Order ID এখন র‍্যান্ডম (যেমন `MH8K2PQ4ZT7A`) — কেউ আন্দাজ করে অন্যের
> অর্ডার দেখতে পারবে না। পুরনো অর্ডারগুলোর ID আগের মতোই কাজ করবে।

⚠️ **সাবধান:** admin panel-এ ঢুকতে mijanu443@gmail.com দিয়ে Firebase Authentication-এ login
থাকতে হবে (Console → Authentication → Sign-in method → Email/Password → Enable)।

> **সাইট অন্য কারো কাছে বিক্রি করলে:** `firebase-config.js`-এ তাদের নিজের Firebase প্রজেক্টের
> config ও `ADMIN_EMAIL` বসাবেন, আর `firebase-rules.json`-এ `mijanu443@gmail.com` সব জায়গায়
> তাদের admin ইমেইল দিয়ে replace করে Publish করবেন (Notepad → Ctrl+H)।

---

## ২) দোকানের তথ্য বসানো — এখন কোড এডিট লাগে না

**Admin panel → Settings → Store Settings** থেকে সব বসানো যায়, Save করলেই পুরো সাইটে আপডেট:

- দোকানের নাম, ট্যাগলাইন, ওয়েবসাইট URL (ডোমেইন)
- **Theme color** — ওয়েবসাইটের বাটন/দাম/মেনুর রং (ডিফল্ট Fresh green; এক ক্লিকে Orange, Blue ইত্যাদি)। লোগোর রং (কমলা) কখনো বদলায় না।
- হটলাইন, **WhatsApp** (880 দিয়ে — বসালেই WhatsApp বাটন ও "Order on WhatsApp" চালু হবে), ইমেইল, ঠিকানা, ট্রেড লাইসেন্স
- ডেলিভারি চার্জ (ঢাকার ভেতরে/বাইরে) ও কত টাকার উপরে ফ্রি ডেলিভারি
- **bKash / Nagad নম্বর** — বসালে checkout-এ কাস্টমার নম্বর দেখবে এবং Transaction ID দিতে হবে।
  অর্ডারে TrxID দেখে মিলিয়ে admin → Order → **"Payment verified — mark paid"** চাপবেন।
- উপরের অ্যানাউন্সমেন্ট বার (যেমন "🎉 Eid sale — 20% off")
- Facebook / Instagram / YouTube / TikTok লিংক (ফুটারে আইকন দেখাবে)
- **Facebook Pixel ID** ও **Google Analytics ID** — বসালেই ViewContent, AddToCart, Checkout, Purchase ট্র্যাক হবে (FB অ্যাডের জন্য জরুরি)
- **USD rate** — যেমন 123 দিলে প্রতিটা দামের নিচে "($11.69)" দেখাবে (বিদেশি/ইমপোর্ট কাস্টমারদের জন্য)। 0 = বন্ধ।

> `app.js`-এর `CONFIG`-এ যা আছে সেগুলো এখন শুধু **ডিফল্ট** — Store Settings-এ কিছু Save করলে সেটাই চলবে।

---

## ৩) ডোমেইন কেনার পর

1. Admin → Settings → Store Settings → **Website URL**-এ আসল ডোমেইন বসিয়ে Save
2. Admin → Settings → Data → **Download sitemap.xml** → ফাইলটা হোস্টিংয়ের root-এ আপলোড করুন
3. **robots.txt** → শেষের `Sitemap:` লাইনে ডোমেইন বসান
4. **index.html** → `<head>`-এর দুটো JSON-LD ব্লকে (`"url"`, `"logo"`, `"target"`) ডোমেইন বসান

Notepad-এ **Ctrl+H** দিয়ে `https://YOUR-DOMAIN.com` খুঁজে replace করলেই হবে।
`404.html` ফাইলটা root-এ রাখলে ভুল লিংকে সুন্দর "Page not found" পেজ দেখাবে (Netlify / Firebase Hosting / cPanel সব জায়গায় কাজ করে)।

---

## ৪) Admin panel — কী কী করা যায়

| ট্যাব | কাজ |
|------|-----|
| **Dashboard** | আজকের / এই মাসের বিক্রি, ১৪ দিনের সেলস চার্ট, টপ প্রোডাক্ট, pending অর্ডার, স্টক-আউট |
| **Orders** | খোঁজা (ID/নাম/ফোন/TrxID), স্ট্যাটাস (pending → confirmed → shipped → delivered / cancelled / returned), **Invoice প্রিন্ট**, পেমেন্ট verify, internal note, কল/WhatsApp, CSV |
| **Products** | যোগ/এডিট/কপি/ডিলিট, একাধিক ক্যাটাগরি, স্টক, গ্যালারি ছবি, কীভাবে খাবেন (dosage) |
| **Categories** | ক্যাটাগরি ও সাব-ক্যাটাগরি যোগ/নাম বদল/ক্রম/ডিলিট — মেনু ও হোমপেজ নিজে আপডেট হয় |
| **Banners** | হিরো ছবি + **Hero slider** ব্যানার (উপরের বড় স্লাইডার, ছবি ~1600×500), **Promo row** (ক্যাটাগরির নিচে ৩টা ব্যানার — লেখার ব্যানারে নিজে থেকেই প্রোডাক্টের ছবি বসে), ক্যাটাগরির ছবি |
| **Coupons** | % বা টাকা ছাড়, মিনিমাম অর্ডার, মেয়াদ, চালু/বন্ধ, কতবার ব্যবহার হয়েছে |
| **Customers** | সব কাস্টমার (মোট খরচ, অর্ডার সংখ্যা, রিপিট কাস্টমার), newsletter subscribers, CSV |
| **Reviews** | সব রিভিউ এক জায়গায় — spam মুছে ফেলুন |
| **AI Assistant** | চালু/বন্ধ, Basic/AI মোড, মডেল, লেখা, quick বাটন, "সমস্যা → প্রোডাক্ট" রুল, কাস্টমাররা কী জিজ্ঞেস করছে |
| **Messages** | Contact পেজের ফর্ম থেকে আসা মেসেজ — unread গোনা, Call / WhatsApp / Email দিয়ে উত্তর, mark read |
| **Blog** | হেলথ টিপস / গাইড লিখুন (ছবি, Draft/Published) — `blog.html`-এ দেখায়, Google থেকে ফ্রি ভিজিটর আনে |
| **Banners → 🔔 Notifications** | ওয়েবসাইটের উপরের bell-এ অফার/নোটিশ (নতুন হলে লাল সংখ্যা) |
| **Products → Stock quantity** | সংখ্যা দিলে "Only 3 left" দেখায়, কার্টে এর বেশি নেওয়া যায় না; অর্ডার **confirmed** করলে নিজে কমে, **cancelled/returned** করলে ফিরে আসে |
| **Courier** | Steadfast-এ সরাসরি parcel, pickup — পাঠালে অর্ডার নিজে "Shipped" হয় ও কাস্টমার ট্র্যাকিং কোড দেখে |

🔔 উপরের **Alerts** বাটন চালু করলে নতুন অর্ডার আসলেই শব্দ + নোটিফিকেশন হবে (admin panel খোলা থাকলে)।

---

## ৫) পলিসি পেজের লেখা ঠিক করা (গুরুত্বপূর্ণ)

`app.js`-এর `PAGES` অবজেক্টে About/Privacy/Terms/Return ইত্যাদির খসড়া লেখা আছে।
এগুলো **সাধারণ টেমপ্লেট** — দোকানের আসল নিয়ম অনুযায়ী পড়ে ঠিক করে নেবেন।
ফোন/ইমেইল/ঠিকানা/ডেলিভারি চার্জ Store Settings থেকে নিজে বসে যায়।

---

## ৭) AI Health Assistant চালু করা

হোমপেজের বড় AI সেকশনে (আর অন্য পেজে ভাসমান **"Ask AI"** বাটনে) কাস্টমার নিজের সমস্যা লেখে —
বাংলা, Banglish বা English, চাইলে মাইকে বলেও — আর সাথে সাথে স্টকে থাকা মানানসই প্রোডাক্ট + ছোট টিপস পায়,
সরাসরি "Add to cart" সহ। বুকে ব্যথা, শ্বাসকষ্টের মতো জরুরি লক্ষণে প্রোডাক্ট না দেখিয়ে ডাক্তার/৯৯৯ দেখায়।

### দুটো মোড

| মোড | কী লাগে | কেমন |
|-----|---------|------|
| **Basic** (ডিফল্ট) | কিছুই না — এখনই চালু | বিল্ট-ইন কীওয়ার্ড (চুল পড়া, ঘুম, ব্রণ, ওজন… ২০+ সমস্যা) দিয়ে প্রোডাক্ট বাছে। ফ্রি। |
| **AI** (আসল Claude AI) | Anthropic API key + Cloudflare Worker (নিচে ধাপ) | যেকোনো ভাষায় যেকোনো ভাবে লেখা বোঝে, পাল্টা প্রশ্নের উত্তর দেয়, পুরো প্রোডাক্ট লিস্ট দেখে বাছে। |

AI মোডে কোনো কারণে সমস্যা হলে (নেট, লিমিট, key) সাইট **নিজে থেকেই Basic মোডে** উত্তর দেয় — কাস্টমার কখনো খালি হাতে ফেরে না।

### AI মোড চালুর ধাপ (একবারই করতে হয়, ~১৫ মিনিট)

**ক) Anthropic API key**
1. https://console.anthropic.com — অ্যাকাউন্ট খুলুন
2. **Billing** → ক্রেডিট যোগ করুন (শুরুতে $5–10 যথেষ্ট)
3. ⚠️ **Settings → Limits** → মাসিক **spend limit** সেট করুন (যেমন $10) — যাতে খরচ কখনো সীমা ছাড়ায় না
4. **API Keys → Create Key** → key-টা কপি করে রাখুন (আর কাউকে দেবেন না, ওয়েবসাইটের কোডেও বসাবেন না)

**খ) Cloudflare Worker** (আপনার courier Worker যে অ্যাকাউন্টে, সেখানেই)
1. https://dash.cloudflare.com → **Workers & Pages → Create → Create Worker** → নাম দিন `myhealth-ai` → **Deploy**
2. **Edit code** → যা আছে সব মুছে এই ফোল্ডারের **`ai-worker.js`**-এর পুরোটা পেস্ট করুন → **Deploy**
3. Worker → **Settings → Variables and Secrets → Add**:
   - `ANTHROPIC_API_KEY` — Type: **Secret** — Value: ক) ধাপের key
   - `FIREBASE_DB_URL` — Type: **Text** — Value: `https://myhealth-6a311-default-rtdb.asia-southeast1.firebasedatabase.app`
   - (ঐচ্ছিক, ডোমেইন কেনার পর) `ALLOWED_ORIGINS` — Type: **Text** — Value: `https://yourshop.com,https://www.yourshop.com` — তখন শুধু আপনার সাইট থেকেই AI ব্যবহার করা যাবে
   - **Deploy** চাপুন
4. Worker-এর URL কপি করুন (যেমন `https://myhealth-ai.yourname.workers.dev`)

**গ) Admin panel**
1. Admin → **AI Assistant** → *Cloudflare Worker URL*-এ পেস্ট → **Test connection** (✓ দেখাবে)
2. *Answer mode* → **AI**, *AI model* বেছে নিন → **Save AI settings**
3. নিচের **"Ask the AI"** দিয়ে একটা প্রশ্ন টেস্ট করুন — তারপর হোমপেজে গিয়ে দেখুন

### খরচ (আনুমানিক, প্রতি প্রশ্ন)

| মডেল | আনুমানিক খরচ | কখন |
|------|--------------|-----|
| Claude Opus 5.5 (ডিফল্ট) | ~৳২–১০ | সবচেয়ে ভালো উত্তর |
| Claude Sonnet 5.5 | ~৳১–৫ | ভালো উত্তর, প্রায় অর্ধেক খরচ, একটু দ্রুত |

> ⚠️ আগে Worker বসিয়ে থাকলে: নতুন [ai-worker.js](ai-worker.js) কোড Cloudflare-এ আবার পেস্ট করে **Deploy** দিন (নতুন মডেল Opus 5.5 / Sonnet 5.5)। পুরনো Opus 5 / Haiku বেছে রাখলেও Worker নিজে থেকে নতুন মডেল ব্যবহার করবে।

খরচ প্রোডাক্টের সংখ্যার উপর নির্ভর করে (পুরো লিস্ট AI-কে দেওয়া হয়; কাছাকাছি সময়ের প্রশ্নে cache-এর কারণে কম লাগে)।
অপব্যবহার ঠেকাতে Worker একজন ভিজিটরকে ১০ মিনিটে সর্বোচ্চ ১২টা প্রশ্ন করতে দেয়। আসল নিরাপত্তা হলো ক-৩ ধাপের **spend limit** — অবশ্যই সেট করুন।

### AI-কে নিজের মতো চালানো (admin → AI Assistant)

- **Extra instructions** — নতুন দোকান-কর্মচারীকে যেভাবে বুঝিয়ে দেন সেভাবে লিখুন (যেমন: "ঈদ অফার EID15 কোডের কথা বলবে", "দেশি ব্র্যান্ড আগে দেখাবে")
- **Problem → product rules** — "chul pore, hair fall, চুল পড়া" বললে আপনার পছন্দের ৩টা প্রোডাক্ট আগে দেখাবে (Basic ও AI দুই মোডেই)
- **What customers are asking** — কাস্টমাররা কী সমস্যার কথা বলছে (নাম/ফোন ছাড়া) — কোন প্রোডাক্ট বেশি আনা দরকার বোঝার জন্য দারুণ; CSV-ও নেওয়া যায়
- লেখা, quick বাটন, disclaimer, ভাসমান বাটন চালু/বন্ধ — সব এখান থেকেই

---

## ৮) sitemap.xml আপডেট করার নিয়ম

নতুন প্রোডাক্ট admin থেকে যোগ করলে সাইটে **সাথে সাথেই লাইভ হয়**। শুধু Google-কে জানানোর জন্য
মাসে একবার: Admin → Settings → Data → **Download sitemap.xml** → হোস্টিংয়ের root-এ replace।
প্রথমবার Google Search Console-এ (search.google.com/search-console) সাইট যোগ করে sitemap submit করুন।

---

## ৯) নতুন ইউনিক ফিচার — কোথায় কী, কীভাবে চালাবেন

| ফিচার | কাস্টমার কী দেখে | আপনি কোথা থেকে চালাবেন |
|------|------------------|--------------------------|
| **চলমান প্রোমো ব্যানার** | হোমপেজের ৩টা ব্যানার এখন ধীরে ধীরে ডান থেকে বামে চলে (মাউস রাখলে / আঙুল দিলে থামে) | Admin → **Banners** → placement **promo** দিয়ে ব্যানার যোগ করুন — যত খুশি |
| **টপ ব্যানার transition** | একাধিক hero ব্যানার থাকলে ৫.৫ সেকেন্ড পরপর fade হয়ে একটার পর একটা আসে; একটা থাকলে সেটাই বারবার fade-out → fade-in হয় | Admin → **Banners** → placement **hero** |
| **Free Health Tools** (`health-tools.html`) | BMI (এশিয়ান মান), দৈনিক পানি, প্রোটিন, ক্যালোরি ক্যালকুলেটর — রেজাল্টের নিচে মিলিয়ে প্রোডাক্ট সাজেশন | কিছু লাগে না — category-র প্রোডাক্ট থেকে নিজে নিজে বাছাই করে |
| **Frequently bought together** | প্রোডাক্ট পেজে "এর সাথে এগুলোও কেনে" — টিক দিয়ে এক ক্লিকে সব কার্টে | স্বয়ংক্রিয় (একই ক্যাটাগরির best seller / ভালো রেটিং) |
| **ডেলিভারি তারিখ** | প্রোডাক্ট পেজে জেলা বাছলে "Arrives Mon 5 Oct – Tue 6 Oct · Delivery ৳60/FREE" (শুক্রবার বাদ) | Settings-এর delivery charge থেকে হিসাব হয় |
| **Back-in-stock alert** | স্টক শেষ হলে "Notify me" — কাস্টমার মোবাইল নম্বর দেয় | Admin → **Products** ট্যাবের উপরে **Back-in-stock requests** — স্টক আনার পর নম্বরে ক্লিক করলে WhatsApp মেসেজ তৈরি থাকে → পাঠিয়ে **Clear** |
| **Live purchase popup** | "Someone in Sylhet ordered Whey Protein · 14 min ago" — শুধু **আসল অর্ডার** থেকে (গত ৭ দিন), নাম/ফোন কখনো দেখায় না | Admin → **Settings** → *Live purchase popup* On/Off |
| **ভয়েস সার্চ** | সার্চ বক্সে 🎤 — প্রোডাক্টের নাম বললেই খুঁজে দেয় (Chrome/Android) | কিছু লাগে না |

> ⚠️ Back-in-stock alert আর Live purchase popup কাজ করার জন্য **নতুন `firebase-rules.json` Publish করতেই হবে** (০ নম্বর ধাপ)।
> Publish না করলে বাকি সাইট ঠিকই চলবে, শুধু এই দুটো ফিচার চুপচাপ বন্ধ থাকবে।
