import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserData = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
} | null;

export type UserNotification = 'CONTACT_REQUEST' | 'MESSAGE' | 'GROUP_INVITE';

interface UserStore {
  userData?: UserData;
  notifications?: UserNotification[];
  setUserData: (user: UserData) => void;
  setNotifications: (notifications: UserNotification[]) => void;
  clearUserData: () => void;
}
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userData: null,
      notifications: [],
      setUserData: (user) => set({ userData: user }),
      setNotifications: (notifications) => set({ notifications }),
      clearUserData: () => set({ userData: null }),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'user-storage',
    },
  ),
);
