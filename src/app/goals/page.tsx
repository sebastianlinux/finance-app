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
  LinearProgress,
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
import { formatCurrency } from '@/utils/format';
import { FinancialGoal } from '@/types';
import EmptyState from '@/components/common/EmptyState';
import TargetIcon from '@mui/icons-material/GpsFixed';
import ConfirmDialog from '@/components/common/ConfirmDialog';

function GoalsPage() {
  const { t } = useTranslation();
  const financialGoals = useFinanceStore((state) => state.financialGoals);
  const addFinancialGoal = useFinanceStore((state) => state.addFinancialGoal);
  const updateFinancialGoal = useFinanceStore((state) => state.updateFinancialGoal);
  const deleteFinancialGoal = useFinanceStore((state) => state.deleteFinancialGoal);
  const currency = useFinanceStore((state) => state.settings.currency);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [formData, setFormData] = useState<Omit<FinancialGoal, 'id' | 'userId' | 'createdAt' | 'currentAmount'>>({
    name: '',
    targetAmount: 0,
    deadline: new Date().toISOString().split('T')[0],
    category: '',
    type: 'savings',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const handleOpenDialog = (goal?: FinancialGoal) => {
    if (goal) {
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount,
        deadline: goal.deadline,
        category: goal.category || '',
        type: goal.type,
      });
      setEditingGoalId(goal.id);
    } else {
      setFormData({
        name: '',
        targetAmount: 0,
        deadline: new Date().toISOString().split('T')[0],
        category: '',
        type: 'savings',
      });
      setEditingGoalId(null);
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGoalId(null);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('goals.nameRequired') || 'Name is required';
    }

    if (formData.targetAmount <= 0) {
      newErrors.targetAmount = t('goals.invalidAmount') || 'Target amount must be greater than 0';
    }

    if (!formData.deadline) {
      newErrors.deadline = t('goals.deadlineRequired') || 'Deadline is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    if (editingGoalId) {
      updateFinancialGoal(editingGoalId, formData);
      setSnackbarMessage(t('goals.goalUpdated') || 'Goal updated successfully');
    } else {
      addFinancialGoal(formData);
      setSnackbarMessage(t('goals.goalAdded') || 'Goal added successfully');
    }
    setSnackbarOpen(true);
    handleCloseDialog();
  };

  const handleDeleteClick = (id: string) => {
    setGoalToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (goalToDelete) {
      deleteFinancialGoal(goalToDelete);
      setSnackbarMessage(t('goals.goalDeleted') || 'Goal deleted successfully');
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setGoalToDelete(null);
  };

  const getProgress = (goal: FinancialGoal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const isAchieved = (goal: FinancialGoal) => {
    return goal.currentAmount >= goal.targetAmount;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          {t('goals.title') || 'Financial Goals'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          {t('goals.addGoal') || 'Add Goal'}
        </Button>
      </Box>

      {financialGoals.length === 0 ? (
        <EmptyState
          message={t('goals.noGoals') || 'No financial goals yet. Create your first goal to start tracking your progress!'}
          icon={<TargetIcon sx={{ fontSize: 64 }} />}
        />
      ) : (
        <Grid container spacing={3}>
          {financialGoals.map((goal) => {
            const progress = getProgress(goal);
            const achieved = isAchieved(goal);

            return (
              <Grid size={{ xs: 12, md: 6 }} key={goal.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {goal.name}
                        </Typography>
                        <Chip
                          label={t(`goals.${goal.type}`) || goal.type}
                          color={achieved ? 'success' : 'primary'}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        {goal.category && (
                          <Typography variant="body2" color="text.secondary">
                            {t('goals.category') || 'Category'}: {goal.category}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(goal)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(goal.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('goals.progress') || 'Progress'}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          <span className="mono">{formatCurrency(goal.currentAmount, currency)}</span> / <span className="mono">{formatCurrency(goal.targetAmount, currency)}</span>
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        color={achieved ? 'success' : 'primary'}
                        sx={{ height: 8, borderRadius: 4, mb: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {progress.toFixed(1)}% {t('goals.complete') || 'complete'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('goals.deadline') || 'Deadline'}: {new Date(goal.deadline).toLocaleDateString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ color: achieved ? 'success.main' : 'text.primary' }}
                      >
                        {achieved
                          ? t('goals.achieved') || 'Achieved!'
                          : formatCurrency(goal.targetAmount - goal.currentAmount, currency) + ' ' + (t('goals.remaining') || 'remaining')}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Add/Edit Goal Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingGoalId ? t('goals.editGoal') || 'Edit Goal' : t('goals.addGoal') || 'Add Goal'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label={t('goals.name') || 'Goal Name'}
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
              label={t('goals.type') || 'Goal Type'}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              fullWidth
            >
              <MenuItem value="savings">{t('goals.savings') || 'Savings'}</MenuItem>
              <MenuItem value="debt_payoff">{t('goals.debtPayoff') || 'Debt Payoff'}</MenuItem>
              <MenuItem value="expense_limit">{t('goals.expenseLimit') || 'Expense Limit'}</MenuItem>
            </TextField>

            <TextField
              type="number"
              label={t('goals.targetAmount') || 'Target Amount'}
              value={formData.targetAmount || ''}
              onChange={(e) => {
                setFormData({ ...formData, targetAmount: parseFloat(e.target.value) || 0 });
                setErrors({ ...errors, targetAmount: undefined });
              }}
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              error={!!errors.targetAmount}
              helperText={errors.targetAmount}
            />

            <TextField
              type="date"
              label={t('goals.deadline') || 'Deadline'}
              value={formData.deadline}
              onChange={(e) => {
                setFormData({ ...formData, deadline: e.target.value });
                setErrors({ ...errors, deadline: undefined });
              }}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.deadline}
              helperText={errors.deadline}
            />

            <TextField
              label={t('goals.category') || 'Category (Optional)'}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              fullWidth
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
        message={t('goals.deleteConfirm') || 'Are you sure you want to delete this goal?'}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setGoalToDelete(null);
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

export default function ProtectedGoals() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <GoalsPage />
      </AppLayout>
    </ProtectedRoute>
  );
}
