import { useState, useCallback, useRef, useEffect } from 'react';
import { Message } from '../types';

export type ChatMode = 'landing' | 'workflow' | 'chat';

export const useChat = () => {
  const [mode, setMode] = useState<ChatMode>('landing');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, mode, scrollToBottom]);

  const startWorkflow = useCallback(() => {
    setMode('workflow');
  }, []);

  const startChat = useCallback(() => {
    setMode('chat');
    setMessages([
      {
        id: 'init-1',
        role: 'assistant',
        content: `Great! I've successfully connected to your data and synchronized the environment. How can I help you analyze this information today?`,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const completeWorkflow = useCallback(() => {
    startChat(); // Start chat directly after workflow
  }, [startChat]);

  const sendMessage = useCallback(async (content: string) => {
    if (mode !== 'chat') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I've analyzed the data based on your query: "${content}". Here are the insights I've found...`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  }, [mode]);

  return {
    messages,
    sendMessage,
    isLoading,
    scrollRef,
    mode,
    completeWorkflow,
    startChat,
    startWorkflow,
  };
};
