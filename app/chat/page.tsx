"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Send, Bot, User, Loader2, Download } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your Civil Engineering AI assistant powered by LLaMA 3.2. Ask me any civil engineering question, and I'll do my best to help you.",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please make sure the AI server is running and try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const downloadChatPDF = async () => {
    try {
      setIsLoading(true)
      
      // Create a temporary div to hold the chat content
      const tempDiv = document.createElement('div')
      tempDiv.className = 'p-4 bg-white dark:bg-gray-900'
      
      // Add title
      const title = document.createElement('h1')
      title.className = 'text-2xl font-bold mb-4 text-center'
      title.textContent = 'Civil Engineering Chat History'
      tempDiv.appendChild(title)
      
      // Add date
      const date = document.createElement('p')
      date.className = 'text-sm text-gray-500 dark:text-gray-400 mb-6 text-center'
      date.textContent = `Generated on: ${new Date().toLocaleString()}`
      tempDiv.appendChild(date)
      
      // Add messages
      messages.forEach((message, index) => {
        const messageDiv = document.createElement('div')
        messageDiv.className = `mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`
        
        const role = document.createElement('p')
        role.className = 'text-sm font-semibold mb-1'
        role.textContent = message.role === 'user' ? 'You' : 'AI Assistant'
        messageDiv.appendChild(role)
        
        const content = document.createElement('div')
        content.className = `inline-block p-3 rounded-lg ${
          message.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'
        }`
        content.innerHTML = message.content.replace(/\n/g, '<br>')
        messageDiv.appendChild(content)
        
        tempDiv.appendChild(messageDiv)
      })

      // Add footer with creator info
      const footer = document.createElement('div')
      footer.className = 'mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center'
      
      const creatorText = document.createElement('p')
      creatorText.className = 'text-sm text-gray-500 dark:text-gray-400'
      creatorText.innerHTML = 'Created by <a href="https://github.com/obsidianspecter" class="text-primary hover:underline">obsidianspecter</a>'
      footer.appendChild(creatorText)
      
      tempDiv.appendChild(footer)
      
      // Add to document
      document.body.appendChild(tempDiv)
      
      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true
      })
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      
      // Clean up
      document.body.removeChild(tempDiv)
      
      // Save PDF
      pdf.save('civil-engineering-chat-history.pdf')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container px-4 sm:px-6 py-4 sm:py-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Civil Engineering AI Chatbot</h1>
            <Button 
              onClick={downloadChatPDF} 
              variant="outline" 
              size="sm"
              disabled={isLoading || messages.length <= 1}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download Chat</span>
            </Button>
          </div>
          <Card className="mb-4">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4 mb-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex items-start gap-3 max-w-[90%] sm:max-w-[80%] ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      } rounded-lg px-3 sm:px-4 py-2 sm:py-3`}
                    >
                      <div className="mt-1">
                        {message.role === "user" ? <User className="h-4 w-4 sm:h-5 sm:w-5" /> : <Bot className="h-4 w-4 sm:h-5 sm:w-5" />}
                      </div>
                      <div className="prose dark:prose-invert prose-sm max-w-full">
                        {message.content.split("\n").map((line, i) => {
                          if (line.startsWith("# ")) {
                            return (
                              <h2 key={i} className="text-base sm:text-lg font-bold mt-2 mb-1">
                                {line.substring(2)}
                              </h2>
                            )
                          } else if (line.startsWith("### ")) {
                            return (
                              <h3 key={i} className="text-sm sm:text-base font-semibold mt-2 mb-1">
                                {line.substring(4)}
                              </h3>
                            )
                          } else if (line.startsWith("- ")) {
                            return (
                              <li key={i} className="ml-4 text-sm sm:text-base">
                                {line.substring(2)}
                              </li>
                            )
                          } else if (line === "") {
                            return <br key={i} />
                          } else {
                            return (
                              <p key={i} className="mb-1 text-sm sm:text-base">
                                {line}
                              </p>
                            )
                          }
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a civil engineering question..."
                  className="min-h-[50px] sm:min-h-[60px] flex-1 text-sm sm:text-base"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />
                <Button type="submit" size="icon" disabled={isLoading} className="h-10 w-10 sm:h-12 sm:w-12">
                  {isLoading ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : <Send className="h-4 w-4 sm:h-5 sm:w-5" />}
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="text-xs sm:text-sm text-muted-foreground">
            <p>Example questions:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Explain the differences between M25 and M30 grade concrete</li>
              <li>
                Calculate the maximum bending moment for a simply supported beam of span 6m carrying a UDL of 20 kN/m
              </li>
              <li>
                Estimate the safe bearing capacity for sandy soil with plate load test value of 200 kN/m² and footing
                width 1.5m
              </li>
              <li>From IS:456, explain the minimum reinforcement required for an RCC slab</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
