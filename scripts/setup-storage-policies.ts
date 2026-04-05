import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { db: { schema: "storage" } }
);

async function checkBucketAccess() {
  // Test: list files in the avatars bucket using service role
  const { data, error } = await supabase.storage.from("avatars").list("", { limit: 1 });

  if (error) {
    console.log("✗ Cannot access avatars bucket:", error.message);
    return false;
  }

  console.log("✓ Avatars bucket accessible");

  // Test upload with service role
  const testBlob = new Blob(["test"], { type: "text/plain" });
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload("__test__/test.txt", testBlob, { upsert: true });

  if (uploadError) {
    console.log("⚠ Upload test failed (RLS may need setup):", uploadError.message);
  } else {
    console.log("✓ Upload test passed (service_role can write)");
    // Clean up
    await supabase.storage.from("avatars").remove(["__test__/test.txt"]);
  }

  return true;
}

async function main() {
  console.log("Checking Storage setup...\n");

  const ok = await checkBucketAccess();

  if (ok) {
    console.log("\n✓ Bucket 'avatars' is ready!");
    console.log("\nIMPORTANT: Run this SQL in the Supabase SQL Editor to allow");
    console.log("authenticated users to manage their own avatars:\n");
    console.log(`-- Run in Supabase Dashboard > SQL Editor
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (select auth.uid()::text));

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (select auth.uid()::text))
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (select auth.uid()::text));

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (select auth.uid()::text));

CREATE POLICY "Public avatar read access"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'avatars');
`);
  }
}

main().catch(console.error);
