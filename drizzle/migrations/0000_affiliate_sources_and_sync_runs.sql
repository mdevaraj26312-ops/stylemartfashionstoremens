CREATE TABLE public.affiliate_sources (
  id uuid not null default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  kind text not null default 'paapi',
  marketplace text,
  is_active boolean not null default true,
  sync_interval_minutes integer not null default 60,
  last_sync_at timestamptz,
  last_sync_status text not null default 'never',
  last_sync_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.sync_runs (
  id uuid not null default gen_random_uuid(),
  source_slug text not null,
  status text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  imported integer not null default 0,
  updated integer not null default 0,
  hidden integer not null default 0,
  error text,
  detail jsonb not null default '{}'::jsonb
);

GRANT SELECT ON public.affiliate_sources TO authenticated;
GRANT ALL ON public.affiliate_sources TO service_role;
GRANT SELECT ON public.sync_runs TO authenticated;
GRANT ALL ON public.sync_runs TO service_role;

ALTER TABLE public.affiliate_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view affiliate sources"
  ON public.affiliate_sources FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins view sync runs"
  ON public.sync_runs FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_updated_at_affiliate_sources
  BEFORE UPDATE ON public.affiliate_sources
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.affiliate_sources (slug, name, kind, marketplace, is_active, sync_interval_minutes) VALUES
  ('amazon-paapi', 'Amazon India', 'paapi', 'amazon.in', true, 60),
  ('myntra', 'Myntra', 'external', 'myntra.com', false, 1440),
  ('ajio', 'Ajio', 'external', 'ajio.com', false, 1440);