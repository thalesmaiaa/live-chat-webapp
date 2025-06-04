import React from 'react';
import { ChatPreview } from './ChatPreview';
import { fireEvent, render } from '@testing-library/react';
import { UserChat } from '@/@types';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/components/ui', () => ({
  Card: {
    Container: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    Icon: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLSpanElement> & { children: React.ReactNode }) => (
      <span {...props}>{children}</span>
    ),
  },
}));

describe('ChatPreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const baseChat: UserChat = {
    ownerId: 'owner123',
    chatId: 'chat123',
    name: 'Test Chat',
    chatType: 'GROUP',
    members: [],
    messages: [],
    createdAt: '2023-01-01T00:00:00Z',
  };

  it('renders chat name and fallback icon', () => {
    const { getByText } = render(<ChatPreview {...baseChat} />);
    expect(getByText('Test Chat')).toBeInTheDocument();
    expect(getByText('T')).toBeInTheDocument();
  });

  it('renders "No messages yet" if there are no messages', () => {
    const { getByText } = render(<ChatPreview {...baseChat} />);
    expect(getByText('No messages yet')).toBeInTheDocument();
  });

  it('renders last message description if messages exist', () => {
    const chatWithMessage = {
      ...baseChat,
      messages: [
        {
          content: 'Hello world',
          sentAt: '2023-01-01T00:00:00Z',
          senderUser: {
            id: 'user123',
            email: 'teste',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        },
      ],
    };
    const { getByText } = render(<ChatPreview {...chatWithMessage} />);
    expect(getByText('teste - Hello world')).toBeInTheDocument();
  });

  it('calls push with correct chatId when clicked', () => {
    const { getByRole } = render(<ChatPreview {...baseChat} />);
    fireEvent.click(getByRole('button'));
    expect(mockPush).toHaveBeenCalledWith(`/chats/${baseChat.chatId}`);
  });

  it('renders fallback icon "C" if name is empty', () => {
    const chat = { ...baseChat, name: '' };
    const { getByText } = render(<ChatPreview {...chat} />);
    expect(getByText('C')).toBeInTheDocument();
  });
});
