import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import chatBotLogo from "@/assets/chat-bot-logo.png";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/faq-chat`;

const suggestedQuestions = [
  "Combien coûte un site vitrine ?",
  "En combien de temps mon site sera prêt ?",
  "C'est quoi le SEO exactement ?",
  "Vous intervenez dans ma ville ?",
];

/** Shared chat logic + UI. Used both as sidebar (FAQ) and floating widget (other pages). */
const useChat = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (nextChunk: string) => {
      assistantSoFar += nextChunk;
      const content = assistantSoFar;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content } : m));
        }
        return [...prev, { role: "assistant", content }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erreur" }));
        toast.error(err.error || "Une erreur est survenue");
        setIsLoading(false);
        return;
      }
      if (!resp.body) throw new Error("No stream body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Impossible de contacter l'assistant. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, input, setInput, isLoading, scrollRef, sendMessage };
};

const renderMarkdown = (text: string) => {
  return text.split("\n").map((line, i, arr) => {
    const parts = line.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
    const rendered = parts.map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**"))
        return <strong key={j} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const isExternal = linkMatch[2].startsWith("http");
        if (isExternal) {
          return <a key={j} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">{linkMatch[1]}</a>;
        }
        return <Link key={j} to={linkMatch[2]} className="text-primary underline hover:text-primary/80">{linkMatch[1]}</Link>;
      }
      return part;
    });
    return <span key={i}>{rendered}{i < arr.length - 1 && <br />}</span>;
  });
};

const ChatMessages = ({ messages, isLoading, scrollRef, sendMessage }: {
  messages: Msg[];
  isLoading: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
  sendMessage: (text: string) => void;
}) => (
  <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
    {messages.length === 0 && (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <Bot size={36} className="text-primary/40" />
        <p className="text-sm text-muted-foreground max-w-xs">
          Bonjour ! Je suis l'assistant Déclic Digital. Posez-moi une question ou cliquez sur une suggestion.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    )}
    <AnimatePresence>
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {msg.role === "assistant" && (
            <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Bot size={14} className="text-primary" />
            </div>
          )}
          <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
          }`}>
            {msg.role === "assistant" ? renderMarkdown(msg.content) : msg.content}
          </div>
          {msg.role === "user" && (
            <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary">
              <User size={14} className="text-muted-foreground" />
            </div>
          )}
        </motion.div>
      ))}
    </AnimatePresence>
    {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
      <div className="flex gap-2.5">
        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Bot size={14} className="text-primary" />
        </div>
        <div className="rounded-2xl bg-secondary px-4 py-2.5">
          <Loader2 size={16} className="animate-spin text-muted-foreground" />
        </div>
      </div>
    )}
  </div>
);

const ChatInput = ({ input, setInput, isLoading, onSubmit }: {
  input: string;
  setInput: (v: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
}) => (
  <form
    onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
    className="flex items-center gap-2 border-t bg-background p-3"
  >
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Tapez votre question..."
      className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
      disabled={isLoading}
    />
    <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="rounded-full h-9 w-9">
      <Send size={16} />
    </Button>
  </form>
);

/** Sidebar version for the FAQ page - always visible */
export const FaqAiChatSidebar = () => {
  const { messages, input, setInput, isLoading, scrollRef, sendMessage } = useChat();

  return (
    <div className="sticky top-24">
      <div className="mb-4 flex items-center gap-2">
        <img src={chatBotLogo} alt="Assistant IA" className="h-8 w-8 rounded-full object-cover" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Assistant IA</h2>
          <p className="text-xs text-muted-foreground">Posez votre question</p>
        </div>
      </div>
      <div className="rounded-2xl border bg-card shadow-card overflow-hidden flex flex-col h-[500px]">
        <ChatMessages messages={messages} isLoading={isLoading} scrollRef={scrollRef} sendMessage={sendMessage} />
        <ChatInput input={input} setInput={setInput} isLoading={isLoading} onSubmit={() => sendMessage(input)} />
      </div>
    </div>
  );
};

/** Floating widget for all other pages */
export const AiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Don't show on FAQ (it has sidebar), admin, or client pages
  if (location.pathname === "/faq" || location.pathname.startsWith("/admin") || location.pathname.startsWith("/espace-client") || location.pathname === "/connexion" || location.pathname === "/reset-password") {
    return null;
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elevated hover:scale-105 transition-transform"
            aria-label="Ouvrir l'assistant IA"
          >
            <img src={chatBotLogo} alt="Assistant IA" className="h-9 w-9 rounded-full object-cover" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && <FloatingChatPanel onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

const FloatingChatPanel = ({ onClose }: { onClose: () => void }) => {
  const { messages, input, setInput, isLoading, scrollRef, sendMessage } = useChat();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl border bg-card shadow-elevated overflow-hidden flex flex-col"
      style={{ height: "min(500px, calc(100vh - 6rem))" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-primary/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Sparkles size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold">Assistant Déclic Digital</p>
            <p className="text-[11px] text-muted-foreground">Posez-nous votre question</p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-full p-1.5 hover:bg-secondary transition-colors" aria-label="Fermer">
          <X size={18} className="text-muted-foreground" />
        </button>
      </div>

      <ChatMessages messages={messages} isLoading={isLoading} scrollRef={scrollRef} sendMessage={sendMessage} />
      <ChatInput input={input} setInput={setInput} isLoading={isLoading} onSubmit={() => sendMessage(input)} />
    </motion.div>
  );
};

export default FaqAiChatSidebar;
