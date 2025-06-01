'use client';

import * as React from 'react';
import { Button, Card, Loader, Sidebar, WrapperContainer } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { useChat, useContacts, UserContact } from '@/hooks';
import { useParams } from 'next/navigation';
import { GroupChatNameModal } from './GroupChatModal';
import { useNewChatState } from './useNewChatState';

export default function NewChat() {
  const { id: userId } = useParams();
  const { findUserContactsForNewChat } = useContacts();
  const { startGroupChat } = useChat();

  const { state, closeModal, setSelectedUserIds, setChatName, openModal } = useNewChatState();

  const { data: contacts, isLoading } = useQuery<UserContact[]>({
    queryKey: ['user-contacts', userId],
    queryFn: async () => await findUserContactsForNewChat(),
    refetchOnWindowFocus: true,
  });

  const { selectedUserIds, isModalOpen, chatName } = state;
  const hasSelectedUsers = selectedUserIds.length > 0;
  const hasContacts = contacts && contacts.length > 0;

  function selectUserId(id: string) {
    const isAlreadySelected = selectedUserIds.includes(id);
    const updatedUserIds = state.selectedUserIds.filter((userId) => userId !== id);
    setSelectedUserIds(isAlreadySelected ? updatedUserIds : [...updatedUserIds, id]);
  }

  function handleStartChat() {
    if (!hasSelectedUsers) return;

    if (chatName) {
      startGroupChat({ ownerId: userId as string, members: selectedUserIds, chatName })
        .then(() => setSelectedUserIds([]))
        .catch((error) => console.error('Failed to start new chat:', error));
      return;
    }

    openModal();
  }

  function handleChatNameChange(name: string) {
    setChatName(name);
    closeModal();
  }

  function generateSubmitButtonText() {
    if (!hasSelectedUsers) return 'Select Contacts';
    if (!chatName) return 'Define Group Name';
    return 'Start Group Chat';
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <WrapperContainer>
      <Sidebar />

      <main className='flex flex-col gap-8 flex-1 p-8 pb-20 justify-start items-start'>
        <section className='max-w-lg w-full'>
          <h2 className='text-xl font-semibold mb-4'>Your Contacts</h2>
          {!hasContacts && (
            <p className='text-gray-600 text-left'>
              You have no contacts to start a new chat. Please add contacts to start chatting.
            </p>
          )}
          {hasContacts && (
            <ul className='space-y-3'>
              {contacts?.map(({ user: { id, email } }) => (
                <Card.Container
                  key={id}
                  role='button'
                  tabIndex={0}
                  onClick={() => selectUserId(id)}
                >
                  <div className='flex items-center gap-3'>
                    <input
                      type='checkbox'
                      checked={selectedUserIds.includes(id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        selectUserId(id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className='w-5 h-5 cursor-pointer'
                      aria-label={`Select user ${email}`}
                    />

                    <Card.Title>{email}</Card.Title>
                  </div>

                  <Card.Icon>{email.charAt(0).toUpperCase()}</Card.Icon>
                </Card.Container>
              ))}
            </ul>
          )}
        </section>
        {hasContacts && (
          <Button disabled={!hasSelectedUsers} onClick={handleStartChat}>
            {generateSubmitButtonText()}
          </Button>
        )}

        {isModalOpen && <GroupChatNameModal onClose={closeModal} onSubmit={handleChatNameChange} />}
      </main>
    </WrapperContainer>
  );
}
