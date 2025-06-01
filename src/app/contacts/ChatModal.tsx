import { ChatInput } from '@/components/ui';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useChat, UserContact } from '@/hooks';
import { useUserStore } from '@/stores';

type ChatModalProps = {
  onClose: () => void;
  selectedContact?: UserContact;
};

export function ChatModal({ onClose, selectedContact }: ChatModalProps) {
  const { userData } = useUserStore();
  const [message, setMessage] = React.useState('');
  const { push } = useRouter();

  const { startNewChat } = useChat();

  async function onSubmit() {
    if (!userData || !selectedContact?.id) return;

    const createdChatId = await startNewChat({
      userId: userData.id as string,
      receiverId: selectedContact.user.id,
      message: message,
    }).catch((error) => {
      console.error('Failed to start new chat:', error);
    });

    push(`/users/${userData.id}/chats/${createdChatId}`);
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
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>

        <h3 id='modal-title' className='text-2xl font-semibold mb-6 text-blue-950'>
          Chat with {selectedContact?.user?.username}
        </h3>

        <ChatInput disabled={false} onSubmit={onSubmit} onType={setMessage} value={message} />
      </div>
    </div>
  );
}
