'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
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
  Paper,
  InputAdornment,
  FormControl,
  Select,
  InputLabel,
  Stack,
  Pagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import ClearIcon from '@mui/icons-material/Clear';
import { useTranslation } from 'react-i18next';
import { useFinanceStore } from '@/store/financeStore';
import { Transaction, TransactionType } from '@/types';
import EmptyState from '@/components/common/EmptyState';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { formatCurrency } from '@/utils/format';
import { getCategoryKeys, getAllCategoryKeys } from '@/utils/categories';
import { useTranslateCategory } from '@/utils/translateCategory';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppLayout from '@/components/Layout/AppLayout';

function TransactionsPage() {
  const { t } = useTranslation();
  const translateCategory = useTranslateCategory();
  const transactions = useFinanceStore((state) => state.transactions);
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const updateTransaction = useFinanceStore((state) => state.updateTransaction);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);
  const currency = useFinanceStore((state) => state.settings.currency);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    type: 'expense',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date,
        description: transaction.description,
      });
      setEditingTransactionId(transaction.id);
    } else {
      setFormData({
        type: 'expense',
        amount: 0,
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
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

    if (editingTransactionId) {
      updateTransaction(editingTransactionId, formData);
      setSnackbarMessage(t('transactions.editTransaction') + ' ' + t('common.save'));
    } else {
      addTransaction(formData);
      setSnackbarMessage(t('transactions.addTransaction') + ' ' + t('common.save'));
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
      deleteTransaction(transactionToDelete);
      setSnackbarMessage(t('transactions.deleteConfirm'));
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  // Filter and sort transactions
  const filteredAndSortedTransactions = [...transactions]
    .filter((transaction) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          transaction.description.toLowerCase().includes(query) ||
          translateCategory(transaction.category).toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Type filter
      if (filterType !== 'all' && transaction.type !== filterType) return false;

      // Category filter
      if (filterCategory !== 'all' && transaction.category !== filterCategory) return false;

      // Date filters
      if (filterDateFrom && new Date(transaction.date) < new Date(filterDateFrom)) return false;
      if (filterDateTo && new Date(transaction.date) > new Date(filterDateTo)) return false;

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortBy === 'category') {
        comparison = a.category.localeCompare(b.category);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const categoryOptions = getCategoryKeys(formData.type).map((key) => ({
    value: key,
    label: t(`categories.${key}`),
  }));

  const allCategories = getAllCategoryKeys();

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredAndSortedTransactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setSnackbarMessage('Transactions exported successfully');
    setSnackbarOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
    const rows = filteredAndSortedTransactions.map((t) => [
      t.date,
      t.type,
      translateCategory(t.category),
      t.amount.toString(),
      t.description || '',
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');
    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setSnackbarMessage('Transactions exported to CSV successfully');
    setSnackbarOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterCategory('all');
    setFilterDateFrom('');
    setFilterDateTo('');
    setPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, filterType, filterCategory, filterDateFrom, filterDateTo, sortBy, sortOrder]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          {t('transactions.title')}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportCSV}
            disabled={filteredAndSortedTransactions.length === 0}
          >
            CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={filteredAndSortedTransactions.length === 0}
          >
            JSON
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            {t('transactions.addTransaction')}
          </Button>
        </Stack>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder={t('transactions.search') || 'Search transactions...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ flexGrow: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant={showFilters ? 'contained' : 'outlined'}
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            size="small"
          >
            {t('transactions.filters') || 'Filters'}
          </Button>
          {(filterType !== 'all' || filterCategory !== 'all' || filterDateFrom || filterDateTo) && (
            <Button
              variant="text"
              startIcon={<ClearIcon />}
              onClick={clearFilters}
              size="small"
            >
              {t('transactions.clearFilters') || 'Clear'}
            </Button>
          )}
        </Box>

        {showFilters && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('transactions.type')}</InputLabel>
              <Select
                value={filterType}
                label={t('transactions.type')}
                onChange={(e) => setFilterType(e.target.value as any)}
              >
                <MenuItem value="all">{t('transactions.all') || 'All'}</MenuItem>
                <MenuItem value="income">{t('transactions.income')}</MenuItem>
                <MenuItem value="expense">{t('transactions.expense')}</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>{t('transactions.category')}</InputLabel>
              <Select
                value={filterCategory}
                label={t('transactions.category')}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <MenuItem value="all">{t('transactions.all') || 'All'}</MenuItem>
                {allCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {t(`categories.${cat}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              type="date"
              label={t('transactions.dateFrom') || 'From Date'}
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />

            <TextField
              type="date"
              label={t('transactions.dateTo') || 'To Date'}
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('transactions.sortBy') || 'Sort By'}</InputLabel>
              <Select
                value={sortBy}
                label={t('transactions.sortBy') || 'Sort By'}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <MenuItem value="date">{t('transactions.date')}</MenuItem>
                <MenuItem value="amount">{t('transactions.amount')}</MenuItem>
                <MenuItem value="category">{t('transactions.category')}</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>{t('transactions.order') || 'Order'}</InputLabel>
              <Select
                value={sortOrder}
                label={t('transactions.order') || 'Order'}
                onChange={(e) => setSortOrder(e.target.value as any)}
              >
                <MenuItem value="desc">{t('transactions.desc') || 'Desc'}</MenuItem>
                <MenuItem value="asc">{t('transactions.asc') || 'Asc'}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </Paper>

      {filteredAndSortedTransactions.length === 0 ? (
        <EmptyState
          message={
            transactions.length === 0
              ? t('transactions.noTransactions')
              : t('transactions.noFilteredTransactions') || 'No transactions match your filters'
          }
          icon={<ReceiptIcon sx={{ fontSize: 64 }} />}
        />
      ) : (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('transactions.showing') || 'Showing'} {filteredAndSortedTransactions.length}{' '}
              {filteredAndSortedTransactions.length === 1 ? 'transaction' : 'transactions'}
              {transactions.length !== filteredAndSortedTransactions.length &&
                ` of ${transactions.length} total`}
            </Typography>
            {totalPages > 1 && (
              <Typography variant="body2" color="text.secondary">
                {t('transactions.page') || 'Page'} {page} {t('transactions.of') || 'of'} {totalPages}
              </Typography>
            )}
          </Box>
          <Grid container spacing={2}>
            {paginatedTransactions.map((transaction) => (
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size="large"
            />
          </Box>
        )}
        </>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTransactionId ? t('transactions.editTransaction') : t('transactions.addTransaction')}
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

export default function ProtectedTransactions() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <TransactionsPage />
      </AppLayout>
    </ProtectedRoute>
  );
}
