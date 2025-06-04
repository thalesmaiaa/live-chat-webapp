import { useChat } from './useChat';
import { toast } from 'sonner';
import { useLiveChat } from './useLiveChat';

jest.mock('./useLiveChat', () => ({
  useLiveChat: jest.fn(),
}));
jest.mock('sonner', () => ({
  toast: { success: jest.fn() },
}));

describe('useChat', () => {
  const mockRequest = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useLiveChat as jest.Mock).mockReturnValue({ request: mockRequest });
  });

  describe('startNewChat', () => {
    it('calls toast and returns response JSON on success', async () => {
      const mockJson = jest.fn().mockResolvedValue({ chatId: 'abc' });
      mockRequest.mockResolvedValue({ status: 201, json: mockJson });

      const { startNewChat } = useChat();
      const params = { userId: 'u1', receiverId: 'u2', message: 'hello' };
      const result = await startNewChat(params);

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: '/chats/u1',
        body: { receiverId: 'u2', message: 'hello' },
      });
      expect(toast.success).toHaveBeenCalledWith('New chat started successfully!');
      expect(result).toEqual({ chatId: 'abc' });
    });

    it('throws error if response status is not 201', async () => {
      mockRequest.mockResolvedValue({ status: 400 });

      const { startNewChat } = useChat();
      const params = { userId: 'u1', receiverId: 'u2', message: 'fail' };

      await expect(startNewChat(params)).rejects.toThrow('Failed to start new chat');
      expect(toast.success).not.toHaveBeenCalled();
    });

    it('sends correct request params', async () => {
      const mockJson = jest.fn().mockResolvedValue({});
      mockRequest.mockResolvedValue({ status: 201, json: mockJson });

      const { startNewChat } = useChat();
      const params = {
        userId: 'userX',
        receiverId: 'userY',
        message: 'hi',
        members: ['userX', 'userY'],
      };
      await startNewChat(params);

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: '/chats/userX',
        body: { receiverId: 'userY', message: 'hi', members: ['userX', 'userY'] },
      });
    });
  });

  describe('startGroupChat', () => {
    it('calls toast and resolves on success', async () => {
      mockRequest.mockResolvedValue({ status: 201 });

      const { startGroupChat } = useChat();
      const params = { ownerId: 'u1', members: ['u1', 'u2'], chatName: 'group' };
      await expect(startGroupChat(params)).resolves.toBeUndefined();

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: '/chats',
        body: params,
      });
      expect(toast.success).toHaveBeenCalledWith('New chat started successfully!');
    });

    it('throws error if response status is not 201', async () => {
      mockRequest.mockResolvedValue({ status: 400 });

      const { startGroupChat } = useChat();
      const params = { ownerId: 'u1', members: ['u1', 'u2'] };

      await expect(startGroupChat(params)).rejects.toThrow('Failed to start new chat');
      expect(toast.success).not.toHaveBeenCalled();
    });
  });
});
