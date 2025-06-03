import React from 'react';

import { ChatInput } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useChat, UserContact } from '@/hooks';
import { useUserStore } from '@/stores';
import { XIcon } from '@/components/icons';

type ChatModalProps = {
  onClose: () => void;
  selectedContact?: UserContact;
};

export function ChatModal({ onClose, selectedContact }: ChatModalProps) {
  const [message, setMessage] = React.useState('');

  const { userData } = useUserStore();
  const { push } = useRouter();

  const { startNewChat } = useChat();

  async function onSubmit() {
    if (!userData || !selectedContact?.id) return;

    const createdChatId = await startNewChat({
      userId: userData.id as string,
      receiverId: selectedContact.user.id,
      message: message,
    }).catch((error) => console.error('Failed to start new chat:', error));

    push(`/chats/${createdChatId}`);
  }

  if (!selectedContact) {
    return null;
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn p-6'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-title'
    >
      <div
        className='relative bg-white rounded-xl shadow-xl p-6 max-w-lg w-full max-h-[60vh] overflow-y-auto animate-fadeIn animate-scaleUp'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label='Close modal'
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded'
        >
          <XIcon color='text-gray-500' />
        </button>

        <h3 id='modal-title' className='text-2xl font-semibold mb-6 text-blue-950'>
          Chat with {selectedContact?.user?.username}
        </h3>

        <ChatInput disabled={false} onSubmit={onSubmit} onType={setMessage} value={message} />
      </div>
    </div>
  );
}
