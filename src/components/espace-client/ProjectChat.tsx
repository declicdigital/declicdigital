import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquare, Send, Loader2, X } from "lucide-react";
import logoImg from "@/assets/logo-declic-digital-new.webp";

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
  contactName?: string;
  contactInitials?: string;
}

const ProjectChat = ({
  projectId,
  userId,
  isAdmin = false,
  contactName = "Declic Digital",
  contactInitials = "DD",
}: ProjectChatProps) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    const { data } = await (supabase.from("project_messages") as any)
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });
    const msgs = data || [];
    setMessages(msgs);
    setUnreadCount(msgs.filter((m: Message) => !m.is_read && m.user_id !== userId).length);
    setLoading(false);
  };

  const markAsRead = async () => {
    await (supabase.from("project_messages") as any)
      .update({ is_read: true })
      .eq("project_id", projectId)
      .neq("user_id", userId)
      .eq("is_read", false);
  };

  useEffect(() => {
    loadMessages();

    // Poll for new messages every 5 seconds (secure alternative to Realtime subscriptions)
    const interval = setInterval(() => loadMessages(), 5000);

    return () => { clearInterval(interval); };
  }, [projectId]);

  useEffect(() => {
    if (open) {
      markAsRead();
      setUnreadCount(0);
    }
  }, [open, messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    const { error } = await (supabase.from("project_messages") as any).insert({
      project_id: projectId,
      user_id: userId,
      content: newMessage.trim(),
    });
    if (!error) setNewMessage("");
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

    if (isToday) return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    if (isYesterday) return `Hier ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const isOwnMessage = (msg: Message) => msg.user_id === userId;

  return (
    <>
      {/* Floating chat button */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40 bg-primary hover:bg-primary/90"
          >
            <MessageSquare className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-full sm:w-[420px] p-0 flex flex-col [&>button]:hidden"
        >
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                {contactInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-base font-semibold text-foreground truncate">
                {contactName}
              </SheetTitle>
              <p className="text-xs text-muted-foreground">Messagerie projet</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
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
                  <div key={msg.id} className={`flex gap-2 ${own ? "flex-row-reverse" : "flex-row"}`}>
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback
                        className={`text-[10px] font-semibold ${
                          own
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {own ? (isAdmin ? "DD" : "Moi") : contactInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                        own
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted text-foreground rounded-tl-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${own ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                        {formatDate(msg.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input area */}
          <div className="border-t border-border p-3 bg-card shrink-0">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ecrivez votre message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[42px] max-h-28 resize-none flex-1 text-sm"
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
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProjectChat;
