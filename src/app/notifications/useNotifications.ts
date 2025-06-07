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

export const useNotifications = () => {
  const { request } = useLiveChat();

  async function sendContactInvite(body: SendContactInviteData) {
    await request<SendContactInviteData>({
      method: 'POST',
      url: '/contacts',
      body,
    });

    toast.success('Contact invite sent successfully!');
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

  return {
    sendContactInvite,
    findPendingInvites,
    acceptContactInvite,
    rejectContactInvite,
  };
};
