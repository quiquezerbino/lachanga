import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: Request) {
  try {
    // 1. Auth check
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
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

Your task: Determine if the person in the selfie is the same person shown on the identity document.

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "result": "match" | "no_match" | "unclear",
  "confidence": 0.0 to 1.0,
  "reasoning": "brief explanation in Spanish"
}

Rules:
- "match": You are confident it's the same person (confidence >= 0.75)
- "no_match": You are confident it's NOT the same person (confidence >= 0.75)
- "unclear": Image quality is poor, document is partially obscured, or you cannot determine with confidence
- Be conservative: when in doubt, return "unclear"
- Do NOT try to read or extract personal data from the document (name, ID number, etc.)
- Only compare the facial features`,
            },
          ],
        },
      ],
    });

    // 6. Parse AI response
    const aiText = aiResponse.content[0].type === "text" ? aiResponse.content[0].text : "";
    let aiResult: { result: string; confidence: number; reasoning: string };

    try {
      aiResult = JSON.parse(aiText);
    } catch {
      aiResult = { result: "unclear", confidence: 0, reasoning: "Error parsing AI response" };
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
  } catch (err) {
    console.error("Verification error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
