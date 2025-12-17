'use client';

import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFinanceStore } from '@/store/financeStore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EmptyState from '@/components/common/EmptyState';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { formatCurrency } from '@/utils/format';

export default function DashboardPage() {
  const { t } = useTranslation();
  const balance = useFinanceStore((state) => state.getBalance());
  const totalIncome = useFinanceStore((state) => state.getTotalIncome());
  const totalExpenses = useFinanceStore((state) => state.getTotalExpenses());
  const transactions = useFinanceStore((state) => state.transactions);
  const currency = useFinanceStore((state) => state.settings.currency);
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

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

      <Grid container spacing={3} sx={{ mt: 1, mb: 4 }}>
        {statCards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      {card.title}
                    </Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ color: card.color }}>
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
                        {transaction.description || transaction.category}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
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
                      {formatCurrency(transaction.amount, currency)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
