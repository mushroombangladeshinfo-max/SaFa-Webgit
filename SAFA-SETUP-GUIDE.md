# SaFa Naturals — Backend Setup Guide
## Phase 5: Supabase, WhatsApp, & Go-Live Checklist

---

## PART 1 — SUPABASE: CREATE THE ORDERS TABLE

### Step 1 — Open the SQL Editor

1. Go to [supabase.com](https://supabase.com) → sign in
2. Click your project **uiwmerejtrdrykqpumdu**
3. Left sidebar → **SQL Editor**
4. Click **New query**

### Step 2 — Run this SQL

Copy and paste the entire block below, then click **Run** (▶):

```sql
-- ============================================================
-- SaFa Naturals — Orders Table
-- Run this once in Supabase SQL Editor
-- ============================================================

-- Create the orders table
CREATE TABLE IF NOT EXISTS public.orders (

  -- Primary key — auto-generated UUID
  id                uuid          DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Link to the authenticated user (if logged in)
  user_id           uuid          REFERENCES auth.users(id),

  -- Human-readable order ID (e.g. SAFA-1904-7823)
  -- UNIQUE prevents duplicate order numbers
  order_number      text          NOT NULL UNIQUE,

  -- Customer details
  customer_name     text          NOT NULL,
  customer_phone    text          NOT NULL,

  -- Delivery address (split for filtering/reporting)
  district          text          NOT NULL,
  thana             text          NOT NULL,
  full_address      text          NOT NULL,
  special_notes     text,                    -- nullable — customer may leave blank

  -- Cart snapshot stored as JSONB
  -- Array of: { id, name, price, qty, unit, subtotal }
  -- Stored at order time so price changes don't affect history
  items             jsonb         NOT NULL DEFAULT '[]'::jsonb,

  -- Financials in BDT — stored as integers (no decimal ambiguity)
  subtotal          integer       NOT NULL DEFAULT 0,
  delivery_fee      integer       NOT NULL DEFAULT 0,
  total_amount      integer       NOT NULL DEFAULT 0,

  -- Payment & fulfilment status
  payment_method    text          NOT NULL DEFAULT 'cod',
  payment_status    text          NOT NULL DEFAULT 'unpaid',
  status            text          NOT NULL DEFAULT 'pending',

  -- Timestamp — set automatically by Supabase
  created_at        timestamptz   NOT NULL DEFAULT now()
);

-- ── Indexes for common queries ──
-- Filter by status (pending / confirmed / dispatched / delivered)
CREATE INDEX IF NOT EXISTS idx_orders_status
  ON public.orders (status);

-- Filter by phone (look up a customer's orders)
CREATE INDEX IF NOT EXISTS idx_orders_phone
  ON public.orders (customer_phone);

-- Filter by district (regional reporting)
CREATE INDEX IF NOT EXISTS idx_orders_district
  ON public.orders (district);

-- Sort by newest first (default dashboard view)
CREATE INDEX IF NOT EXISTS idx_orders_created_at
  ON public.orders (created_at DESC);

-- Filter by payment status
CREATE INDEX IF NOT EXISTS idx_orders_payment_status
  ON public.orders (payment_status);

-- ── Add a comment so future you knows what this table is ──
COMMENT ON TABLE public.orders IS
  'SaFa Naturals customer orders. Inserted by checkout.html via anon key. Read only via dashboard.';
```

**You should see:** `Success. No rows returned.`

---

## PART 2 — ROW LEVEL SECURITY (RLS)

RLS controls who can read/write your data.
**Goal:** Website can INSERT orders. Nobody can SELECT without logging in.

### Step 3 — Enable RLS and set policies

In the same SQL Editor, run this second block:

```sql
-- ============================================================
-- SaFa Naturals — RLS Policies
-- Run after creating the orders table
-- ============================================================

-- 1. Enable RLS on the orders table
--    Without this, ALL data is publicly accessible — dangerous.
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;


-- 2. ALLOW: anonymous users can INSERT new orders
--    This is what checkout.html does when a customer places an order.
--    The anon key in checkout.html has INSERT permission only.
CREATE POLICY "anon_can_insert_orders"
  ON public.orders
  FOR INSERT
  TO anon                        -- the anon role (used by your website)
  WITH CHECK (true);             -- no extra conditions — any insert is fine


-- 3. DENY: nobody can SELECT (read) orders via the API
--    Your dashboard reads orders directly via Supabase UI (bypasses RLS).
--    This prevents anyone with your anon key from dumping order data.
--    If you later build an admin panel, create a separate authenticated policy.
CREATE POLICY "deny_anon_select"
  ON public.orders
  FOR SELECT
  TO anon
  USING (false);                 -- always false = always denied


-- 4. ALLOW: Authenticated users can view their own orders
CREATE POLICY "auth_can_select_own_orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);


-- 5. ALLOW: Authenticated users can update their own orders (e.g. to cancel)
CREATE POLICY "auth_can_update_own_orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);


-- 6. DENY: anon users cannot UPDATE or DELETE
CREATE POLICY "deny_anon_update"
  ON public.orders
  FOR UPDATE
  TO anon
  USING (false);

CREATE POLICY "deny_anon_delete"
  ON public.orders
  FOR DELETE
  TO anon
  USING (false);


-- 7. ALLOW: Admin can do everything (Replace with your actual email)
CREATE POLICY "admin_all_orders"
  ON public.orders
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'your_actual_email@example.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'your_actual_email@example.com');
```

**You should see:** `Success. No rows returned.`

### Verify RLS is working

```sql
-- This should return 0 rows (RLS blocks it)
SELECT * FROM public.orders LIMIT 1;
```

If it returns data, RLS is active but you're logged in as a superuser
which bypasses RLS — that's correct and expected in the SQL editor.
The anon key used by your website will be blocked correctly.

---

## PART 3 — VERIFY THE TABLE

### Step 4 — Check the structure looks right

```sql
-- View column definitions
SELECT
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
  AND table_schema = 'public'
ORDER BY ordinal_position;
```

Expected output (12 rows):

| column_name    | data_type                | is_nullable |
|----------------|--------------------------|-------------|
| id             | uuid                     | NO          |
| order_number   | text                     | NO          |
| customer_name  | text                     | NO          |
| customer_phone | text                     | NO          |
| district       | text                     | NO          |
| thana          | text                     | NO          |
| full_address   | text                     | NO          |
| special_notes  | text                     | YES         |
| items          | jsonb                    | NO          |
| subtotal       | integer                  | NO          |
| delivery_fee   | integer                  | NO          |
| total_amount   | integer                  | NO          |
| payment_method | text                     | NO          |
| payment_status | text                     | NO          |
| status         | text                     | NO          |
| created_at     | timestamp with time zone | NO          |

---

## PART 4 — VIEWING ORDERS IN THE DASHBOARD

### How to see incoming orders

1. Left sidebar → **Table Editor**
2. Click **orders** in the table list
3. Your orders appear as rows — newest at the bottom by default
4. Click the **Sort** button → sort by `created_at` → **Descending**
   to see newest orders at the top

### How to update an order status

1. Click any row to open it
2. Click the **status** cell
3. Change from `pending` to:
   - `confirmed` — you've called the customer
   - `dispatched` — order is on its way
   - `delivered` — order received
4. Press **Save**

### How to filter by status

1. Click **Filter** → Add filter
2. Column: `status` | Operator: `=` | Value: `pending`
3. You'll see only orders awaiting action

### How to search by phone

1. Filter → Column: `customer_phone` | contains | `0171`
2. All orders from that number appear

---

## PART 5 — EMAIL ALERTS FOR NEW ORDERS (Optional, Free)

Get an email whenever a new order comes in, without any code.

### Step 5 — Set up a Supabase Webhook → Email

1. Left sidebar → **Database** → **Webhooks**
2. Click **Create a new webhook**
3. Fill in:
   - **Name:** `new-order-email`
   - **Table:** `orders`
   - **Events:** ✅ INSERT only
   - **Type:** HTTP Request
   - **URL:** Use a free service like [Make.com](https://make.com) or
     [Zapier](https://zapier.com) to receive the webhook and
     forward it to your email
4. Click **Create webhook**

**Simpler alternative — just check your dashboard:**
Set a bookmark to your Supabase Table Editor orders view.
Check it when you get the CallMeBot WhatsApp ping.

---

## PART 6 — CALLMEBOT WHATSAPP SETUP

This takes 30 seconds. After this, you get an automatic WhatsApp
message every time an order is placed.

### Step 6 — Get your CallMeBot API key

**On your phone (the number +8801970099378):**

1. Open WhatsApp
2. Add the number **+34 644 59 97 23** to your contacts
   (name it "CallMeBot" so you recognise it)
3. Send this **exact message** to that number:

   ```
   I allow callmebot to send me messages
   ```

4. Within 60 seconds, CallMeBot replies with your API key.
   It looks like: `Your APIKEY is 1234567`
5. Copy that number.

### Step 7 — Add the key to checkout.html

Open `checkout.html` and find this line (around line 1543):

```javascript
const CALLMEBOT_API_KEY = ''; /* e.g. '1234567' */
```

Replace with your key:

```javascript
const CALLMEBOT_API_KEY = '1234567'; /* your actual key */
```

Save and upload `checkout.html`.

**Test it:** Place a test order on your site.
You should receive a WhatsApp message within 5–15 seconds.

---

## PART 7 — FINAL GO-LIVE CHECKLIST

Work through this list top to bottom before sharing your site link.

### Files to upload to htdocs

Upload these 3 files to your InfinityFree `htdocs` folder:

- [ ] `checkout.html` (Phase 1–4 version from this session)
- [ ] `script.js` (updated renderItems with image support)
- [ ] `style.css` (Phase 1–5 cleaned version)

### Supabase checks

- [ ] Orders table created (Part 1 SQL ran successfully)
- [ ] RLS policies applied (Part 2 SQL ran successfully)
- [ ] Test order appears in Table Editor after a test purchase
- [ ] Status column shows `pending` for new orders

### WhatsApp checks

- [ ] CallMeBot API key added to `checkout.html`
- [ ] Test order triggers WhatsApp message to your phone
- [ ] Message contains: order ID, customer name, address, items, total

### Frontend checks — open your site and test these

- [ ] Cart adds items correctly from the product page
- [ ] Checkout page shows cart items (not just skeleton)
- [ ] Form progress bar fills as you type in each field
- [ ] Phone field: typing `01711234567` shows `01711-234-567`
- [ ] Phone validation: entering `012345` shows error
- [ ] Address counter: shows `0 / 300` and counts up
- [ ] Submitting with empty fields shows red inline errors
- [ ] Submitting a valid order shows animated green checkmark
- [ ] Confirmation shows itemised list with correct totals
- [ ] "Chat About Your Order" button opens WhatsApp with pre-filled message
- [ ] Cart dot disappears from nav after order
- [ ] "Continue Shopping" returns to index.html

### Mobile checks

- [ ] All the above on a real phone (not just browser resize)
- [ ] Right column (summary) stacks below form correctly
- [ ] WhatsApp button opens WhatsApp app (not browser)
- [ ] Progress bar and validation all work on touch

### Edge case checks

- [ ] Empty cart → checkout shows "No items" + link back to shop
- [ ] Submit with empty cart → banner: "cart appears to be empty"
- [ ] Supabase down → error banner shown, button re-enables

---

## PART 8 — ORDER STATUS WORKFLOW

Here is the recommended daily workflow once live:

```
Customer places order
        ↓
You receive WhatsApp ping from CallMeBot
        ↓
Open Supabase Table Editor → find the order
        ↓
Call customer to confirm → update status: pending → confirmed
        ↓
Package and dispatch → update status: confirmed → dispatched
        ↓
Customer receives order → update status: dispatched → delivered
```

**Status reference:**

| Status      | Meaning                                    |
|-------------|---------------------------------------------|
| `pending`   | Just placed — needs your attention          |
| `confirmed` | You've spoken to the customer               |
| `dispatched`| Order is on its way                         |
| `delivered` | Customer received it                        |
| `cancelled` | Customer cancelled or you couldn't deliver  |

---

## QUICK REFERENCE — KEY VALUES

| Item                  | Value                                                    |
|-----------------------|----------------------------------------------------------|
| Supabase Project URL  | `https://uiwmerejtrdrykqpumdu.supabase.co`               |
| Supabase Anon Key     | In `checkout.html` — `const SUPABASE_ANON`               |
| Seller WhatsApp       | `+880 19 7009 9378`                                      |
| CallMeBot number      | `+34 644 59 97 23`                                       |
| Free shipping above   | ৳500 (change `FREE_SHIPPING_THRESHOLD` in `script.js`)   |
| Delivery fee          | ৳60 (change `DELIVERY_FEE` in `script.js`)               |
| Orders table          | `public.orders` in Supabase                              |
| Order ID format       | `SAFA-DDMM-XXXX` e.g. `SAFA-1904-7823`                  |

---

*SaFa Naturals Backend Setup — Generated during development session.*
*All 5 checkout phases complete.*

---

## PART 9 — INVENTORY TRACKING (Optional)

This adds inventory tracking to your products. When an order is placed, the stock for each item will be automatically decremented.

### Step 8 — Create the `products` table

Run this SQL in the Supabase SQL Editor to create a `products` table and populate it with your current items.

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id              text          PRIMARY KEY,
  name            text          NOT NULL,
  price           integer       NOT NULL,
  inventory_count integer       DEFAULT 0,
  -- Add other fields like image_url, description if you want to manage them from the DB
  image_url       text,
  description     text,
  unit            text
);

-- Enable RLS for products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read products
CREATE POLICY "public_can_read_products"
  ON public.products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only allow admin to update products (e.g., inventory)
CREATE POLICY "admin_can_update_products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'your_actual_email@example.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'your_actual_email@example.com');

-- Populate with initial data from index.html
-- ⚙️ Set your initial inventory_count values here!
INSERT INTO public.products (id, name, price, inventory_count, image_url, description, unit)
VALUES
  ('fresh_oyster', 'Fresh Oyster Mushrooms', 350, 100, 'SaFa Fresh Oyster Mushroom.png', 'Experience the rich, meaty texture...', '1kg'),
  ('dried_oyster', 'Dried Oyster Mushroom', 280, 100, 'SaFa Dried Oyster Mushroom.png', 'Sun-dried to lock in nutrients...', '100g'),
  ('mushroom_powder', 'Oyster Mushroom Powder', 350, 100, 'SaFa Oyster Mushroom Powder.png', 'Super-fine, nutrient-dense powder...', '100g')
ON CONFLICT (id) DO NOTHING;
```

### Step 9 — Create inventory decrement function and trigger

This function will run automatically every time a new order is inserted.

```sql
-- Function to decrement inventory
CREATE OR REPLACE FUNCTION public.decrement_inventory()
RETURNS TRIGGER AS $$
BEGIN
  -- Loop through each item in the new order
  FOR item IN SELECT * FROM jsonb_to_recordset(NEW.items) AS x(id text, qty int)
  LOOP
    -- Decrement the inventory for the corresponding product
    UPDATE public.products
    SET inventory_count = inventory_count - item.qty
    WHERE id = item.id AND inventory_count IS NOT NULL; -- Only decrement if tracking is enabled
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function after a new order is inserted
DROP TRIGGER IF EXISTS on_order_placed ON public.orders;
CREATE TRIGGER on_order_placed
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.decrement_inventory();
```
