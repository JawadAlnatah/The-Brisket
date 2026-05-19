-- ============================================================
-- THE BRISKET — Full Database Schema
-- Project: JawadAlnatah's Project (Supabase)
-- ============================================================

CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START 1;

-- ============================================================
-- TABLE: menu_items
-- ============================================================
CREATE TABLE public.menu_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  description  TEXT,
  price        NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  category     TEXT NOT NULL,
  image        TEXT,                           -- filename only e.g. smoked-brisket.png (stored in Supabase Storage: menu-images bucket)
  stock        INTEGER NOT NULL DEFAULT 0,     -- available quantity for stock check
  is_available BOOLEAN NOT NULL DEFAULT true,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: admins
-- ============================================================
CREATE TABLE public.admins (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username   TEXT NOT NULL UNIQUE,
  password   TEXT NOT NULL,                   -- store plain text for CIS311 scope (or bcrypt hash if desired)
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default admin account (username: admin, password: brisket123)
INSERT INTO public.admins (username, password, name)
VALUES ('admin', 'brisket123', 'The Brisket Admin');

-- ============================================================
-- TABLE: orders
-- ============================================================
CREATE TABLE public.orders (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number   TEXT UNIQUE,                         -- auto: #BRK-0001
  order_type     TEXT NOT NULL CHECK (order_type IN ('pickup', 'delivery')),
  customer_phone TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  subtotal       NUMERIC(10, 2) NOT NULL DEFAULT 0,
  delivery_fee   NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total          NUMERIC(10, 2) NOT NULL DEFAULT 0,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: order_items
-- ============================================================
CREATE TABLE public.order_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
  item_name    TEXT NOT NULL,           -- price snapshot
  item_price   NUMERIC(10, 2) NOT NULL, -- price snapshot
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  subtotal     NUMERIC(10, 2) NOT NULL, -- item_price * quantity
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_menu_items_category  ON public.menu_items(category);
CREATE INDEX idx_menu_items_available ON public.menu_items(is_available);
CREATE INDEX idx_orders_status        ON public.orders(status);
CREATE INDEX idx_orders_created_at    ON public.orders(created_at DESC);
CREATE INDEX idx_orders_phone         ON public.orders(customer_phone);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

-- ============================================================
-- FUNCTION: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- FUNCTION: auto-generate order number (#BRK-0001)
-- ============================================================
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := '#BRK-' || LPAD(nextval('public.order_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION public.generate_order_number();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.menu_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- menu_items policies
CREATE POLICY "Public can view available menu items"
  ON public.menu_items FOR SELECT TO anon
  USING (is_available = true);

CREATE POLICY "Admin has full access to menu items"
  ON public.menu_items FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- orders policies
CREATE POLICY "Anyone can place an order"
  ON public.orders FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Admin can view all orders"
  ON public.orders FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admin can update order status"
  ON public.orders FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- order_items policies
CREATE POLICY "Anyone can add order items"
  ON public.order_items FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Admin can view all order items"
  ON public.order_items FOR SELECT TO authenticated
  USING (true);

-- admins policies
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Allow anon to SELECT (needed so login page can check credentials via anon key)
CREATE POLICY "Allow login check"
  ON public.admins FOR SELECT TO anon
  USING (true);

CREATE POLICY "Admin full access to admins table"
  ON public.admins FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

