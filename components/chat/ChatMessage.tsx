import { motion } from "framer-motion";
import { Clipboard, RotateCw } from "lucide-react";
import { toast } from "sonner";

export function ChatMessage({
  role,
  content,
  timestamp,
  onRetry,
}: {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  onRetry?: () => void;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="flex max-w-[80%] flex-col gap-1">
        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className={`${
            isUser
              ? "bg-[#9B2D1F] text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          } rounded-2xl px-3 py-2 shadow-sm`}
        >
          <div className="whitespace-pre-wrap leading-relaxed text-base">
            {content}
          </div>
          {timestamp && (
            <div
              className={`mt-1 text-xs ${
                isUser ? "text-white/80" : "text-gray-500"
              }`}
            >
              {new Date(timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </motion.div>
        <div
          className={`flex items-center gap-3 ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          <button
            type="button"
            className={`text-xs inline-flex items-center gap-1 px-3 py-2 opacity-70 hover:opacity-100 ${
              isUser ? "text-gray-500" : "text-gray-600 dark:text-gray-300"
            }`}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(content);
                toast.success("Copied to clipboard");
              } catch {
                toast.error("Failed to copy");
              }
            }}
          >
            <Clipboard className="h-3.5 w-3.5" /> Copy
          </button>
          {onRetry && (
            <button
              type="button"
              className={`text-xs inline-flex items-center gap-1 px-3 py-2 opacity-70 hover:opacity-100 ${
                isUser ? "text-gray-500" : "text-gray-600 dark:text-gray-300"
              }`}
              onClick={() => onRetry?.()}
            >
              <RotateCw className="h-3.5 w-3.5" /> Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
