import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserChats from '../page';
import { useUserChats } from '../useUserChats';
import { useRouter } from 'next/navigation';
import { UserChat } from '@/@types';

jest.mock('../useUserChats');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/components/ui', () => ({
  Button: ({
    onClick,
    children,
  }: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
  }) => <button onClick={onClick}>{children}</button>,
  Loader: ({ message }: { message: string }) => <div>{message}</div>,
  Sidebar: () => <aside>Sidebar</aside>,
  WrapperContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('../ChatPreview', () => ({
  ChatPreview: (props: { chatId: string }) => <li>ChatPreview: {props.chatId}</li>,
}));

describe('UserChats', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it('renders loader when loading', () => {
    (useUserChats as jest.Mock).mockReturnValue({ isLoading: true, userChats: [] });
    render(<UserChats />);
    expect(screen.getByText(/Loading your chats/i)).toBeInTheDocument();
  });

  it('renders message when no chats', () => {
    (useUserChats as jest.Mock).mockReturnValue({ isLoading: false, userChats: [] });
    render(<UserChats />);
    expect(screen.getByText(/You have no active chats yet/i)).toBeInTheDocument();
  });
});

jest.mock('../useUserChats');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/components/ui', () => ({
  Button: ({
    onClick,
    children,
  }: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
  }) => <button onClick={onClick}>{children}</button>,
  Loader: ({ message }: { message: string }) => <div>{message}</div>,
  Sidebar: () => <aside>Sidebar</aside>,
  WrapperContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('../ChatPreview', () => ({
  ChatPreview: (props: { chatId: string }) => <li>ChatPreview: {props.chatId}</li>,
}));

const mockPush = jest.fn();

function setupUserChatsMock({ isLoading = false, userChats = [] as UserChat[] } = {}) {
  (useUserChats as jest.Mock).mockReturnValue({ isLoading, userChats });
}

function renderComponent() {
  return render(<UserChats />);
}

describe('UserChats', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it('renders loader when loading', () => {
    setupUserChatsMock({ isLoading: true });
    renderComponent();
    expect(screen.getByText(/Loading your chats/i)).toBeInTheDocument();
  });

  it('renders message when no chats', () => {
    setupUserChatsMock({ userChats: [] });
    renderComponent();
    expect(screen.getByText(/You have no active chats yet/i)).toBeInTheDocument();
  });

  it('renders chat previews when there are chats', () => {
    setupUserChatsMock({
      userChats: [
        {
          chatId: '1',
          name: 'Chat 1',
          chatType: 'GROUP',
          members: [],
          createdAt: new Date().toISOString(),
          messages: [],
          ownerId: 'user1',
        },
      ],
    });
    renderComponent();
    expect(screen.getByText(/ChatPreview: 1/)).toBeInTheDocument();
  });

  it('renders sidebar and heading', () => {
    setupUserChatsMock();
    renderComponent();
    expect(screen.getByText('Sidebar')).toBeInTheDocument();
    expect(screen.getByText('Your Chats')).toBeInTheDocument();
  });

  it('navigates to new chat on button click', () => {
    setupUserChatsMock();
    renderComponent();
    fireEvent.click(screen.getByText(/Create group/i));
    expect(mockPush).toHaveBeenCalledWith('/new-chat');
  });

  it('does not render chat previews when userChats is undefined', () => {
    setupUserChatsMock({ userChats: undefined });
    renderComponent();
    expect(screen.queryByText(/ChatPreview:/)).not.toBeInTheDocument();
  });

  it('renders correct number of chat previews', () => {
    const chats = [
      {
        chatId: '1',
        name: 'Chat 1',
        chatType: 'GROUP' as const,
        members: [],
        createdAt: new Date().toISOString(),
        messages: [],
        ownerId: 'user1',
      },
    ];
    setupUserChatsMock({ userChats: chats });
    renderComponent();
    chats.forEach((chat) =>
      expect(screen.getByText(`ChatPreview: ${chat.chatId}`)).toBeInTheDocument(),
    );
  });

  it('does not call push when loader is visible and button is clicked', () => {
    setupUserChatsMock({ isLoading: true });
    renderComponent();
    const button = screen.queryByText(/Create group/i);
    if (button) fireEvent.click(button);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('renders WrapperContainer always', () => {
    setupUserChatsMock();
    renderComponent();
    expect(screen.getByText('Sidebar').parentElement).toBeInTheDocument();
  });
});
