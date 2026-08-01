ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS enriched_at timestamptz,
  ADD COLUMN IF NOT EXISTS enrich_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS enrich_error text;

CREATE INDEX IF NOT EXISTS products_enrich_status_idx ON public.products (enrich_status) WHERE enrich_status = 'pending';