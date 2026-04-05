import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Brain,
  MessageCircle,
  AlertCircle,
  X,
  Home,
  Calendar,
  TrendingUp,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
} from "lucide-react";

// Define SessionType locally since Dashboards doesn't exist
type SessionType = "dump" | "mindmap" | "chat";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentSession?: SessionType | null;
  onSessionSelect: (session: SessionType) => void;
  onNavigate: (page: string) => void;
}

const quickSessions = [
  {
    type: "dump" as SessionType,
    icon: AlertCircle,
    label: "Mental Load Dump",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    emoji: "💭",
  },
  {
    type: "mindmap" as SessionType,
    icon: Brain,
    label: "Code Logic Walk",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    emoji: "🧠",
  },
  {
    type: "chat" as SessionType,
    icon: MessageCircle,
    label: "Casual Chat",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    emoji: "💬",
  },
];

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "insights", label: "Insights", icon: TrendingUp },
  { id: "reminders", label: "Reminders", icon: Bell },
];

export default function Sidebar({
  isOpen,
  onClose,
  currentSession,
  onSessionSelect,
  onNavigate,
}: SidebarProps) {
  const [activeNav, setActiveNav] = useState("dashboard");

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    onNavigate(id);
    onClose();
  };

  const handleSessionClick = (type: SessionType) => {
    onSessionSelect(type);
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -320,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed lg:relative z-50 w-80 h-screen bg-white border-r border-slate-200 shadow-xl lg:shadow-none flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-linear-to-br from-teal-500 to-teal-600 p-2.5 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-lg">DevSpace</h2>
                <p className="text-xs text-slate-500">Mental Health Hub</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Navigation */}
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Navigation
            </h3>
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeNav === item.id
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {activeNav === item.id && (
                    <ChevronRight className="w-4 h-4 text-teal-600" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Quick Sessions */}
          <div className="p-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Quick Sessions
            </h3>
            <div className="space-y-2">
              {quickSessions.map((session) => (
                <button
                  key={session.type}
                  onClick={() => handleSessionClick(session.type)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left group ${
                    currentSession === session.type
                      ? `${session.bgColor} ${session.color}`
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      currentSession === session.type
                        ? session.bgColor
                        : "bg-white"
                    }`}
                  >
                    <session.icon
                      className={`w-4 h-4 ${
                        currentSession === session.type
                          ? session.color
                          : "text-slate-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{session.label}</p>
                  </div>
                  <span className="text-lg">{session.emoji}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Burnout Status */}
          <div className="p-6 border-t mb-4 border-slate-200">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Burnout Status
            </h3>
            <div className="bg-linear-to-br from-green-50 to-teal-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">
                  Current Level
                </span>
                <span className="text-sm font-bold text-teal-600">Low</span>
              </div>
              <div className="w-full bg-white/50 rounded-full h-2 mb-3">
                <div
                  className="bg-linear-to-r from-green-500 to-teal-500 h-2 rounded-full"
                  style={{ width: "35%" }}
                />
              </div>
              <p className="text-xs text-slate-600">
                Keep up the great work! Your stress levels are well-managed.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 space-y-2">
          <button
            onClick={() => handleNavClick("settings")}
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </button>
          <button
            onClick={() => console.log("Logout")}
            className="w-full flex items-center space-x-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
