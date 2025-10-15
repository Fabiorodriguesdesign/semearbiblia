import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
// 1. IMPORTAÇÃO CORRIGIDA: Importando do novo pacote
import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { useToast } from '../contexts/ToastContext';

// 2. CORREÇÃO DA API KEY: Pegando a chave do ambiente Vite
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ChatView = () => {
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // A referência agora é para ChatSession, do novo SDK
    const chatRef = useRef<ChatSession | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const { language } = useLanguage();
    const { showToast } = useToast();
    
    // A inicialização do AI agora é feita com a chave do ambiente
    const ai = useMemo(() => new GoogleGenerativeAI(apiKey), [apiKey]);

    const initChat = useCallback(() => {
        // A criação do chat mudou ligeiramente com o novo SDK
        chatRef.current = ai.getGenerativeModel({ model: 'gemini-1.5-flash' })
            .startChat({
                systemInstruction: {
                    role: 'model',
                    parts: [{ text: translations.chat_system_instruction[language] }]
                },
            });
    }, [ai, language]);

    useEffect(() => {
        if (!apiKey) {
            console.error("VITE_GEMINI_API_KEY não foi encontrada. Crie um arquivo .env.local e adicione a variável.");
            showToast("A chave da API para o chat não está configurada.");
            setMessages([{ role: 'model', text: "Erro de configuração. O serviço de chat está indisponível." }]);
            return;
        }

        initChat();
        const startConversation = async () => {
            if (chatRef.current) {
                setIsLoading(true);
                setMessages([]);
                try {
                    const result = await chatRef.current.sendMessage(translations.chat_welcome_prompt[language]);
                    const response = result.response;
                    setMessages([{ role: 'model', text: response.text() }]);
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
    }, [language, initChat, showToast, apiKey]);

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
                const result = await chatRef.current.sendMessage(userMessage.text);
                const response = result.response;
                setMessages(prev => [...prev, { role: 'model', text: response.text() }]);
            } catch (error) {
                console.error("Error sending message:", error);
                setMessages(prev => [...prev, { role: 'model', text: translations.chat_error[language] }]);
                showToast(translations.error_generic[language]);
            } finally {
                setIsLoading(false);
            }
        }
    }, [input, isLoading, language, showToast, chatRef]);

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
