import { useLiveChat } from '@/hooks';
import { useUserStore } from '@/stores';

export const useLogin = () => {
  const { request } = useLiveChat();
  const { setUserData } = useUserStore();

  async function login({ email, password }: { email: string; password: string }) {
    const response = await request({
      method: 'POST',
      url: '/oauth/login',
      body: { email, password },
    });

    if (response.ok) {
      const data = await response.json();
      document.cookie = `authToken=${data.accessToken}; path=/;`;
    }

    if (!response.ok) {
      throw new Error(`Failed to login: ${response.statusText}`);
    }
  }

  async function fetchAuthenticatedUserData() {
    const response = await request({
      method: 'GET',
      url: '/users/me',
    });

    if (response.ok) {
      const data = await response.json();
      setUserData(data);
      return;
    }
  }

  return {
    login,
    fetchAuthenticatedUserData,
  };
};
