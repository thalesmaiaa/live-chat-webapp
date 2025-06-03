'use client';

import * as React from 'react';
import { Chat, Loader, Sidebar, WrapperContainer } from '@/components/ui';
import { useNotificationSocket } from '@/hooks';
import { extractCookie } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { useUserChat } from './useUserChat';
import { useUserStore } from '@/stores';

export default function UserChatPage() {
  const { chatId } = useParams();
  const { userData } = useUserStore();

  const userId = userData?.id;
  const { connected, publishMessage, connectSocket, disconnectSocket } = useNotificationSocket();
  const { chat, state, setState } = useUserChat({ chatId: chatId as string });

  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.receivedMessages]);

  const authToken = extractCookie('authToken') || '';

  React.useEffect(() => {
    if (authToken && chatId) {
      connectSocket({
        authToken,
        subscribeUrl: `/topics/${chatId}`,
        onSubscribe: (message) => {
          setState((prevState) => ({
            ...prevState,
            receivedMessages: [...(prevState?.receivedMessages || []), message],
          }));
        },
      });
    }

    return () => {
      disconnectSocket();
    };
  }, [authToken, chatId, connectSocket, disconnectSocket, setState]);

  async function onSubmit() {
    const message = {
      chatId: chatId as string,
      senderId: userId as string,
      receiverId: chatId as string,
      message: state.message,
      sentAt: new Date().toISOString(),
      chatType: 'GROUP',
    };

    publishMessage({
      destination: `/app/new-message/${userId}`,
      message,
    });
  }

  if (!chat) {
    return <Loader message='Loading your chat...' />;
  }

  return (
    <WrapperContainer>
      <Sidebar />
      <Chat
        enabled={connected}
        messages={state.receivedMessages || []}
        userId={userId as string}
        onSendMessage={onSubmit}
        setMessage={(message) => setState({ ...state, message })}
        message={state.message}
      />
    </WrapperContainer>
  );
}
