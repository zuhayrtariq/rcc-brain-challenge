import { motion } from "framer-motion";

export function DateSeparator({ label }: { label: string }) {
  return (
    <div className="relative my-6 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200 dark:border-gray-800" />
      </div>
      <motion.span
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
      >
        {label}
      </motion.span>
    </div>
  );
}
