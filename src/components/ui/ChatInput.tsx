import { Button } from './Button';
import { Input } from './Input';

type ChatInputProps = {
  disabled: boolean;
  onSubmit: () => Promise<void>;
  onType: (message: string) => void;
  value: string;
};

export function ChatInput({ disabled, onSubmit, onType, value }: ChatInputProps) {
  async function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!disabled && value?.trim() !== '') {
      await onSubmit();
    }
    onType('');
  }

  return (
    <form className='flex gap-2' onSubmit={onFormSubmit}>
      <Input
        type='text'
        placeholder='Type your message...'
        className='flex-1'
        onChange={(e) => onType(e.target.value)}
        value={value}
        disabled={disabled}
        autoComplete='off'
      />
      <Button type='submit' disabled={disabled || value?.trim() === ''}>
        Send
      </Button>
    </form>
  );
}
