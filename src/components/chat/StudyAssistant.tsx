'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  BookOpen, 
  Brain,
  Lightbulb,
  Code,
  Calculator,
  Database,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  MessageCircle,
  Copy,
  ThumbsUp,
  RefreshCw
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

interface StudyAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const QUICK_PROMPTS = [
  { 
    icon: Brain, 
    text: "Explain machine learning algorithms", 
    topic: "ML", 
    gradient: "from-purple-500 to-pink-500",
    bg: "bg-purple-50",
    border: "border-purple-200",
    textColor: "text-purple-700"
  },
  { 
    icon: Calculator, 
    text: "Help with statistics concepts", 
    topic: "Stats", 
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    textColor: "text-blue-700"
  },
  { 
    icon: Code, 
    text: "Python programming questions", 
    topic: "Programming", 
    gradient: "from-green-500 to-emerald-500",
    bg: "bg-green-50",
    border: "border-green-200",
    textColor: "text-green-700"
  },
  { 
    icon: Database, 
    text: "SQL queries and databases", 
    topic: "Database", 
    gradient: "from-orange-500 to-red-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    textColor: "text-orange-700"
  },
  { 
    icon: BookOpen, 
    text: "Study tips and methods", 
    topic: "Study", 
    gradient: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
    border: "border-pink-200",
    textColor: "text-pink-700"
  },
  { 
    icon: Lightbulb, 
    text: "Project ideas and guidance", 
    topic: "Projects", 
    gradient: "from-yellow-500 to-amber-500",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    textColor: "text-yellow-700"
  }
];

export default function StudyAssistant({ isOpen, onToggle, onClose }: StudyAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI Study Assistant. I'm here to help you with your Data Science studies, programming questions, assignments, and academic guidance. What would you like to learn about today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      content: '...',
      sender: 'assistant',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const token = localStorage.getItem('token');
      const conversationHistory = messages
        .filter(m => !m.isTyping)
        .map(m => ({
          [m.sender === 'user' ? 'user' : 'assistant']: m.content
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: message.trim(),
          conversationHistory
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message,
          sender: 'assistant',
          timestamp: new Date()
        };

        setMessages(prev => prev.filter(m => m.id !== 'typing').concat(assistantMessage));
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error. Please try again or check your connection.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => prev.filter(m => m.id !== 'typing').concat(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatMessageContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-2">
        {lines.map((line, index) => {
          if (line.trim().startsWith('```') && line.trim().endsWith('```')) {
            const code = line.replace(/```/g, '');
            return (
              <div key={index} className="relative group">
                <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-sm overflow-x-auto font-mono">
                  <code>{code}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(code)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 hover:bg-gray-600 text-white p-1 rounded text-xs"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            );
          }
          if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
            return (
              <div key={index} className="font-semibold text-gray-900 my-2">
                {line.replace(/\*\*/g, '')}
              </div>
            );
          }
          if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
            return (
              <div key={index} className="flex items-start gap-2 my-1">
                <span className="text-blue-500 mt-1.5 text-xs">•</span>
                <span className="leading-relaxed">{line.replace(/^[-•]\s*/, '')}</span>
              </div>
            );
          }
          return <div key={index} className="leading-relaxed">{line || '\u00A0'}</div>;
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`fixed z-50 bg-white shadow-2xl transition-all duration-300 ${
        isMinimized 
          ? 'bottom-4 right-4 w-80 h-16 rounded-2xl border border-gray-200' 
          : 'bottom-4 right-4 w-[400px] h-[700px] rounded-2xl border border-gray-200 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center min-w-0 flex-1">
          <div className="bg-white/20 p-2 rounded-xl mr-3 backdrop-blur-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base truncate">AI Study Assistant</h3>
            {!isMinimized && (
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <p className="text-xs opacity-90 truncate">Online & Ready to Help</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
            aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex flex-col h-[656px]">
          {/* Messages Container - FIXED HEIGHT WITH PROPER SCROLLING */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto scroll-smooth p-4 space-y-4"
            style={{ height: 'calc(100% - 140px)' }}
          >
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-3' 
                        : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 mr-3'
                    }`}>
                      {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    
                    <motion.div 
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className={`relative group p-4 rounded-2xl shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'bg-gray-50 text-gray-800 border border-gray-100'
                      }`}
                    >
                      {message.isTyping ? (
                        <div className="flex items-center space-x-2 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="text-sm text-gray-500">AI is thinking...</span>
                        </div>
                      ) : (
                        <>
                          <div className="text-sm leading-relaxed">
                            {formatMessageContent(message.content)}
                          </div>
                          {message.sender === 'assistant' && (
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => copyToClipboard(message.content)}
                                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <Copy className="w-3 h-3" />
                                Copy
                              </button>
                              <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
                                <ThumbsUp className="w-3 h-3" />
                                Helpful
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 pb-4 border-t border-gray-100"
            >
              <div className="flex items-center mb-3 pt-3">
                <Sparkles className="w-4 h-4 text-blue-500 mr-2" />
                <p className="text-sm text-gray-600 font-medium">Quick Start</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_PROMPTS.slice(0, 4).map((prompt, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickPrompt(prompt.text)}
                    className={`flex items-center p-3 text-xs rounded-xl transition-all hover:shadow-lg border-2 ${prompt.bg} ${prompt.border} ${prompt.textColor} group`}
                  >
                    <div className={`bg-gradient-to-r ${prompt.gradient} p-2 rounded-lg mr-2 group-hover:scale-110 transition-transform`}>
                      <prompt.icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-left font-medium leading-tight">{prompt.text}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Input Section - FIXED AT BOTTOM */}
          <div className="border-t border-gray-100 p-4 bg-white rounded-b-2xl">
            <form onSubmit={handleSubmit} className="flex items-end gap-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything about your studies..."
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all"
                  disabled={isLoading}
                />
              </div>
              
              <motion.button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-3 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg disabled:shadow-none flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            </form>
            
            <div className="flex items-center justify-center mt-3">
              <div className="flex items-center text-xs text-gray-400 gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Powered by Gemini AI</span>
                </div>
                <span>•</span>
                <span>Always verify important information</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
} 