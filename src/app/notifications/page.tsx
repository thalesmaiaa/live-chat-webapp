'use client';

import * as React from 'react';
import { Button, Card, Input, Sidebar, WrapperContainer } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { SendContactInviteData, useContacts } from '../../hooks/useContacts';
import { useUserStore } from '@/stores';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { UserNotification } from '@/stores/userStore';
import { CheckIcon, XIcon } from '@/components/icons';

type UserContact = {
  user: {
    id: string;
    email: string;
  };
  id: string;
};

export default function Notifications() {
  const { sendContactInvite, findPendingInvites, acceptContactInvite, rejectContactInvite } =
    useContacts();
  const { userData, notifications, setNotifications } = useUserStore();

  const { id: userId } = useParams();

  const { data: pendingRequests, refetch } = useQuery<UserContact[]>({
    queryKey: ['user-pending-contacts', userId],
    queryFn: async () => await findPendingInvites(),
    refetchOnWindowFocus: true,
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SendContactInviteData>();

  async function onSubmit(data: SendContactInviteData) {
    if (data.email === userData?.email) {
      toast.error('You cannot send an invite to yourself.');
      return;
    }
    await sendContactInvite(data).catch((error) => {
      console.error('Error sending contact invite:', error);
    });
  }

  React.useEffect(() => {
    if (!notifications) return;
    const hasContactRequestNotification = notifications?.some(
      (notification) => notification === 'CONTACT_REQUEST',
    );
    if (hasContactRequestNotification) {
      refetch();
      const filteredNotifications = notifications?.filter(
        (notification) => notification !== 'CONTACT_REQUEST',
      ) as UserNotification[];
      setNotifications(filteredNotifications);
    }
  }, [notifications, refetch, setNotifications]);

  const hasPendingRequests = pendingRequests && pendingRequests.length > 0;

  return (
    <WrapperContainer>
      <Sidebar />

      <main className='flex flex-col gap-8 flex-1 p-8 pb-20 justify-start items-start'>
        <section className='max-w-lg w-full'>
          <h2 className='text-xl font-semibold mb-4'>Your pending contact requests</h2>
          {!hasPendingRequests && (
            <p className='text-gray-600 text-left'>You have no pending requests.</p>
          )}{' '}
          {hasPendingRequests && (
            <ul
              className='space-y-3 mb-8 border border-gray-200 rounded max-h-96 overflow-y-auto'
              role='list'
            >
              {pendingRequests?.map(({ user: { email }, id }) => (
                <Card.Container key={id} role='listitem'>
                  <div className='flex items-center gap-4'>
                    <Card.Icon>{email.charAt(0).toUpperCase()}</Card.Icon>
                    <Card.Title>{email}</Card.Title>
                  </div>

                  <Card.Actions>
                    <button
                      aria-label={`Accept contact request from ${email}`}
                      className='p-1 rounded hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400'
                      onClick={() =>
                        acceptContactInvite({
                          inviteId: id,
                          onSuccess: refetch,
                        })
                      }
                      type='button'
                    >
                      <CheckIcon />
                    </button>

                    <button
                      aria-label={`Deny contact request from ${email}`}
                      className='p-1 rounded hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400'
                      onClick={() =>
                        rejectContactInvite({
                          inviteId: id,
                          onSuccess: refetch,
                        })
                      }
                      type='button'
                    >
                      <XIcon />
                    </button>
                  </Card.Actions>
                </Card.Container>
              ))}
            </ul>
          )}
        </section>

        <div>
          <h2 className='text-xl font-semibold mb-4'>Send Contact Invite</h2>

          <form
            className='max-w-lg w-full space-y-8'
            id='groupChatForm'
            onSubmit={handleSubmit(onSubmit)}
          >
            <section>
              <label
                htmlFor='groupChatName'
                className='block text-sm font-medium text-blue-950 mb-2'
              >
                User Email
              </label>
              <Input
                type='text'
                placeholder='Enter user email'
                {...register('email', { required: true })}
              />
            </section>

            <section>
              <Button disabled={isSubmitting} type='submit' form='groupChatForm'>
                Send Invite
              </Button>
            </section>
          </form>
        </div>
      </main>
    </WrapperContainer>
  );
}
