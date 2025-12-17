import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Budget, AppSettings, CustomCategory, BudgetTemplate, FinancialGoal, RecurringTransaction, Alert, SharedBudget } from '@/types';
import { normalizeCategoryToKey } from '@/utils/categories';
import { useAuthStore } from './authStore';

// Helper functions
function calculateNextDueDate(startDate: string, frequency: RecurringTransaction['frequency']): string {
  const date = new Date(startDate);
  switch (frequency) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date.toISOString().split('T')[0];
}

function getCategoryBreakdown(transactions: Transaction[]): Array<{ category: string; amount: number }> {
  const breakdown = new Map<string, number>();
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const current = breakdown.get(t.category) || 0;
      breakdown.set(t.category, current + t.amount);
    });
  return Array.from(breakdown.entries()).map(([category, amount]) => ({ category, amount }));
}

interface MonthlyReport {
  income: number;
  expenses: number;
  transactions: number;
  byCategory: Array<{ category: string; amount: number }>;
}

interface YearlyReport {
  totalIncome: number;
  totalExpenses: number;
  transactions: number;
  monthlyBreakdown: MonthlyReport[];
  byCategory: Array<{ category: string; amount: number }>;
}

interface PeriodComparison {
  period1: MonthlyReport;
  period2: MonthlyReport;
  incomeChange: number;
  expenseChange: number;
  incomeChangePercent: number;
  expenseChangePercent: number;
}

interface FinancialProjection {
  month: string;
  projectedIncome: number;
  projectedExpenses: number;
  projectedBalance: number;
}

interface CategoryAnalysis {
  categories: Array<{ category: string; amount: number }>;
  total: number;
  average: number;
  problemCategories: Array<{ category: string; amount: number }>;
}

interface Insight {
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
}

interface FinanceState {
  // Data
  transactions: Transaction[];
  budgets: Budget[];
  settings: AppSettings;
  customCategories: CustomCategory[];
  budgetTemplates: BudgetTemplate[];
  financialGoals: FinancialGoal[];
  recurringTransactions: RecurringTransaction[];
  alerts: Alert[];
  sharedBudgets: SharedBudget[];

  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Budget actions
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  deleteBudget: (id: string) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  getBudgetHistory: (category: string, period: 'monthly' | 'yearly') => Budget[];

  // Custom Categories actions
  addCustomCategory: (category: Omit<CustomCategory, 'id' | 'userId' | 'createdAt'>) => void;
  updateCustomCategory: (id: string, updates: Partial<CustomCategory>) => void;
  deleteCustomCategory: (id: string) => void;
  getAllCategories: (type?: 'income' | 'expense') => string[];

  // Budget Templates actions
  addBudgetTemplate: (template: Omit<BudgetTemplate, 'id' | 'userId' | 'createdAt'>) => void;
  deleteBudgetTemplate: (id: string) => void;
  applyBudgetTemplate: (templateId: string) => void;

  // Financial Goals actions
  addFinancialGoal: (goal: Omit<FinancialGoal, 'id' | 'userId' | 'createdAt' | 'currentAmount'>) => void;
  updateFinancialGoal: (id: string, updates: Partial<FinancialGoal>) => void;
  deleteFinancialGoal: (id: string) => void;
  updateGoalProgress: (goalId: string, amount: number) => void;

  // Recurring Transactions actions
  addRecurringTransaction: (transaction: Omit<RecurringTransaction, 'id' | 'userId' | 'nextDueDate'>) => void;
  updateRecurringTransaction: (id: string, updates: Partial<RecurringTransaction>) => void;
  deleteRecurringTransaction: (id: string) => void;
  processRecurringTransactions: () => void;

  // Alerts actions
  addAlert: (alert: Omit<Alert, 'id' | 'userId' | 'createdAt' | 'isRead'>) => void;
  markAlertAsRead: (id: string) => void;
  deleteAlert: (id: string) => void;
  checkBudgetAlerts: () => void;

  // Shared Budgets actions
  shareBudget: (budgetId: string, permission: 'view' | 'edit', expiresInDays?: number) => SharedBudget;
  getSharedBudget: (shareToken: string) => SharedBudget | null;
  revokeSharedBudget: (id: string) => void;
  getSharedBudgetsByBudget: (budgetId: string) => SharedBudget[];
  checkBalanceAlerts: () => void;

