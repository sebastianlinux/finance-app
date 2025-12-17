import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Budget, AppSettings } from '@/types';
import { normalizeCategoryToKey } from '@/utils/categories';

interface FinanceState {
  // Data
  transactions: Transaction[];
  budgets: Budget[];
  settings: AppSettings;

  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Budget actions
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  deleteBudget: (id: string) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;

  // Settings actions
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetAllData: () => void;

  // Computed values
  getBalance: () => number;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getCategorySpending: (category: string) => number;
}

const defaultSettings: AppSettings = {
  currency: 'USD',
  language: 'en',
  darkMode: false,
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      budgets: [],
      settings: defaultSettings,

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            ...state.transactions,
            {
              ...transaction,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            },
          ],
        })),

      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      addBudget: (budget) =>
        set((state) => ({
          budgets: [
            ...state.budgets,
            {
              ...budget,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            },
          ],
        })),

      deleteBudget: (id) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        })),

      updateBudget: (id, updates) =>
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        })),

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      resetAllData: () =>
        set({
          transactions: [],
          budgets: [],
          settings: defaultSettings,
        }),

      getBalance: () => {
        const state = get();
        return state.getTotalIncome() - state.getTotalExpenses();
      },

      getTotalIncome: () => {
        const state = get();
        return state.transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getTotalExpenses: () => {
        const state = get();
        return state.transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getCategorySpending: (category: string) => {
        const state = get();
        const normalizedCategory = normalizeCategoryToKey(category);
        return state.transactions
          .filter((t) => {
            const normalizedTransactionCategory = normalizeCategoryToKey(t.category);
            return t.type === 'expense' && normalizedTransactionCategory === normalizedCategory;
          })
          .reduce((sum, t) => sum + t.amount, 0);
      },
    }),
    {
      name: 'finance-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        budgets: state.budgets,
        settings: state.settings,
      }),
    }
  )
);
