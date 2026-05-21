-- Adds Q6 (ticketing research block) to the commons interest form.
-- Stored as JSONB to keep the schema migration minimal — Q6's five
-- sub-fields are composed client-side and the whole object lands in
-- one column. Querying later via JSONB operators (q6_ticketing->>'mix'
-- etc.).
--
-- Shape:
--   {
--     "platforms":       ["Eventbrite", "Outsavvy", ...],
--     "mix":             "70% free / 20% subsidised / 10% full-price",
--     "events_by_size":  { "under_20": 3, "20_50": 5, "50_100": 2, "100_150": 1, "150_plus": 0 },
--     "ranked_reasons":  ["Legitimacy signal", "RSVP and capacity", "Mailing list"],
--     "ranked_other":    "if 'Other' picked, the description text"
--   }

ALTER TABLE public.commons_interest
ADD COLUMN IF NOT EXISTS q6_ticketing jsonb;

COMMENT ON COLUMN public.commons_interest.q6_ticketing IS
'Q6 ticketing research block. Structured as platforms[], mix, events_by_size{}, ranked_reasons[], ranked_other. NULL when respondent skipped the section entirely.';

-- Explicit column-level grant — column grants don''t always inherit
-- from table grants under Supabase RLS when columns are added later.
-- (See feedback_supabase_migration_grants.md for the 42501 trap.)
GRANT INSERT (q6_ticketing) ON public.commons_interest TO anon;
GRANT INSERT (q6_ticketing) ON public.commons_interest TO authenticated;
