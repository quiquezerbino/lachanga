/**
 * Run with: npx tsx scripts/setup-verification.ts
 * Sets up the verification system: enum, columns, table, RLS, storage bucket
 */
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

async function run(label: string, sql: string) {
  const { error } = await supabase.rpc("exec_sql" as never, { sql } as never);
  if (error) {
    // Try raw query via REST
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`,
      {
        method: "POST",
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql }),
      }
    );
    if (!res.ok) {
      console.log(`⚠️  ${label}: needs manual SQL execution`);
      return false;
    }
  }
  console.log(`✅ ${label}`);
  return true;
}

async function main() {
  console.log("Setting up verification system...\n");
  console.log("If the script can't execute SQL directly, run this in the Supabase SQL Editor:\n");
  console.log("=".repeat(70));

  const sql = `
-- 1. Create verification_status enum
DO $$ BEGIN
  CREATE TYPE public.verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Add verification_status to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS verification_status public.verification_status NOT NULL DEFAULT 'unverified';

-- 3. Create verifications table
CREATE TABLE IF NOT EXISTS public.verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cedula_url TEXT NOT NULL,
  selfie_url TEXT NOT NULL,
  ai_result TEXT NOT NULL CHECK (ai_result IN ('match', 'no_match', 'unclear')),
  ai_confidence NUMERIC(3,2),
  ai_reasoning TEXT,
  admin_decision TEXT CHECK (admin_decision IN ('approved', 'rejected')),
  admin_id UUID REFERENCES auth.users(id),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_verifications_user_id ON public.verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_verifications_pending ON public.verifications(ai_result)
  WHERE admin_decision IS NULL;

-- 4. RLS for verifications
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can view own verifications"
    ON public.verifications FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own verifications"
    ON public.verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can view all verifications"
    ON public.verifications FOR SELECT USING (public.is_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can update verifications"
    ON public.verifications FOR UPDATE USING (public.is_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 5. Storage bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('verifications', 'verifications', false)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage RLS policies
DO $$ BEGIN
  CREATE POLICY "Users upload own verification files"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'verifications' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users read own verification files"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'verifications' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins read all verification files"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'verifications' AND public.is_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
`;

  console.log(sql);
  console.log("=".repeat(70));
  console.log("\nCopy and paste the SQL above into the Supabase SQL Editor and run it.");
}

main();
