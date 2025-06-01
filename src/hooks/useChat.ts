import { toast } from 'sonner';
import { useLiveChat } from './useLiveChat';

type StartPrivateChatParams = {
  userId: string;
  receiverId?: string;
  message: string;
  members?: string[];
};

type StartGroupChatParams = {
  ownerId: string;
  members: string[];
  chatName?: string;
};

export const useChat = () => {
  const { request } = useLiveChat();

  async function startNewChat({ userId, ...body }: StartPrivateChatParams) {
    const response = await request({
      method: 'POST',
      url: `/chats/${userId}`,
      body,
    });

    if (response.status === 201) {
      toast.success('New chat started successfully!');
      return await response.json();
    }

    throw new Error('Failed to start new chat');
  }

  async function startGroupChat(body: StartGroupChatParams) {
    const response = await request({
      method: 'POST',
      url: `/chats`,
      body,
    });

    if (response.status === 201) {
      toast.success('New chat started successfully!');
      return;
    }

    throw new Error('Failed to start new chat');
  }

  return {
    startNewChat,
    startGroupChat,
  };
};
