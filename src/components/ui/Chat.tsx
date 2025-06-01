import { ReceivedWebSocketMessage } from '@/hooks/useNotificationSocket';
import React from 'react';
import { Button } from './Button';
import { Input } from './Input';

type ChatProps = {
  messages: ReceivedWebSocketMessage[];
  userId: string;
  onSendMessage: () => void;
  enabled: boolean;
  message: string;
  setMessage: (message: string) => void;
};

export function Chat(props: ChatProps) {
  const { messages, userId, onSendMessage, enabled, message, setMessage } = props;
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  return (
    <main
      className='flex flex-col flex-1 p-8 pb-6 max-w-3xl w-full mx-auto'
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <div className='flex-1 overflow-y-auto mb-4 flex flex-col gap-4 border border-gray-300 rounded p-4 bg-white'>
        {messages?.length === 0 && (
          <p className='text-gray-500 text-center mt-4'>No messages yet</p>
        )}
        {messages?.map((message, index) => {
          const isOwnMessage = message.senderUser.id === userId;

          return (
            <div
              key={index}
              className={`p-2 rounded max-w-[70%] ${
                isOwnMessage
                  ? 'bg-blue-100 self-end text-right'
                  : 'bg-gray-100 self-start text-left'
              }`}
            >
              <div className='flex items-center gap-2'>
                <p className='flex-1 break-words'>
                  <strong>{message.senderUser.email}</strong>: {message.message}
                </p>
                <span className='text-gray-500 text-xs whitespace-nowrap ml-auto'>
                  {new Date(message.sentAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <form
        className='flex gap-2'
        onSubmit={(e) => {
          e.preventDefault();
          if (enabled && message?.trim() !== '') {
            setMessage('');
            onSendMessage();
          }
        }}
      >
        <Input
          type='text'
          placeholder='Type your message...'
          className='flex-1'
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          disabled={!enabled}
          autoComplete='off'
        />
        <Button type='submit' disabled={!enabled || message?.trim() === ''}>
          Send
        </Button>
      </form>
    </main>
  );
}
