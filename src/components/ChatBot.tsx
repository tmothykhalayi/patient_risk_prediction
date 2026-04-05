import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquareIcon, XIcon, SendIcon, SparklesIcon } from 'lucide-react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { resources } from './data/data'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

// Initialize Gemini AI
const getApiKey = (): string => {
  const envApiKey = import.meta.env?.VITE_GEMINI_API
  return envApiKey
}

const apiKey = getApiKey()
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null
const model = genAI
  ? genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  : null

// Generate AI response using Gemini
const generateAIResponse = async (
  userMessage: string,
  conversationHistory: Message[] = [],
): Promise<string> => {
  if (!model) {
    return "I'm currently unable to provide AI-powered responses. Please check that your API key is configured correctly."
  }

  try {
    // Build conversation context from history
    const historyContext = conversationHistory
      .slice(-6) // Last 6 messages for context
      .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n')

    const prompt = `
You are a compassionate and empathetic mental health assistant for DevSpace, a mental wellness platform designed specifically for developers and tech professionals.

Available resources:
${JSON.stringify(resources, null, 2)}

Conversation history:
${historyContext}

Current user message: "${userMessage}"

Guidelines:
- Be warm, supportive, and conversational
- Keep responses concise (2-4 sentences typically)
- Use emojis sparingly but effectively to add warmth 😊
- When appropriate, suggest one of these options:
  • Therapist search (if they seem distressed or need professional help)
  • Mental load dump (to help them vent and process feelings)
  • General supportive chat about their day
- Reference specific coping strategies or resources from the available data when relevant
- Validate their feelings and normalize developer-specific challenges
- Ask thoughtful follow-up questions to understand their situation better

Respond naturally and helpfully to their message:`

    const result = await model.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error('Error generating AI response:', error)
    return "I apologize, I'm having trouble connecting right now. 😔 Please try again in a moment. If this continues, you can still explore our mental wellness resources."
  }
}

const quickActions = [
  {
    label: 'Feeling burned out',
    topic: 'burnout',
  },
  {
    label: 'Imposter syndrome',
    topic: 'imposter',
  },
  {
    label: 'Work-life balance',
    topic: 'balance',
  },
  {
    label: 'Deployment anxiety',
    topic: 'anxiety',
  },
]

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your DevSpace AI companion. 👋 I'm here to provide support and understanding for the unique challenges you face as a developer. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      // Generate AI response with conversation history
      const aiResponse = await generateAIResponse(text.trim(), messages)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Error in handleSendMessage:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, something went wrong. Please try sending your message again.",
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickAction = async (topic: string) => {
    const actionLabel = quickActions.find((a) => a.topic === topic)?.label || ''
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: actionLabel,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    try {
      // Use AI to respond to quick action
      const aiResponse = await generateAIResponse(actionLabel, messages)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Error in handleQuickAction:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, something went wrong. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputValue)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0,
              opacity: 0,
            }}
            whileHover={{
              scale: 1.1,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-teal-600 text-white p-4 rounded-full shadow-2xl hover:bg-teal-700 transition-colors group"
          >
            <MessageSquareIcon className="w-6 h-6" />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
            />
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Chat with AI support
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Overlay */}
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Chat Container */}
            <motion.div
              initial={{
                opacity: 0,
                y: 100,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 100,
                scale: 0.9,
              }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
              }}
              className="fixed bottom-6 right-6 z-50 w-full md:w-96 h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden md:max-w-md mx-4 md:mx-0"
            >
              {/* Header */}
              <div className="bg-linear-to-r from-teal-600 to-teal-700 text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <SparklesIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Support Companion</h3>
                    <p className="text-xs text-teal-100">
                      Always here to listen
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.sender === 'user' ? 'bg-teal-600 text-white rounded-br-sm' : 'bg-white text-slate-800 rounded-bl-sm shadow-sm'}`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${message.sender === 'user' ? 'text-teal-100' : 'text-slate-400'}`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="flex justify-start"
                  >
                    <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                      <div className="flex space-x-2">
                        <motion.div
                          className="w-2 h-2 bg-slate-400 rounded-full"
                          animate={{
                            y: [0, -8, 0],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: 0,
                          }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-slate-400 rounded-full"
                          animate={{
                            y: [0, -8, 0],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: 0.1,
                          }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-slate-400 rounded-full"
                          animate={{
                            y: [0, -8, 0],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: 0.2,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              {messages.length === 1 && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.3,
                  }}
                  className="px-4 py-3 bg-white border-t border-slate-200"
                >
                  <p className="text-xs text-slate-600 mb-2 font-medium">
                    Quick topics:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action) => (
                      <button
                        key={action.topic}
                        onClick={() => handleQuickAction(action.topic)}
                        className="text-xs bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full hover:bg-teal-100 transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Input Area */}
              <form
                onSubmit={handleSubmit}
                className="p-4 bg-white border-t border-slate-200"
              >
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SendIcon className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Powered by Gemini AI ✨
                </p>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}