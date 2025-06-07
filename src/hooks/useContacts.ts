import { useLiveChat } from '@/hooks';
import { toast } from 'sonner';

export type SendContactInviteData = {
  email: string;
};

export type ChatUser = {
  id: string;
  email: string;
  username: string;
};

export type UserContact = {
  id: string;
  user: ChatUser;
  hasActiveChat: boolean;
  chatId?: string;
};

export const useContacts = () => {
  const { request } = useLiveChat();

  async function findUserContactsForNewChat() {
    const response = await request<{ userId: string }>({
      method: 'GET',
      url: `/contacts`,
    });

    if (!response.ok) {
      throw new Error(`Failed to find user contacts: ${response.statusText}`);
    }

    return await response.json();
  }

  async function removeContact({
    contactId,
    onSuccess,
  }: {
    contactId: string;
    onSuccess: () => void;
  }) {
    const response = await request({
      method: 'DELETE',
      url: `/contacts/${contactId}`,
    });

    if (!response.ok) {
      throw new Error(`Failed to remove contact: ${response.statusText}`);
    }

    toast.success('Contact removed successfully!');
    onSuccess();
  }

  return {
    findUserContactsForNewChat,
    removeContact,
  };
};
