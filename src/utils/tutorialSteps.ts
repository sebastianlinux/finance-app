import { TutorialStep } from '@/components/common/TutorialTour';

export const getDashboardTutorialSteps = (t: (key: string) => string): TutorialStep[] => [
  {
    id: 'dashboard-welcome',
    title: t('tutorial.dashboard.welcome.title'),
    content: t('tutorial.dashboard.welcome.content'),
    position: 'center',
  },
  {
    id: 'dashboard-balance',
    target: '[data-tutorial="balance-card"]',
    title: t('tutorial.dashboard.balance.title'),
    content: t('tutorial.dashboard.balance.content'),
    position: 'bottom',
  },
  {
    id: 'dashboard-charts',
    target: '[data-tutorial="charts"]',
    title: t('tutorial.dashboard.charts.title'),
    content: t('tutorial.dashboard.charts.content'),
    position: 'bottom',
  },
  {
    id: 'dashboard-transactions',
    target: '[data-tutorial="recent-transactions"]',
    title: t('tutorial.dashboard.transactions.title'),
    content: t('tutorial.dashboard.transactions.content'),
    position: 'bottom',
  },
];

export const getTransactionsTutorialSteps = (t: (key: string) => string): TutorialStep[] => [
  {
    id: 'transactions-welcome',
    title: t('tutorial.transactions.welcome.title'),
    content: t('tutorial.transactions.welcome.content'),
    position: 'center',
  },
  {
    id: 'transactions-add',
    target: '[data-tutorial="add-transaction"]',
    title: t('tutorial.transactions.add.title'),
    content: t('tutorial.transactions.add.content'),
    position: 'bottom',
  },
  {
    id: 'transactions-filters',
    target: '[data-tutorial="filters"]',
    title: t('tutorial.transactions.filters.title'),
    content: t('tutorial.transactions.filters.content'),
    position: 'bottom',
  },
  {
    id: 'transactions-views',
    target: '[data-tutorial="view-modes"]',
    title: t('tutorial.transactions.views.title'),
    content: t('tutorial.transactions.views.content'),
    position: 'bottom',
  },
];

export const getBudgetsTutorialSteps = (t: (key: string) => string): TutorialStep[] => [
  {
    id: 'budgets-welcome',
    title: t('tutorial.budgets.welcome.title'),
    content: t('tutorial.budgets.welcome.content'),
    position: 'center',
  },
  {
    id: 'budgets-add',
    target: '[data-tutorial="add-budget"]',
    title: t('tutorial.budgets.add.title'),
    content: t('tutorial.budgets.add.content'),
    position: 'bottom',
  },
  {
    id: 'budgets-progress',
    target: '[data-tutorial="budget-progress"]',
    title: t('tutorial.budgets.progress.title'),
    content: t('tutorial.budgets.progress.content'),
    position: 'bottom',
  },
];

export const getMainTutorialSteps = (t: (key: string) => string): TutorialStep[] => [
  {
    id: 'welcome',
    title: t('tutorial.main.welcome.title'),
    content: t('tutorial.main.welcome.content'),
    position: 'center',
  },
  {
    id: 'navigation',
    target: '[data-tutorial="sidebar"]',
    title: t('tutorial.main.navigation.title'),
    content: t('tutorial.main.navigation.content'),
    position: 'right',
  },
  {
    id: 'dashboard',
    target: '[data-tutorial="dashboard-link"]',
    title: t('tutorial.main.dashboard.title'),
    content: t('tutorial.main.dashboard.content'),
    position: 'right',
  },
  {
    id: 'features',
    title: t('tutorial.main.features.title'),
    content: t('tutorial.main.features.content'),
    position: 'center',
  },
];
