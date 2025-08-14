"use client";

import { useCallback, useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function ChatInput({
  onSend,
  disabled,
  placeholder,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Ensure textarea and button have the same height
  useLayoutEffect(() => {
    if (textareaRef.current && buttonRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto";
      // Set textarea height to its scrollHeight, but at least 40px (h-10)
      const newHeight = Math.max(textareaRef.current.scrollHeight, 40);
      textareaRef.current.style.height = `${newHeight}px`;
      // Set button height to match textarea, minus 2px to avoid overflow
      buttonRef.current.style.height = `${newHeight - 2}px`;
      buttonRef.current.style.minHeight = `${newHeight - 2}px`;
      buttonRef.current.style.maxHeight = `${newHeight - 2}px`;
      buttonRef.current.style.paddingTop = "0";
      buttonRef.current.style.paddingBottom = "0";
    }
  }, [value]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!value.trim() || disabled) return;
      onSend(value);
      setValue("");
    },
    [value, onSend, disabled]
  );

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex items-center gap-2"
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder || "Type your message"}
        className="flex-1 resize-none max-h-40 min-h-[40px] leading-6 text-base px-4 py-4"
        rows={1}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
          }
          if (e.key === "Escape") {
            e.preventDefault();
            setValue("");
          }
        }}
        disabled={disabled}
        style={{ overflow: "hidden" }}
      />
      <Button
        ref={buttonRef}
        type="submit"
        disabled={disabled}
        className="px-3 py-2 rounded-lg flex items-center justify-center text-sm"
      >
        <Send className="h-5 w-5" />
        <span className="sr-only">Send</span>
      </Button>
    </motion.form>
  );
}
