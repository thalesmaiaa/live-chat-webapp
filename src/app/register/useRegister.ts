import { useLiveChat } from '@/hooks';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export type RegisterUserData = {
  email: string;
  password: string;
  username: string;
};

export const useRegister = () => {
  const { push } = useRouter();
  const { request } = useLiveChat();

  async function registerUser(body: RegisterUserData) {
    const response = await request({
      method: 'POST',
      url: '/users',
      body,
    });

    if (response.ok) {
      toast.success('Registration successful! Please log in.');
      push('/login');
      return;
    }

    if (!response.ok) {
      const errorResponse = await response.json();
      toast.error(`Registration failed: ${errorResponse.detail}`);
      return;
    }
  }

  return {
    registerUser,
  };
};
