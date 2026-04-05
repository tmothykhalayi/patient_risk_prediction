import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendIcon, SparklesIcon, RefreshCwIcon, XIcon } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  sentiment?: "positive" | "negative" | "neutral";
  context?: string;
}

// Initialize Gemini AI
const getApiKey = (): string => {
  const envApiKey = import.meta.env?.VITE_GEMINI_API;
  return envApiKey;
};

const apiKey = getApiKey();
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI
  ? genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
  : null;

// Rate limiting helper
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests

// Sentiment analysis function
function analyzeSentiment(
  message: string
): "positive" | "negative" | "neutral" {
  const lowerMessage = message.toLowerCase();
  const positiveWords = [
    "good",
    "great",
    "happy",
    "better",
    "improve",
    "hope",
    "calm",
    "relaxed",
    "motivated",
    "excited",
    "productive",
    "accomplished",
    "proud",
  ];
  const negativeWords = [
    "sad",
    "depressed",
    "anxious",
    "worried",
    "stress",
    "bad",
    "afraid",
    "scared",
    "overwhelmed",
    "exhausted",
    "frustrated",
    "angry",
    "hopeless",
    "alone",
  ];

  let positiveScore = 0;
  let negativeScore = 0;

  positiveWords.forEach((word) => {
    if (lowerMessage.includes(word)) positiveScore++;
  });

  negativeWords.forEach((word) => {
    if (lowerMessage.includes(word)) negativeScore++;
  });

  if (positiveScore > negativeScore) return "positive";
  if (negativeScore > positiveScore) return "negative";
  return "neutral";
}

// Extract conversation context
function getConversationContext(messages: Message[]): string {
  if (!messages || messages.length === 0) return "initial";

  // Check last 4 messages for patterns
  const recentMessages = messages.slice(-4).map((m) => m.text.toLowerCase());

  if (
    recentMessages.some(
      (msg) =>
        msg.includes("anxiety") ||
        msg.includes("anxious") ||
        msg.includes("panic") ||
        msg.includes("worry") ||
        msg.includes("nervous")
    )
  ) {
    return "anxiety";
  }

  if (
    recentMessages.some(
      (msg) =>
        msg.includes("burnout") ||
        msg.includes("burned out") ||
        msg.includes("exhausted") ||
        msg.includes("overwhelmed")
    )
  ) {
    return "burnout";
  }

  if (
    recentMessages.some(
      (msg) =>
        msg.includes("imposter") ||
        msg.includes("not good enough") ||
        msg.includes("fraud") ||
        msg.includes("inadequate")
    )
  ) {
    return "imposter";
  }

  if (
    recentMessages.some(
      (msg) =>
        msg.includes("sad") ||
        msg.includes("depress") ||
        msg.includes("hopeless") ||
        msg.includes("down")
    )
  ) {
    return "depression";
  }

  if (
    recentMessages.some(
      (msg) =>
        msg.includes("sleep") ||
        msg.includes("tired") ||
        msg.includes("insomnia") ||
        msg.includes("rest")
    )
  ) {
    return "sleep";
  }

  if (
    recentMessages.some(
      (msg) =>
        msg.includes("deploy") ||
        msg.includes("production") ||
        msg.includes("deadline") ||
        msg.includes("release")
    )
  ) {
    return "deployment";
  }

  if (
    recentMessages.some(
      (msg) =>
        msg.includes("work life") ||
        msg.includes("balance") ||
        msg.includes("overwork") ||
        msg.includes("time off")
    )
  ) {
    return "work-life-balance";
  }

  return "general";
}

