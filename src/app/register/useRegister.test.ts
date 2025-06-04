import { useRegister } from './useRegister';
import { useLiveChat } from '@/hooks';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// src/app/register/useRegister.test.ts

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks', () => ({
  useLiveChat: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('useRegister', () => {
  // Set up common mocks
  const mockPush = jest.fn();
  const mockRequest = jest.fn();
  const mockResponse = {
    ok: true,
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useLiveChat as jest.Mock).mockReturnValue({ request: mockRequest });
    mockRequest.mockResolvedValue(mockResponse);
  });

  test('should return registerUser function', () => {
    const result = useRegister();
    expect(result).toHaveProperty('registerUser');
    expect(typeof result.registerUser).toBe('function');
  });

  test('successful registration redirects to login page and shows success toast', async () => {
    mockResponse.ok = true;
    mockRequest.mockResolvedValueOnce(mockResponse);

    const { registerUser } = useRegister();
    const userData = {
      username: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    await registerUser(userData);

    // Verify request was called with correct parameters
    expect(mockRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/users',
      body: userData,
    });

    // Verify success path was followed
    expect(toast.success).toHaveBeenCalledWith('Registration successful! Please log in.');
    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(toast.error).not.toHaveBeenCalled();
  });

  test('failed registration shows error toast', async () => {
    const errorDetail = 'Email already exists';
    mockResponse.ok = false;
    mockResponse.json.mockResolvedValueOnce({ detail: errorDetail });
    mockRequest.mockResolvedValueOnce(mockResponse);

    const { registerUser } = useRegister();
    const userData = {
      username: 'Test User',
      email: 'existing@example.com',
      password: 'password123',
    };

    await registerUser(userData);

    // Verify error path was followed
    expect(toast.error).toHaveBeenCalledWith(`Registration failed: ${errorDetail}`);
    expect(mockPush).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });
});
