import { useLiveChat } from '@/hooks';
import { useQuery } from '@tanstack/react-query';

export type UserChat = {
  ownerId: string;
  chatId: string;
  name: string;
  chatType: 'GROUP' | 'PRIVATE';
  members: {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  }[];
  messages: {
    content: string;
    sentAt: string;
    senderUser: {
      id: string;
      email: string;
      name?: string;
      createdAt: string;
      updatedAt: string;
    };
  }[];
  createdAt: string;
};

export const useUserChats = () => {
  const { request } = useLiveChat();
  const { data: userChats, isLoading } = useQuery<UserChat[]>({
    queryKey: ['user-chats'],
    queryFn: async () => {
      const response = await request<UserChat[]>({
        method: 'GET',
        url: '/chats',
      });
      return response.json();
    },
    refetchOnWindowFocus: true,
  });

  return { userChats, isLoading };
};
