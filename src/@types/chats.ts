export type UserChat = {
  ownerId: string;
  chatId: string;
  name: string;
  chatType: 'GROUP' | 'PRIVATE';
  members: {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  }[];
  messages: {
    content: string;
    sentAt: string;
    senderUser: {
      id: string;
      email: string;
      username?: string;
      createdAt: string;
      updatedAt: string;
    };
  }[];
  createdAt: string;
};
