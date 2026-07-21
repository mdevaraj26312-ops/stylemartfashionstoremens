
-- Roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Products table
CREATE TYPE public.product_source AS ENUM ('Amazon', 'Flipkart', 'Meesho', 'Myntra', 'Ajio', 'Other');
CREATE TYPE public.product_category AS ENUM ('women','men','kids','footwear','bags','watches','jewellery','accessories');

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  brand text NOT NULL,
  category public.product_category NOT NULL,
  source public.product_source NOT NULL DEFAULT 'Amazon',
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  original_price numeric(10,2) NOT NULL DEFAULT 0 CHECK (original_price >= 0),
  image_url text NOT NULL,
  affiliate_url text NOT NULL,
  description text NOT NULL DEFAULT '',
  rating numeric(2,1) NOT NULL DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
  reviews_count integer NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
  is_trending boolean NOT NULL DEFAULT false,
  is_new_arrival boolean NOT NULL DEFAULT false,
  is_deal boolean NOT NULL DEFAULT false,
  search_tsv tsvector GENERATED ALWAYS AS (
    to_tsvector('simple',
      coalesce(title,'') || ' ' || coalesce(brand,'') || ' ' || coalesce(description,'')
    )
  ) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Indexes for scale (100k+ rows)
CREATE INDEX products_category_idx ON public.products (category);
CREATE INDEX products_source_idx ON public.products (source);
CREATE INDEX products_price_idx ON public.products (price);
CREATE INDEX products_created_idx ON public.products (created_at DESC);
CREATE INDEX products_trending_idx ON public.products (is_trending) WHERE is_trending = true;
CREATE INDEX products_new_idx ON public.products (is_new_arrival) WHERE is_new_arrival = true;
CREATE INDEX products_deal_idx ON public.products (is_deal) WHERE is_deal = true;
CREATE INDEX products_search_idx ON public.products USING GIN (search_tsv);
CREATE INDEX products_brand_idx ON public.products (lower(brand));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
