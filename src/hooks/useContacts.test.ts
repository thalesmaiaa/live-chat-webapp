import { useContacts } from './useContacts';
import { useLiveChat } from '@/hooks';
import { toast } from 'sonner';

jest.mock('@/hooks', () => ({
  useLiveChat: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('useContacts', () => {
  const mockRequest = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useLiveChat as jest.Mock).mockReturnValue({ request: mockRequest });
  });

  test('sendContactInvite calls request and shows toast', async () => {
    mockRequest.mockResolvedValue({});
    const { sendContactInvite } = useContacts();
    await sendContactInvite({ email: 'test@example.com' });
    expect(mockRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/contacts',
      body: { email: 'test@example.com' },
    });
    expect(toast.success).toHaveBeenCalledWith('Contact invite sent successfully!');
  });

  test('findUserContactsForNewChat returns json on ok', async () => {
    const mockJson = jest.fn().mockResolvedValue([{ id: '1' }]);
    mockRequest.mockResolvedValue({ ok: true, json: mockJson });
    const { findUserContactsForNewChat } = useContacts();
    const result = await findUserContactsForNewChat();
    expect(mockRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/contacts',
    });
    expect(result).toEqual([{ id: '1' }]);
  });

  test('findUserContactsForNewChat throws on !ok', async () => {
    mockRequest.mockResolvedValue({ ok: false, statusText: 'error' });
    const { findUserContactsForNewChat } = useContacts();
    await expect(findUserContactsForNewChat()).rejects.toThrow(
      'Failed to find user contacts: error',
    );
  });

  test('findPendingInvites returns json on ok', async () => {
    const mockJson = jest.fn().mockResolvedValue([{ id: '2' }]);
    mockRequest.mockResolvedValue({ ok: true, json: mockJson });
    const { findPendingInvites } = useContacts();
    const result = await findPendingInvites();
    expect(mockRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/contacts/invites',
    });
    expect(result).toEqual([{ id: '2' }]);
  });

  test('findPendingInvites throws on !ok', async () => {
    mockRequest.mockResolvedValue({ ok: false, statusText: 'fail' });
    const { findPendingInvites } = useContacts();
    await expect(findPendingInvites()).rejects.toThrow('Failed to find pending invites: fail');
  });

  test('acceptContactInvite calls PATCH, toast, and onSuccess on ok', async () => {
    mockRequest.mockResolvedValue({ ok: true });
    const onSuccess = jest.fn();
    const { acceptContactInvite } = useContacts();
    await acceptContactInvite({ inviteId: 'abc', onSuccess });
    expect(mockRequest).toHaveBeenCalledWith({
      method: 'PATCH',
      url: '/contacts/abc/ACCEPTED',
    });
    expect(toast.success).toHaveBeenCalledWith('Contact invite accepted successfully!');
    expect(onSuccess).toHaveBeenCalled();
  });

  test('acceptContactInvite throws on !ok', async () => {
    mockRequest.mockResolvedValue({ ok: false, statusText: 'bad' });
    const onSuccess = jest.fn();
    const { acceptContactInvite } = useContacts();
    await expect(acceptContactInvite({ inviteId: 'abc', onSuccess })).rejects.toThrow(
      'Failed to accept contact invite: bad',
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });

  test('rejectContactInvite calls PATCH, toast, and onSuccess on ok', async () => {
    mockRequest.mockResolvedValue({ ok: true });
    const onSuccess = jest.fn();
    const { rejectContactInvite } = useContacts();
    await rejectContactInvite({ inviteId: 'xyz', onSuccess });
    expect(mockRequest).toHaveBeenCalledWith({
      method: 'PATCH',
      url: '/contacts/xyz/REJECTED',
    });
    expect(toast.success).toHaveBeenCalledWith('Contact invite rejected successfully!');
    expect(onSuccess).toHaveBeenCalled();
  });

  test('rejectContactInvite throws on !ok', async () => {
    mockRequest.mockResolvedValue({ ok: false, statusText: 'fail' });
    const onSuccess = jest.fn();
    const { rejectContactInvite } = useContacts();
    await expect(rejectContactInvite({ inviteId: 'xyz', onSuccess })).rejects.toThrow(
      'Failed to reject contact invite: fail',
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });

  test('removeContact calls DELETE, toast, and onSuccess on ok', async () => {
    mockRequest.mockResolvedValue({ ok: true });
    const onSuccess = jest.fn();
    const { removeContact } = useContacts();
    await removeContact({ contactId: 'c1', onSuccess });
    expect(mockRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: '/contacts/c1',
    });
    expect(toast.success).toHaveBeenCalledWith('Contact removed successfully!');
    expect(onSuccess).toHaveBeenCalled();
  });

  test('removeContact throws on !ok', async () => {
    mockRequest.mockResolvedValue({ ok: false, statusText: 'fail' });
    const onSuccess = jest.fn();
    const { removeContact } = useContacts();
    await expect(removeContact({ contactId: 'c1', onSuccess })).rejects.toThrow(
      'Failed to remove contact: fail',
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
