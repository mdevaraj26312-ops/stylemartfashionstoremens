UPDATE public.products p SET
  title = CASE
    WHEN p.title ~* 'great deals|great prices|starting[[:space:]]*(₹|rs\.?|inr)|under[[:space:]]*(₹|rs\.?|inr)[[:space:]]*[0-9]|resistance bands|yoga mats|string lights|deal of the day|lightning deal|shop early deals|top offers|fashion sale|mega sale|shop by category'
      AND p.slug LIKE 'amazon-product-%' THEN ''
    WHEN p.title ~* 'great deals|great prices|starting[[:space:]]*(₹|rs\.?|inr)|under[[:space:]]*(₹|rs\.?|inr)[[:space:]]*[0-9]|resistance bands|yoga mats|string lights|deal of the day|lightning deal|shop early deals|top offers|fashion sale|mega sale|shop by category'
      THEN initcap(replace(p.slug, '-', ' '))
    ELSE p.title
  END,
  brand = CASE
    WHEN p.brand ~* '^(amazon|unknown|various|not specified|n/a|na|brand|generic|seller)$|& more' THEN 'Generic'
    ELSE p.brand
  END,
  image_url = CASE
    WHEN p.image_url ~* 'nav-sprite|gno/sprites|fls-eu\.amazon|uedata|aicid=|aiweblab'
      THEN 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=70'
    ELSE p.image_url
  END,
  description = CASE
    WHEN p.description ~* 'great deals|great prices|resistance bands|yoga mats|string lights|deal of the day|shop early deals|check amazon' THEN ''
    ELSE p.description
  END,
  price = CASE
    WHEN p.title ~* 'great deals|great prices|starting[[:space:]]*(₹|rs\.?|inr)|under[[:space:]]*(₹|rs\.?|inr)[[:space:]]*[0-9]|resistance bands|yoga mats|string lights|deal of the day|lightning deal|shop early deals|top offers|fashion sale|mega sale|shop by category' THEN 0
    ELSE p.price
  END,
  original_price = CASE
    WHEN p.title ~* 'great deals|great prices|starting[[:space:]]*(₹|rs\.?|inr)|under[[:space:]]*(₹|rs\.?|inr)[[:space:]]*[0-9]|resistance bands|yoga mats|string lights|deal of the day|lightning deal|shop early deals|top offers|fashion sale|mega sale|shop by category' THEN 0
    ELSE p.original_price
  END,
  discount_pct = CASE
    WHEN p.title ~* 'great deals|great prices|starting[[:space:]]*(₹|rs\.?|inr)|under[[:space:]]*(₹|rs\.?|inr)[[:space:]]*[0-9]|resistance bands|yoga mats|string lights|deal of the day|lightning deal|shop early deals|top offers|fashion sale|mega sale|shop by category' THEN 0
    ELSE p.discount_pct
  END,
  enrich_status = 'pending',
  enrich_error = NULL
WHERE p.title ~* 'great deals|great prices|starting[[:space:]]*(₹|rs\.?|inr)|under[[:space:]]*(₹|rs\.?|inr)[[:space:]]*[0-9]|resistance bands|yoga mats|string lights|deal of the day|lightning deal|shop early deals|top offers|fashion sale|mega sale|shop by category'
   OR p.brand ~* '^(amazon|unknown|various|not specified|n/a|na|brand|generic|seller)$|& more'
   OR p.image_url ~* 'nav-sprite|gno/sprites|fls-eu\.amazon|uedata|aicid=|aiweblab'
   OR p.description ~* 'great deals|great prices|resistance bands|yoga mats|string lights|deal of the day|shop early deals|check amazon';