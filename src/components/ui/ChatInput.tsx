import { Button } from './Button';

type ChatInputProps = {
  disabled: boolean;
  onSubmit: () => void;
  onType: (message: string) => void;
  value: string;
};

export function ChatInput({ disabled, onSubmit, onType, value }: ChatInputProps) {
  function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!disabled && value?.trim() !== '') {
      onSubmit();
    }
    onType('');
  }

  return (
    <form className='flex gap-2' onSubmit={onFormSubmit}>
      <input
        type='text'
        placeholder='Type your message...'
        className='flex-1 border border-gray-300 rounded px-4 py-2 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500'
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
