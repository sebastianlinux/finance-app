'use client';

import { useState, useEffect } from 'react';
import { useFinanceStore } from '@/store/financeStore';
import { useAuthStore } from '@/store/authStore';
import { TutorialStep } from '@/components/common/TutorialTour';
import { Transaction, Budget, FinancialGoal } from '@/types';

const TUTORIAL_COMPLETED_KEY = 'tutorial_completed';
const DEMO_MODE_KEY = 'demo_mode_active';

export function useTutorial() {
  const [tutorialCompleted, setTutorialCompleted] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem(TUTORIAL_COMPLETED_KEY) === 'true';
      const demo = localStorage.getItem(DEMO_MODE_KEY) === 'true';
      setTutorialCompleted(completed);
      setDemoMode(demo);
      
      // No mostrar automáticamente - el usuario puede iniciarlo desde el botón de ayuda
      // if (!completed && !demo) {
      //   setTutorialOpen(true);
      // }
    }
  }, []);

  const markTutorialCompleted = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
      setTutorialCompleted(true);
      setTutorialOpen(false);
    }
  };

  const startTutorial = () => {
    setTutorialOpen(true);
  };

  const enableDemoMode = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_MODE_KEY, 'true');
      setDemoMode(true);
      loadDemoData();
    }
  };

  const disableDemoMode = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_MODE_KEY, 'false');
      setDemoMode(false);
      clearDemoData();
    }
  };

  const loadDemoData = () => {
    const addTransaction = useFinanceStore.getState().addTransaction;
    const addBudget = useFinanceStore.getState().addBudget;
    const addFinancialGoal = useFinanceStore.getState().addFinancialGoal;

    // Limpiar datos existentes si hay
    const transactions = useFinanceStore.getState().transactions;
    if (transactions.length === 0) {
      // Datos demo de transacciones
      const demoTransactions: Omit<Transaction, 'id'>[] = [
        {
          type: 'income',
          amount: 3500,
          category: 'salary',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: 'Monthly Salary',
        },
        {
          type: 'expense',
          amount: 1200,
          category: 'bills',
          date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: 'Rent Payment',
        },
        {
          type: 'expense',
          amount: 450,
          category: 'food',
          date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: 'Groceries',
        },
        {
          type: 'expense',
          amount: 200,
          category: 'transport',
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: 'Gas & Transportation',
        },
        {
          type: 'expense',
          amount: 150,
          category: 'entertainment',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: 'Movies & Entertainment',
        },
        {
          type: 'income',
          amount: 500,
          category: 'freelance',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: 'Freelance Project',
        },
      ];

      demoTransactions.forEach((t) => addTransaction(t));

      // Datos demo de presupuestos
      const demoBudgets: Omit<Budget, 'id'>[] = [
        {
          category: 'food',
          limit: 500,
          period: 'monthly',
        },
        {
          category: 'transport',
          limit: 300,
          period: 'monthly',
        },
        {
          category: 'entertainment',
          limit: 200,
          period: 'monthly',
        },
      ];

      demoBudgets.forEach((b) => addBudget(b));

      // Datos demo de metas
      const demoGoals: Omit<FinancialGoal, 'id' | 'userId' | 'createdAt' | 'currentAmount'>[] = [
        {
          name: 'Emergency Fund',
          targetAmount: 10000,
          deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          type: 'savings',
        },
        {
          name: 'Vacation Fund',
          targetAmount: 3000,
          deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          type: 'savings',
        },
      ];

      demoGoals.forEach((g) => addFinancialGoal(g));
    }
  };

  const clearDemoData = () => {
    useFinanceStore.getState().resetAllData();
  };

  return {
    tutorialCompleted,
    demoMode,
    tutorialOpen,
    markTutorialCompleted,
    startTutorial,
    enableDemoMode,
    disableDemoMode,
    setTutorialOpen,
  };
}
