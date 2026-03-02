import { useState, FormEvent } from 'react';
import { Button, Input } from '@/src/ui-kit';
import { SendHorizontal } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex-1">
        <Input
          placeholder="Ask anything..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          className="pr-12"
        />
      </div>
      <Button 
        type="submit" 
        disabled={!value.trim() || disabled}
        className="h-[42px] w-[42px] p-0 shrink-0"
      >
        <SendHorizontal className="w-5 h-5" />
      </Button>
    </form>
  );
};
