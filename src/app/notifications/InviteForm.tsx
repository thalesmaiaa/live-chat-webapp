import { Button, Input } from '@/components/ui';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { SendContactInviteData } from './useNotifications';

export function InviteForm({
  onSubmit,
  isSubmitting,
  register,
}: {
  onSubmit: () => void;
  isSubmitting: boolean;
  register: ReturnType<typeof useForm<SendContactInviteData>>['register'];
}) {
  return (
    <form className='max-w-lg w-full space-y-8' id='groupChatForm' onSubmit={onSubmit}>
      <section>
        <label htmlFor='groupChatName' className='block text-sm font-medium text-blue-950 mb-2'>
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
  );
}
