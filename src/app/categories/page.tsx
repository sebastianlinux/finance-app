'use client';

import { useState } from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import { useFinanceStore } from '@/store/financeStore';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppLayout from '@/components/Layout/AppLayout';
import { CustomCategory, TransactionType } from '@/types';
import EmptyState from '@/components/common/EmptyState';
import CategoryIcon from '@mui/icons-material/Category';
import ConfirmDialog from '@/components/common/ConfirmDialog';

const colors = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
  '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
  '#ff5722', '#795548', '#9e9e9e', '#607d8b',
];

function CategoriesPage() {
  const { t } = useTranslation();
  const customCategories = useFinanceStore((state) => state.customCategories);
  const addCustomCategory = useFinanceStore((state) => state.addCustomCategory);
  const updateCustomCategory = useFinanceStore((state) => state.updateCustomCategory);
  const deleteCustomCategory = useFinanceStore((state) => state.deleteCustomCategory);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [formData, setFormData] = useState<Omit<CustomCategory, 'id' | 'userId' | 'createdAt'>>({
    name: '',
    type: 'expense',
    color: colors[0],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const handleOpenDialog = (category?: CustomCategory) => {
    if (category) {
      setFormData({
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon,
      });
      setEditingCategoryId(category.id);
    } else {
      setFormData({
        name: '',
        type: 'expense',
        color: colors[0],
      });
      setEditingCategoryId(null);
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategoryId(null);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('categories.nameRequired') || 'Category name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    if (editingCategoryId) {
      updateCustomCategory(editingCategoryId, formData);
      setSnackbarMessage(t('categories.categoryUpdated') || 'Category updated successfully');
    } else {
      addCustomCategory(formData);
      setSnackbarMessage(t('categories.categoryAdded') || 'Category added successfully');
    }
    setSnackbarOpen(true);
    handleCloseDialog();
  };

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteCustomCategory(categoryToDelete);
      setSnackbarMessage(t('categories.categoryDeleted') || 'Category deleted successfully');
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const incomeCategories = customCategories.filter((c) => c.type === 'income');
  const expenseCategories = customCategories.filter((c) => c.type === 'expense');

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          {t('categories.customCategories') || 'Custom Categories'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          {t('categories.addCategory') || 'Add Category'}
        </Button>
      </Box>

      {customCategories.length === 0 ? (
        <EmptyState
          message={t('categories.noCustomCategories') || 'No custom categories yet. Create your first custom category!'}
          icon={<CategoryIcon sx={{ fontSize: 64 }} />}
        />
      ) : (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              {t('transactions.income')} {t('categories.categories') || 'Categories'}
            </Typography>
            {incomeCategories.length === 0 ? (
              <Typography color="text.secondary">{t('categories.noIncomeCategories') || 'No income categories'}</Typography>
            ) : (
              <Grid container spacing={2}>
                {incomeCategories.map((category) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={category.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: category.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 600,
                              }}
                            >
                              {category.name.charAt(0).toUpperCase()}
                            </Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {category.name}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenDialog(category)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteClick(category.id)}
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
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              {t('transactions.expense')} {t('categories.categories') || 'Categories'}
            </Typography>
            {expenseCategories.length === 0 ? (
              <Typography color="text.secondary">{t('categories.noExpenseCategories') || 'No expense categories'}</Typography>
            ) : (
              <Grid container spacing={2}>
                {expenseCategories.map((category) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={category.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: category.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 600,
                              }}
                            >
                              {category.name.charAt(0).toUpperCase()}
                            </Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {category.name}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenDialog(category)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteClick(category.id)}
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
            )}
          </Grid>
        </Grid>
      )}

      {/* Add/Edit Category Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategoryId ? t('categories.editCategory') || 'Edit Category' : t('categories.addCategory') || 'Add Category'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label={t('categories.name') || 'Category Name'}
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: undefined });
              }}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              select
              label={t('transactions.type')}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
              fullWidth
            >
              <MenuItem value="income">{t('transactions.income')}</MenuItem>
              <MenuItem value="expense">{t('transactions.expense')}</MenuItem>
            </TextField>

            <Box>
              <Typography variant="body2" gutterBottom>
                {t('categories.color') || 'Color'}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {colors.map((color) => (
                  <Box
                    key={color}
                    onClick={() => setFormData({ ...formData, color })}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: color,
                      cursor: 'pointer',
                      border: formData.color === color ? 3 : 1,
                      borderColor: formData.color === color ? 'primary.main' : 'divider',
                      '&:hover': { transform: 'scale(1.1)' },
                      transition: 'all 0.2s',
                    }}
                  />
                ))}
              </Box>
            </Box>
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
        message={t('categories.deleteConfirm') || 'Are you sure you want to delete this category?'}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setCategoryToDelete(null);
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

export default function ProtectedCategories() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <CategoriesPage />
      </AppLayout>
    </ProtectedRoute>
  );
}