  // Settings actions
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetAllData: () => void;

  // Computed values
  getBalance: () => number;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getCategorySpending: (category: string) => number;
  getMonthlyReport: (year: number, month: number) => MonthlyReport;
  getYearlyReport: (year: number) => YearlyReport;
  comparePeriods: (period1: { year: number; month: number }, period2: { year: number; month: number }) => PeriodComparison;
  getFinancialProjection: (months: number) => FinancialProjection[];
  getCategoryAnalysis: () => CategoryAnalysis;
  getInsights: () => Insight[];
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
      customCategories: [],
      budgetTemplates: [],
      financialGoals: [],
      recurringTransactions: [],
      alerts: [],
      sharedBudgets: [],

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
          customCategories: [],
          budgetTemplates: [],
          financialGoals: [],
          recurringTransactions: [],
          alerts: [],
          sharedBudgets: [],
        }),

      // Shared Budgets actions
      shareBudget: (budgetId, permission, expiresInDays) => {
        const user = useAuthStore.getState().user;
        if (!user) throw new Error('User not authenticated');

        const shareToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const expiresAt = expiresInDays
          ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
          : undefined;

        const sharedBudget: SharedBudget = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          budgetId,
          shareToken,
          createdBy: user.id,
          permission,
          expiresAt,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          sharedBudgets: [...state.sharedBudgets, sharedBudget],
        }));

        return sharedBudget;
      },

      getSharedBudget: (shareToken) => {
        const state = get();
        const shared = state.sharedBudgets.find((sb) => sb.shareToken === shareToken);
        
        if (!shared) return null;
        
        // Check if expired
        if (shared.expiresAt && new Date(shared.expiresAt) < new Date()) {
          return null;
        }
        
        return shared;
      },

      revokeSharedBudget: (id) =>
        set((state) => ({
          sharedBudgets: state.sharedBudgets.filter((sb) => sb.id !== id),
        })),

      getSharedBudgetsByBudget: (budgetId) => {
        const state = get();
        return state.sharedBudgets.filter((sb) => sb.budgetId === budgetId);
      },

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

      // Custom Categories
      addCustomCategory: (category) => {
        const userId = useAuthStore.getState().user?.id || '';
        set((state) => ({
          customCategories: [
            ...state.customCategories,
            {
              ...category,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              userId,
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },

      updateCustomCategory: (id, updates) => {
        set((state) => ({
          customCategories: state.customCategories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteCustomCategory: (id) => {
        set((state) => ({
          customCategories: state.customCategories.filter((c) => c.id !== id),
        }));
      },

      getAllCategories: (type) => {
        const state = get();
        const defaultCategories = ['food', 'transport', 'shopping', 'bills', 'entertainment', 'health', 'education', 'salary', 'freelance', 'investment', 'other'];
        const customCategories = state.customCategories
          .filter((c) => !type || c.type === type)
          .map((c) => c.name);
        return [...defaultCategories, ...customCategories];
      },

      // Budget History
      getBudgetHistory: (category, period) => {
        const state = get();
        return state.budgets.filter((b) => {
          const normalizedBudgetCategory = normalizeCategoryToKey(b.category);
          const normalizedCategory = normalizeCategoryToKey(category);
          return normalizedBudgetCategory === normalizedCategory && b.period === period;
        });
      },

      // Budget Templates
      addBudgetTemplate: (template) => {
        const userId = useAuthStore.getState().user?.id || '';
        set((state) => ({
          budgetTemplates: [
            ...state.budgetTemplates,
            {
              ...template,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              userId,
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },

      deleteBudgetTemplate: (id) => {
        set((state) => ({
          budgetTemplates: state.budgetTemplates.filter((t) => t.id !== id),
        }));
      },

      applyBudgetTemplate: (templateId) => {
        const state = get();
        const template = state.budgetTemplates.find((t) => t.id === templateId);
        if (template) {
          template.budgets.forEach((budget) => {
            get().addBudget(budget);
          });
        }
      },

      // Financial Goals
      addFinancialGoal: (goal) => {
        const userId = useAuthStore.getState().user?.id || '';
        set((state) => ({
          financialGoals: [
            ...state.financialGoals,
            {
              ...goal,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              userId,
              currentAmount: 0,
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },

      updateFinancialGoal: (id, updates) => {
        set((state) => ({
          financialGoals: state.financialGoals.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        }));
      },

      deleteFinancialGoal: (id) => {
        set((state) => ({
          financialGoals: state.financialGoals.filter((g) => g.id !== id),
        }));
      },

      updateGoalProgress: (goalId, amount) => {
        set((state) => ({
          financialGoals: state.financialGoals.map((g) =>
            g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
          ),
        }));
      },

      // Recurring Transactions
      addRecurringTransaction: (transaction) => {
        const userId = useAuthStore.getState().user?.id || '';
        const nextDueDate = calculateNextDueDate(transaction.startDate, transaction.frequency);
        set((state) => ({
          recurringTransactions: [
            ...state.recurringTransactions,
            {
              ...transaction,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              userId,
              nextDueDate,
            },
          ],
        }));
      },

      updateRecurringTransaction: (id, updates) => {
        set((state) => ({
          recurringTransactions: state.recurringTransactions.map((rt) =>
            rt.id === id ? { ...rt, ...updates } : rt
          ),
        }));
      },

      deleteRecurringTransaction: (id) => {
        set((state) => ({
          recurringTransactions: state.recurringTransactions.filter((rt) => rt.id !== id),
        }));
      },

      processRecurringTransactions: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        state.recurringTransactions
          .filter((rt) => rt.isActive && rt.nextDueDate <= today && (!rt.endDate || rt.endDate >= today))
          .forEach((rt) => {
            get().addTransaction({
              type: rt.type,
              amount: rt.amount,
              category: rt.category,
              date: rt.nextDueDate,
              description: rt.description,
            });
            
            const nextDue = calculateNextDueDate(rt.nextDueDate, rt.frequency);
            get().updateRecurringTransaction(rt.id, { nextDueDate: nextDue });
          });
      },

      // Alerts
      addAlert: (alert) => {
        const userId = useAuthStore.getState().user?.id || '';
        set((state) => ({
          alerts: [
            ...state.alerts,
            {
              ...alert,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              userId,
              isRead: false,
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },

      markAlertAsRead: (id) => {
        set((state) => ({
          alerts: state.alerts.map((a) => (a.id === id ? { ...a, isRead: true } : a)),
        }));
      },

      deleteAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.filter((a) => a.id !== id),
        }));
      },

      checkBudgetAlerts: () => {
        const state = get();
        state.budgets.forEach((budget) => {
          const used = get().getCategorySpending(budget.category);
          if (used > budget.limit) {
            get().addAlert({
              type: 'budget_exceeded',
              title: 'Budget Exceeded',
              message: `You have exceeded your ${budget.category} budget. Used: ${used.toFixed(2)}, Limit: ${budget.limit.toFixed(2)}`,
              actionUrl: '/budgets',
            });
          }
        });
      },

      checkBalanceAlerts: () => {
        const balance = get().getBalance();
        if (balance < 0) {
          get().addAlert({
            type: 'low_balance',
            title: 'Negative Balance',
            message: `Your balance is negative: ${balance.toFixed(2)}`,
            actionUrl: '/dashboard',
          });
        } else if (balance < 100) {
          get().addAlert({
            type: 'low_balance',
            title: 'Low Balance Warning',
            message: `Your balance is low: ${balance.toFixed(2)}`,
            actionUrl: '/dashboard',
          });
        }
      },

      // Reports
      getMonthlyReport: (year, month) => {
        const state = get();
        const startDate = new Date(year, month - 1, 1).toISOString();
        const endDate = new Date(year, month, 0).toISOString();
        const monthTransactions = state.transactions.filter(
          (t) => t.date >= startDate && t.date <= endDate
        );
        return {
          income: monthTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
          expenses: monthTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
          transactions: monthTransactions.length,
          byCategory: getCategoryBreakdown(monthTransactions),
        };
      },

      getYearlyReport: (year) => {
        const state = get();
        const yearTransactions = state.transactions.filter(
          (t) => new Date(t.date).getFullYear() === year
        );
        const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => {
          return get().getMonthlyReport(year, i + 1);
        });
        return {
          totalIncome: yearTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
          totalExpenses: yearTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
          transactions: yearTransactions.length,
          monthlyBreakdown,
          byCategory: getCategoryBreakdown(yearTransactions),
        };
      },

      comparePeriods: (period1, period2) => {
        const report1 = get().getMonthlyReport(period1.year, period1.month);
        const report2 = get().getMonthlyReport(period2.year, period2.month);
        return {
          period1: report1,
          period2: report2,
          incomeChange: report2.income - report1.income,
          expenseChange: report2.expenses - report1.expenses,
          incomeChangePercent: report1.income > 0 ? ((report2.income - report1.income) / report1.income) * 100 : 0,
          expenseChangePercent: report1.expenses > 0 ? ((report2.expenses - report1.expenses) / report1.expenses) * 100 : 0,
        };
      },

      getFinancialProjection: (months) => {
        const now = new Date();
        const last3Months = Array.from({ length: 3 }, (_, i) => {
          const date = new Date(now.getFullYear(), now.getMonth() - (2 - i), 1);
          return get().getMonthlyReport(date.getFullYear(), date.getMonth() + 1);
        });
        
        const avgIncome = last3Months.reduce((sum, r) => sum + r.income, 0) / 3;
        const avgExpenses = last3Months.reduce((sum, r) => sum + r.expenses, 0) / 3;
        const currentBalance = get().getBalance();

        return Array.from({ length: months }, (_, i) => {
          const projectedBalance = currentBalance + (avgIncome - avgExpenses) * (i + 1);
          return {
            month: new Date(now.getFullYear(), now.getMonth() + i + 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            projectedIncome: avgIncome,
            projectedExpenses: avgExpenses,
            projectedBalance,
          };
        });
      },

      getCategoryAnalysis: () => {
        const state = get();
        const categorySpending = new Map<string, number>();
        state.transactions
          .filter((t) => t.type === 'expense')
          .forEach((t) => {
            const current = categorySpending.get(t.category) || 0;
            categorySpending.set(t.category, current + t.amount);
          });

        const categories = Array.from(categorySpending.entries())
          .map(([category, amount]) => ({ category, amount }))
          .sort((a, b) => b.amount - a.amount);

        const total = categories.reduce((sum, c) => sum + c.amount, 0);
        const avgPerCategory = categories.length > 0 ? total / categories.length : 0;

        return {
          categories,
          total,
          average: avgPerCategory,
          problemCategories: categories.filter((c) => c.amount > avgPerCategory * 1.5),
        };
      },

      getInsights: () => {
        const insights: Insight[] = [];
        const balance = get().getBalance();
        const categoryAnalysis = get().getCategoryAnalysis();

        if (balance < 0) {
          insights.push({
            type: 'warning',
            title: 'Negative Balance',
            message: 'Your expenses exceed your income. Consider reviewing your spending habits.',
          });
        }

        if (categoryAnalysis.problemCategories.length > 0) {
          insights.push({
            type: 'info',
            title: 'High Spending Categories',
            message: `You're spending significantly more than average in: ${categoryAnalysis.problemCategories.map((c: { category: string; amount: number }) => c.category).join(', ')}`,
          });
        }

        const now = new Date();
        const monthlyAvg = get().getMonthlyReport(now.getFullYear(), now.getMonth() + 1);
        if (monthlyAvg.expenses > monthlyAvg.income * 0.8) {
          insights.push({
            type: 'warning',
            title: 'High Expense Ratio',
            message: 'Your expenses are more than 80% of your income. Consider increasing savings.',
          });
        }

        return insights;
      },
    }),
    {
      name: 'finance-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        budgets: state.budgets,
        settings: state.settings,
        customCategories: state.customCategories,
        budgetTemplates: state.budgetTemplates,
        financialGoals: state.financialGoals,
        recurringTransactions: state.recurringTransactions,
        alerts: state.alerts,
        sharedBudgets: state.sharedBudgets,
      }),
    }
  )
);
