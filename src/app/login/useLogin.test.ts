import { useLogin } from './useLogin';
import * as hooksModule from '@/hooks';
import * as storesModule from '@/stores';

const mockRequest = jest.fn();
const mockSetUserData = jest.fn();

jest.mock('@/hooks', () => ({
  useLiveChat: jest.fn(),
}));
jest.mock('@/stores', () => ({
  useUserStore: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  (hooksModule.useLiveChat as jest.Mock).mockReturnValue({ request: mockRequest });
  (storesModule.useUserStore as unknown as jest.Mock).mockReturnValue({
    setUserData: mockSetUserData,
  });
});

describe('useLogin - fetchAuthenticatedUserData', () => {
  it('calls setUserData with fetched user data when response is ok', async () => {
    const userData = { id: '1', name: 'Test User' };
    mockRequest.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(userData),
    });

    const { fetchAuthenticatedUserData } = useLogin();
    await fetchAuthenticatedUserData();

    expect(mockRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/users/me',
    });
    expect(mockSetUserData).toHaveBeenCalledWith(userData);
  });

  it('does not call setUserData if response is not ok', async () => {
    mockRequest.mockResolvedValue({
      ok: false,
      json: jest.fn(),
    });

    const { fetchAuthenticatedUserData } = useLogin();
    await fetchAuthenticatedUserData();

    expect(mockSetUserData).not.toHaveBeenCalled();
  });
});

describe('useLogin - login', () => {
  it('sets authToken cookie and calls toast on successful login', async () => {
    const response = {
      ok: true,
      json: jest.fn().mockResolvedValue({ accessToken: 'token123' }),
    };
    mockRequest.mockResolvedValue(response);

    const { login } = useLogin();
    await login({ email: 'email', password: 'password' });
    expect(mockRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/oauth/login',
      body: { email: 'email', password: 'password' },
    });
    expect(document.cookie).toContain('authToken=token123');
  });

  it('throws error on failed login', async () => {
    const response = {
      ok: false,
      statusText: 'Unauthorized',
    };
    mockRequest.mockResolvedValue(response);

    const { login } = useLogin();
    await expect(login({ email: 'email', password: 'password' })).rejects.toThrow(
      'Failed to login: Unauthorized',
    );
  });
});
