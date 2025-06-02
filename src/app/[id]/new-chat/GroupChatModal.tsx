import { Button, Input } from '@/components/ui';
import * as React from 'react';

type GroupChatNameModalProps = {
  onSubmit: (groupName: string) => void;
  onClose: () => void;
};

export function GroupChatNameModal({ onSubmit, onClose }: GroupChatNameModalProps) {
  const [groupName, setGroupName] = React.useState('');

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50'>
      <div className='bg-white p-6 rounded shadow max-w-sm w-full'>
        <h3 className='text-lg font-semibold mb-4'>Name your group chat</h3>
        <Input
          type='text'
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder='Group chat name'
          className='mb-4'
        />
        <div className='flex justify-start gap-3'>
          <button onClick={onClose} className='px-4 py-2 border rounded hover:bg-gray-100'>
            Cancel
          </button>
          <Button onClick={() => onSubmit(groupName)} disabled={!groupName.trim()}>
            Set Group Name
          </Button>
        </div>
      </div>
    </div>
  );
}
