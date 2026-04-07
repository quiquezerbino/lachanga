"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MapPin, Star, Calendar, ShieldCheck, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { UserAvatar } from "@/components/user-avatar";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import type { Tables } from "@/lib/supabase/types";

type Profile = Tables<"profiles">;
type Review = Tables<"reviews"> & { reviewer?: Profile | null };

export default function PerfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const isOwn = user?.id === id;

  const fetchProfile = useCallback(async () => {
    if (!id) return;
    setLoading(true);

    const { data: p } = await supabase.from("profiles").select("*").eq("user_id", id).single();
    setProfile(p);

    const { data: r } = await supabase
      .from("reviews").select("*").eq("reviewee_id", id)
      .order("created_at", { ascending: false });

    if (r && r.length > 0) {
      const reviewerIds = [...new Set(r.map((rv) => rv.reviewer_id))];
      const { data: reviewerProfiles } = await supabase.from("profiles").select("*").in("user_id", reviewerIds);
      const profileMap = new Map((reviewerProfiles || []).map((rp) => [rp.user_id, rp]));
      setReviews(r.map((rv) => ({ ...rv, reviewer: profileMap.get(rv.reviewer_id) || null })));
    }

    const { data: completedOffers } = await supabase
      .from("offers").select("task_id").eq("tasker_id", id).eq("status", "accepted");
    if (completedOffers && completedOffers.length > 0) {
      const taskIds = completedOffers.map((o) => o.task_id);
      const { count } = await supabase
        .from("tasks").select("id", { count: "exact", head: true })
        .in("id", taskIds).in("status", ["completed", "reviewed"]);
      setCompletedCount(count ?? 0);
    }

    setLoading(false);
  }, [id, supabase]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />)}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-lg font-medium">Perfil no encontrado</p>
      </div>
    );
  }

  const isVerified = profile.verification_status === "verified";
  const computedAvg = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : Number(profile.rating ?? 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <UserAvatar
              src={profile.avatar_url}
              name={profile.full_name}
              className="h-16 w-16 text-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{profile.full_name}</h1>
                {isVerified && <ShieldCheck className="h-5 w-5 text-accent" />}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Badge variant="secondary" className="capitalize">{profile.role}</Badge>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {profile.department || "Uruguay"}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Desde {format(new Date(profile.created_at), "MMM yyyy", { locale: es })}
                </span>
              </div>
            </div>
          </div>
          {isOwn && (
            <Link href="/perfil/editar" className={buttonVariants({ variant: "outline", size: "sm" })}>
              <Pencil className="mr-1 h-3.5 w-3.5" /> Editar perfil
            </Link>
          )}
        </div>

        {profile.bio && <p className="mt-4 text-sm leading-relaxed">{profile.bio}</p>}

        {profile.skills && profile.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
            ))}
          </div>
        )}
      </div>

      {/* Stats for tasker */}
      {profile.role === "tasker" && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-4">
            <p className="text-2xl font-bold tabular-nums text-primary">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Completadas</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-current text-amber-500" />
              <span className="text-lg font-bold tabular-nums">{computedAvg.toFixed(1)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Valoración</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-4">
            <p className="text-2xl font-bold tabular-nums text-primary">{reviews.length}</p>
            <p className="text-xs text-muted-foreground">Reseñas</p>
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-6">
        <h3 className="text-lg font-bold">Reseñas</h3>
        {reviews.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Sin valoraciones aún.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      src={review.reviewer?.avatar_url}
                      name={review.reviewer?.full_name}
                      size="sm"
                      className="h-8 w-8"
                    />
                    <span className="text-sm font-medium">{review.reviewer?.full_name || "Usuario"}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-4 w-4 ${s <= review.rating ? "fill-current text-amber-500" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                </div>
                {review.comment && <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
