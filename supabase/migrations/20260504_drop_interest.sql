-- ====================================================================
-- BLKOUT — drop_interest (pre-launch waiting list for /shop/drops/{slug})
-- ====================================================================
-- Captures interest in BLKOUT drops (pre-orders, threshold-to-print).
-- Generic across all drops via drop_slug. Same shape as
-- membership_interest — standalone, no FK to public.contacts (CRM stays
-- archive). When a drop's print run triggers and Stripe is wired,
-- entries can be matched into pre_orders.
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.drop_interest (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drop_slug TEXT NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    quantity_intent INTEGER NOT NULL DEFAULT 1 CHECK (quantity_intent > 0 AND quantity_intent <= 50),
    motivation_text TEXT,

    utm_source   TEXT,
    utm_medium   TEXT,
    utm_campaign TEXT,

    signed_up_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (drop_slug, email)
);

CREATE INDEX IF NOT EXISTS drop_interest_drop_slug_idx
    ON public.drop_interest (drop_slug);
CREATE INDEX IF NOT EXISTS drop_interest_signed_up_idx
    ON public.drop_interest (signed_up_at DESC);

-- Table privileges. Supabase auto-grants on dashboard-created tables but
-- not when applied via the management API — set them explicitly.
-- (See feedback_supabase_migration_grants.md)
GRANT INSERT ON public.drop_interest TO anon;
GRANT SELECT, INSERT ON public.drop_interest TO authenticated;

-- RLS
ALTER TABLE public.drop_interest ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anon can register drop interest" ON public.drop_interest;
CREATE POLICY "Anon can register drop interest"
    ON public.drop_interest FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can register drop interest" ON public.drop_interest;
CREATE POLICY "Authenticated can register drop interest"
    ON public.drop_interest FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can view drop interest" ON public.drop_interest;
CREATE POLICY "Authenticated can view drop interest"
    ON public.drop_interest FOR SELECT TO authenticated USING (true);
