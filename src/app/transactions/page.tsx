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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Menu,
  ListItemIcon,
  ListItemText,
  DialogContentText,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import ClearIcon from '@mui/icons-material/Clear';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TableChartIcon from '@mui/icons-material/TableChart';
import ViewListIcon from '@mui/icons-material/ViewList';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import SaveIcon from '@mui/icons-material/Save';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
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
  const [multiSort, setMultiSort] = useState<Array<{ field: 'date' | 'amount' | 'category'; order: 'asc' | 'desc' }>>([]);
  const [savedFilters, setSavedFilters] = useState<Array<{ name: string; filters: any }>>([]);
  const [saveFilterDialogOpen, setSaveFilterDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [viewMode, setViewMode] = useState<'card' | 'table' | 'calendar' | 'compact'>('card');
  const [compactMode, setCompactMode] = useState(false);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);

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

  // Real-time validation
  const validateField = (field: keyof typeof formData, value: any): string | undefined => {
    switch (field) {
      case 'amount':
        if (!value || value <= 0) {
          return t('transactions.invalidAmount');
        }
        break;
      case 'category':
        if (!value) {
          return t('transactions.required');
        }
        break;
      case 'date':
        if (!value) {
          return t('transactions.required');
        }
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

    Object.keys(formData).forEach((key) => {
      const field = key as keyof typeof formData;
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

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
      // Multi-sort support
      if (multiSort.length > 0) {
        for (const sort of multiSort) {
          let comparison = 0;
          if (sort.field === 'date') {
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          } else if (sort.field === 'amount') {
            comparison = a.amount - b.amount;
          } else if (sort.field === 'category') {
            comparison = a.category.localeCompare(b.category);
          }
          if (comparison !== 0) {
            return sort.order === 'asc' ? comparison : -comparison;
          }
        }
        return 0;
      }

      // Single sort (fallback)
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

  const handleAddSort = (field: 'date' | 'amount' | 'category') => {
    const existingIndex = multiSort.findIndex((s) => s.field === field);
    if (existingIndex >= 0) {
      const newSort = [...multiSort];
      newSort[existingIndex].order = newSort[existingIndex].order === 'asc' ? 'desc' : 'asc';
      setMultiSort(newSort);
    } else {
      setMultiSort([...multiSort, { field, order: 'asc' }]);
    }
  };

  const handleRemoveSort = (field: 'date' | 'amount' | 'category') => {
    setMultiSort(multiSort.filter((s) => s.field !== field));
  };

  const handleSaveFilter = () => {
    if (!filterName.trim()) return;
    
    const filterConfig = {
      searchQuery,
      filterType,
      filterCategory,
      filterDateFrom,
      filterDateTo,
      sortBy,
      sortOrder,
      multiSort,
    };

    setSavedFilters([...savedFilters, { name: filterName, filters: filterConfig }]);
    setFilterName('');
    setSaveFilterDialogOpen(false);
    setSnackbarMessage(t('transactions.filterSaved') || 'Filter saved successfully');
    setSnackbarOpen(true);
  };

  const handleLoadFilter = (filter: { name: string; filters: any }) => {
    setSearchQuery(filter.filters.searchQuery || '');
    setFilterType(filter.filters.filterType || 'all');
    setFilterCategory(filter.filters.filterCategory || 'all');
    setFilterDateFrom(filter.filters.filterDateFrom || '');
    setFilterDateTo(filter.filters.filterDateTo || '');
    setSortBy(filter.filters.sortBy || 'date');
    setSortOrder(filter.filters.sortOrder || 'desc');
    setMultiSort(filter.filters.multiSort || []);
    setSnackbarMessage(t('transactions.filterLoaded') || 'Filter loaded successfully');
    setSnackbarOpen(true);
  };

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
    setSnackbarMessage(t('transactions.exportSuccess') || 'Transactions exported successfully');
    setSnackbarOpen(true);
    setExportMenuAnchor(null);
  };

  const handleExportExcel = () => {
    // For Excel, we'll create a CSV with Excel-compatible format
    handleExportCSV();
  };

  const handleExportPDF = () => {
    // Simple PDF export using window.print or a library
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const htmlContent = `
        <html>
          <head>
            <title>Transactions Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #1976d2; color: white; }
              tr:nth-child(even) { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Transactions Report</h1>
            <p>Generated: ${new Date().toLocaleDateString()}</p>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                ${filteredAndSortedTransactions.map((t) => `
                  <tr>
                    <td>${new Date(t.date).toLocaleDateString()}</td>
                    <td>${t.type}</td>
                    <td>${translateCategory(t.category)}</td>
                    <td>${formatCurrency(t.amount, currency)}</td>
                    <td>${t.description || ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
    setExportMenuAnchor(null);
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

  const handleFileImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter((line) => line.trim());
      if (lines.length === 0) {
        setImportErrors([t('transactions.importEmptyFile') || 'File is empty']);
        return;
      }
      
      const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
      
      const preview: any[] = [];
      const errors: string[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim().replace(/"/g, ''));
        if (values.length < 4) {
          errors.push(`${t('transactions.row') || 'Row'} ${i + 1}: ${t('transactions.insufficientColumns') || 'Insufficient columns'}`);
          continue;
        }
        
        const dateIndex = headers.findIndex((h) => h.toLowerCase().includes('date'));
        const typeIndex = headers.findIndex((h) => h.toLowerCase().includes('type'));
        const categoryIndex = headers.findIndex((h) => h.toLowerCase().includes('category'));
        const amountIndex = headers.findIndex((h) => h.toLowerCase().includes('amount'));
        const descIndex = headers.findIndex((h) => h.toLowerCase().includes('description'));
        
        const date = values[dateIndex] || values[0];
        const type = (values[typeIndex] || values[1]).toLowerCase();
        const category = values[categoryIndex] || values[2];
        const amount = parseFloat(values[amountIndex] || values[3]);
        const description = values[descIndex] || values[4] || '';
        
        if (!date || !type || !category || isNaN(amount)) {
          errors.push(`${t('transactions.row') || 'Row'} ${i + 1}: ${t('transactions.invalidData') || 'Invalid data'}`);
          continue;
        }
        
        if (type !== 'income' && type !== 'expense') {
          errors.push(`${t('transactions.row') || 'Row'} ${i + 1}: ${t('transactions.invalidType') || "Type must be 'income' or 'expense'"}`);
          continue;
        }
        
        preview.push({
          date,
          type,
          category,
          amount,
          description,
        });
      }
      
      setImportPreview(preview);
      setImportErrors(errors);
    };
    reader.readAsText(file);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          {t('transactions.title')}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="card">
              <ViewListIcon sx={{ mr: 1 }} />
              {t('transactions.cardView') || 'Cards'}
            </ToggleButton>
            <ToggleButton value="table">
              <TableChartIcon sx={{ mr: 1 }} />
              {t('transactions.tableView') || 'Table'}
            </ToggleButton>
            <ToggleButton value="calendar">
              <CalendarMonthIcon sx={{ mr: 1 }} />
              {t('transactions.calendarView') || 'Calendar'}
            </ToggleButton>
            <ToggleButton value="compact">
              <ViewCompactIcon sx={{ mr: 1 }} />
              {t('transactions.compactView') || 'Compact'}
            </ToggleButton>
          </ToggleButtonGroup>
          
          <IconButton
            onClick={() => setCompactMode(!compactMode)}
            color={compactMode ? 'primary' : 'default'}
            title={compactMode ? t('transactions.expandView') || 'Expand View' : t('transactions.compactView') || 'Compact View'}
          >
            {compactMode ? <ViewAgendaIcon /> : <ViewCompactIcon />}
          </IconButton>
          
          <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            onClick={() => setImportDialogOpen(true)}
          >
            {t('transactions.import') || 'Import'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={(e) => setExportMenuAnchor(e.currentTarget)}
            disabled={filteredAndSortedTransactions.length === 0}
          >
            {t('transactions.export') || 'Export'}
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
          {viewMode === 'calendar' ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('transactions.calendarView') || 'Calendar View'}
              </Typography>
              <Grid container spacing={1}>
                {paginatedTransactions.map((transaction) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={transaction.id}>
                    <Card
                      sx={{
                        p: compactMode ? 1 : 2,
                        transition: 'all 0.2s',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 },
                      }}
                    >
                      <CardContent sx={{ p: compactMode ? '8px !important' : 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant={compactMode ? 'body2' : 'subtitle2'} fontWeight={600}>
                              {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </Typography>
                            <Typography variant={compactMode ? 'caption' : 'body2'} color="text.secondary">
                              {transaction.description || translateCategory(transaction.category)}
                            </Typography>
                          </Box>
                          <Typography
                            variant={compactMode ? 'body2' : 'h6'}
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
            </Box>
          ) : viewMode === 'card' ? (
            <Grid container spacing={2}>
              {paginatedTransactions.map((transaction) => (
                <Grid size={{ xs: 12 }} key={transaction.id}>
                  <Card
                    sx={{
                      transition: 'all 0.2s ease-in-out',
                      p: compactMode ? 1 : 2,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ p: compactMode ? '8px !important' : 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: compactMode ? 0.5 : 1 }}>
                            <Chip
                              label={t(`transactions.${transaction.type}`)}
                              color={transaction.type === 'income' ? 'success' : 'error'}
                              size="small"
                            />
                            <Typography variant={compactMode ? 'body2' : 'subtitle1'} fontWeight={600}>
                              {transaction.description || translateCategory(transaction.category)}
                            </Typography>
                          </Box>
                          <Typography variant={compactMode ? 'caption' : 'body2'} color="text.secondary">
                            {translateCategory(transaction.category)} • {new Date(transaction.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography
                            variant={compactMode ? 'body2' : 'h6'}
                            fontWeight={700}
                            sx={{
                              color: transaction.type === 'income' ? 'success.main' : 'error.main',
                            }}
                          >
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount, currency)}
                          </Typography>
                          {!compactMode && (
                            <>
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
                            </>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : viewMode === 'table' ? (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size={compactMode ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <strong>{t('transactions.date')}</strong>
                    <IconButton size="small" onClick={() => handleAddSort('date')}>
                      {multiSort.find((s) => s.field === 'date')?.order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell><strong>{t('transactions.type')}</strong></TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <strong>{t('transactions.category')}</strong>
                    <IconButton size="small" onClick={() => handleAddSort('category')}>
                      {multiSort.find((s) => s.field === 'category')?.order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                    </IconButton>
                  </Box>
                </TableCell>
                {!compactMode && <TableCell><strong>{t('transactions.description')}</strong></TableCell>}
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                    <strong>{t('transactions.amount')}</strong>
                    <IconButton size="small" onClick={() => handleAddSort('amount')}>
                      {multiSort.find((s) => s.field === 'amount')?.order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                    </IconButton>
                  </Box>
                </TableCell>
                {!compactMode && <TableCell align="center"><strong>{t('common.actions') || 'Actions'}</strong></TableCell>}
              </TableRow>
            </TableHead>
                <TableBody>
                  {paginatedTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      sx={{
                        '&:hover': { bgcolor: 'action.hover' },
                        cursor: 'pointer',
                      }}
                      onClick={() => !compactMode && handleOpenDialog(transaction)}
                    >
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={t(`transactions.${transaction.type}`)}
                          color={transaction.type === 'income' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{translateCategory(transaction.category)}</TableCell>
                      {!compactMode && <TableCell>{transaction.description || '-'}</TableCell>}
                      <TableCell
                        align="right"
                        sx={{
                          color: transaction.type === 'income' ? 'success.main' : 'error.main',
                          fontWeight: 600,
                        }}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount, currency)}
                      </TableCell>
                      {!compactMode && (
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDialog(transaction);
                            }}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(transaction.id);
                            }}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('transactions.compactViewDesc') || 'Compact view shows essential information only'}
              </Typography>
              <Grid container spacing={1}>
                {paginatedTransactions.map((transaction) => (
                  <Grid size={{ xs: 12 }} key={transaction.id}>
                    <Card sx={{ p: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80 }}>
                          {new Date(transaction.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" sx={{ flex: 1, mx: 1 }}>
                          {transaction.description || translateCategory(transaction.category)}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          sx={{
                            color: transaction.type === 'income' ? 'success.main' : 'error.main',
                            minWidth: 100,
                            textAlign: 'right',
                          }}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount, currency)}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
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
                const value = parseFloat(e.target.value) || 0;
                setFormData({ ...formData, amount: value });
                const error = validateField('amount', value);
                setErrors({ ...errors, amount: error });
              }}
              onBlur={(e) => {
                const value = parseFloat(e.target.value) || 0;
                const error = validateField('amount', value);
                setErrors({ ...errors, amount: error });
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
                const error = validateField('category', e.target.value);
                setErrors({ ...errors, category: error });
              }}
              onBlur={() => {
                const error = validateField('category', formData.category);
                setErrors({ ...errors, category: error });
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
                const error = validateField('date', e.target.value);
                setErrors({ ...errors, date: error });
              }}
              onBlur={() => {
                const error = validateField('date', formData.date);
                setErrors({ ...errors, date: error });
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

      {/* Export Menu */}
      <Menu
        anchorEl={exportMenuAnchor}
        open={Boolean(exportMenuAnchor)}
        onClose={() => setExportMenuAnchor(null)}
      >
        <MenuItem onClick={handleExportCSV}>
          <ListItemIcon>
            <DescriptionIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExport}>
          <ListItemIcon>
            <DescriptionIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>JSON</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportExcel}>
          <ListItemIcon>
            <DescriptionIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Excel (CSV)</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportPDF}>
          <ListItemIcon>
            <PictureAsPdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>PDF</ListItemText>
        </MenuItem>
      </Menu>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('transactions.importTransactions') || 'Import Transactions'}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t('transactions.importInstructions') || 'Upload a CSV file with columns: Date, Type, Category, Amount, Description'}
          </DialogContentText>
          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  setImportFile(file);
                  handleFileImport(file);
                } else {
                  setImportPreview([]);
                  setImportErrors([]);
                }
              }}
              style={{ width: '100%', padding: '8px' }}
            />
          </Box>
          {importPreview.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('transactions.preview') || 'Preview'} ({importPreview.length} {t('transactions.transactions') || 'transactions'})
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 300, mt: 2 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {importPreview.slice(0, 10).map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell align="right">{formatCurrency(row.amount, currency)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {importErrors.length > 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {t('transactions.importErrors') || 'Errors found:'}
                  </Typography>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    {importErrors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setImportDialogOpen(false);
            setImportFile(null);
            setImportPreview([]);
            setImportErrors([]);
          }}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (importPreview.length > 0) {
                importPreview.forEach((transaction) => {
                  addTransaction({
                    type: transaction.type,
                    amount: transaction.amount,
                    category: transaction.category,
                    date: transaction.date,
                    description: transaction.description || '',
                  });
                });
                setSnackbarMessage(t('transactions.importSuccess') || `Successfully imported ${importPreview.length} transactions`);
                setSnackbarOpen(true);
                setImportDialogOpen(false);
                setImportFile(null);
                setImportPreview([]);
                setImportErrors([]);
              }
            }}
            disabled={importPreview.length === 0}
          >
            {t('transactions.importConfirm') || 'Import'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      {/* Save Filter Dialog */}
      <Dialog open={saveFilterDialogOpen} onClose={() => setSaveFilterDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('transactions.saveFilter') || 'Save Filter'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={t('transactions.filterName') || 'Filter Name'}
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            sx={{ mt: 2 }}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setSaveFilterDialogOpen(false);
            setFilterName('');
          }}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveFilter}
            disabled={!filterName.trim()}
          >
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

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
