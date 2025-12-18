import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../authStore';

describe('authStore', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    // Reset auth state
    const store = useAuthStore.getState();
    store.logout();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const result = await useAuthStore.getState().login('demo@example.com', 'demo123');
      
      expect(result.success).toBe(true);
      
      // Get fresh state after login
      const store = useAuthStore.getState();
      expect(store.isAuthenticated).toBe(true);
      expect(store.user).toBeTruthy();
      expect(store.user?.email).toBe('demo@example.com');
    });

    it('should fail login with invalid email', async () => {
      const store = useAuthStore.getState();
      const result = await store.login('invalid@example.com', 'password');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
      expect(store.isAuthenticated).toBe(false);
    });

    it('should fail login with invalid password', async () => {
      const store = useAuthStore.getState();
      const result = await store.login('demo@example.com', 'wrongpassword');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
      expect(store.isAuthenticated).toBe(false);
    });

    it('should handle different user plans', async () => {
      // Test premium user
      await useAuthStore.getState().login('premium@example.com', 'premium123');
      expect(useAuthStore.getState().user?.plan).toBe('premium');
      
      useAuthStore.getState().logout();
      
      // Test standard user
      await useAuthStore.getState().login('standard@example.com', 'standard123');
      expect(useAuthStore.getState().user?.plan).toBe('standard');
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const result = await useAuthStore.getState().register(
        'newuser@example.com',
        'password123',
        'New User'
      );
      
      expect(result.success).toBe(true);
      
      const store = useAuthStore.getState();
      expect(store.isAuthenticated).toBe(true);
      expect(store.user?.email).toBe('newuser@example.com');
      expect(store.user?.name).toBe('New User');
    });

    it('should fail registration with existing email', async () => {
      const store = useAuthStore.getState();
      
      // First registration
      await store.register('test@example.com', 'password123', 'Test User');
      store.logout();
      
      // Try to register again with same email
      const result = await store.register('test@example.com', 'password123', 'Test User');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('logout', () => {
    it('should logout and clear user data', async () => {
      // Login first
      await useAuthStore.getState().login('demo@example.com', 'demo123');
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      
      // Logout
      useAuthStore.getState().logout();
      
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user information', async () => {
      await useAuthStore.getState().login('demo@example.com', 'demo123');
      
      useAuthStore.getState().updateUser({ name: 'Updated Name' });
      
      const store = useAuthStore.getState();
      expect(store.user?.name).toBe('Updated Name');
      expect(store.user?.email).toBe('demo@example.com'); // Email should remain
    });
  });

  describe('updatePlan', () => {
    it('should update user plan', async () => {
      const store = useAuthStore.getState();
      await store.login('demo@example.com', 'demo123');
      
      expect(store.user?.plan).toBe('basic');
      
      // Create a payment first (required for updatePlan)
      const payment = store.addPayment({
        userId: store.user!.id,
        plan: 'premium',
        amount: 29.99,
        currency: 'USD',
        status: 'completed',
        paymentMethod: 'credit_card',
      });
      
      // Now update plan
      store.updatePlan('premium');
      
      expect(store.user?.plan).toBe('premium');
    });
  });
});
