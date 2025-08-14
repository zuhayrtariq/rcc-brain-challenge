import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-2 shadow-sm"
      >
        <span className="sr-only">Assistant is typing</span>
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:0ms]"></span>
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:150ms]"></span>
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:300ms]"></span>
      </motion.div>
    </div>
  );
}
