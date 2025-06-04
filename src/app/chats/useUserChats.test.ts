/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react';
import { useUserChats } from './useUserChats';
import { useLiveChat } from '@/hooks';
import { useQuery } from '@tanstack/react-query';

jest.mock('@/hooks');
jest.mock('@tanstack/react-query');

const mockRequest = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useLiveChat as jest.Mock).mockReturnValue({ request: mockRequest });
});

const setupUseQuery = (returnValue: any, queryFnRef?: { current?: any }) => {
  (useQuery as jest.Mock).mockImplementation((opts) => {
    if (queryFnRef) queryFnRef.current = opts.queryFn;
    return returnValue;
  });
};

describe('useUserChats', () => {
  it('returns userChats and calls request with correct params', () => {
    const mockChats = [{ id: 1, name: 'chat1' }];
    setupUseQuery({ data: mockChats, isLoading: false });

    const { result } = renderHook(() => useUserChats());

    expect(useLiveChat).toHaveBeenCalled();
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['user-chats'],
        refetchOnWindowFocus: true,
        queryFn: expect.any(Function),
      }),
    );
    expect(result.current.userChats).toEqual(mockChats);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns loading state', () => {
    setupUseQuery({ data: undefined, isLoading: true });

    const { result } = renderHook(() => useUserChats());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.userChats).toBeUndefined();
  });

  it('queryFn calls request and returns response.json()', async () => {
    const mockChats = [{ id: 2, name: 'chat2' }];
    const mockJson = jest.fn().mockResolvedValue(mockChats);
    mockRequest.mockResolvedValue({ json: mockJson });

    const queryFnRef: { current?: any } = {};
    setupUseQuery({ data: undefined, isLoading: false }, queryFnRef);

    renderHook(() => useUserChats());
    const result = await queryFnRef.current();

    expect(mockRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/chats',
    });
    expect(mockJson).toHaveBeenCalled();
    expect(result).toEqual(mockChats);
  });

  it('handles request rejection gracefully', async () => {
    const error = new Error('Network error');
    mockRequest.mockRejectedValue(error);

    const queryFnRef: { current?: any } = {};
    setupUseQuery({ data: undefined, isLoading: false }, queryFnRef);

    renderHook(() => useUserChats());
    await expect(queryFnRef.current()).rejects.toThrow('Network error');
    expect(mockRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/chats',
    });
  });

  it('returns undefined userChats if data is not present', () => {
    setupUseQuery({ data: undefined, isLoading: false });

    const { result } = renderHook(() => useUserChats());

    expect(result.current.userChats).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});
