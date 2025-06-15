import { extractCookie } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type LiveChatRequest<T> = {
  headers?: Record<string, string>;
  body?: T;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
};

const HttpStatus = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
};

export const useLiveChat = () => {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  async function request<T>(props: LiveChatRequest<T>) {
    const authToken = extractCookie('authToken');

    const { headers, body, method, url } = props;
    const requestUrl = `${apiUrl}${url}`;
    const response = await fetch(requestUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    const isUnAuthorized =
      response.status === HttpStatus.UNAUTHORIZED || response.status === HttpStatus.FORBIDDEN;
    if (isUnAuthorized) {
      clearAuthCookie();
      router.push('/login');
    }

    return response;
  }

  function clearAuthCookie() {
    const pathsToClear = ['/', '/login'];

    pathsToClear.forEach((path) => {
      document.cookie = `authToken=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    });
  }

  return {
    request,
  };
};
