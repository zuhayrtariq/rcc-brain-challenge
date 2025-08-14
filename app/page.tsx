"use client";

import { motion } from "framer-motion";
import { IntentCard } from "@/components/home/IntentCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageSquare, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#9B2D1F] to-[#7A241A] flex items-center justify-center shadow-xl">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            RCC Brain
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your intelligent OUAF assistant. Ask questions, get insights, and
            explore documentation with AI-powered conversations.
          </p>

          {/* Quick Start Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-lg mx-auto mb-12"
          >
            <form
              action="/chat"
              className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <Input
                name="q"
                type="text"
                placeholder="Ask me anything about OUAF..."
                className="flex-1 border-0 bg-transparent focus:ring-0 text-base"
              />
              <Button type="submit" className="rounded-xl px-6">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </form>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center gap-8 mb-16"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ⚡
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Real-time streaming
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                🎯
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                OUAF specialized
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                🚀
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Always available
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Intent Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            Popular conversations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <IntentCard
              title="📚 Summarize Document"
              prompt="Summarize this OUAF document for me"
              description="Get quick summaries of OUAF documentation"
              icon={<span className="text-lg">📚</span>}
            />
            <IntentCard
              title="📊 Project Status"
              prompt="What's the current status of the OUAF implementation?"
              description="Check progress and updates on OUAF projects"
              icon={<span className="text-lg">📊</span>}
            />
            <IntentCard
              title="💻 Explain Code"
              prompt="Help me understand this OUAF code snippet"
              description="Get explanations for OUAF code and functions"
              icon={<span className="text-lg">💻</span>}
            />
            <IntentCard
              title="💡 Brainstorm Ideas"
              prompt="Brainstorm implementation approaches for this OUAF feature"
              description="Explore different ways to implement features"
              icon={<span className="text-lg">💡</span>}
            />
            <IntentCard
              title="❓ Technical Q&A"
              prompt="I have a technical question about OUAF"
              description="Ask detailed technical questions"
              icon={<span className="text-lg">❓</span>}
            />
            <IntentCard
              title="🔍 Deep Dive"
              prompt="Give me a deep dive into OUAF architecture"
              description="Explore OUAF architecture in detail"
              icon={<span className="text-lg">🔍</span>}
            />
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-[#9B2D1F] to-[#7A241A] rounded-3xl p-8 text-white">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-lg opacity-90 mb-6">
              Jump into a conversation and experience AI-powered OUAF assistance
            </p>
            <Button
              asChild
              variant="secondary"
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-xl"
            >
              <a href="/chat">Start chatting now →</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
