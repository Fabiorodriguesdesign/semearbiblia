import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { useToast } from '../contexts/ToastContext';

const ChatView = () => {
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const { language } = useLanguage();
    const { showToast } = useToast();
    
    const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);

    const initChat = useCallback(() => {
        chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: translations.chat_system_instruction[language],
            },
        });
    }, [ai, language]);

    useEffect(() => {
        initChat();
        const startConversation = async () => {
            if (chatRef.current) {
                setIsLoading(true);
                setMessages([]);
                try {
                    const response = await chatRef.current.sendMessage({ message: translations.chat_welcome_prompt[language] });
                    setMessages([{ role: 'model', text: response.text }]);
                } catch (error) {
                    console.error("Error starting chat:", error);
                    setMessages([{ role: 'model', text: translations.chat_error[language] }]);
                    showToast(translations.error_generic[language]);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        startConversation();
    }, [language, initChat, showToast]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user' as const, text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        if (chatRef.current) {
            try {
                const response = await chatRef.current.sendMessage({ message: userMessage.text });
                setMessages(prev => [...prev, { role: 'model', text: response.text }]);
            } catch (error) {
                console.error("Error sending message:", error);
                setMessages(prev => [...prev, { role: 'model', text: translations.chat_error[language] }]);
                showToast(translations.error_generic[language]);
            } finally {
                setIsLoading(false);
            }
        }
    }, [input, isLoading, language, showToast]);

    return (
        <div className="chat-view-container">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message-wrapper ${msg.role}`}>
                        <div className={`chat-bubble ${msg.role}`}>
                            {msg.role === 'model' && <div className="chat-bubble-header">{translations.nav_chat[language]}</div>}
                            <p>{msg.text}{isLoading && msg.role === 'model' && index === messages.length - 1 && <span className="typing-cursor"></span>}</p>
                        </div>
                    </div>
                ))}
                 {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                    <div className="chat-message-wrapper model">
                        <div className="chat-bubble model">
                            <div className="chat-bubble-header">{translations.nav_chat[language]}</div>
                            <p><span className="typing-cursor"></span></p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={translations.chat_input_placeholder[language].replace('{chatBotName}', translations.nav_chat[language])}
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()} aria-label={translations.send_message_aria[language]}>
                    <i className="material-icons">send</i>
                </button>
            </form>
        </div>
    );
};

export default ChatView;