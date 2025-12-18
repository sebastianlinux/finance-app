import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders, userEvent } from '@/test/testUtils';
import LoginPage from '../page';
import { useAuthStore } from '@/store/authStore';

// Mock Next.js router
const mockPush = vi.fn();
const mockPathname = '/login';
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname,
}));

// Note: i18next is handled by TestWrapper, no need to mock

describe('LoginPage', () => {
  beforeEach(() => {
    const store = useAuthStore.getState();
    store.logout();
    mockPush.mockClear();
  });

  it('should render login form', () => {
    renderWithProviders(<LoginPage />);
    
    // Check for email input by label
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    
    // Check for password input by label
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
    
    // Check for login button
    const loginButton = screen.getByRole('button', { name: /sign.*in|login/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('should show validation error for empty email', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    
    const submitButton = screen.getByRole('button', { name: /sign.*in|login/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      const errorText = screen.queryByText(/email.*required|emailRequired/i);
      expect(errorText).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email format', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByRole('button', { name: /sign.*in|login/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      const errorText = screen.queryByText(/email.*invalid|emailInvalid/i);
      expect(errorText).toBeInTheDocument();
    });
  });

  it('should show validation error for empty password', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@example.com');
    
    const submitButton = screen.getByRole('button', { name: /sign.*in|login/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      const errorText = screen.queryByText(/password.*required|passwordRequired/i);
      expect(errorText).toBeInTheDocument();
    });
  });

  it('should login successfully with valid credentials', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await user.type(emailInput, 'demo@example.com');
    await user.type(passwordInput, 'demo123');
    
    const submitButton = screen.getByRole('button', { name: /sign.*in|login/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    }, { timeout: 3000 });
  });

  it('should show error message for invalid credentials', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await user.type(emailInput, 'demo@example.com');
    await user.type(passwordInput, 'wrongpassword');
    
    const submitButton = screen.getByRole('button', { name: /sign.*in|login/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      const errorText = screen.queryByText(/invalid|error|wrong|incorrecto|invalidCredentials/i);
      expect(errorText).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
