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
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useFinanceStore } from '@/store/financeStore';
import { Transaction, TransactionType } from '@/types';
import EmptyState from '@/components/common/EmptyState';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { formatCurrency } from '@/utils/format';
import { getCategoryKeys } from '@/utils/categories';
import { useTranslateCategory } from '@/utils/translateCategory';

export default function TransactionsPage() {
  const { t } = useTranslation();
  const translateCategory = useTranslateCategory();
  const transactions = useFinanceStore((state) => state.transactions);
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);
  const currency = useFinanceStore((state) => state.settings.currency);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    type: 'expense',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const handleOpenDialog = () => {
    setFormData({
      type: 'expense',
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
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

    if (formData.amount <= 0) {
      newErrors.amount = t('transactions.invalidAmount');
    }

    if (!formData.category) {
      newErrors.category = t('transactions.required');
    }

    if (!formData.date) {
      newErrors.date = t('transactions.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    addTransaction(formData);
    setSnackbarMessage(t('transactions.addTransaction') + ' ' + t('common.save'));
    setSnackbarOpen(true);
    handleCloseDialog();
  };

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
      setSnackbarMessage(t('transactions.deleteConfirm'));
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const categoryOptions = getCategoryKeys(formData.type).map((key) => ({
    value: key, // Store the key, not the translated value
    label: t(`categories.${key}`),
  }));

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          {t('transactions.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          {t('transactions.addTransaction')}
        </Button>
      </Box>

      {sortedTransactions.length === 0 ? (
        <EmptyState
          message={t('transactions.noTransactions')}
          icon={<ReceiptIcon sx={{ fontSize: 64 }} />}
        />
      ) : (
        <Grid container spacing={2}>
          {sortedTransactions.map((transaction) => (
            <Grid size={{ xs: 12 }} key={transaction.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip
                          label={t(`transactions.${transaction.type}`)}
                          color={transaction.type === 'income' ? 'success' : 'error'}
                          size="small"
                        />
                        <Typography variant="subtitle1" fontWeight={600}>
                          {transaction.description || translateCategory(transaction.category)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {translateCategory(transaction.category)} • {new Date(transaction.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(transaction.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{t('transactions.addTransaction')}</DialogTitle>
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
              error={!!errors.type}
              helperText={errors.type}
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
              type="date"
              label={t('transactions.date')}
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
                setErrors({ ...errors, date: undefined });
              }}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.date}
              helperText={errors.date}
            />

            <TextField
              label={t('transactions.description')}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
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
        message={t('transactions.deleteConfirm')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setTransactionToDelete(null);
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
