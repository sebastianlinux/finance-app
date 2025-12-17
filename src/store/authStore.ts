import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, PlanType, Payment, Subscription, Invoice } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  payments: Payment[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  
  // Auth actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updatePlan: (plan: PlanType) => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  
  // Payment & Subscription actions
  addPayment: (payment: Omit<Payment, 'id' | 'paymentDate' | 'invoiceId'>) => Payment;
  getPayments: () => Payment[];
  getInvoices: () => Invoice[];
  getCurrentSubscription: () => Subscription | null;
  createSubscription: (plan: PlanType, paymentId: string) => Subscription;
  cancelSubscription: (subscriptionId: string) => void;
  updateSubscription: (subscriptionId: string, updates: Partial<Subscription>) => void;
  generateInvoice: (paymentId: string, subscriptionId: string) => Invoice;
}

// Simple in-memory user database (for demo - in production this would be a backend)
const usersDb: Map<string, { email: string; password: string; name: string; plan: PlanType }> = new Map();

// Initialize demo users
const initializeDemoUsers = () => {
  // Only initialize if the Map is empty (first load)
  if (usersDb.size === 0) {
    usersDb.set('demo@example.com', {
      email: 'demo@example.com',
      password: 'demo123',
      name: 'Demo User',
      plan: 'basic',
    });
    usersDb.set('premium@example.com', {
      email: 'premium@example.com',
      password: 'premium123',
      name: 'Premium User',
      plan: 'premium',
    });
    usersDb.set('standard@example.com', {
      email: 'standard@example.com',
      password: 'standard123',
      name: 'Standard User',
      plan: 'standard',
    });
  }
};

// Initialize on module load
if (typeof window !== 'undefined') {
  initializeDemoUsers();
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      payments: [],
      subscriptions: [],
      invoices: [],

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

          // If upgrading to paid plan, create payment and subscription
          if (plan !== 'basic' && currentUser.plan === 'basic') {
            const amount = plan === 'standard' ? 9.99 : 19.99;
            const payment = get().addPayment({
              userId: currentUser.id,
              plan,
              amount,
              currency: 'USD',
              status: 'completed',
              paymentMethod: 'card',
            });
            get().createSubscription(plan, payment.id);
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

      addPayment: (paymentData) => {
        const state = get();
        const payment: Payment = {
          ...paymentData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          paymentDate: new Date().toISOString(),
          invoiceId: '',
        };
        
        // Generate invoice
        const invoice = get().generateInvoice(payment.id, '');
        
        // Create subscription if upgrading
        if (state.user && paymentData.plan !== 'basic') {
          const subscription = get().createSubscription(paymentData.plan, payment.id);
          set({ subscriptions: [...state.subscriptions, subscription] });
        }
        
        set({ payments: [...state.payments, payment] });
        return payment;
      },

      getPayments: () => {
        const state = get();
        return state.payments.filter((p) => p.userId === state.user?.id);
      },

      getInvoices: () => {
        const state = get();
        return state.invoices.filter((i) => i.userId === state.user?.id);
      },

      getCurrentSubscription: () => {
        const state = get();
        if (!state.user) return null;
        return state.subscriptions.find(
          (s) => s.userId === state.user?.id && s.status === 'active'
        ) || null;
      },

      createSubscription: (plan, paymentId) => {
        const state = get();
        const now = new Date();
        const endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + 1);
        const renewalDate = new Date(endDate);

        const subscription: Subscription = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          userId: state.user?.id || '',
          plan,
          status: 'active',
          startDate: now.toISOString(),
          endDate: endDate.toISOString(),
          renewalDate: renewalDate.toISOString(),
          autoRenew: true,
          paymentId,
        };

        set({ subscriptions: [...state.subscriptions, subscription] });
        return subscription;
      },

      cancelSubscription: (subscriptionId) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === subscriptionId ? { ...s, status: 'cancelled', autoRenew: false } : s
          ),
        }));
      },

      updateSubscription: (subscriptionId, updates) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === subscriptionId ? { ...s, ...updates } : s
          ),
        }));
      },

      generateInvoice: (paymentId, subscriptionId) => {
        const state = get();
        const payment = state.payments.find((p) => p.id === paymentId);
        if (!payment) throw new Error('Payment not found');

        const invoice: Invoice = {
          id: 'INV-' + Date.now().toString(),
          userId: payment.userId,
          subscriptionId,
          paymentId,
          amount: payment.amount,
          currency: payment.currency,
          issueDate: new Date().toISOString(),
          dueDate: new Date().toISOString(),
          status: payment.status === 'completed' ? 'paid' : 'pending',
          items: [
            {
              description: `${payment.plan.charAt(0).toUpperCase() + payment.plan.slice(1)} Plan - Monthly Subscription`,
              quantity: 1,
              price: payment.amount,
            },
          ],
        };

        // Update payment with invoice ID
        set((state) => ({
          payments: state.payments.map((p) =>
            p.id === paymentId ? { ...p, invoiceId: invoice.id } : p
          ),
          invoices: [...state.invoices, invoice],
        }));

        return invoice;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        payments: state.payments,
        subscriptions: state.subscriptions,
        invoices: state.invoices,
      }),
    }
  )
);
