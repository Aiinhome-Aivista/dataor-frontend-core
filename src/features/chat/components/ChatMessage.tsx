import { Message } from '../types';
import { motion } from 'motion/react';

interface ChatMessageProps {
  message: Message;
  key?: string | number;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div
        className={`
          max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isAssistant 
            ? 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] rounded-tl-none' 
            : 'bg-[var(--accent)] text-white rounded-tr-none shadow-lg shadow-[var(--accent)]/10'}
        `}
      >
        {message.content}
        <div 
          className={`
            text-[10px] mt-1 opacity-50 
            ${isAssistant ? 'text-[var(--text-secondary)]' : 'text-white/80'}
          `}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
};
