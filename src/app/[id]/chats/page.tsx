'use client';

import * as React from 'react';
import { useUserChats } from './useUserChats';
import { Button, Loader, Sidebar, WrapperContainer } from '@/components/ui';
import { ChatPreview } from './ChatPreview';
import { useParams, useRouter } from 'next/navigation';

export default function UserChats() {
  const { id: userId } = useParams();
  const { push } = useRouter();
  const { userChats, isLoading } = useUserChats();

  if (isLoading) {
    return <Loader message='Loading your chats...' />;
  }

  function redirectToCreateChat() {
    push(`/${userId}/new-chat`);
  }

  const hasChats = userChats && !!userChats.length;

  return (
    <WrapperContainer>
      <Sidebar />
      <div
        className='
        flex-1
        min-h-screen
        p-8 pb-20
        flex flex-col
        items-center
        font-[family-name:var(--font-geist-sans)]
        bg-gray-50
      '
      >
        <main className='flex flex-col gap-8 w-full'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-3xl font-semibold text-blue-950'>Your Chats</h1>
            <Button onClick={redirectToCreateChat}>Create group</Button>
          </div>

          {!hasChats && <p className='text-gray-600 text-center'>You have no active chats yet.</p>}

          {hasChats && (
            <ul className='flex flex-row gap-4 overflow-x-auto flex-wrap'>
              {userChats?.map((userChat) => (
                <ChatPreview {...userChat} key={userChat.chatId} />
              ))}
            </ul>
          )}
        </main>
      </div>
    </WrapperContainer>
  );
}
