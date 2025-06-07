'use client';

import * as React from 'react';
import { Sidebar, WrapperContainer } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { useUserStore } from '@/stores';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { UserNotification } from '@/@types';
import { PendingRequestsList, UserContact } from './PendingContactRequests';
import { InviteForm } from './InviteForm';
import { SendContactInviteData, useNotifications } from './useNotifications';

export default function Notifications() {
  const { sendContactInvite, findPendingInvites, acceptContactInvite, rejectContactInvite } =
    useNotifications();
  const { userData, notifications, setNotifications } = useUserStore();
  const { id: userId } = useParams();

  const { data: pendingRequests = [], refetch } = useQuery<UserContact[]>({
    queryKey: ['user-pending-contacts', userId],
    queryFn: findPendingInvites,
    refetchOnWindowFocus: true,
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SendContactInviteData>();

  const handleInviteSubmit = async (data: SendContactInviteData) => {
    if (data.email === userData?.email) {
      toast.error('You cannot send an invite to yourself.');
      return;
    }
    await sendContactInvite(data);
  };

  const handleAccept = (inviteId: string) => {
    acceptContactInvite({ inviteId, onSuccess: refetch });
  };

  const handleReject = (inviteId: string) => {
    rejectContactInvite({ inviteId, onSuccess: refetch });
  };

  React.useEffect(() => {
    if (!notifications) return;
    if (notifications.includes('CONTACT_REQUEST')) {
      refetch();
      setNotifications(notifications.filter((n) => n !== 'CONTACT_REQUEST') as UserNotification[]);
    }
  }, [notifications, refetch, setNotifications]);

  return (
    <WrapperContainer>
      <Sidebar />
      <main className='flex flex-col gap-8 flex-1 p-8 pb-20 justify-start items-start'>
        <section className='max-w-lg w-full'>
          <h2 className='text-xl font-semibold mb-4'>Your pending contact requests</h2>
          <PendingRequestsList
            pendingRequests={pendingRequests}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        </section>
        <div>
          <h2 className='text-xl font-semibold mb-4'>Send Contact Invite</h2>
          <InviteForm
            onSubmit={handleSubmit(handleInviteSubmit)}
            isSubmitting={isSubmitting}
            register={register}
          />
        </div>
      </main>
    </WrapperContainer>
  );
}
