import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import EspaceClientLayout from "@/components/client/EspaceClientLayout";
import { useClientAuth } from "@/hooks/useClientAuth";

export default function EspaceClientMessages() {
  const { user, loading } = useClientAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/connexion");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("projects").select("*").eq("client_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => {
        setProjects(data ?? []);
        if (data && data.length > 0) setSelectedProject(data[0].id);
        setLoadingData(false);
      });
  }, [user]);

  useEffect(() => {
    if (!selectedProject) return;
    supabase.from("project_messages").select("*, profiles(full_name)").eq("project_id", selectedProject).order("created_at")
      .then(({ data }) => {
        setMessages(data ?? []);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      });

    // Écoute en temps réel
    const channel = supabase.channel(`messages-${selectedProject}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "project_messages", filter: `project_id=eq.${selectedProject}` },
        async (payload) => {
          const { data } = await supabase.from("project_messages").select("*, profiles(full_name)").eq("id", payload.new.id).single();
          if (data) { setMessages((prev) => [...prev, data]); setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100); }
        })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedProject]);

  async function sendMessage() {
    if (!newMessage.trim() || !selectedProject || !user) return;
    setSending(true);
    await supabase.from("project_messages").insert({ project_id: selectedProject, user_id: user.id, content: newMessage.trim() });
    setNewMessage("");
    setSending(false);
  }

  if (loading || loadingData) return <div className="min-h-screen" style={{ background: "hsl(263, 36%, 10%)" }} />;

  return (
    <EspaceClientLayout>
      <div className="p-6 md:p-8 flex flex-col h-full" style={{ maxHeight: "calc(100vh - 56px)" }}>
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Échangez directement avec Déclic Digital</p>
        </div>

        {projects.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {projects.map((p) => (
              <button key={p.id} onClick={() => setSelectedProject(p.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={selectedProject === p.id ? { background: "rgba(255,255,255,0.12)", color: "white" } : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.45)" }}>
                {p.name}
              </button>
            ))}
          </div>
        )}

        {/* Zone messages */}
        <div className="flex-1 overflow-y-auto rounded-2xl p-4 space-y-3 mb-4" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {messages.length === 0 ? (
            <div className="text-center py-12" style={{ color: "rgba(255,255,255,0.25)" }}>
              <p className="text-sm">Pas encore de messages.</p>
              <p className="text-xs mt-1">Envoyez un message à Déclic Digital !</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.user_id === user?.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-3 text-sm ${isMe ? "" : ""}`}
                    style={isMe
                      ? { background: "linear-gradient(135deg, hsl(183,70%,63%,0.3), hsl(284,65%,66%,0.3))", color: "white" }
                      : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.80)" }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: isMe ? "hsl(183,70%,80%)" : "rgba(255,255,255,0.50)" }}>
                      {isMe ? "Moi" : "Déclic Digital"}
                    </p>
                    <p>{msg.content}</p>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input message */}
        <div className="flex gap-3">
          <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Écrivez votre message..."
            className="flex-1 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }} />
          <button onClick={sendMessage} disabled={sending || !newMessage.trim()}
            className="px-4 py-3 rounded-xl font-semibold disabled:opacity-50 transition-all"
            style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}>
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </EspaceClientLayout>
  );
}
