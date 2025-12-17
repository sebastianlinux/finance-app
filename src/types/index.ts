export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // ISO date string
  description: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  period: 'monthly' | 'yearly'; // For future use
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color?: string;
}

export interface AppSettings {
  currency: string;
  language: string;
  darkMode: boolean;
}

export type PlanType = 'basic' | 'standard' | 'premium';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: PlanType;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface Payment {
  id: string;
  userId: string;
  plan: PlanType;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentDate: string;
  invoiceId: string;
  paymentMethod: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanType;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  renewalDate: string;
  autoRenew: boolean;
  paymentId: string;
}

export interface Invoice {
  id: string;
  userId: string;
  subscriptionId: string;
  paymentId: string;
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export interface CustomCategory {
  id: string;
  userId: string;
  name: string;
  type: TransactionType;
  color: string;
  icon?: string;
  createdAt: string;
}

export interface BudgetTemplate {
  id: string;
  userId: string;
  name: string;
  budgets: Omit<Budget, 'id'>[];
  createdAt: string;
}

export interface FinancialGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category?: string;
  type: 'savings' | 'debt_payoff' | 'expense_limit';
  createdAt: string;
}

export interface RecurringTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  nextDueDate: string;
  isActive: boolean;
}

export interface Alert {
  id: string;
  userId: string;
  type: 'budget_exceeded' | 'low_balance' | 'goal_achieved' | 'recurring_due' | 'custom';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}
