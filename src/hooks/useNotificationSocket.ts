import { ReceivedWebSocketMessage, WebSocketMessage } from '@/@types';
import { Client } from '@stomp/stompjs';
import * as React from 'react';

type PublishMessage = {
  destination: string;
  message: WebSocketMessage;
};

type ConnectSocket = {
  authToken: string;
  subscribeUrl: string;
  onSubscribe: (message: ReceivedWebSocketMessage) => void;
};

export const useNotificationSocket = () => {
  const [connected, setConnected] = React.useState(false);
  const stompClientRef = React.useRef<Client | null>(null);

  const connectSocket = React.useCallback(
    ({ authToken, onSubscribe, subscribeUrl }: ConnectSocket) => {
      const client = new Client({
        brokerURL: 'ws://localhost:8080/live-chat/livechat',
        connectHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
        reconnectDelay: 5000,
        onConnect: () => {
          setConnected(true);
          client.subscribe(subscribeUrl, (message) => {
            if (message.body) {
              const parsedMessage = JSON.parse(message.body);
              onSubscribe(parsedMessage);
            }
          });
        },
        onStompError: (frame) => console.error('STOMP error:', frame.headers['message']),
        onWebSocketClose: () => setConnected(false),
      });

      client.activate();
      stompClientRef.current = client;
    },
    [],
  );

  const disconnectSocket = React.useCallback(() => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      setConnected(false);
      stompClientRef.current = null;
    }
  }, []);

  function publishMessage({ destination, message }: PublishMessage) {
    if (!connected || !stompClientRef.current) {
      console.warn('WebSocket not connected');
      return;
    }

    stompClientRef.current.publish({
      destination: destination,
      body: JSON.stringify(message),
    });
  }

  return {
    connected,
    publishMessage,
    connectSocket,
    disconnectSocket,
  };
};
