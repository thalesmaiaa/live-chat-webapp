import { UserChat } from '@/@types';
import { useLiveChat } from '@/hooks';
import { useQuery } from '@tanstack/react-query';

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
