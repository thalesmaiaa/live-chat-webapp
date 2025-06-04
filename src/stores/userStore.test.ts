import { UserNotification } from '@/@types';
import { useUserStore } from './userStore';

describe('useUserStore', () => {
  const user = {
    id: '1',
    email: 'test@example.com',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  const notifications: UserNotification[] = ['CONTACT_REQUEST', 'GROUP_INVITE', 'NEW_MESSAGE'];

  beforeEach(() => {
    useUserStore.setState({
      userData: null,
      notifications: [],
    });
  });

  it('should have initial state', () => {
    expect(useUserStore.getState().userData).toBeNull();
    expect(useUserStore.getState().notifications).toEqual([]);
  });

  it('should set user data', () => {
    useUserStore.getState().setUserData(user);
    expect(useUserStore.getState().userData).toEqual(user);
  });

  it('should clear user data', () => {
    useUserStore.getState().setUserData(user);
    useUserStore.getState().clearUserData();
    expect(useUserStore.getState().userData).toBeNull();
  });

  it('should set notifications', () => {
    useUserStore.getState().setNotifications(notifications);
    expect(useUserStore.getState().notifications).toEqual(notifications);
  });

  it('should clear notifications', () => {
    useUserStore.getState().setNotifications(notifications);
    useUserStore.getState().clearNotifications();
    expect(useUserStore.getState().notifications).toEqual([]);
  });
});
