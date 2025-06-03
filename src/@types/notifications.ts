export type UserNotification = 'CONTACT_REQUEST' | 'NEW_MESSAGE' | 'GROUP_INVITE';

export type WebSocketMessage = {
  senderId: string;
  receiverId: string;
  message: string;
  sentAt: string;
  chatId: string;
  chatType: string;
};

export type ReceivedWebSocketMessage = {
  message: string;
  sentAt: string;
  senderUser: {
    id: string;
    username: string;
    email: string;
  };
  notificationType: UserNotification;
  destination: string;
  destinationId: string;
};
