'use client';

import { useState, useEffect } from 'react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
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
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HistoryIcon from '@mui/icons-material/History';
import ShareIcon from '@mui/icons-material/Share';
import LinkIcon from '@mui/icons-material/Link';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next';
import { useFinanceStore } from '@/store/financeStore';
import { Budget } from '@/types';
import EmptyState from '@/components/common/EmptyState';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { formatCurrency } from '@/utils/format';
import { getAllCategoryKeys, normalizeCategoryToKey } from '@/utils/categories';
import { useTranslateCategory } from '@/utils/translateCategory';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppLayout from '@/components/Layout/AppLayout';

function BudgetsPage() {
  const { t } = useTranslation();
  const translateCategory = useTranslateCategory();
  const budgets = useFinanceStore((state) => state.budgets);
  const budgetTemplates = useFinanceStore((state) => state.budgetTemplates);
  const addBudget = useFinanceStore((state) => state.addBudget);
  const updateBudget = useFinanceStore((state) => state.updateBudget);
  const deleteBudget = useFinanceStore((state) => state.deleteBudget);
  const addBudgetTemplate = useFinanceStore((state) => state.addBudgetTemplate);
  const applyBudgetTemplate = useFinanceStore((state) => state.applyBudgetTemplate);
  const getCategorySpending = useFinanceStore((state) => state.getCategorySpending);
  const getBudgetHistory = useFinanceStore((state) => state.getBudgetHistory);
  const shareBudget = useFinanceStore((state) => state.shareBudget);
  const getSharedBudgetsByBudget = useFinanceStore((state) => state.getSharedBudgetsByBudget);
  const revokeSharedBudget = useFinanceStore((state) => state.revokeSharedBudget);
  const currency = useFinanceStore((state) => state.settings.currency);
  
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareBudgetId, setShareBudgetId] = useState<string | null>(null);
  const [sharePermission, setSharePermission] = useState<'view' | 'edit'>('view');
  const [shareLink, setShareLink] = useState<string>('');
  const [linkCopied, setLinkCopied] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [formData, setFormData] = useState<Omit<Budget, 'id'>>({
    category: '',
    limit: 0,
    period: 'monthly',
  });
  
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  // Keyboard shortcuts for dialog
  useKeyboardShortcuts([
    {
      key: 'Enter',
      action: () => {
        if (openDialog && !errors.category && !errors.limit) {
          handleSave();
        }
      },
    },
    {
      key: 'Escape',
      action: () => {
        if (openDialog) {
          handleCloseDialog();
        }
      },
    },
  ], openDialog);

  const handleOpenDialog = (budget?: Budget) => {
    if (budget) {
      setFormData({
        category: budget.category,
        limit: budget.limit,
        period: budget.period,
      });
      setEditingBudgetId(budget.id);
    } else {
      setFormData({
        category: '',
        limit: 0,
        period: 'monthly',
      });
      setEditingBudgetId(null);
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleOpenNewDialog = () => {
    handleOpenDialog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBudgetId(null);
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

    // Check if budget already exists for this category (normalize for comparison)
    // But skip this check if we're editing the same budget
    const normalizedNewCategory = normalizeCategoryToKey(formData.category);
    const existingBudget = budgets.find(
      (b) => normalizeCategoryToKey(b.category) === normalizedNewCategory
    );
    if (existingBudget && existingBudget.id !== editingBudgetId) {
      newErrors.category = t('budgets.categoryExists') || 'Budget already exists for this category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    if (editingBudgetId) {
      updateBudget(editingBudgetId, formData);
      setSnackbarMessage(t('budgets.editBudget') + ' ' + t('common.save'));
    } else {
      addBudget(formData);
      setSnackbarMessage(t('budgets.addBudget') + ' ' + t('common.save'));
    }
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
    value: key, // Store the key, not the translated value
    label: t(`categories.${key}`),
  }));

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight={700}>
          {t('budgets.title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {budgets.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={() => setTemplateDialogOpen(true)}
            >
              {t('budgets.saveTemplate') || 'Save as Template'}
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => setHistoryDialogOpen(true)}
          >
            {t('budgets.history') || 'History'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenNewDialog}
            data-tutorial="add-budget"
          >
            {t('budgets.addBudget')}
          </Button>
        </Box>
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
                <Card data-tutorial="budget-progress">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {translateCategory(budget.category)}
                        </Typography>
                        <Chip
                          label={isOverBudget ? t('budgets.overBudget') : t('budgets.onTrack')}
                          color={isOverBudget ? 'error' : 'success'}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setShareBudgetId(budget.id);
                            setShareDialogOpen(true);
                            const existingShares = getSharedBudgetsByBudget(budget.id);
                            if (existingShares.length > 0) {
                              const share = existingShares[0];
                              const baseUrl = window.location.origin;
                              setShareLink(`${baseUrl}/budgets/shared/${share.shareToken}`);
                            }
                          }}
                          size="small"
                          title={t('budgets.share') || 'Share Budget'}
                        >
                          <ShareIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(budget)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(budget.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('budgets.limit')}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          <span className="mono">{formatCurrency(budget.limit, currency)}</span>
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
                          <span className="mono">{formatCurrency(remaining, currency)}</span>
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

      {/* Add/Edit Budget Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBudgetId ? t('budgets.editBudget') : t('budgets.addBudget')}
        </DialogTitle>
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
              disabled={!!editingBudgetId}
            >
              {categoryOptions
                .filter((option) => {
                  // If editing, allow the current budget's category
                  if (editingBudgetId) {
                    const currentBudget = budgets.find((b) => b.id === editingBudgetId);
                    if (currentBudget && normalizeCategoryToKey(currentBudget.category) === normalizeCategoryToKey(option.value)) {
                      return true;
                    }
                  }
                  // Otherwise, only show categories that don't have budgets yet
                  const normalizedOptionKey = normalizeCategoryToKey(option.value);
                  return !budgets.some((b) => normalizeCategoryToKey(b.category) === normalizedOptionKey);
                })
                .map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </TextField>

            <TextField
              select
              label={t('budgets.period') || 'Period'}
              value={formData.period}
              onChange={(e) => {
                setFormData({ ...formData, period: e.target.value as 'monthly' | 'yearly' });
              }}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="monthly">{t('budgets.monthly') || 'Monthly'}</MenuItem>
              <MenuItem value="yearly">{t('budgets.yearly') || 'Yearly'}</MenuItem>
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

      {/* Save Template Dialog */}
      <Dialog open={templateDialogOpen} onClose={() => setTemplateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('budgets.saveTemplate') || 'Save as Template'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={t('budgets.templateName') || 'Template Name'}
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setTemplateDialogOpen(false);
            setTemplateName('');
          }}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (templateName.trim()) {
                addBudgetTemplate({
                  name: templateName,
                  budgets: budgets.map((b) => ({
                    category: b.category,
                    limit: b.limit,
                    period: b.period,
                  })),
                });
                setSnackbarMessage(t('budgets.templateSaved') || 'Template saved successfully');
                setSnackbarOpen(true);
                setTemplateDialogOpen(false);
                setTemplateName('');
              }
            }}
            disabled={!templateName.trim()}
          >
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Budget History Dialog */}
      <Dialog open={historyDialogOpen} onClose={() => setHistoryDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('budgets.history') || 'Budget History'}</DialogTitle>
        <DialogContent>
          {budgets.length === 0 ? (
            <Typography color="text.secondary">{t('budgets.noHistory') || 'No budget history available'}</Typography>
          ) : (
            <Box>
              {budgets.map((budget) => {
                const history = getBudgetHistory(budget.category, budget.period);
                return (
                  <Box key={budget.id} sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {translateCategory(budget.category)} - {budget.period}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('budgets.currentLimit') || 'Current Limit'}: {formatCurrency(budget.limit, currency)}
                    </Typography>
                    {history.length > 1 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {t('budgets.historyCount') || 'Previous budgets'}: {history.length - 1}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>

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

      {/* Share Budget Dialog */}
      <Dialog open={shareDialogOpen} onClose={() => {
        setShareDialogOpen(false);
        setShareBudgetId(null);
        setShareLink('');
        setLinkCopied(false);
      }} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t('budgets.shareBudget') || 'Share Budget'}
        </DialogTitle>
        <DialogContent>
          {!shareLink ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                select
                label={t('budgets.sharePermission') || 'Permission'}
                value={sharePermission}
                onChange={(e) => setSharePermission(e.target.value as 'view' | 'edit')}
                fullWidth
                SelectProps={{ native: true }}
              >
                <option value="view">{t('budgets.viewOnly') || 'View Only'}</option>
                <option value="edit">{t('budgets.canEdit') || 'Can Edit'}</option>
              </TextField>
              <Button
                variant="contained"
                startIcon={<ShareIcon />}
                onClick={() => {
                  if (shareBudgetId) {
                    const shared = shareBudget(shareBudgetId, sharePermission);
                    const baseUrl = window.location.origin;
                    const link = `${baseUrl}/budgets/shared/${shared.shareToken}`;
                    setShareLink(link);
                  }
                }}
                fullWidth
              >
                {t('budgets.generateLink') || 'Generate Share Link'}
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label={t('budgets.shareLink') || 'Share Link'}
                value={shareLink}
                fullWidth
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          navigator.clipboard.writeText(shareLink);
                          setLinkCopied(true);
                          setTimeout(() => setLinkCopied(false), 2000);
                        }}
                        edge="end"
                      >
                        {linkCopied ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<EmailIcon />}
                  onClick={() => {
                    window.location.href = `mailto:?subject=${encodeURIComponent(t('budgets.shareBudget') || 'Shared Budget')}&body=${encodeURIComponent(shareLink)}`;
                  }}
                  sx={{ flex: 1 }}
                >
                  {t('budgets.shareEmail') || 'Email'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 2000);
                  }}
                  sx={{ flex: 1 }}
                >
                  {linkCopied ? (t('budgets.copied') || 'Copied!') : (t('budgets.copy') || 'Copy')}
                </Button>
              </Box>
              <Alert severity="info" sx={{ mt: 1 }}>
                {t('budgets.shareInfo') || 'Anyone with this link can access the budget according to the selected permission.'}
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShareDialogOpen(false);
            setShareBudgetId(null);
            setShareLink('');
            setLinkCopied(false);
          }}>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default function ProtectedBudgets() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <BudgetsPage />
      </AppLayout>
    </ProtectedRoute>
  );
}
