import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function setupStorage() {
  console.log("Setting up Supabase Storage buckets...\n");

  // Create avatars bucket (public read)
  const { error: bucketError } = await supabase.storage.createBucket(
    "avatars",
    {
      public: true,
      fileSizeLimit: 2 * 1024 * 1024, // 2MB
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }
  );

  if (bucketError) {
    if (bucketError.message.includes("already exists")) {
      console.log("✓ Bucket 'avatars' already exists");
    } else {
      console.error("✗ Error creating bucket:", bucketError.message);
      process.exit(1);
    }
  } else {
    console.log("✓ Bucket 'avatars' created (public, 2MB limit, images only)");
  }

  // RLS policies for the bucket
  // Users can upload their own avatar (path: {user_id}/*)
  // Anyone can read (public bucket)
  // Users can update/delete their own avatar
  const policies = [
    {
      name: "Users can upload own avatar",
      definition: "INSERT",
      check: `(bucket_id = 'avatars' AND (storage.foldername(name))[1] = (select auth.uid()::text))`,
    },
    {
      name: "Users can update own avatar",
      definition: "UPDATE",
      check: `(bucket_id = 'avatars' AND (storage.foldername(name))[1] = (select auth.uid()::text))`,
    },
    {
      name: "Users can delete own avatar",
      definition: "DELETE",
      check: `(bucket_id = 'avatars' AND (storage.foldername(name))[1] = (select auth.uid()::text))`,
    },
    {
      name: "Public avatar read access",
      definition: "SELECT",
      check: `(bucket_id = 'avatars')`,
    },
  ];

  for (const policy of policies) {
    const sql =
      policy.definition === "SELECT"
        ? `CREATE POLICY "${policy.name}" ON storage.objects FOR ${policy.definition} USING ${policy.check};`
        : policy.definition === "DELETE"
          ? `CREATE POLICY "${policy.name}" ON storage.objects FOR ${policy.definition} USING ${policy.check};`
          : `CREATE POLICY "${policy.name}" ON storage.objects FOR ${policy.definition} WITH CHECK ${policy.check};`;

    const { error } = await supabase.rpc("exec_sql", { sql }).single();

    if (error) {
      // Try raw SQL via the management API
      const { error: sqlError } = await supabase.from("_exec").select().limit(0);
      // Policies might already exist, that's ok
      if (error.message.includes("already exists")) {
        console.log(`✓ Policy "${policy.name}" already exists`);
      } else {
        console.log(`⚠ Policy "${policy.name}": ${error.message} (may need manual setup)`);
      }
    } else {
      console.log(`✓ Policy "${policy.name}" created`);
    }
  }

  console.log("\n--- Manual SQL (run in Supabase SQL Editor if policies failed) ---\n");
  console.log(`-- Storage RLS policies for avatars bucket
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (select auth.uid()::text));

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (select auth.uid()::text));

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (select auth.uid()::text));

CREATE POLICY "Public avatar read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
`);

  console.log("Done! If bucket was created but policies failed, copy the SQL above into the Supabase SQL Editor.");
}

setupStorage().catch(console.error);
