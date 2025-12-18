import { describe, it, expect, beforeEach } from 'vitest';
import { useFinanceStore } from '../financeStore';
import { Transaction, Budget } from '@/types';

describe('financeStore', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    // Reset store data
    const store = useFinanceStore.getState();
    store.resetAllData();
  });

  describe('Transactions', () => {
    it('should add a transaction', () => {
      const transaction: Omit<Transaction, 'id'> = {
        type: 'expense',
        amount: 100,
        category: 'food',
        date: '2024-01-15',
        description: 'Test transaction',
      };
      
      useFinanceStore.getState().addTransaction(transaction);
      
      const store = useFinanceStore.getState();
      expect(store.transactions.length).toBe(1);
      expect(store.transactions[0].description).toBe('Test transaction');
      expect(store.transactions[0].amount).toBe(100);
    });

    it('should update a transaction', () => {
      // Add transaction
      useFinanceStore.getState().addTransaction({
        type: 'expense',
        amount: 100,
        category: 'food',
        date: '2024-01-15',
        description: 'Original',
      });
      
      const store = useFinanceStore.getState();
      expect(store.transactions.length).toBeGreaterThan(0);
      const transactionId = store.transactions[0].id;
      
      // Update transaction
      store.updateTransaction(transactionId, { amount: 200, description: 'Updated' });
      
      const updatedStore = useFinanceStore.getState();
      const updatedTransaction = updatedStore.transactions.find(t => t.id === transactionId);
      expect(updatedTransaction).toBeDefined();
      expect(updatedTransaction?.amount).toBe(200);
      expect(updatedTransaction?.description).toBe('Updated');
    });

    it('should delete a transaction', () => {
      // Add transaction
      useFinanceStore.getState().addTransaction({
        type: 'expense',
        amount: 100,
        category: 'food',
        date: '2024-01-15',
        description: 'To delete',
      });
      
      const store = useFinanceStore.getState();
      const transactionId = store.transactions[0].id;
      expect(store.transactions.length).toBe(1);
      
      // Delete transaction
      store.deleteTransaction(transactionId);
      
      expect(useFinanceStore.getState().transactions.length).toBe(0);
    });
  });

  describe('Budgets', () => {
    it('should add a budget', () => {
      const budget: Omit<Budget, 'id'> = {
        category: 'food',
        limit: 500,
        period: 'monthly',
      };
      
      useFinanceStore.getState().addBudget(budget);
      
      const store = useFinanceStore.getState();
      expect(store.budgets.length).toBe(1);
      expect(store.budgets[0].category).toBe('food');
      expect(store.budgets[0].limit).toBe(500);
    });

    it('should delete a budget', () => {
      useFinanceStore.getState().addBudget({
        category: 'food',
        limit: 500,
        period: 'monthly',
      });
      
      const store = useFinanceStore.getState();
      const budgetId = store.budgets[0].id;
      expect(store.budgets.length).toBe(1);
      
      store.deleteBudget(budgetId);
      
      expect(useFinanceStore.getState().budgets.length).toBe(0);
    });

    it('should update a budget', () => {
      // Add budget
      useFinanceStore.getState().addBudget({
        category: 'food',
        limit: 500,
        period: 'monthly',
      });
      
      const store = useFinanceStore.getState();
      expect(store.budgets.length).toBeGreaterThan(0);
      const budgetId = store.budgets[0].id;
      
      // Update budget
      store.updateBudget(budgetId, { limit: 600 });
      
      const updatedStore = useFinanceStore.getState();
      const updatedBudget = updatedStore.budgets.find(b => b.id === budgetId);
      expect(updatedBudget).toBeDefined();
      expect(updatedBudget?.limit).toBe(600);
    });
  });

  describe('Computed Values', () => {
    it('should calculate total income correctly', () => {
      const store = useFinanceStore.getState();
      
      store.addTransaction({
        type: 'income',
        amount: 1000,
        category: 'salary',
        date: '2024-01-15',
        description: 'Salary',
      });
      
      store.addTransaction({
        type: 'income',
        amount: 500,
        category: 'freelance',
        date: '2024-01-16',
        description: 'Freelance',
      });
      
      store.addTransaction({
        type: 'expense',
        amount: 200,
        category: 'food',
        date: '2024-01-17',
        description: 'Food',
      });
      
      expect(store.getTotalIncome()).toBe(1500);
    });

    it('should calculate total expenses correctly', () => {
      const store = useFinanceStore.getState();
      
      store.addTransaction({
        type: 'expense',
        amount: 100,
        category: 'food',
        date: '2024-01-15',
        description: 'Food',
      });
      
      store.addTransaction({
        type: 'expense',
        amount: 50,
        category: 'transport',
        date: '2024-01-16',
        description: 'Transport',
      });
      
      expect(store.getTotalExpenses()).toBe(150);
    });

    it('should calculate balance correctly', () => {
      const store = useFinanceStore.getState();
      
      store.addTransaction({
        type: 'income',
        amount: 1000,
        category: 'salary',
        date: '2024-01-15',
        description: 'Salary',
      });
      
      store.addTransaction({
        type: 'expense',
        amount: 300,
        category: 'food',
        date: '2024-01-16',
        description: 'Food',
      });
      
      expect(store.getBalance()).toBe(700);
    });

    it('should calculate category spending correctly', () => {
      const store = useFinanceStore.getState();
      
      store.addTransaction({
        type: 'expense',
        amount: 100,
        category: 'food',
        date: '2024-01-15',
        description: 'Food 1',
      });
      
      store.addTransaction({
        type: 'expense',
        amount: 50,
        category: 'food',
        date: '2024-01-16',
        description: 'Food 2',
      });
      
      store.addTransaction({
        type: 'expense',
        amount: 75,
        category: 'transport',
        date: '2024-01-17',
        description: 'Transport',
      });
      
      expect(store.getCategorySpending('food')).toBe(150);
      expect(store.getCategorySpending('transport')).toBe(75);
      expect(store.getCategorySpending('shopping')).toBe(0);
    });
  });

  describe('Settings', () => {
    it('should update settings', () => {
      useFinanceStore.getState().updateSettings({ currency: 'EUR' });
      
      expect(useFinanceStore.getState().settings.currency).toBe('EUR');
    });

    it('should update dark mode', () => {
      useFinanceStore.getState().updateSettings({ darkMode: true });
      
      expect(useFinanceStore.getState().settings.darkMode).toBe(true);
    });
  });

  describe('resetAllData', () => {
    it('should reset all data', () => {
      const store = useFinanceStore.getState();
      
      // Add some data
      store.addTransaction({
        type: 'expense',
        amount: 100,
        category: 'food',
        date: '2024-01-15',
        description: 'Test',
      });
      
      store.addBudget({
        category: 'food',
        limit: 500,
        period: 'monthly',
      });
      
      const storeAfterAdd = useFinanceStore.getState();
      expect(storeAfterAdd.transactions.length).toBe(1);
      expect(storeAfterAdd.budgets.length).toBe(1);
      
      // Reset
      store.resetAllData();
      
      const resetStore = useFinanceStore.getState();
      expect(resetStore.transactions.length).toBe(0);
      expect(resetStore.budgets.length).toBe(0);
    });
  });
});
