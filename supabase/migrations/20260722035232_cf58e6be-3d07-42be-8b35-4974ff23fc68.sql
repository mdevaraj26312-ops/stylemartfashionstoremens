
-- ============= PRODUCTS: extend =============
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS subcategory text,
  ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('men','women','unisex','kids','boys','girls')),
  ADD COLUMN IF NOT EXISTS discount_pct integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS additional_images text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS sizes text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS colors text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS material text,
  ADD COLUMN IF NOT EXISTS sku text,
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS availability text NOT NULL DEFAULT 'in_stock' CHECK (availability IN ('in_stock','out_of_stock','preorder','discontinued')),
  ADD COLUMN IF NOT EXISTS affiliate_network text,
  ADD COLUMN IF NOT EXISTS tracking_id text,
  ADD COLUMN IF NOT EXISTS click_count bigint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_bestseller boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','draft','archived')),
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text;

CREATE INDEX IF NOT EXISTS idx_products_status ON public.products (status);
CREATE INDEX IF NOT EXISTS idx_products_category_status ON public.products (category, status);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products (brand);
CREATE INDEX IF NOT EXISTS idx_products_gender ON public.products (gender);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products (price);
CREATE INDEX IF NOT EXISTS idx_products_discount ON public.products (discount_pct DESC);
CREATE INDEX IF NOT EXISTS idx_products_rating ON public.products (rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_click_count ON public.products (click_count DESC);
CREATE INDEX IF NOT EXISTS idx_products_flags ON public.products (is_trending, is_new_arrival, is_deal, is_featured, is_bestseller);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_tags ON public.products USING gin (tags);
CREATE INDEX IF NOT EXISTS idx_products_sizes ON public.products USING gin (sizes);
CREATE INDEX IF NOT EXISTS idx_products_colors ON public.products USING gin (colors);
CREATE UNIQUE INDEX IF NOT EXISTS ux_products_sku ON public.products (sku) WHERE sku IS NOT NULL;

-- ============= BRANDS =============
CREATE TABLE IF NOT EXISTS public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  logo_url text,
  description text NOT NULL DEFAULT '',
  website text,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.brands TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.brands TO authenticated;
GRANT ALL ON public.brands TO service_role;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Admins insert brands" ON public.brands FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update brands" ON public.brands FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete brands" ON public.brands FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER brands_updated_at BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============= SUBCATEGORIES =============
CREATE TABLE IF NOT EXISTS public.subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category public.product_category NOT NULL,
  slug text NOT NULL,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category, slug)
);
GRANT SELECT ON public.subcategories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.subcategories TO authenticated;
GRANT ALL ON public.subcategories TO service_role;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view subcategories" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Admins insert subcategories" ON public.subcategories FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update subcategories" ON public.subcategories FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete subcategories" ON public.subcategories FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ============= AFFILIATE NETWORKS =============
CREATE TABLE IF NOT EXISTS public.affiliate_networks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  base_url text,
  tracking_param text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.affiliate_networks TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.affiliate_networks TO authenticated;
GRANT ALL ON public.affiliate_networks TO service_role;
ALTER TABLE public.affiliate_networks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view networks" ON public.affiliate_networks FOR SELECT USING (true);
CREATE POLICY "Admins insert networks" ON public.affiliate_networks FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update networks" ON public.affiliate_networks FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete networks" ON public.affiliate_networks FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER affiliate_networks_updated_at BEFORE UPDATE ON public.affiliate_networks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.affiliate_networks (slug, name, base_url) VALUES
  ('amazon','Amazon','https://www.amazon.in'),
  ('flipkart','Flipkart','https://www.flipkart.com'),
  ('myntra','Myntra','https://www.myntra.com'),
  ('ajio','Ajio','https://www.ajio.com'),
  ('meesho','Meesho','https://www.meesho.com'),
  ('nykaa-fashion','Nykaa Fashion','https://www.nykaafashion.com'),
  ('tata-cliq','Tata CLiQ','https://www.tatacliq.com'),
  ('puma','Puma','https://in.puma.com'),
  ('adidas','Adidas','https://www.adidas.co.in'),
  ('nike','Nike','https://www.nike.com/in'),
  ('hm','H&M','https://www2.hm.com/en_in'),
  ('bewakoof','Bewakoof','https://www.bewakoof.com'),
  ('libas','Libas','https://libas.in'),
  ('biba','Biba','https://www.biba.in')
ON CONFLICT (slug) DO NOTHING;

-- ============= ACTIVITY LOGS =============
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  entity_type text,
  entity_id text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.activity_logs TO authenticated;
GRANT ALL ON public.activity_logs TO service_role;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view logs" ON public.activity_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.activity_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs (user_id);

-- ============= PRODUCT CLICKS =============
CREATE TABLE IF NOT EXISTS public.product_clicks (
  id bigserial PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  referrer text,
  user_agent text,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.product_clicks TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.product_clicks_id_seq TO anon, authenticated;
GRANT SELECT ON public.product_clicks TO authenticated;
GRANT ALL ON public.product_clicks TO service_role;
ALTER TABLE public.product_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert clicks" ON public.product_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view clicks" ON public.product_clicks FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE INDEX IF NOT EXISTS idx_product_clicks_product ON public.product_clicks (product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_clicks_created ON public.product_clicks (created_at DESC);

-- ============= RPC: increment click =============
CREATE OR REPLACE FUNCTION public.increment_product_click(_product_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.products SET click_count = click_count + 1 WHERE id = _product_id;
$$;
REVOKE ALL ON FUNCTION public.increment_product_click(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_product_click(uuid) TO anon, authenticated;
