"use client";

import { useState, useRef } from "react";
import { Camera, Upload, Loader2, X, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface VerificationUploadProps {
  userId: string;
  onComplete: (result: { result: string; status: string; reasoning: string }) => void;
}

export function VerificationUpload({ userId, onComplete }: VerificationUploadProps) {
  const [cedulaFile, setCedulaFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [cedulaPreview, setCedulaPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cedulaRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  function handleFile(file: File, type: "cedula" | "selfie") {
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar 5MB");
      return;
    }
    setError(null);
    const preview = URL.createObjectURL(file);
    if (type === "cedula") {
      setCedulaFile(file);
      setCedulaPreview(preview);
    } else {
      setSelfieFile(file);
      setSelfiePreview(preview);
    }
  }

  async function handleSubmit() {
    if (!cedulaFile || !selfieFile) {
      setError("Subí ambas imágenes");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const cedulaExt = cedulaFile.name.split(".").pop() || "jpg";
      const selfieExt = selfieFile.name.split(".").pop() || "jpg";
      const ts = Date.now();
      const cedulaPath = `${userId}/cedula_${ts}.${cedulaExt}`;
      const selfiePath = `${userId}/selfie_${ts}.${selfieExt}`;

      // Upload both files to private bucket
      const [cedulaUpload, selfieUpload] = await Promise.all([
        supabase.storage
          .from("verifications")
          .upload(cedulaPath, cedulaFile, { contentType: cedulaFile.type }),
        supabase.storage
          .from("verifications")
          .upload(selfiePath, selfieFile, { contentType: selfieFile.type }),
      ]);

      if (cedulaUpload.error) throw new Error(`Error subiendo cédula: ${cedulaUpload.error.message}`);
      if (selfieUpload.error) throw new Error(`Error subiendo selfie: ${selfieUpload.error.message}`);

      // Call verification API
      const res = await fetch("/api/verify-identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedulaPath, selfiePath }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error en verificación");
      }

      const result = await res.json();
      onComplete(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Cedula upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Foto de tu cédula (frente)</label>
          <button
            type="button"
            onClick={() => cedulaRef.current?.click()}
            disabled={uploading}
            className={cn(
              "flex h-48 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors",
              cedulaPreview ? "border-primary/30" : "border-muted-foreground/30 hover:border-primary/50",
              uploading && "pointer-events-none opacity-50"
            )}
          >
            {cedulaPreview ? (
              <img src={cedulaPreview} alt="Cédula" className="h-full w-full rounded-xl object-cover" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground/50" />
                <span className="mt-2 text-xs text-muted-foreground">Click para subir</span>
              </>
            )}
          </button>
          <input
            ref={cedulaRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file, "cedula");
              e.target.value = "";
            }}
          />
        </div>

        {/* Selfie upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Selfie de tu rostro</label>
          <button
            type="button"
            onClick={() => selfieRef.current?.click()}
            disabled={uploading}
            className={cn(
              "flex h-48 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors",
              selfiePreview ? "border-primary/30" : "border-muted-foreground/30 hover:border-primary/50",
              uploading && "pointer-events-none opacity-50"
            )}
          >
            {selfiePreview ? (
              <img src={selfiePreview} alt="Selfie" className="h-full w-full rounded-xl object-cover" />
            ) : (
              <>
                <Camera className="h-8 w-8 text-muted-foreground/50" />
                <span className="mt-2 text-xs text-muted-foreground">Click para subir</span>
              </>
            )}
          </button>
          <input
            ref={selfieRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file, "selfie");
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Tus documentos se almacenan de forma segura y privada. Solo se usan para verificar tu identidad.
      </p>

      {error && (
        <p className="flex items-center gap-1 text-sm text-destructive">
          <X className="h-4 w-4" /> {error}
        </p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!cedulaFile || !selfieFile || uploading}
        className="w-full font-semibold"
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verificando...
          </>
        ) : (
          "Verificar identidad"
        )}
      </Button>
    </div>
  );
}

export function VerificationResult({ result, status, reasoning }: { result: string; status: string; reasoning: string }) {
  const icons = {
    match: <CheckCircle className="h-12 w-12 text-green-500" />,
    no_match: <AlertCircle className="h-12 w-12 text-destructive" />,
    unclear: <Clock className="h-12 w-12 text-amber-500" />,
  };

  const titles: Record<string, string> = {
    match: "Identidad verificada",
    no_match: "Verificación rechazada",
    unclear: "En revisión manual",
  };

  const descriptions: Record<string, string> = {
    match: "Tu identidad fue verificada exitosamente. Ya podés usar La Changa con tu perfil verificado.",
    no_match: "No pudimos verificar tu identidad. Podés intentar nuevamente con fotos más claras.",
    unclear: "Tu verificación está siendo revisada por nuestro equipo. Te notificaremos cuando esté lista.",
  };

  return (
    <div className="flex flex-col items-center text-center">
      {icons[result as keyof typeof icons]}
      <h2 className="mt-4 text-xl font-bold">{titles[result]}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{descriptions[result]}</p>
    </div>
  );
}
