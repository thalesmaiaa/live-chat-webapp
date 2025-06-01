import * as React from 'react';

import { useQuery } from '@tanstack/react-query';
import { useContacts, UserContact } from '@/hooks';
import { Button, Card } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { ChatModal } from './ChatModal';
import { useUserStore } from '@/stores';

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

  const hasContacts = contacts && contacts.length > 0;

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
    push(`/users/${userData?.id}/chats/${contact.chatId}`);
  }

  function onCloseModal() {
    setIsModalOpen(false);
  }

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

                  <div className='flex gap-2'>
                    <button
                      aria-label={`Remove contact ${username}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveContact(id);
                      }}
                      className='p-1 rounded hover:bg-red-100 focus:outline-none focus:ring-0'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5 text-red-600'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4'
                        />
                      </svg>
                    </button>
                    <button
                      aria-label={`Send message to ${username}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendMessage(contact);
                      }}
                      className='p-1 rounded hover:bg-blue-100 focus:outline-none focus:ring-0'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5 text-blue-600'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M5 12h14M12 5l7 7-7 7'
                        />
                      </svg>
                    </button>
                  </div>
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
