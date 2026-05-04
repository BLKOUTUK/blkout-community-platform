-- ====================================================================
-- BLKOUT — membership_interest (CBS pre-launch waiting list)
-- ====================================================================
-- Captures pre-launch interest in the three CBS tiers (free / £3 / £10)
-- before the board has finalised structure. Standalone — does NOT
-- foreign-key to public.contacts (CRM is institutional memory, not a
-- mailing list — see feedback_crm_as_archive). When the board signs off
-- and Zeffy/Stripe go live, rows can migrate into commerce_signups +
-- memberships with deliberate contact creation.
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.membership_interest (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    tier_chosen TEXT NOT NULL CHECK (tier_chosen IN ('free', 'three', 'ten')),
    motivation_text TEXT,

    utm_source   TEXT,
    utm_medium   TEXT,
    utm_campaign TEXT,

    signed_up_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS membership_interest_tier_idx
    ON public.membership_interest (tier_chosen);
CREATE INDEX IF NOT EXISTS membership_interest_signed_up_idx
    ON public.membership_interest (signed_up_at DESC);

-- RLS: anon can register interest; only authenticated can read/update
ALTER TABLE public.membership_interest ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anon can register interest" ON public.membership_interest;
CREATE POLICY "Anon can register interest"
    ON public.membership_interest FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can register interest" ON public.membership_interest;
CREATE POLICY "Authenticated can register interest"
    ON public.membership_interest FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can view interest" ON public.membership_interest;
CREATE POLICY "Authenticated can view interest"
    ON public.membership_interest FOR SELECT TO authenticated USING (true);
