"use client"

import { Bot } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import OpenRouterChat from "@/components/chat/OpenRouterChat"

export default function OpenRouterChatPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Bot className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">OpenRouter Civil Engineering Assistant</h1>
          </div>
          <OpenRouterChat />
        </div>
      </main>
      <Footer />
    </div>
  )
} 