import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Anthropic from "@anthropic-ai/sdk";

// Rate limiting: max 3 attempts per user per hour (in-memory, resets on deploy)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    // 1. Auth check
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // 1.5 Rate limit check
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: "Demasiados intentos. Esperá una hora antes de volver a intentar." },
        { status: 429 }
      );
    }

    // 2. Parse request
    const { cedulaPath, selfiePath } = await request.json();
    if (!cedulaPath || !selfiePath) {
      return NextResponse.json({ error: "Faltan archivos" }, { status: 400 });
    }

    // 3. Download images from private bucket using admin client
    const admin = createAdminClient();

    const [cedulaRes, selfieRes] = await Promise.all([
      admin.storage.from("verifications").download(cedulaPath),
      admin.storage.from("verifications").download(selfiePath),
    ]);

    if (cedulaRes.error || selfieRes.error) {
      return NextResponse.json({ error: "Error descargando imágenes" }, { status: 500 });
    }

    // 4. Convert to base64
    const [cedulaBuffer, selfieBuffer] = await Promise.all([
      cedulaRes.data.arrayBuffer(),
      selfieRes.data.arrayBuffer(),
    ]);

    const cedulaB64 = Buffer.from(cedulaBuffer).toString("base64");
    const selfieB64 = Buffer.from(selfieBuffer).toString("base64");

    // Detect media type from file extension
    const getMediaType = (path: string): "image/jpeg" | "image/png" | "image/webp" => {
      if (path.endsWith(".png")) return "image/png";
      if (path.endsWith(".webp")) return "image/webp";
      return "image/jpeg";
    };

    // 5. Call Claude Haiku for verification
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const aiResponse = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: getMediaType(cedulaPath), data: cedulaB64 },
            },
            {
              type: "image",
              source: { type: "base64", media_type: getMediaType(selfiePath), data: selfieB64 },
            },
            {
              type: "text",
              text: `You are an identity verification assistant. Compare the two images:
- Image 1: A photo of an identity document (cédula de identidad from Uruguay)
- Image 2: A selfie of a person

Your tasks:
1. Determine if the person in the selfie is the same person shown on the identity document.
2. Extract the document number (número de cédula) and full name from the identity document.

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "result": "match" | "no_match" | "unclear",
  "confidence": 0.0 to 1.0,
  "reasoning": "brief explanation in Spanish",
  "document_number": "the cédula number (e.g. 1.234.567-8) or null if unreadable",
  "document_name": "the full name on the document or null if unreadable"
}

Rules:
- "match": You are confident it's the same person (confidence >= 0.75)
- "no_match": You are confident it's NOT the same person (confidence >= 0.75)
- "unclear": Image quality is poor, document is partially obscured, or you cannot determine with confidence
- Be conservative: when in doubt, return "unclear"
- Extract the document number and name exactly as printed on the cédula
- If you cannot read the document number or name clearly, set them to null`,
            },
          ],
        },
      ],
    });

    // 6. Parse AI response
    const aiText = aiResponse.content[0].type === "text" ? aiResponse.content[0].text : "";
    let aiResult: {
      result: string;
      confidence: number;
      reasoning: string;
      document_number: string | null;
      document_name: string | null;
    };

    try {
      aiResult = JSON.parse(aiText);
    } catch {
      aiResult = { result: "unclear", confidence: 0, reasoning: "Error parsing AI response", document_number: null, document_name: null };
    }

    // Validate result
    if (!["match", "no_match", "unclear"].includes(aiResult.result)) {
      aiResult.result = "unclear";
    }

    // 7. Insert verification record
    const { error: insertError } = await admin
      .from("verifications")
      .insert({
        user_id: user.id,
        cedula_url: cedulaPath,
        selfie_url: selfiePath,
        ai_result: aiResult.result,
        ai_confidence: aiResult.confidence,
        ai_reasoning: aiResult.reasoning,
        document_number: aiResult.document_number || null,
        document_name: aiResult.document_name || null,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: "Error guardando verificación" }, { status: 500 });
    }

    // 8. Update profile verification status
    const statusMap: Record<string, "verified" | "rejected" | "pending"> = {
      match: "verified",
      no_match: "rejected",
      unclear: "pending",
    };

    await admin
      .from("profiles")
      .update({ verification_status: statusMap[aiResult.result] })
      .eq("user_id", user.id);

    return NextResponse.json({
      result: aiResult.result,
      status: statusMap[aiResult.result],
      reasoning: aiResult.reasoning,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Verification error:", errorMessage, err);
    return NextResponse.json({ error: `Error interno: ${errorMessage}` }, { status: 500 });
  }
}
