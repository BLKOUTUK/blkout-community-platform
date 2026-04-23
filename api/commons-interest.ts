// Commons interest form — POST handler
// Writes to public.commons_interest via anon role (insert-only RLS policy)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const EMAIL_RE = /^.+@.+\..+$/;
const MAX_TEXT = 4000;
const MAX_ARR = 20;

function s(v: unknown, max = MAX_TEXT): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t.length ? t.slice(0, max) : null;
}

function arr(v: unknown, max = MAX_ARR): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
          .map(x => x.trim().slice(0, 200))
          .slice(0, max);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'supabase_not_configured' });
  }

  const body = (req.body || {}) as Record<string, unknown>;

  const organisation = s(body.organisation);
  const name = s(body.name);
  const email = s(body.email, 200);

  if (!organisation || !name || !email) {
    return res.status(400).json({ error: 'missing_required_fields' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'invalid_email' });
  }

  const record = {
    organisation,
    name,
    email: email.toLowerCase(),
    q1_reach: s(body.q1_reach),
    q2_missed: s(body.q2_missed),
    q3_tools: arr(body.q3_tools),
    q3_other: s(body.q3_other),
    q4_invisibility: s(body.q4_invisibility),
    q5_shared_tool: s(body.q5_shared_tool),
    reg_interests: arr(body.reg_interests),
    notes: s(body.notes),
    source: s(body.source) || 'commons-landing',
    user_agent: s(req.headers['user-agent'] as string | undefined, 500),
    referer: s(req.headers['referer'] as string | undefined, 500),
  };

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  // No .select() — anon role has INSERT policy but no SELECT, so RETURNING would 401.
  const { error } = await supabase.from('commons_interest').insert(record);

  if (error) {
    console.error('commons_interest insert error:', error);
    return res.status(500).json({ error: 'insert_failed' });
  }

  return res.status(201).json({ ok: true });
}
