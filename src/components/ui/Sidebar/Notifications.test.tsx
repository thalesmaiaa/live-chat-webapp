import React from 'react';
import { render, act } from '@testing-library/react';
import { Notifications } from './Notifications';
import { useNotificationSocket } from '@/hooks';
import { useUserStore } from '@/stores';
import { extractCookie } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface NotificationMessage {
  notificationType: string;
  destinationId: string;
  message: string;
}

jest.mock('@/hooks', () => ({
  useNotificationSocket: jest.fn(),
}));

jest.mock('@/stores', () => ({
  useUserStore: jest.fn(),
}));

jest.mock('@/lib/utils', () => ({
  extractCookie: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    info: jest.fn(),
  },
}));

describe('Notifications', () => {
  const mockConnectSocket = jest.fn();
  const mockDisconnectSocket = jest.fn();
  const mockPush = jest.fn();
  const mockSetNotifications = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useNotificationSocket as jest.Mock).mockReturnValue({
      connectSocket: mockConnectSocket,
      disconnectSocket: mockDisconnectSocket,
    });

    (useUserStore as unknown as jest.Mock).mockReturnValue({
      userData: { id: 'user123' },
      setNotifications: mockSetNotifications,
      notifications: ['PREVIOUS_NOTIFICATION'],
    });

    (extractCookie as jest.Mock).mockReturnValue('mock-token');
    (usePathname as jest.Mock).mockReturnValue('/some/path');
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test('connects to socket when component mounts with valid auth', () => {
    render(<Notifications />);

    expect(mockConnectSocket).toHaveBeenCalledWith(
      expect.objectContaining({
        authToken: 'mock-token',
        subscribeUrl: '/topics/notifications/user123',
      }),
    );
  });

  test('disconnects from socket when component unmounts', () => {
    const { unmount } = render(<Notifications />);
    unmount();

    expect(mockDisconnectSocket).toHaveBeenCalled();
  });

  test('does not connect when auth token is missing', () => {
    (extractCookie as jest.Mock).mockReturnValue('');

    render(<Notifications />);
    expect(mockConnectSocket).not.toHaveBeenCalled();
  });

  test('does not connect when user ID is missing', () => {
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      userData: null,
      setNotifications: mockSetNotifications,
      notifications: [],
    });

    render(<Notifications />);

    expect(mockConnectSocket).not.toHaveBeenCalled();
  });

  test('processes new message notification correctly', () => {
    let onSubscribeCallback: (message: NotificationMessage) => void;

    mockConnectSocket.mockImplementation(({ onSubscribe }) => {
      onSubscribeCallback = onSubscribe;
    });

    render(<Notifications />);

    act(() => {
      onSubscribeCallback({
        notificationType: 'NEW_MESSAGE',
        destinationId: 'chat123',
        message: 'You have a new message',
      });
    });

    expect(toast.info).toHaveBeenCalledWith('You have a new message', expect.any(Object));

    expect(mockSetNotifications).toHaveBeenCalledWith(['PREVIOUS_NOTIFICATION', 'NEW_MESSAGE']);
  });

  test('redirects to chat when notification is clicked', () => {
    let onSubscribeCallback: (message: NotificationMessage) => void;
    let capturedAction: { label: string; onClick: () => void } | undefined;

    mockConnectSocket.mockImplementation(({ onSubscribe }) => {
      onSubscribeCallback = onSubscribe;
    });

    (toast.info as jest.Mock).mockImplementation((_, options) => {
      capturedAction = options.action;
    });

    render(<Notifications />);

    act(() => {
      onSubscribeCallback({
        notificationType: 'NEW_MESSAGE',
        destinationId: 'chat123',
        message: 'You have a new message',
      });
    });

    act(() => {
      capturedAction?.onClick();
    });

    expect(mockPush).toHaveBeenCalledWith('/chats/chat123');
  });

  test('redirects to notifications page for other notification types', () => {
    let onSubscribeCallback: (message: NotificationMessage) => void;
    let capturedAction: { label: string; onClick: () => void } | undefined;
    mockConnectSocket.mockImplementation(({ onSubscribe }) => {
      onSubscribeCallback = onSubscribe;
    });
    (toast.info as jest.Mock).mockImplementation((_, options) => {
      capturedAction = options.action;
    });
    render(<Notifications />);
    act(() => {
      onSubscribeCallback({
        notificationType: 'CONTACT_REQUEST',
        destinationId: 'someId',
        message: 'You have a new notification',
      });
    });
    act(() => {
      capturedAction?.onClick();
    });
    expect(mockPush).toHaveBeenCalledWith('/notifications');
  });

  test('does not show toast when already on the destination page', () => {
    (usePathname as jest.Mock).mockReturnValue('/chats/chat123');

    let onSubscribeCallback: (message: NotificationMessage) => void;
    mockConnectSocket.mockImplementation(({ onSubscribe }) => {
      onSubscribeCallback = onSubscribe;
    });

    render(<Notifications />);

    act(() => {
      onSubscribeCallback({
        notificationType: 'NEW_MESSAGE',
        destinationId: 'chat123',
        message: 'You have a new message',
      });
    });

    expect(toast.info).not.toHaveBeenCalled();

    expect(mockSetNotifications).toHaveBeenCalled();
  });
});
