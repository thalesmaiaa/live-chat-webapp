import * as React from 'react';
import { Card } from '@/components/ui';
import { CheckIcon, XIcon } from '@/components/icons';

export type UserContact = {
  user: {
    id: string;
    email: string;
  };
  id: string;
};

export function PendingRequestsList({
  pendingRequests,
  onAccept,
  onReject,
}: {
  pendingRequests: UserContact[];
  onAccept: (inviteId: string) => void;
  onReject: (inviteId: string) => void;
}) {
  if (!pendingRequests.length) {
    return <p className='text-gray-600 text-left'>You have no pending requests.</p>;
  }

  return (
    <ul
      className='space-y-3 mb-8 border border-gray-200 rounded max-h-96 overflow-y-auto'
      role='list'
    >
      {pendingRequests.map(({ user: { email }, id }) => (
        <Card.Container key={id} role='listitem'>
          <div className='flex items-center gap-4'>
            <Card.Icon>{email.charAt(0).toUpperCase()}</Card.Icon>
            <Card.Title>{email}</Card.Title>
          </div>
          <Card.Actions>
            <button
              aria-label={`Accept contact request from ${email}`}
              className='p-1 rounded hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400'
              onClick={() => onAccept(id)}
              type='button'
            >
              <CheckIcon />
            </button>
            <button
              aria-label={`Deny contact request from ${email}`}
              className='p-1 rounded hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400'
              onClick={() => onReject(id)}
              type='button'
            >
              <XIcon />
            </button>
          </Card.Actions>
        </Card.Container>
      ))}
    </ul>
  );
}
