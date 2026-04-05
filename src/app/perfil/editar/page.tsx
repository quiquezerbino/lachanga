"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { AvatarUpload } from "@/components/avatar-upload";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase/client";

const DEPARTAMENTOS = [
  "Artigas", "Canelones", "Cerro Largo", "Colonia", "Durazno",
  "Flores", "Florida", "Lavalleja", "Maldonado", "Montevideo",
  "Paysandú", "Río Negro", "Rivera", "Rocha", "Salto",
  "San José", "Soriano", "Tacuarembó", "Treinta y Tres",
];

export default function EditarPerfilPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [department, setDepartment] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setBio(profile.bio || "");
      setDepartment(profile.department || "");
      setSkills(profile.skills || []);
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  const addSkill = () => {
    const trimmed = skillsInput.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 10) {
      setSkills([...skills, trimmed]);
      setSkillsInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        bio: bio.trim() || null,
        department,
        skills: skills.length > 0 ? skills : null,
      })
      .eq("user_id", user.id);

    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (authLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />)}
        </div>
      </div>
    );
  }

  if (!user || !profile) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <Link
        href={`/perfil/${user.id}`}
        className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-6" })}
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Volver al perfil
      </Link>

      <h1 className="text-2xl font-bold">Editar perfil</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Actualizá tu información para que los demás te conozcan mejor.
      </p>

      <div className="mt-8 space-y-8">
        {/* Avatar */}
        <div className="flex flex-col items-center rounded-xl border bg-card p-6">
          <AvatarUpload
            userId={user.id}
            currentUrl={avatarUrl}
            size={112}
            onUploaded={(url) => setAvatarUrl(url)}
          />
        </div>

        {/* Datos personales */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Datos personales</h2>

          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="department">Departamento</Label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Seleccioná</option>
                {DEPARTAMENTOS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="bio">Sobre vos</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Contá brevemente qué hacés, tu experiencia, etc."
                rows={3}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        {profile.role === "tasker" && (
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">Habilidades</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Agregá hasta 10 habilidades para que los clientes te encuentren.
            </p>

            <div className="mt-4 flex gap-2">
              <Input
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="Ej: Plomería"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addSkill} disabled={!skillsInput.trim()}>
                Agregar
              </Button>
            </div>

            {skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-0.5 text-muted-foreground hover:text-foreground"
                    >
                      &times;
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Save */}
        <Button onClick={handleSave} disabled={saving || !fullName.trim()} className="w-full">
          {saving ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
          ) : saved ? (
            "Guardado"
          ) : (
            <><Save className="mr-2 h-4 w-4" /> Guardar cambios</>
          )}
        </Button>
      </div>
    </div>
  );
}
