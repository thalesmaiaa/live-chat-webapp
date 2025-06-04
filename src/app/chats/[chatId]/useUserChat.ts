import { ReceivedWebSocketMessage, UserChat } from '@/@types';
import { useLiveChat } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

type State = {
  message: string;
  receivedMessages: ReceivedWebSocketMessage[];
};

export const useUserChat = ({ chatId }: { chatId: string }) => {
  const [state, setState] = React.useState<State>({ message: '', receivedMessages: [] });

  const { request } = useLiveChat();
  const { data: chat, isLoading } = useQuery<UserChat>({
    queryKey: ['user-chat', chatId],
    queryFn: async () => {
      const response = await request({
        method: 'GET',
        url: `/chats/${chatId}`,
      });
      return response.json();
    },
    refetchOnWindowFocus: true,
  });

  React.useEffect(() => {
    if (chat) {
      setState((prevState) => ({
        ...prevState,
        receivedMessages: chat?.messages?.map((message) => {
          return {
            message: message.content,
            sentAt: message.sentAt,
            senderUser: {
              id: message.senderUser.id,
              username: message.senderUser.username as string,
              email: message.senderUser.email,
            },
          };
        }),
      }));
    }
  }, [chat]);

  return { chat, isLoading, state, setState };
};
