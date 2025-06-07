import { renderHook, act } from '@testing-library/react';
import { useUserChat } from './useUserChat';
import * as hooksModule from '@/hooks';
import * as reactQueryModule from '@tanstack/react-query';

jest.mock('@/hooks', () => ({
  useLiveChat: jest.fn(),
}));
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

const mockRequest = jest.fn();

describe('useUserChat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (hooksModule.useLiveChat as jest.Mock).mockReturnValue({ request: mockRequest });
  });

  it('returns initial state', () => {
    (reactQueryModule.useQuery as jest.Mock).mockReturnValue({ data: undefined, isLoading: false });
    const { result } = renderHook(() => useUserChat({ chatId: '123' }));
    expect(result.current.state).toEqual({ message: '', receivedMessages: [] });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.chat).toBeUndefined();
    expect(typeof result.current.setState).toBe('function');
  });

  it('maps receivedMessages from chat', () => {
    const chat = {
      messages: [
        {
          content: 'hello',
          sentAt: '2024-01-01T00:00:00Z',
          senderUser: { id: 'u1', username: 'alice', email: 'a@a.com' },
        },
        {
          content: 'world',
          sentAt: '2024-01-01T01:00:00Z',
          senderUser: { id: 'u2', username: 'bob', email: 'b@b.com' },
        },
      ],
    };
    (reactQueryModule.useQuery as jest.Mock).mockReturnValue({ data: chat, isLoading: false });

    const { result, rerender } = renderHook(() => useUserChat({ chatId: '123' }));

    act(() => {
      rerender();
    });

    expect(result.current.state.receivedMessages).toEqual([
      {
        message: 'hello',
        sentAt: '2024-01-01T00:00:00Z',
        senderUser: { id: 'u1', username: 'alice', email: 'a@a.com' },
      },
      {
        message: 'world',
        sentAt: '2024-01-01T01:00:00Z',
        senderUser: { id: 'u2', username: 'bob', email: 'b@b.com' },
      },
    ]);
  });

  it('handles empty messages array', () => {
    const chat = { messages: [] };
    (reactQueryModule.useQuery as jest.Mock).mockReturnValue({ data: chat, isLoading: false });

    const { result, rerender } = renderHook(() => useUserChat({ chatId: '123' }));

    act(() => {
      rerender();
    });

    expect(result.current.state.receivedMessages).toEqual([]);
  });

  it('passes isLoading from useQuery', () => {
    (reactQueryModule.useQuery as jest.Mock).mockReturnValue({ data: undefined, isLoading: true });
    const { result } = renderHook(() => useUserChat({ chatId: '123' }));
    expect(result.current.isLoading).toBe(true);
  });

  it('setState updates state', () => {
    (reactQueryModule.useQuery as jest.Mock).mockReturnValue({ data: undefined, isLoading: false });
    const { result } = renderHook(() => useUserChat({ chatId: '123' }));
    act(() => {
      result.current.setState({ message: 'foo', receivedMessages: [] });
    });
    expect(result.current.state.message).toBe('foo');
  });
});
