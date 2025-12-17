import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, PlanType } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  
  // Auth actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updatePlan: (plan: PlanType) => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
}

// Simple in-memory user database (for demo - in production this would be a backend)
const usersDb: Map<string, { email: string; password: string; name: string; plan: PlanType }> = new Map();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const userData = usersDb.get(email.toLowerCase());
        
        if (!userData || userData.password !== password) {
          return { success: false, error: 'Invalid email or password' };
        }

        const user: User = {
          id: email.toLowerCase(),
          email: userData.email,
          name: userData.name,
          plan: userData.plan,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set({
          user,
          isAuthenticated: true,
        });

        return { success: true };
      },

      register: async (email: string, password: string, name: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const emailLower = email.toLowerCase();
        
        if (usersDb.has(emailLower)) {
          return { success: false, error: 'Email already registered' };
        }

        if (password.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters' };
        }

        const user: User = {
          id: emailLower,
          email: emailLower,
          name,
          plan: 'basic',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        usersDb.set(emailLower, {
          email: emailLower,
          password, // In production, this would be hashed
          name,
          plan: 'basic',
        });

        set({
          user,
          isAuthenticated: true,
        });

        return { success: true };
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser: User = {
            ...currentUser,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          set({ user: updatedUser });
          
          // Update in-memory DB
          const userData = usersDb.get(currentUser.email);
          if (userData) {
            if (updates.name) userData.name = updates.name;
            if (updates.email) {
              usersDb.delete(currentUser.email);
              usersDb.set(updates.email.toLowerCase(), userData);
            }
          }
        }
      },

      updatePlan: (plan: PlanType) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser: User = {
            ...currentUser,
            plan,
            updatedAt: new Date().toISOString(),
          };
          set({ user: updatedUser });
          
          const userData = usersDb.get(currentUser.email);
          if (userData) {
            userData.plan = plan;
          }
        }
      },

      requestPasswordReset: async (email: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const emailLower = email.toLowerCase();
        const exists = usersDb.has(emailLower);
        
        // Always return success for security (don't reveal if email exists)
        return {
          success: true,
          message: exists
            ? 'Password reset instructions sent to your email'
            : 'If this email exists, password reset instructions have been sent',
        };
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
