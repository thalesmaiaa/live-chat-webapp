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
