# Sisinene Hub — Setup Guide
## Read this fully before opening the website

---

## STEP 1 — Create Your Free Supabase Account

1. Go to **https://supabase.com** → click **Start for Free**
2. Sign up with your email (Google sign-in works too)
3. Click **New Project** and fill in:
   - **Name:** sisinene-hub
   - **Database Password:** create a strong password and save it
   - **Region:** Europe West (closest free region to Nigeria)
4. Wait ~2 minutes for your project to finish setting up

---

## STEP 2 — Create the Products Table

1. In the left sidebar, click **SQL Editor**
2. Click **New Query**, paste this SQL, then click **Run**:

```sql
CREATE TABLE products (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('foodstuffs', 'cloths')),
  price       NUMERIC(10,2) NOT NULL,
  description TEXT,
  image_url   TEXT,
  available   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT
  USING (available = true);

CREATE POLICY "Admins can do everything"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');
```

You should see **"Success. No rows returned."** ✅

---

## STEP 3 — Create the Image Storage Bucket

This is what lets you upload images from your computer.

1. In the left sidebar, click **Storage**
2. Click **New Bucket**
3. Set the name to exactly: **`product-images`**
4. Toggle **Public bucket** to ON (so images show on the website)
5. Click **Save**

Then set the storage policy so only you can upload but everyone can view:

1. Click on your new **product-images** bucket
2. Click **Policies** tab → **New Policy**
3. Choose **For full customization** and add these two policies:

**Policy 1 — Allow public image viewing:**
- Policy name: `Public read`
- Allowed operation: `SELECT`
- Target roles: leave blank (public)
- Policy definition: `true`

**Policy 2 — Allow admin uploads:**
- Policy name: `Admin upload`
- Allowed operations: `INSERT`, `UPDATE`, `DELETE`
- Target roles: `authenticated`
- Policy definition: `true`

---

## STEP 4 — Create Your Admin Account

1. In the left sidebar, click **Authentication**
2. Click **Users** → **Add User** → **Create New User**
3. Enter your email and a strong password
4. **Save these credentials** — you'll use them to log into Admin Panel

---

## STEP 5 — Get Your API Keys

1. Click **Project Settings** (gear icon, bottom of left sidebar)
2. Click **API**
3. Copy both:
   - **Project URL** → looks like `https://abcxyz.supabase.co`
   - **anon public** key → long string starting with `eyJ...`

---

## STEP 6 — Add Keys to the Website

Open **`js/config.js`** and replace the placeholders:

```js
const SUPABASE_URL      = 'https://abcxyz.supabase.co'; // ← your URL
const SUPABASE_ANON_KEY = 'eyJhbGciOi...';              // ← your anon key
const WHATSAPP_NUMBER   = '2348012345678';               // ← your number (no + or spaces)
```

Save the file.

---

## STEP 7 — Test It Locally

1. Open **`index.html`** in Chrome — you should see the store (empty products, that's fine)
2. Open **`admin/index.html`** — log in with your Step 4 credentials
3. Click **+ Add Product**, fill in details, click **Choose Image**, pick a photo from your computer
4. Watch it upload and show a preview, then click **Save Product**
5. Go back to `index.html` and refresh — your product with its image should appear! 🎉

---

## STEP 8 — Host It Online for Free (Netlify)

1. Go to **https://netlify.com** and create a free account
2. On your dashboard, drag and drop the entire **sisinene-hub** folder
3. Netlify gives you a live URL like `https://sisinene-hub.netlify.app`
4. Share that link with your customers!

Images will load fine on the hosted site because they're stored in Supabase, not on your computer.

---

## How the Image Upload Works

When you add/edit a product in the admin panel:
- Click **Choose Image** and pick any photo from your PC
- The image uploads directly to your Supabase **product-images** bucket
- Supabase returns a permanent public URL
- That URL is saved with the product in your database
- The image shows on the store automatically — even when hosted online

---

## Folder Structure

```
sisinene-hub/
├── index.html          ← Customer-facing store
├── admin/
│   └── index.html      ← Your admin panel (password protected)
├── css/
│   ├── style.css       ← Store styles
│   └── admin.css       ← Admin styles
├── js/
│   ├── config.js       ⭐ PUT YOUR SUPABASE KEYS HERE
│   ├── cart.js         ← Cart + WhatsApp checkout
│   ├── products.js     ← Loads products from Supabase
│   └── admin.js        ← CRUD + image upload logic
└── images/             ← (empty — images go to Supabase Storage)
```

---

## Admin Panel Quick Reference

| Task | How |
|---|---|
| Add product | Click **+ Add Product** |
| Upload image | Click **Choose Image** inside the form |
| Edit product | Click **Edit** on any table row |
| Change a product image | Click **Edit** → **Change Image** |
| Hide product from store | Edit → uncheck **Show in store** |
| Delete product | Click **Delete** (asks for confirmation) |

---

## How WhatsApp Checkout Works

When a customer clicks **"Order on WhatsApp"**:
- A message is built listing all items, quantities, and total cost in ₦
- WhatsApp opens with your number pre-filled and the message ready to send
- Customer hits **Send** — you receive the order and process it manually

---

*Sisinene Hub · Built with HTML, CSS, Vanilla JS + Supabase BaaS*
