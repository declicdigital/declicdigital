import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Loader2 } from "lucide-react";

interface Message {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface ProjectChatProps {
  projectId: string;
  userId: string;
  isAdmin?: boolean;
}

const ProjectChat = ({ projectId, userId, isAdmin = false }: ProjectChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    const { data } = await (supabase.from("project_messages") as any)
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });
    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel(`project-chat-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "project_messages",
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark unread messages as read
  useEffect(() => {
    if (!isAdmin && messages.length > 0) {
      const unread = messages.filter((m) => !m.is_read && m.user_id !== userId);
      if (unread.length > 0) {
        // Only admins can update, so we skip for clients
      }
    }
  }, [messages, userId, isAdmin]);

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    const { error } = await (supabase.from("project_messages") as any).insert({
      project_id: projectId,
      user_id: userId,
      content: newMessage.trim(),
    });
    if (!error) {
      setNewMessage("");
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    }
    if (isYesterday) {
      return `Hier ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
    }
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOwnMessage = (msg: Message) => msg.user_id === userId;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5 text-primary" />
          Messagerie
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          ref={scrollRef}
          className="h-80 overflow-y-auto border border-border rounded-lg p-4 space-y-3 bg-muted/10"
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
              <MessageSquare className="h-8 w-8 opacity-40" />
              <p>Aucun message pour le moment.</p>
              <p className="text-xs">Envoyez un message pour demarrer la conversation.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const own = isOwnMessage(msg);
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${own ? "flex-row-reverse" : "flex-row"}`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className={`text-xs ${own ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {own ? (isAdmin ? "DD" : "Moi") : (isAdmin ? "CL" : "DD")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      own
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-card border border-border text-foreground rounded-tl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        own ? "text-primary-foreground/60" : "text-muted-foreground"
                      }`}
                    >
                      {formatDate(msg.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex gap-2">
          <Textarea
            placeholder="Ecrivez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[44px] max-h-32 resize-none flex-1"
            rows={1}
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            size="icon"
            className="shrink-0 self-end"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectChat;
