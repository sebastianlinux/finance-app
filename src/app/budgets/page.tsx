'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  LinearProgress,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useFinanceStore } from '@/store/financeStore';
import { Budget } from '@/types';
import EmptyState from '@/components/common/EmptyState';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { formatCurrency } from '@/utils/format';
import { getAllCategoryKeys } from '@/utils/categories';

export default function BudgetsPage() {
  const { t } = useTranslation();
  const budgets = useFinanceStore((state) => state.budgets);
  const addBudget = useFinanceStore((state) => state.addBudget);
  const deleteBudget = useFinanceStore((state) => state.deleteBudget);
  const getCategorySpending = useFinanceStore((state) => state.getCategorySpending);
  const currency = useFinanceStore((state) => state.settings.currency);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [formData, setFormData] = useState<Omit<Budget, 'id'>>({
    category: '',
    limit: 0,
    period: 'monthly',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const handleOpenDialog = () => {
    setFormData({
      category: '',
      limit: 0,
      period: 'monthly',
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

    if (formData.limit <= 0) {
      newErrors.limit = t('budgets.invalidLimit');
    }

    if (!formData.category) {
      newErrors.category = t('budgets.required');
    }

    // Check if budget already exists for this category
    if (budgets.some((b) => b.category === formData.category)) {
      newErrors.category = 'Budget already exists for this category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    addBudget(formData);
    setSnackbarMessage(t('budgets.addBudget') + ' ' + t('common.save'));
    setSnackbarOpen(true);
    handleCloseDialog();
  };

  const handleDeleteClick = (id: string) => {
    setBudgetToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (budgetToDelete) {
      deleteBudget(budgetToDelete);
      setSnackbarMessage('Budget deleted');
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setBudgetToDelete(null);
  };

  const categoryOptions = getAllCategoryKeys().map((key) => ({
    value: t(`categories.${key}`),
    label: t(`categories.${key}`),
  }));

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          {t('budgets.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          {t('budgets.addBudget')}
        </Button>
      </Box>

      {budgets.length === 0 ? (
        <EmptyState
          message={t('budgets.noBudgets')}
          icon={<AccountBalanceWalletIcon sx={{ fontSize: 64 }} />}
        />
      ) : (
        <Grid container spacing={3}>
          {budgets.map((budget) => {
            const used = getCategorySpending(budget.category);
            const remaining = budget.limit - used;
            const percentage = Math.min((used / budget.limit) * 100, 100);
            const isOverBudget = used > budget.limit;

            return (
              <Grid size={{ xs: 12, md: 6 }} key={budget.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {budget.category}
                        </Typography>
                        <Chip
                          label={isOverBudget ? t('budgets.overBudget') : t('budgets.onTrack')}
                          color={isOverBudget ? 'error' : 'success'}
                          size="small"
                        />
                      </Box>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(budget.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('budgets.limit')}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(budget.limit, currency)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('budgets.used')}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ color: isOverBudget ? 'error.main' : 'text.primary' }}
                        >
                          {formatCurrency(used, currency)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('budgets.remaining')}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ color: remaining < 0 ? 'error.main' : 'success.main' }}
                        >
                          {formatCurrency(remaining, currency)}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        color={isOverBudget ? 'error' : percentage > 80 ? 'warning' : 'primary'}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {percentage.toFixed(1)}% {t('budgets.progress')}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Add Budget Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{t('budgets.addBudget')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              select
              label={t('budgets.category')}
              value={formData.category}
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value });
                setErrors({ ...errors, category: undefined });
              }}
              fullWidth
              error={!!errors.category}
              helperText={errors.category}
            >
              {categoryOptions
                .filter((option) => !budgets.some((b) => b.category === option.value))
                .map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </TextField>

            <TextField
              type="number"
              label={t('budgets.limit')}
              value={formData.limit || ''}
              onChange={(e) => {
                setFormData({ ...formData, limit: parseFloat(e.target.value) || 0 });
                setErrors({ ...errors, limit: undefined });
              }}
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              error={!!errors.limit}
              helperText={errors.limit}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          <Button onClick={handleSave} variant="contained">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title={t('common.delete')}
        message={t('budgets.deleteConfirm')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setBudgetToDelete(null);
        }}
      />

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
