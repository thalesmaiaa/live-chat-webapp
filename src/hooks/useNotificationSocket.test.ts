import { act, renderHook } from '@testing-library/react';
import { useNotificationSocket } from './useNotificationSocket';
import { Client } from '@stomp/stompjs';
import { WebSocketMessage } from '@/@types';

jest.mock('@stomp/stompjs', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Client: jest.fn().mockImplementation(function (this: any, opts) {
      this.activate = jest.fn();
      this.deactivate = jest.fn();
      this.publish = jest.fn();
      this.subscribe = jest.fn((destination, callback) => {
        this._callback = callback;
      });
      Object.assign(this, opts);
    }),
  };
});

describe('useNotificationSocket', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with connected as false', () => {
    const { result } = renderHook(() => useNotificationSocket());
    expect(result.current.connected).toBe(false);
  });

  it('should connect socket and subscribe', () => {
    const onSubscribe = jest.fn();
    const authToken = 'token';
    const subscribeUrl = '/topic/test';

    const { result } = renderHook(() => useNotificationSocket());

    act(() => {
      result.current.connectSocket({ authToken, subscribeUrl, onSubscribe });
    });

    // Client should be constructed and activate called
    expect(Client).toHaveBeenCalledWith(
      expect.objectContaining({
        brokerURL: expect.any(String),
        connectHeaders: { Authorization: `Bearer ${authToken}` },
        reconnectDelay: 5000,
        onConnect: expect.any(Function),
        onStompError: expect.any(Function),
        onWebSocketClose: expect.any(Function),
      }),
    );
    const clientInstance = (Client as jest.Mock).mock.instances[0];
    expect(clientInstance.activate).toHaveBeenCalled();

    // Simulate onConnect
    act(() => {
      clientInstance.onConnect();
    });

    // Should set connected to true
    expect(result.current.connected).toBe(true);

    // Simulate receiving a message
    const message = { body: JSON.stringify({ foo: 'bar' }) };
    act(() => {
      clientInstance.subscribe.mock.calls[0][1](message);
    });
    expect(onSubscribe).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should handle disconnectSocket', () => {
    const { result } = renderHook(() => useNotificationSocket());
    act(() => {
      result.current.connectSocket({
        authToken: 'token',
        subscribeUrl: '/topic/test',
        onSubscribe: jest.fn(),
      });
    });
    const clientInstance = (Client as jest.Mock).mock.instances[0];

    // Simulate onConnect to set connected true
    act(() => {
      clientInstance.onConnect();
    });

    act(() => {
      result.current.disconnectSocket();
    });

    expect(clientInstance.deactivate).toHaveBeenCalled();
    expect(result.current.connected).toBe(false);
  });

  it('should warn if publishMessage is called when not connected', () => {
    const { result } = renderHook(() => useNotificationSocket());
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    act(() => {
      result.current.publishMessage({
        destination: '/topic/test',
        message: {} as WebSocketMessage,
      });
    });
    expect(warnSpy).toHaveBeenCalledWith('WebSocket not connected');
    warnSpy.mockRestore();
  });

  it('should publish message if connected', () => {
    const { result } = renderHook(() => useNotificationSocket());
    act(() => {
      result.current.connectSocket({
        authToken: 'token',
        subscribeUrl: '/topic/test',
        onSubscribe: jest.fn(),
      });
    });
    const clientInstance = (Client as jest.Mock).mock.instances[0];
    act(() => {
      clientInstance.onConnect();
    });

    const payloadMessage = {
      chatId: '123',
      message: 'Hello',
      senderId: 'user1',
      sentAt: new Date().toISOString(),
      chatType: 'text',
      receiverId: 'user2',
    };

    act(() => {
      result.current.publishMessage({
        destination: '/topic/test',
        message: payloadMessage,
      });
    });

    expect(clientInstance.publish).toHaveBeenCalledWith({
      destination: '/topic/test',
      body: JSON.stringify(payloadMessage),
    });
  });

  it('should handle onStompError and onWebSocketClose', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useNotificationSocket());
    act(() => {
      result.current.connectSocket({
        authToken: 'token',
        subscribeUrl: '/topic/test',
        onSubscribe: jest.fn(),
      });
    });
    const clientInstance = (Client as jest.Mock).mock.instances[0];

    // onStompError
    act(() => {
      clientInstance.onStompError({ headers: { message: 'error!' } });
    });
    expect(errorSpy).toHaveBeenCalledWith('STOMP error:', 'error!');

    // onWebSocketClose
    act(() => {
      clientInstance.onWebSocketClose();
    });
    expect(result.current.connected).toBe(false);

    errorSpy.mockRestore();
  });
});
