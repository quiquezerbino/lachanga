"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  userId: string;
  currentUrl: string | null;
  size?: number;
  onUploaded: (url: string) => void;
}

export function AvatarUpload({ userId, currentUrl, size = 96, onUploaded }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const displayUrl = preview || currentUrl;

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen no puede superar 2MB");
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${userId}/avatar.${ext}`;

      // Delete old avatar if exists
      await supabase.storage.from("avatars").remove([`${userId}/avatar.jpg`, `${userId}/avatar.png`, `${userId}/avatar.webp`]);

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);

      // Add cache-bust param
      const finalUrl = `${publicUrl}?v=${Date.now()}`;

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: finalUrl })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      onUploaded(finalUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir imagen");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/30 transition-colors hover:border-primary/50",
          uploading && "pointer-events-none opacity-70"
        )}
        style={{ width: size, height: size }}
      >
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="Avatar"
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <Camera className="h-8 w-8 text-muted-foreground/50" />
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}

        {!uploading && displayUrl && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 opacity-0 transition-all hover:bg-black/40 hover:opacity-100">
            <Camera className="h-6 w-6 text-white" />
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      <p className="text-xs text-muted-foreground">
        {uploading ? "Subiendo..." : "Hacé clic para cambiar"}
      </p>

      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <X className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  );
}
