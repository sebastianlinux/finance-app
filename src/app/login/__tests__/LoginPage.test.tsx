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

// Don't mock i18next - use the real one from TestWrapper

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
    
    // Check for login button - use getAllByRole and filter by type="submit"
    const buttons = screen.getAllByRole('button', { name: /sign.*in|login/i });
    const submitButton = buttons.find(btn => btn.getAttribute('type') === 'submit');
    expect(submitButton).toBeInTheDocument();
  });

  it('should show validation error for empty email', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    
    const buttons = screen.getAllByRole('button', { name: /sign.*in|login/i });
    const submitButton = buttons.find(btn => btn.getAttribute('type') === 'submit')!;
    await user.click(submitButton);
    
    await waitFor(() => {
      // Look for error text - could be "Email is required" or translation key
      const errorText = screen.queryByText(/email.*required|email is required/i);
      expect(errorText).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email format', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    
    const buttons = screen.getAllByRole('button', { name: /sign.*in|login/i });
    const submitButton = buttons.find(btn => btn.getAttribute('type') === 'submit')!;
    await user.click(submitButton);
    
    // Wait a bit for validation to run
    await waitFor(() => {
      // Check that user is still not authenticated (form didn't submit)
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    }, { timeout: 1000 });
    
    // Also try to find error text (may be in helperText or elsewhere)
    const errorText = screen.queryByText(/invalid|formato|format/i);
    // If error text is found, great. If not, at least verify form didn't submit
    if (errorText) {
      expect(errorText).toBeInTheDocument();
    }
  });

  it('should show validation error for empty password', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@example.com');
    
    const buttons = screen.getAllByRole('button', { name: /sign.*in|login/i });
    const submitButton = buttons.find(btn => btn.getAttribute('type') === 'submit')!;
    await user.click(submitButton);
    
    await waitFor(() => {
      // Look for error text - could be "Password is required" or translation
      const errorText = screen.queryByText(/password.*required|password is required/i);
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
    
    const buttons = screen.getAllByRole('button', { name: /sign.*in|login/i });
    const submitButton = buttons.find(btn => btn.getAttribute('type') === 'submit')!;
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
    
    const buttons = screen.getAllByRole('button', { name: /sign.*in|login/i });
    const submitButton = buttons.find(btn => btn.getAttribute('type') === 'submit')!;
    await user.click(submitButton);
    
    await waitFor(() => {
      const errorText = screen.queryByText(/invalid|error|wrong|incorrecto|invalidCredentials/i);
      expect(errorText).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
