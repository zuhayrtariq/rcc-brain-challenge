"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ArrowDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { DateSeparator } from "@/components/chat/DateSeparator";
import { toast } from "sonner";
import { startChatStream } from "@/lib/sse-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export default function ChatPage() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const assistantIdRef = useRef<string | null>(null);
  const wordQueueRef = useRef<string[]>([]);
  const intervalRef = useRef<number | null>(null);
  const streamingDoneRef = useRef<boolean>(false);
  const [now, setNow] = useState<Date>(new Date());
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
  const hasProcessedInitialRef = useRef<boolean>(false);

  const initialMessage = useMemo(
    () => searchParams.get("q") || "",
    [searchParams]
  );

  useEffect(() => {
    if (
      initialMessage &&
      messages.length === 0 &&
      !hasProcessedInitialRef.current
    ) {
      hasProcessedInitialRef.current = true;
      handleSend(initialMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage]);

  useEffect(() => {
    // Auto-scroll to bottom when new content arrives only if user is at bottom
    if (isAtBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isStreaming, isAtBottom]);

  useEffect(() => {
    // Observe bottom sentinel visibility for robust at-bottom tracking
    const rootEl = listRef.current;
    const target = bottomRef.current;
    if (!rootEl || !target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsAtBottom(entry.isIntersecting);
      },
      { root: rootEl, threshold: 1.0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) {
        return;
      }

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => {
        return [...prev, userMessage];
      });
      setIsStreaming(true);
      assistantIdRef.current = null;
      wordQueueRef.current = [];
      streamingDoneRef.current = false;

      const startWordInterval = () => {
        if (intervalRef.current != null) return;
        intervalRef.current = window.setInterval(() => {
          const next = wordQueueRef.current.shift();
          if (next != null) {
            if (!assistantIdRef.current) {
              const newId = crypto.randomUUID();
              assistantIdRef.current = newId;
              setMessages((prev) => [
                ...prev,
                {
                  id: newId,
                  role: "assistant",
                  content: next,
                  timestamp: new Date().toISOString(),
                },
              ]);
            } else {
              const id = assistantIdRef.current;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === id ? { ...m, content: m.content + next } : m
                )
              );
            }
          } else if (streamingDoneRef.current) {
            if (intervalRef.current != null) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }, 24);
      };

      try {
        await startChatStream({
          message: trimmed,
          onStart: () => {},
          onChunk: (chunk) => {
            const tokens = chunk.match(/\S+|\s+/g) ?? [chunk];
            wordQueueRef.current.push(...tokens);
            startWordInterval();
          },
          onComplete: () => {
            streamingDoneRef.current = true;
            setIsStreaming(false);
          },
          onError: (errorMessage) => {
            setIsStreaming(false);
            toast.error("Error", {
              description:
                errorMessage || "Something went wrong while streaming.",
            });
          },
        });
      } catch (err) {
        setIsStreaming(false);
        toast.error("Network Error", {
          description: err instanceof Error ? err.message : "Unknown error",
        });
      }
    },
    [isStreaming]
  );

  useEffect(() => {
    return () => {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex h-[100dvh] flex-col bg-gray-200 dark:bg-black">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link href={"/"} className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#9B2D1F] to-[#7A241A] flex items-center justify-center text-white"
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                RCC Brain
              </div>
              <div className="text-xs text-gray-500 ">OUAF Assistant</div>
            </div>
          </Link>
          <div className="text-xs text-gray-500">
            Streaming via /api/chat ·{" "}
            {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4">
        <div
          ref={listRef}
          className="relative pt-6 pb-32 px-6 overflow-y-auto h-full"
          onScroll={(e) => {
            const el = e.currentTarget;
            const threshold = 32; // px from bottom considered "at bottom"
            const atBottom =
              el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
            setIsAtBottom(atBottom);
          }}
        >
          {messages.length === 0 ? (
            <div className="mt-20 flex flex-col items-center gap-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-lg text-gray-600 dark:text-gray-400"
              >
                Ask me about OUAF docs or pick a suggestion to get started
              </motion.div>
              <div className="grid w-full max-w-xl grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  "Summarize recent OUAF doc changes",
                  "Explain this OUAF code snippet",
                  "Brainstorm implementation approaches",
                  "What is the status of module X?",
                ].map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    onClick={() => handleSend(s)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.flatMap((m, idx, arr) => {
                const isLast = idx === messages.length - 1;
                const canRetry = m.role === "user" && (!isStreaming || !isLast);
                const onRetry = canRetry
                  ? () => {
                      // Re-send this user's message
                      const text = m.content;
                      if (text) {
                        handleSend(text);
                      }
                    }
                  : undefined;
                const items: React.ReactNode[] = [];
                const prev = arr[idx - 1];
                const prevDay = prev
                  ? new Date(prev.timestamp).toDateString()
                  : "";
                const thisDay = new Date(m.timestamp).toDateString();
                if (idx === 0 || thisDay !== prevDay) {
                  const label = (() => {
                    const today = new Date().toDateString();
                    const yesterday = new Date(
                      Date.now() - 86400000
                    ).toDateString();
                    if (thisDay === today) return "Today";
                    if (thisDay === yesterday) return "Yesterday";
                    return new Date(m.timestamp).toLocaleDateString();
                  })();
                  items.push(
                    <DateSeparator key={`sep-${m.id}`} label={label} />
                  );
                }
                items.push(
                  <ChatMessage
                    key={m.id}
                    role={m.role}
                    content={m.content}
                    timestamp={m.timestamp}
                    onRetry={onRetry}
                  />
                );
                return items;
              })}
              {isStreaming && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/40">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <ChatInput
            onSend={handleSend}
            disabled={isStreaming}
            placeholder="Ask about OUAF docs…"
          />
        </div>
      </div>

      {!isAtBottom && messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-28 right-5 z-20"
        >
          <Button
            type="button"
            variant="secondary"
            className="shadow-lg border-2"
            onClick={() =>
              bottomRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
              })
            }
          >
            <ArrowDown className="mr-2 h-4 w-4" /> Jump to latest
          </Button>
        </motion.div>
      )}
    </div>
  );
}
