"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send, ArrowLeft, MessageSquare, Lock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

type Conversation = Tables<"conversations">;
type Message = Tables<"messages">;
type Profile = Tables<"profiles">;

interface ConvoWithMeta extends Conversation {
  otherProfile?: Profile | null;
  lastMessage?: Message | null;
  unreadCount: number;
  taskTitle?: string;
}

export default function MensajesPage() {
  return (
    <Suspense>
      <MensajesContent />
    </Suspense>
  );
}

function MensajesContent() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeConvoId = searchParams.get("c");
  const supabase = createClient();

  const [convos, setConvos] = useState<ConvoWithMeta[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    const { data: rawConvos } = await supabase
      .from("conversations")
      .select("*")
      .or(`client_id.eq.${user.id},tasker_id.eq.${user.id}`)
      .order("created_at", { ascending: false });
    if (!rawConvos) { setLoading(false); return; }

    const otherIds = rawConvos.map((c) => c.client_id === user.id ? c.tasker_id : c.client_id);
    const taskIds = rawConvos.map((c) => c.task_id);

    const [{ data: profiles }, { data: tasks }] = await Promise.all([
      supabase.from("profiles").select("*").in("user_id", [...new Set(otherIds)]),
      supabase.from("tasks").select("id, title").in("id", [...new Set(taskIds)]),
    ]);

    const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));
    const taskMap = new Map((tasks || []).map((t) => [t.id, t.title]));

    const enriched: ConvoWithMeta[] = await Promise.all(
      rawConvos.map(async (c) => {
        const otherId = c.client_id === user.id ? c.tasker_id : c.client_id;
        const { data: lastMsgs } = await supabase
          .from("messages").select("*").eq("conversation_id", c.id)
          .order("created_at", { ascending: false }).limit(1);
        const { count } = await supabase
          .from("messages").select("*", { count: "exact", head: true })
          .eq("conversation_id", c.id).neq("sender_id", user.id).eq("read", false);
        return {
          ...c,
          otherProfile: profileMap.get(otherId) || null,
          lastMessage: lastMsgs?.[0] || null,
          unreadCount: count || 0,
          taskTitle: taskMap.get(c.task_id),
        };
      })
    );

    enriched.sort((a, b) => {
      const aTime = a.lastMessage?.created_at || a.created_at;
      const bTime = b.lastMessage?.created_at || b.created_at;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    setConvos(enriched);
    setLoading(false);
  }, [user, supabase]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  useEffect(() => {
    if (!activeConvoId) { setMessages([]); return; }
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages").select("*").eq("conversation_id", activeConvoId)
        .order("created_at", { ascending: true });
      setMessages(data || []);
      if (user) {
        await supabase.from("messages").update({ read: true })
          .eq("conversation_id", activeConvoId).neq("sender_id", user.id).eq("read", false);
      }
    };
    fetchMessages();
  }, [activeConvoId, user, supabase]);

  // Real-time subscription
  useEffect(() => {
    if (!activeConvoId) return;
    const channel = supabase
      .channel(`messages:${activeConvoId}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "messages",
        filter: `conversation_id=eq.${activeConvoId}`,
      }, (payload) => {
        const msg = payload.new as Message;
        setMessages((prev) => [...prev, msg]);
        if (user && msg.sender_id !== user.id) {
          supabase.from("messages").update({ read: true }).eq("id", msg.id).then();
        }
        fetchConversations();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeConvoId, user, supabase, fetchConversations]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!user || !activeConvoId || !newMsg.trim()) return;
    setSending(true);
    await supabase.from("messages").insert({
      conversation_id: activeConvoId, sender_id: user.id, content: newMsg.trim(),
    });
    setNewMsg("");
    setSending(false);
  };

  const selectConvo = (id: string) => {
    router.push(`/mensajes?c=${id}`);
  };

  const activeConvo = convos.find((c) => c.id === activeConvoId);

  if (!user) { router.push("/login"); return null; }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Conversation list */}
      <div className={cn(
        "flex flex-col border-r bg-card",
        activeConvoId ? "hidden md:flex md:w-80" : "w-full md:w-80"
      )}>
        <div className="border-b p-4">
          <h2 className="text-lg font-bold">Mensajes</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="space-y-2 p-4">
              {[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />)}
            </div>
          ) : convos.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-muted-foreground">No tenés conversaciones aún</p>
            </div>
          ) : (
            convos.map((c) => (
              <button
                key={c.id}
                onClick={() => selectConvo(c.id)}
                className={cn(
                  "flex w-full items-start gap-3 border-b px-4 py-3 text-left transition hover:bg-muted/50",
                  activeConvoId === c.id && "bg-muted",
                  c.is_closed && "opacity-60"
                )}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {c.otherProfile?.full_name?.charAt(0)?.toUpperCase() || "?"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1 min-w-0">
                      {c.is_closed && <Lock className="h-3 w-3 shrink-0 text-muted-foreground" />}
                      <p className="truncate text-sm font-medium">{c.otherProfile?.full_name || "Usuario"}</p>
                    </div>
                    {c.lastMessage && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(c.lastMessage.created_at), { locale: es, addSuffix: false })}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{c.taskTitle}</p>
                  <div className="flex items-center justify-between">
                    <p className="truncate text-xs text-muted-foreground">
                      {c.lastMessage?.content || "Sin mensajes"}
                    </p>
                    {c.unreadCount > 0 && (
                      <span className="ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className={cn("flex flex-1 flex-col", !activeConvoId && "hidden md:flex")}>
        {activeConvo ? (
          <>
            <div className="border-b">
              <div className="flex items-center gap-3 px-4 py-3">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => router.push("/mensajes")}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {activeConvo.otherProfile?.full_name?.charAt(0)?.toUpperCase() || "?"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{activeConvo.otherProfile?.full_name}</p>
                  <p className="truncate text-xs text-muted-foreground">{activeConvo.taskTitle}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="mx-auto max-w-2xl space-y-2">
                {messages.map((msg) => {
                  const isMine = msg.sender_id === user.id;
                  return (
                    <div key={msg.id} className={cn("flex items-end gap-2", isMine ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                        isMine ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-muted"
                      )}>
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        <p className={cn("mt-1 text-[10px]", isMine ? "text-primary-foreground/60" : "text-muted-foreground")}>
                          {formatDistanceToNow(new Date(msg.created_at), { locale: es, addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            </div>

            {activeConvo.is_closed ? (
              <div className="border-t px-4 py-3">
                <div className="mx-auto flex max-w-2xl items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4 shrink-0" />
                  <span>Esta conversación fue cerrada.</span>
                </div>
              </div>
            ) : (
              <div className="border-t px-4 py-3">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="mx-auto flex max-w-2xl gap-2">
                  <Input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="Escribí un mensaje..." className="flex-1" autoFocus />
                  <Button type="submit" size="icon" disabled={sending || !newMsg.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-center">
            <div>
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-2 text-muted-foreground">Elegí una conversación para empezar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
