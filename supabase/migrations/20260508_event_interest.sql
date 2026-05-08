-- ====================================================================
-- BLKOUT — event_interest (canvassing interest in events / group travel)
-- ====================================================================
-- Captures expressions of interest in events BLKOUT might organise
-- attendance / a group around. First use: Global Black Pride 2026 in
-- Paris (Sep 9-13). Generic across events via event_slug, same shape
-- as drop_interest / membership_interest. Standalone — no FK to
-- public.contacts (CRM stays archive).
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.event_interest (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_slug TEXT NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    interest_level TEXT NOT NULL
        CHECK (interest_level IN ('definitely', 'if-organised', 'keep-informed')),
    could_help_organise BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,

    utm_source   TEXT,
    utm_medium   TEXT,
    utm_campaign TEXT,

    signed_up_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (event_slug, email)
);

CREATE INDEX IF NOT EXISTS event_interest_event_slug_idx
    ON public.event_interest (event_slug);
CREATE INDEX IF NOT EXISTS event_interest_signed_up_idx
    ON public.event_interest (signed_up_at DESC);

-- Table privileges. Supabase auto-grants on dashboard-created tables but
-- not when applied via the management API — set them explicitly.
-- (See feedback_supabase_migration_grants.md)
GRANT INSERT ON public.event_interest TO anon;
GRANT SELECT, INSERT ON public.event_interest TO authenticated;

-- RLS
ALTER TABLE public.event_interest ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anon can register event interest" ON public.event_interest;
CREATE POLICY "Anon can register event interest"
    ON public.event_interest FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can register event interest" ON public.event_interest;
CREATE POLICY "Authenticated can register event interest"
    ON public.event_interest FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can view event interest" ON public.event_interest;
CREATE POLICY "Authenticated can view event interest"
    ON public.event_interest FOR SELECT TO authenticated USING (true);
