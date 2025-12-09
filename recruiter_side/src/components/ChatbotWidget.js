/**
 * @file ChatbotWidget.js
 * @description AI-powered recruitment assistant chatbot widget
 * @keywords chatbot, ai, assistant, gemini, intern-saathi, chat, bot, help
 * 
 * Search tags:
 * - chat: chatbot interface, messaging
 * - ai: AI responses, Gemini integration
 * - assistant: recruitment helper, Q&A
 * - widget: floating widget, popup
 * - message: send message, receive response
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Minimize2 } from 'lucide-react';

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your recruitment assistant. Ask me about candidates, interviews, or applicants.", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userMessage.text })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: data.answer,
                sender: 'bot'
            }]);
        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "I'm encountering an issue connecting to my AI brain. Please try again in a moment.",
                sender: 'bot'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Chat Window */}
            <div
                className={`absolute bottom-20 right-0 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 origin-bottom-right flex flex-col ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none translate-y-4'
                    }`}
                style={{ height: '500px' }}
            >
                {/* Header */}
                <div className="bg-primary px-4 py-3 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <h3 className="font-semibold">Recruitment Assistant</h3>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <Minimize2 size={18} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                    ? 'bg-primary text-white rounded-br-none'
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask about candidates..."
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-gray-900"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isTyping}
                            className="p-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 ${isOpen ? 'bg-gray-200 text-gray-600 rotate-90' : 'bg-primary text-white hover:bg-orange-600'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </div>
    );
}
