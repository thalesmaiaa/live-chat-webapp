import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui';
import { UserChat } from '@/@types';

export function ChatPreview(chat: UserChat) {
  const { push } = useRouter();
  const { name, chatId, messages } = chat;

  function openChat(chatId: string) {
    push(`/chats/${chatId}`);
  }

  function extractChatDescription() {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) {
      return 'No messages yet';
    }
    const { content, senderUser } = lastMessage;

    return `${senderUser.email} - ${content}`;
  }

  return (
    <Card.Container
      key={chatId}
      onClick={() => openChat(chatId)}
      className='p-6 border gap-6'
      role='button'
      tabIndex={0}
    >
      <Card.Icon className='w-16 h-16'>{name ? name[0].toUpperCase() : 'C'}</Card.Icon>

      <div className='flex flex-col flex-1 min-w-0'>
        <h2 className='text-2xl font-semibold text-blue-950 truncate'>{name}</h2>
        <span className='text-gray-500 text-base truncate'>{extractChatDescription()}</span>
      </div>
    </Card.Container>
  );
}
