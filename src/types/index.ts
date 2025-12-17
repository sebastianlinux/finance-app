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
