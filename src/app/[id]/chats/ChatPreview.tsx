import { useParams, useRouter } from 'next/navigation';
import { UserChat } from './useUserChats';

export function ChatPreview(chat: UserChat) {
  const { push } = useRouter();
  const { id: userId } = useParams();
  const { name, chatId, messages } = chat;

  function openChat(chatId: string) {
    push(`/${userId}/chats/${chatId}`);
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
    <li
      key={chatId}
      onClick={() => openChat(chatId)}
      className='cursor-pointer p-6 border border-gray-300 rounded shadow-sm bg-white hover:bg-blue-50 transition flex items-center gap-6 w-96'
      role='button'
      tabIndex={0}
    >
      <div className='w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-2xl select-none'>
        {name ? name[0].toUpperCase() : 'C'}
      </div>

      <div className='flex flex-col flex-1 min-w-0'>
        <h2 className='text-2xl font-semibold text-blue-950 truncate'>{name}</h2>
        <span className='text-gray-500 text-base truncate'>{extractChatDescription()}</span>
      </div>
    </li>
  );
}
