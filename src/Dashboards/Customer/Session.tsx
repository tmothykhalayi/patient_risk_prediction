import { AlertCircle, Brain, ChevronLeft, MessageCircle, Moon, Send, Sunrise } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import generateAIResponse from "./bot";

export interface SessionContext {
  topics: string[];
  mood: string;
  stressLevel: number;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export type SessionType = "dump" | "morning" | "night" | "mindmap" | "chat" | "therapist" | null;

// Session Component
export const SessionChat = ({
  sessionType,
  onBack,
}: {
  sessionType: Exclude<SessionType, "therapist" | null>;
  onBack: () => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<SessionContext>({
    topics: [],
    mood: "neutral",
    stressLevel: 0,
  });

  const sessionConfig = {
    dump: {
      title: "Mental Load Dump",
      color: "from-purple-500 to-purple-600",
      icon: AlertCircle,
      initialMessage: "Hey, I'm here to listen. 💭 Whatever's on your mind, just let it out. No judgment, no advice unless you want it. What's weighing on you?",
    },
    morning: {
      title: "Morning Check-in",
      color: "from-amber-500 to-orange-600",
      icon: Sunrise,
      initialMessage: "Good morning! ☀️ How are you feeling as you start your day? What's on your mind for today?",
    },
    night: {
      title: "Night Reflection",
      color: "from-indigo-500 to-indigo-600",
      icon: Moon,
      initialMessage: "Evening! 🌙 How did your day go? Let's reflect on what happened and wind down together.",
    },
    mindmap: {
      title: "Code Logic Walk",
      color: "from-teal-500 to-teal-600",
      icon: Brain,
      initialMessage: "Hey there! 🧠 Got a tricky problem? Let's walk through it step by step. What are you working on?",
    },
    chat: {
      title: "Casual Chat",
      color: "from-blue-500 to-blue-600",
      icon: MessageCircle,
      initialMessage: "Hey! 💬 I'm here to chat about whatever you'd like. What's up?",
    },
  };

  const config = sessionConfig[sessionType];

useEffect(() => {
    setMessages([
      {
        id: "1",
        text: config.initialMessage,
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  }, [sessionType]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const { response, extractedContext } = await generateAIResponse(
        inputValue.trim(),
        sessionType,
        context
      );

      setContext((prev) => ({
        ...prev,
        ...extractedContext,
      }));

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Something went wrong. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className={`bg-linear-to-br ${config.color} p-2 rounded-lg`}>
              <config.icon className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-bold text-slate-800">{config.title}</h2>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-4 ${
                  message.sender === "user"
                    ? `bg-linear-to-br ${config.color} text-white shadow-lg`
                    : "bg-white text-slate-800 shadow-md border border-slate-200"
                }`}
              >
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.text}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.sender === "user" ? "text-white/70" : "text-slate-400"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white rounded-2xl px-5 py-4 shadow-md border border-slate-200">
                <div className="flex space-x-2">
                  {[0, 0.1, 0.2].map((delay, i) => (
                    <motion.div
                      key={i}
                      className="w-2.5 h-2.5 bg-teal-500 rounded-full"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="bg-white border-t border-slate-200 p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-5 py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className={`bg-linear-to-br ${config.color} text-white px-6 py-4 rounded-2xl hover:shadow-xl transition-all disabled:opacity-50`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-3 text-center">
            This session is temporary and confidential • Press Enter to send
          </p>
        </div>
      </div>
    </div>
  );
};