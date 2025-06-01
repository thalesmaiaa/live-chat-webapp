import * as React from 'react';

import { useQuery } from '@tanstack/react-query';
import { useContacts, UserContact } from '@/hooks';
import { Button, Card } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { ChatModal } from './ChatModal';
import { useUserStore } from '@/stores';
import { SendMessageIcon, XIcon } from '@/components/icons';

export function Contacts() {
  const { push } = useRouter();
  const { findUserContactsForNewChat, removeContact } = useContacts();
  const { userData } = useUserStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedContact, setSelectedContact] = React.useState<UserContact>();

  const { data: contacts, refetch } = useQuery<UserContact[]>({
    queryKey: ['user-contacts'],
    queryFn: async () => await findUserContactsForNewChat(),
    refetchOnWindowFocus: true,
  });

  function handleRemoveContact(id: string) {
    removeContact({
      contactId: id,
      onSuccess: refetch,
    });
  }

  function handleSendMessage(user: UserContact) {
    setSelectedContact(user);
    setIsModalOpen(true);
  }

  function redirectToAddContacts() {
    push('/notifications');
  }

  function redirectToChat(contact: UserContact) {
    push(`/${userData?.id}/chats/${contact.chatId}`);
  }

  function onCloseModal() {
    setIsModalOpen(false);
  }

  const hasContacts = contacts && contacts.length > 0;

  return (
    <main className='p-8 flex-1'>
      <h1 className='text-2xl font-semibold mb-4'>Your Contacts</h1>
      {!hasContacts && (
        <div className='flex gap-4 items-start flex-col'>
          <p>No contacts found. Add some!</p>
          <Button onClick={redirectToAddContacts}>Add contacts</Button>
        </div>
      )}
      {hasContacts && (
        <ul className='space-y-4'>
          {contacts.map((contact) => {
            const {
              id,
              user: { username },
              hasActiveChat,
            } = contact;
            return (
              <Card.Container
                key={id}
                className={`justify-start  gap-4 ${
                  hasActiveChat ? 'hover:cursor-pointer' : 'hover:cursor-default'
                }`}
                {...(hasActiveChat && { onClick: () => redirectToChat(contact) })}
              >
                <Card.Icon>{username?.charAt(0).toUpperCase() || 'U'}</Card.Icon>
                <div className='flex justify-between items-center flex-grow'>
                  <Card.Title>{username}</Card.Title>

                  <Card.Actions>
                    <button
                      aria-label={`Remove contact ${username}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveContact(id);
                      }}
                      className='p-1 rounded hover:bg-red-100 focus:outline-none focus:ring-0'
                    >
                      <XIcon />
                    </button>
                    <button
                      aria-label={`Send message to ${username}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendMessage(contact);
                      }}
                      className='p-1 rounded hover:bg-blue-100 focus:outline-none focus:ring-0'
                    >
                      <SendMessageIcon />
                    </button>
                  </Card.Actions>
                </div>
              </Card.Container>
            );
          })}
        </ul>
      )}

      {isModalOpen && <ChatModal onClose={onCloseModal} selectedContact={selectedContact} />}
    </main>
  );
}