// Generate AI response using Gemini with sentiment and context
const generateAIResponse = async (
  userMessage: string,
  conversationHistory: Message[] = []
): Promise<string> => {
  if (!model) {
    return "I'm currently unable to provide AI-powered responses. Please check that your API key is configured correctly.";
  }

  try {
    // Rate limiting: wait if needed
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
    lastRequestTime = Date.now();

    // Analyze sentiment and context
    const sentiment = analyzeSentiment(userMessage);
    const context = getConversationContext(conversationHistory);

    // Build conversation context from history
    const historyContext = conversationHistory
      .slice(-4)
      .map(
        (msg) => `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`
      )
      .join("\n");

    // Context-specific guidance for the AI
    const contextGuidance: Record<string, string> = {
      anxiety:
        "User is experiencing anxiety. Offer grounding techniques, breathing exercises, or validation. Be calming and reassuring.",
      burnout:
        "User is experiencing developer burnout. Acknowledge the unique pressures of tech work, suggest boundaries, rest, or breaking tasks into smaller pieces.",
      imposter:
        "User has imposter syndrome. Normalize these feelings in developers, remind them that growth involves not knowing things, validate their skills.",
      depression:
        "User may be depressed. Be empathetic, suggest small achievable steps, validate their feelings, and gently suggest professional support if severe.",
      sleep:
        "User has sleep issues. Discuss sleep hygiene, reducing screen time, bedtime routines, or how stress affects sleep.",
      deployment:
        "User is stressed about deployments/releases. Normalize deployment anxiety, discuss coping strategies, preparation techniques.",
      "work-life-balance":
        "User struggling with work-life balance. Discuss boundaries, time management, self-care, and sustainable work practices.",
      general:
        "General mental health conversation. Be supportive and ask open-ended questions.",
    };

    const sentimentNote =
      sentiment === "positive"
        ? "User seems in a positive state - celebrate this and build on it."
        : sentiment === "negative"
        ? "User seems distressed - be extra compassionate and supportive."
        : "User seems neutral - explore their feelings gently.";

    const prompt = `You are a compassionate mental health assistant for DevSpace, supporting developers and tech professionals.

SENTIMENT DETECTED: ${sentiment.toUpperCase()}
${sentimentNote}

CONTEXT DETECTED: ${context}
${contextGuidance[context] || contextGuidance.general}

${historyContext ? `Recent conversation:\n${historyContext}\n` : ""}

User's current message: "${userMessage}"

Respond with empathy and relevance to their emotional state and situation. Be concise (2-4 sentences), use emojis sparingly. When appropriate, suggest:
- Unpack the reason and cause for worry (if severely distressed)
- Mental load dump (to help process feelings)
- Specific coping strategies relevant to their context
- General supportive conversation

Validate feelings and normalize developer-specific challenges.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    console.error("Error generating AI response:", error);

    // Handle rate limit error specifically
    if (
      error?.status === 429 ||
      error?.message?.includes("429") ||
      error?.message?.includes("quota")
    ) {
      return "I'm getting too many requests right now. 😅 Please wait a moment and try again. The free tier has rate limits.";
    }

    return "I apologize, I'm having trouble connecting right now. 😔 Please try again in a moment.";
  }
};

const quickActions = [
  {
    label: "Feeling burned out",
    topic: "burnout",
    emoji: "🔥",
  },
  {
    label: "Imposter syndrome",
    topic: "imposter",
    emoji: "🎭",
  },
  {
    label: "Work-life balance",
    topic: "balance",
    emoji: "⚖️",
  },
  {
    label: "Deployment anxiety",
    topic: "anxiety",
    emoji: "😰",
  },
  {
    label: "Team conflicts",
    topic: "conflict",
    emoji: "👥",
  },
  {
    label: "Career guidance",
    topic: "career",
    emoji: "🚀",
  },
];

export default function Conversation() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your DevSpace AI companion. 👋 I'm here to provide support and understanding for the unique challenges you face as a developer. How are you feeling today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    // Analyze sentiment and context before sending
    const sentiment = analyzeSentiment(text.trim());
    const context = getConversationContext(messages);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
      sentiment,
      context,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Generate AI response with conversation history
      const aiResponse = await generateAIResponse(text.trim(), messages);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, something went wrong. Please try sending your message again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (topic: string, label: string) => {
    if (isTyping) return;

    console.log(topic)

    const userMessage: Message = {
      id: Date.now().toString(),
      text: label,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setShowQuickActions(false); // Hide quick actions after selection

    try {
      // Use AI to respond to quick action
      const aiResponse = await generateAIResponse(label, messages);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error in handleQuickAction:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, something went wrong. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewConversation = () => {
    setMessages([
      {
        id: Date.now().toString(),
        text: "Hi! I'm your DevSpace AI companion. 👋 I'm here to provide support and understanding for the unique challenges you face as a developer. How are you feeling today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    setShowQuickActions(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-teal-50 flex flex-col">
      {/* Header */}
      <header
        className={`bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-6 shadow-sm flex flex-col align-middle justify-center items-center sticky top-0 z-10 rounded-2xl m-auto my-4 w-full max-w-3xl `}
      >
        <div
          className={`max-w-4xl mx-auto flex items-center justify-between gap-46  `}
        >
          <div className="flex items-center space-x-4">
            <div className="bg-linear-to-br from-teal-500 to-teal-600 p-3 rounded-2xl shadow-lg">
              <SparklesIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">DevSpace AI</h1>
              <p className="text-sm text-slate-600">
                Your mental wellness companion
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleNewConversation}
              className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-medium"
            >
              <RefreshCwIcon className="w-4 h-4" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } group`}
            >
              {/* AI Avatar */}
              {message.sender === "bot" && (
                <div className="shrink-0 mr-4 mt-1">
                  <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                    <SparklesIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}

              <div
                className={`max-w-[80%] md:max-w-[70%] ${
                  message.sender === "user" ? "order-1" : "order-2"
                }`}
              >
                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-6 py-4 shadow-sm transition-all duration-200 group-hover:shadow-md ${
                    message.sender === "user"
                      ? "bg-linear-to-br from-teal-600 to-teal-700 text-white ml-auto"
                      : "bg-white text-slate-800 border border-slate-200/60"
                  }`}
                >
                  <p
                    className={`leading-relaxed whitespace-pre-wrap ${
                      message.sender === "user"
                        ? "text-white"
                        : "text-slate-700"
                    }`}
                  >
                    {message.text}
                  </p>
                </div>

                {/* Timestamp */}
                <p
                  className={`text-xs mt-2 px-2 ${
                    message.sender === "user"
                      ? "text-slate-400 text-right"
                      : "text-slate-400"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* User Avatar Placeholder */}
              {message.sender === "user" && (
                <div className="shrink-0 mx-2 mt-1">
                  <div className="w-10 ml-4 h-10 bg-linear-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg">
                    <span> </span>
                    <span className="text-white text-sm font-semibold">
                      You
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              className="flex justify-start group"
            >
              {/* AI Avatar */}
              <div className="shrink-0 mr-4 mt-1">
                <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-200/60">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600 mr-2">
                    AI is thinking
                  </span>
                  <motion.div
                    className="w-2 h-2 bg-teal-500 rounded-full"
                    animate={{
                      y: [0, -8, 0],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      delay: 0,
                    }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-teal-500 rounded-full"
                    animate={{
                      y: [0, -8, 0],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      delay: 0.15,
                    }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-teal-500 rounded-full"
                    animate={{
                      y: [0, -8, 0],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      delay: 0.3,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      <AnimatePresence>
        {showQuickActions && messages.length <= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-6 pb-4"
          >
            <div className="max-w-4xl mx-auto mt-10">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/60 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                    <SparklesIcon className="w-4 h-4 text-teal-600" />
                    <span>Quick Topics</span>
                  </h3>
                  <button
                    onClick={() => setShowQuickActions(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.topic}
                      onClick={() =>
                        handleQuickAction(action.topic, action.label)
                      }
                      disabled={isTyping}
                      className="flex items-center space-x-2 px-3 py-2.5 bg-linear-to-r from-slate-50 to-slate-100 hover:from-teal-50 hover:to-teal-100 rounded-xl transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm border border-slate-200/50 hover:border-teal-200/60"
                    >
                      <span className="text-lg">{action.emoji}</span>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-teal-700 truncate">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-slate-200/60 p-6 shadow-lg sticky bottom-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setShowQuickActions(false)}
                placeholder="Share what's on your mind..."
                className="w-full px-6 py-4 pr-12 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-[15px] transition-all bg-white shadow-sm"
                disabled={isTyping}
              />
              {!showQuickActions && messages.length > 1 && (
                <button
                  type="button"
                  onClick={() => setShowQuickActions(true)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-slate-400 hover:text-teal-600 transition-colors"
                >
                  <SparklesIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="bg-linear-to-br from-teal-600 to-teal-700 text-white px-6 py-4 rounded-2xl hover:from-teal-700 hover:to-teal-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
            <p>Your conversations are private and powered by Gemini AI</p>
            <p className="hidden sm:block">Press Enter to send</p>
          </div>
        </form>
      </div>
    </div>
  );
}
