'use client';

import * as React from 'react';
import { Button, Sidebar, WrapperContainer } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { SendContactInviteData, useContacts } from '../../hooks/useContacts';
import { useUserStore } from '@/stores';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { UserNotification } from '@/stores/userStore';

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
                <li
                  key={id}
                  className='flex items-center justify-between p-4 border border-gray-300 rounded shadow-sm bg-white'
                  role='listitem'
                >
                  <div className='flex items-center gap-4'>
                    <div className='w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-white font-semibold select-none'>
                      {email.charAt(0).toUpperCase()}
                    </div>
                    <span className='text-blue-950'>{email}</span>
                  </div>

                  <div className='flex items-center gap-2'>
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
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-6 w-6 text-green-600'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth={2}
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                      </svg>
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
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-6 w-6 text-red-600'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M6 18L18 6M6 6l12 12'
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <h2 className='text-xl font-semibold mb-4'>Send Contact Invite</h2>

        <form
          className='max-w-lg w-full space-y-8'
          id='groupChatForm'
          onSubmit={handleSubmit(onSubmit)}
        >
          <section>
            <label htmlFor='groupChatName' className='block text-sm font-medium text-blue-950 mb-2'>
              User Email
            </label>
            <input
              type='text'
              placeholder='Enter user email'
              className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-950'
              {...register('email', { required: true })}
            />
          </section>

          <section>
            <Button disabled={isSubmitting} type='submit' form='groupChatForm'>
              Send Invite
            </Button>
          </section>
        </form>
      </main>
    </WrapperContainer>
  );
}
