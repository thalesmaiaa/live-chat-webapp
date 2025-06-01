import { useLiveChat } from '@/hooks';
import { toast } from 'sonner';

export type SendContactInviteData = {
  email: string;
};

type ContactInvitaionUpdate = {
  inviteId: string;
  onSuccess: () => void;
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

  async function sendContactInvite(body: SendContactInviteData) {
    await request<SendContactInviteData>({
      method: 'POST',
      url: '/contacts',
      body,
    });

    toast.success('Contact invite sent successfully!');
  }

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

  async function findPendingInvites() {
    const response = await request<{ userId: string }>({
      method: 'GET',
      url: `/contacts/invites`,
    });

    if (!response.ok) {
      throw new Error(`Failed to find pending invites: ${response.statusText}`);
    }

    return await response.json();
  }

  async function acceptContactInvite({ inviteId, onSuccess }: ContactInvitaionUpdate) {
    const response = await request({
      method: 'PATCH',
      url: `/contacts/${inviteId}/ACCEPTED`,
    });

    if (!response.ok) {
      throw new Error(`Failed to accept contact invite: ${response.statusText}`);
    }

    toast.success('Contact invite accepted successfully!');
    onSuccess();
  }

  async function rejectContactInvite({ inviteId, onSuccess }: ContactInvitaionUpdate) {
    const response = await request({
      method: 'PATCH',
      url: `/contacts/${inviteId}/REJECTED`,
    });

    if (!response.ok) {
      throw new Error(`Failed to reject contact invite: ${response.statusText}`);
    }

    toast.success('Contact invite rejected successfully!');
    onSuccess();
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
    sendContactInvite,
    findUserContactsForNewChat,
    findPendingInvites,
    acceptContactInvite,
    rejectContactInvite,
    removeContact,
  };
};
