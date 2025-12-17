'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import { useFinanceStore } from '@/store/financeStore';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppLayout from '@/components/Layout/AppLayout';
import { formatCurrency } from '@/utils/format';
import { RecurringTransaction, TransactionType } from '@/types';
import EmptyState from '@/components/common/EmptyState';
import RepeatIcon from '@mui/icons-material/Repeat';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { getCategoryKeys } from '@/utils/categories';
import { useTranslateCategory } from '@/utils/translateCategory';

function RecurringPage() {
  const { t } = useTranslation();
  const translateCategory = useTranslateCategory();
  const recurringTransactions = useFinanceStore((state) => state.recurringTransactions);
  const processRecurringTransactions = useFinanceStore((state) => state.processRecurringTransactions);
  const addRecurringTransaction = useFinanceStore((state) => state.addRecurringTransaction);
  const updateRecurringTransaction = useFinanceStore((state) => state.updateRecurringTransaction);
  const deleteRecurringTransaction = useFinanceStore((state) => state.deleteRecurringTransaction);
  const currency = useFinanceStore((state) => state.settings.currency);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [formData, setFormData] = useState<Omit<RecurringTransaction, 'id' | 'userId' | 'nextDueDate'>>({
    type: 'expense',
    amount: 0,
    category: '',
    description: '',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  useEffect(() => {
    // Process recurring transactions on mount
    processRecurringTransactions();
  }, [processRecurringTransactions]);

  const handleOpenDialog = (transaction?: RecurringTransaction) => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        frequency: transaction.frequency,
        startDate: transaction.startDate,
        endDate: transaction.endDate || '',
        isActive: transaction.isActive,
      });
      setEditingTransactionId(transaction.id);
    } else {
      setFormData({
        type: 'expense',
        amount: 0,
        category: '',
        description: '',
        frequency: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        isActive: true,
      });
      setEditingTransactionId(null);
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTransactionId(null);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

    if (formData.amount <= 0) {
      newErrors.amount = t('transactions.invalidAmount');
    }

    if (!formData.category) {
      newErrors.category = t('transactions.required');
    }

    if (!formData.startDate) {
      newErrors.startDate = t('transactions.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    if (editingTransactionId) {
      updateRecurringTransaction(editingTransactionId, formData);
      setSnackbarMessage(t('recurring.transactionUpdated') || 'Recurring transaction updated');
    } else {
      addRecurringTransaction(formData);
      setSnackbarMessage(t('recurring.transactionAdded') || 'Recurring transaction added');
    }
    setSnackbarOpen(true);
    handleCloseDialog();
  };

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (transactionToDelete) {
      deleteRecurringTransaction(transactionToDelete);
      setSnackbarMessage(t('recurring.transactionDeleted') || 'Recurring transaction deleted');
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  const categoryOptions = getCategoryKeys(formData.type).map((key) => ({
    value: key,
    label: t(`categories.${key}`),
  }));

  const frequencyLabels: Record<RecurringTransaction['frequency'], string> = {
    daily: t('recurring.daily') || 'Daily',
    weekly: t('recurring.weekly') || 'Weekly',
    monthly: t('recurring.monthly') || 'Monthly',
    yearly: t('recurring.yearly') || 'Yearly',
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          {t('recurring.title') || 'Recurring Transactions'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          {t('recurring.addRecurring') || 'Add Recurring Transaction'}
        </Button>
      </Box>

      {recurringTransactions.length === 0 ? (
        <EmptyState
          message={t('recurring.noRecurring') || 'No recurring transactions yet. Create your first recurring transaction!'}
          icon={<RepeatIcon sx={{ fontSize: 64 }} />}
        />
      ) : (
        <Grid container spacing={3}>
          {recurringTransactions.map((transaction) => (
            <Grid size={{ xs: 12, md: 6 }} key={transaction.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {transaction.description || translateCategory(transaction.category)}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={t(`transactions.${transaction.type}`)}
                          color={transaction.type === 'income' ? 'success' : 'error'}
                          size="small"
                        />
                        <Chip
                          label={frequencyLabels[transaction.frequency]}
                          color="primary"
                          size="small"
                        />
                        <Chip
                          label={transaction.isActive ? t('recurring.active') || 'Active' : t('recurring.inactive') || 'Inactive'}
                          color={transaction.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {t('recurring.nextDue') || 'Next due'}: {new Date(transaction.nextDueDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(transaction)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(transaction.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
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
                    <FormControlLabel
                      control={
                        <Switch
                          checked={transaction.isActive}
                          onChange={(e) => {
                            updateRecurringTransaction(transaction.id, { isActive: e.target.checked });
                          }}
                          size="small"
                        />
                      }
                      label={transaction.isActive ? t('recurring.active') || 'Active' : t('recurring.inactive') || 'Inactive'}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTransactionId ? t('recurring.editRecurring') || 'Edit Recurring Transaction' : t('recurring.addRecurring') || 'Add Recurring Transaction'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              select
              label={t('transactions.type')}
              value={formData.type}
              onChange={(e) => {
                setFormData({ ...formData, type: e.target.value as TransactionType, category: '' });
                setErrors({ ...errors, category: undefined });
              }}
              fullWidth
            >
              <MenuItem value="income">{t('transactions.income')}</MenuItem>
              <MenuItem value="expense">{t('transactions.expense')}</MenuItem>
            </TextField>

            <TextField
              type="number"
              label={t('transactions.amount')}
              value={formData.amount || ''}
              onChange={(e) => {
                setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 });
                setErrors({ ...errors, amount: undefined });
              }}
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              error={!!errors.amount}
              helperText={errors.amount}
            />

            <TextField
              select
              label={t('transactions.category')}
              value={formData.category}
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value });
                setErrors({ ...errors, category: undefined });
              }}
              fullWidth
              error={!!errors.category}
              helperText={errors.category}
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label={t('transactions.description')}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />

            <TextField
              select
              label={t('recurring.frequency') || 'Frequency'}
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as RecurringTransaction['frequency'] })}
              fullWidth
            >
              <MenuItem value="daily">{t('recurring.daily') || 'Daily'}</MenuItem>
              <MenuItem value="weekly">{t('recurring.weekly') || 'Weekly'}</MenuItem>
              <MenuItem value="monthly">{t('recurring.monthly') || 'Monthly'}</MenuItem>
              <MenuItem value="yearly">{t('recurring.yearly') || 'Yearly'}</MenuItem>
            </TextField>

            <TextField
              type="date"
              label={t('recurring.startDate') || 'Start Date'}
              value={formData.startDate}
              onChange={(e) => {
                setFormData({ ...formData, startDate: e.target.value });
                setErrors({ ...errors, startDate: undefined });
              }}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.startDate}
              helperText={errors.startDate}
            />

            <TextField
              type="date"
              label={t('recurring.endDate') || 'End Date (Optional)'}
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              }
              label={t('recurring.isActive') || 'Active'}
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

      <ConfirmDialog
        open={deleteDialogOpen}
        title={t('common.delete')}
        message={t('recurring.deleteConfirm') || 'Are you sure you want to delete this recurring transaction?'}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setTransactionToDelete(null);
        }}
      />

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

export default function ProtectedRecurring() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <RecurringPage />
      </AppLayout>
    </ProtectedRoute>
  );
}
