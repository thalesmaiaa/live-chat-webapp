import { useNotifications } from './useNotifications';
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
    const { sendContactInvite } = useNotifications();
    await sendContactInvite({ email: 'test@example.com' });
    expect(mockRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/contacts',
      body: { email: 'test@example.com' },
    });
    expect(toast.success).toHaveBeenCalledWith('Contact invite sent successfully!');
  });

  test('findPendingInvites returns json on ok', async () => {
    const mockJson = jest.fn().mockResolvedValue([{ id: '2' }]);
    mockRequest.mockResolvedValue({ ok: true, json: mockJson });
    const { findPendingInvites } = useNotifications();
    const result = await findPendingInvites();
    expect(mockRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/contacts/invites',
    });
    expect(result).toEqual([{ id: '2' }]);
  });

  test('findPendingInvites throws on !ok', async () => {
    mockRequest.mockResolvedValue({ ok: false, statusText: 'fail' });
    const { findPendingInvites } = useNotifications();
    await expect(findPendingInvites()).rejects.toThrow('Failed to find pending invites: fail');
  });

  test('acceptContactInvite calls PATCH, toast, and onSuccess on ok', async () => {
    mockRequest.mockResolvedValue({ ok: true });
    const onSuccess = jest.fn();
    const { acceptContactInvite } = useNotifications();
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
    const { acceptContactInvite } = useNotifications();
    await expect(acceptContactInvite({ inviteId: 'abc', onSuccess })).rejects.toThrow(
      'Failed to accept contact invite: bad',
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });

  test('rejectContactInvite calls PATCH, toast, and onSuccess on ok', async () => {
    mockRequest.mockResolvedValue({ ok: true });
    const onSuccess = jest.fn();
    const { rejectContactInvite } = useNotifications();
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
    const { rejectContactInvite } = useNotifications();
    await expect(rejectContactInvite({ inviteId: 'xyz', onSuccess })).rejects.toThrow(
      'Failed to reject contact invite: fail',
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
