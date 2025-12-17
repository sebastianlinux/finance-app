'use client';

import { useMemo } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Alert, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFinanceStore } from '@/store/financeStore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EmptyState from '@/components/common/EmptyState';
import ReceiptIcon from '@mui/icons-material/Receipt';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import { formatCurrency } from '@/utils/format';
import { useTranslateCategory } from '@/utils/translateCategory';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppLayout from '@/components/Layout/AppLayout';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getAllCategoryKeys } from '@/utils/categories';
import { useTutorial } from '@/hooks/useTutorial';
import TutorialTour from '@/components/common/TutorialTour';
import { getDashboardTutorialSteps } from '@/utils/tutorialSteps';

function DashboardPage() {
  const { t } = useTranslation();
  const translateCategory = useTranslateCategory();
  const balance = useFinanceStore((state) => state.getBalance());
  const totalIncome = useFinanceStore((state) => state.getTotalIncome());
  const totalExpenses = useFinanceStore((state) => state.getTotalExpenses());
  const transactions = useFinanceStore((state) => state.transactions);
  const budgets = useFinanceStore((state) => state.budgets);
  const getCategorySpending = useFinanceStore((state) => state.getCategorySpending);
  const currency = useFinanceStore((state) => state.settings.currency);
  
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Calculate monthly data for trends
  const monthlyData = useMemo(() => {
    const monthlyMap = new Map<string, { income: number; expenses: number; month: string }>();
    
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { income: 0, expenses: 0, month: monthLabel });
      }
      
      const data = monthlyMap.get(monthKey)!;
      if (transaction.type === 'income') {
        data.income += transaction.amount;
      } else {
        data.expenses += transaction.amount;
      }
    });
    
    return Array.from(monthlyMap.values())
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months
  }, [transactions]);

  // Calculate expenses by category
  const expensesByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>();
    const allCategories = getAllCategoryKeys();
    
    allCategories.forEach((category) => {
      const spending = getCategorySpending(category);
      if (spending > 0) {
        categoryMap.set(category, spending);
      }
    });
    
    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        name: translateCategory(category),
        value: amount,
        category,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 categories
  }, [transactions, getCategorySpending, translateCategory]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (transactions.length === 0) {
      return {
        avgMonthlyIncome: 0,
        avgMonthlyExpense: 0,
        topCategory: null,
        transactionCount: 0,
      };
    }

    const expenseTransactions = transactions.filter((t) => t.type === 'expense');
    
    // Calculate average monthly income/expense
    const months = new Set(
      transactions.map((t) => {
        const date = new Date(t.date);
        return `${date.getFullYear()}-${date.getMonth()}`;
      })
    ).size || 1;

    const categorySpending = new Map<string, number>();
    expenseTransactions.forEach((t) => {
      const current = categorySpending.get(t.category) || 0;
      categorySpending.set(t.category, current + t.amount);
    });

    const topCategory = Array.from(categorySpending.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    return {
      avgMonthlyIncome: totalIncome / months,
      avgMonthlyExpense: totalExpenses / months,
      topCategory,
      transactionCount: transactions.length,
    };
  }, [transactions, totalIncome, totalExpenses]);

  const COLORS = [
    '#1976d2',
    '#9c27b0',
    '#f50057',
    '#ff9800',
    '#4caf50',
    '#00bcd4',
    '#e91e63',
    '#795548',
  ];

  // Check for budget overruns
  const budgetAlerts = useMemo(() => {
    return budgets
      .map((budget) => {
        const used = getCategorySpending(budget.category);
        return { category: budget.category, used, limit: budget.limit };
      })
      .filter((b) => b.used > b.limit);
  }, [budgets, transactions, getCategorySpending]);

  // Get store functions (not calling them in selector)
  const getInsightsFn = useFinanceStore((state) => state.getInsights);
  const getCategoryAnalysisFn = useFinanceStore((state) => state.getCategoryAnalysis);
  
  // Calculate insights and analysis using useMemo
  const insights = useMemo(() => {
    return getInsightsFn();
  }, [getInsightsFn, transactions, budgets]);
  
  const categoryAnalysis = useMemo(() => {
    return getCategoryAnalysisFn();
  }, [getCategoryAnalysisFn, transactions]);

  // Tutorial
  const { tutorialOpen, setTutorialOpen, markTutorialCompleted } = useTutorial();
  const dashboardSteps = getDashboardTutorialSteps((key: string) => t(key) || key);
  // Use tutorialOpen as part of key to force remount when it opens (resets to step 0)
  // The TutorialTour component already handles reset internally via useEffect

  const statCards = [
    {
      title: t('dashboard.balance'),
      value: balance,
      icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
      color: balance >= 0 ? 'success.main' : 'error.main',
    },
    {
      title: t('dashboard.totalIncome'),
      value: totalIncome,
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: 'success.main',
    },
    {
      title: t('dashboard.totalExpenses'),
      value: totalExpenses,
      icon: <TrendingDownIcon sx={{ fontSize: 40 }} />,
      color: 'error.main',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {t('dashboard.title')}
      </Typography>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <Alert
          severity="warning"
          icon={<WarningIcon />}
          sx={{ mb: 3 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <Typography variant="body1" fontWeight={600} gutterBottom>
            {t('dashboard.budgetExceeded') || 'Budget Exceeded!'}
          </Typography>
          {budgetAlerts.map((alert: { category: string; used: number; limit: number }, idx: number) => (
            <Typography key={idx} variant="body2">
              {translateCategory(alert.category)}: {formatCurrency(alert.used, currency)} / {formatCurrency(alert.limit, currency)} ({((alert.used / alert.limit) * 100).toFixed(1)}%)
            </Typography>
          ))}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mt: 1, mb: 4 }}>
        {statCards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.title}>
            <Card data-tutorial={card.title === t('dashboard.balance') ? 'balance-card' : undefined}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      {card.title}
                    </Typography>
                    <Typography 
                      variant="h5" 
                      fontWeight={700} 
                      sx={{ color: card.color }}
                      className="mono"
                    >
                      {formatCurrency(card.value, currency)}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      {transactions.length > 0 && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Income vs Expenses Trend */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card data-tutorial="charts">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {t('dashboard.incomeVsExpenses') || 'Income vs Expenses Trend'}
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: number | undefined) => formatCurrency(value || 0, currency)} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#4caf50"
                        strokeWidth={2}
                        name={t('dashboard.totalIncome')}
                      />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#f50057"
                        strokeWidth={2}
                        name={t('dashboard.totalExpenses')}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Expenses by Category Pie Chart */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {t('dashboard.expensesByCategory') || 'Expenses by Category'}
                  </Typography>
                  {expensesByCategory.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={expensesByCategory}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {expensesByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number | undefined) => formatCurrency(value || 0, currency)} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography color="text.secondary">
                        {t('dashboard.noExpenseData') || 'No expense data available'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Expenses by Category Bar Chart */}
          {expensesByCategory.length > 0 && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {t('dashboard.topExpenseCategories') || 'Top Expense Categories'}
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={expensesByCategory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip formatter={(value: number | undefined) => formatCurrency(value || 0, currency)} />
                        <Bar dataKey="value" fill="#1976d2" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Additional Statistics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    {t('dashboard.avgMonthlyIncome') || 'Avg Monthly Income'}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="success.main">
                    <span className="mono">{formatCurrency(stats.avgMonthlyIncome, currency)}</span>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    {t('dashboard.avgMonthlyExpense') || 'Avg Monthly Expense'}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="error.main">
                    <span className="mono">{formatCurrency(stats.avgMonthlyExpense, currency)}</span>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    {t('dashboard.topCategory') || 'Top Category'}
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {stats.topCategory ? translateCategory(stats.topCategory) : 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    {t('dashboard.totalTransactions') || 'Total Transactions'}
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {stats.transactionCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 4 }}>
        {t('dashboard.recentTransactions')}
      </Typography>

      {recentTransactions.length === 0 ? (
        <EmptyState
          message={t('dashboard.noTransactions')}
          icon={<ReceiptIcon sx={{ fontSize: 64 }} />}
        />
      ) : (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {recentTransactions.map((transaction) => (
            <Grid size={{ xs: 12 }} key={transaction.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {transaction.description || translateCategory(transaction.category)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {translateCategory(transaction.category)} • {new Date(transaction.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        color: transaction.type === 'income' ? 'success.main' : 'error.main',
                      }}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      <span className="mono">{formatCurrency(transaction.amount, currency)}</span>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Insights Section */}
      {insights.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {t('dashboard.insights') || 'Financial Insights'}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {insights.map((insight, idx) => (
                    <Alert key={idx} severity={insight.type} sx={{ width: '100%' }}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        {insight.title}
                      </Typography>
                      <Typography variant="body2">
                        {insight.message}
                      </Typography>
                    </Alert>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Category Analysis */}
      {categoryAnalysis.categories.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {t('dashboard.categoryAnalysis') || 'Category Analysis'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {t('dashboard.categoryAnalysisDesc') || 'Average spending per category: '}
                  <span className="mono">{formatCurrency(categoryAnalysis.average, currency)}</span>
                </Typography>
                {categoryAnalysis.problemCategories.length > 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      {t('dashboard.highSpendingCategories') || 'High spending categories:'}{' '}
                      {categoryAnalysis.problemCategories.map((c) => c.category).join(', ')}
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tutorial Tour */}
      <TutorialTour
        key={`tutorial-${tutorialOpen}`}
        steps={dashboardSteps}
        open={tutorialOpen}
        onClose={() => {
          setTutorialOpen(false);
          markTutorialCompleted();
        }}
        onComplete={() => {
          markTutorialCompleted();
        }}
      />
    </Container>
  );
}

export default function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <DashboardPage />
      </AppLayout>
    </ProtectedRoute>
  );
}
