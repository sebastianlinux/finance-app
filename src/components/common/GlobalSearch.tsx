'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Chip,
  InputAdornment,
  IconButton,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FlagIcon from '@mui/icons-material/Flag';
import CategoryIcon from '@mui/icons-material/Category';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useFinanceStore } from '@/store/financeStore';
import { useTranslateCategory } from '@/utils/translateCategory';
import { formatCurrency } from '@/utils/format';

interface SearchResult {
  id: string;
  type: 'transaction' | 'budget' | 'goal' | 'category';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  path: string;
  data?: any;
}

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const translateCategory = useTranslateCategory();
  const [searchQuery, setSearchQuery] = useState('');
  
  const transactions = useFinanceStore((state) => state.transactions);
  const budgets = useFinanceStore((state) => state.budgets);
  const financialGoals = useFinanceStore((state) => state.financialGoals);
  const customCategories = useFinanceStore((state) => state.customCategories);
  const currency = useFinanceStore((state) => state.settings.currency);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search transactions
    transactions
      .filter((t) => 
        t.description?.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.amount.toString().includes(query)
      )
      .slice(0, 5)
      .forEach((transaction) => {
        results.push({
          id: transaction.id,
          type: 'transaction',
          title: transaction.description || `${transaction.type} - ${translateCategory(transaction.category)}`,
          subtitle: `${formatCurrency(transaction.amount, currency)} • ${new Date(transaction.date).toLocaleDateString()}`,
          icon: <ReceiptIcon />,
          path: '/transactions',
          data: transaction,
        });
      });

    // Search budgets
    budgets
      .filter((b) => 
        translateCategory(b.category).toLowerCase().includes(query) ||
        b.limit.toString().includes(query)
      )
      .slice(0, 5)
      .forEach((budget) => {
        results.push({
          id: budget.id,
          type: 'budget',
          title: translateCategory(budget.category),
          subtitle: `${formatCurrency(budget.limit, currency)} • ${budget.period}`,
          icon: <AccountBalanceWalletIcon />,
          path: '/budgets',
          data: budget,
        });
      });

    // Search goals
    financialGoals
      .filter((g) => 
        g.name.toLowerCase().includes(query) ||
        g.targetAmount.toString().includes(query)
      )
      .slice(0, 5)
      .forEach((goal) => {
        results.push({
          id: goal.id,
          type: 'goal',
          title: goal.name,
          subtitle: `${formatCurrency(goal.currentAmount, currency)} / ${formatCurrency(goal.targetAmount, currency)}`,
          icon: <FlagIcon />,
          path: '/goals',
          data: goal,
        });
      });

    // Search categories
    customCategories
      .filter((c) => 
        c.name.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .forEach((category) => {
        results.push({
          id: category.id,
          type: 'category',
          title: category.name,
          subtitle: category.type,
          icon: <CategoryIcon />,
          path: '/categories',
          data: category,
        });
      });

    return results;
  }, [searchQuery, transactions, budgets, financialGoals, customCategories, currency, translateCategory]);

  const handleSelectResult = (result: SearchResult) => {
    router.push(result.path);
    onClose();
    setSearchQuery('');
  };

  useEffect(() => {
    if (open) {
      setSearchQuery('');
    }
  }, [open]);

  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {
      transactions: [],
      budgets: [],
      goals: [],
      categories: [],
    };

    searchResults.forEach((result) => {
      if (result.type === 'transaction') groups.transactions.push(result);
      else if (result.type === 'budget') groups.budgets.push(result);
      else if (result.type === 'goal') groups.goals.push(result);
      else if (result.type === 'category') groups.categories.push(result);
    });

    return groups;
  }, [searchResults]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          mt: 8,
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            autoFocus
            fullWidth
            placeholder={t('search.placeholder') || 'Search transactions, budgets, goals...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
          {searchQuery.trim() && searchResults.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('search.noResults') || 'No results found'}
              </Typography>
            </Box>
          ) : searchQuery.trim() ? (
            <List sx={{ py: 1 }}>
              {groupedResults.transactions.length > 0 && (
                <>
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {t('transactions.title')} ({groupedResults.transactions.length})
                    </Typography>
                  </Box>
                  {groupedResults.transactions.map((result) => (
                    <ListItem key={result.id} disablePadding>
                      <ListItemButton onClick={() => handleSelectResult(result)}>
                        <ListItemIcon>{result.icon}</ListItemIcon>
                        <ListItemText
                          primary={result.title}
                          secondary={result.subtitle}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  <Divider sx={{ my: 1 }} />
                </>
              )}

              {groupedResults.budgets.length > 0 && (
                <>
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {t('budgets.title')} ({groupedResults.budgets.length})
                    </Typography>
                  </Box>
                  {groupedResults.budgets.map((result) => (
                    <ListItem key={result.id} disablePadding>
                      <ListItemButton onClick={() => handleSelectResult(result)}>
                        <ListItemIcon>{result.icon}</ListItemIcon>
                        <ListItemText
                          primary={result.title}
                          secondary={result.subtitle}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  <Divider sx={{ my: 1 }} />
                </>
              )}

              {groupedResults.goals.length > 0 && (
                <>
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {t('goals.title')} ({groupedResults.goals.length})
                    </Typography>
                  </Box>
                  {groupedResults.goals.map((result) => (
                    <ListItem key={result.id} disablePadding>
                      <ListItemButton onClick={() => handleSelectResult(result)}>
                        <ListItemIcon>{result.icon}</ListItemIcon>
                        <ListItemText
                          primary={result.title}
                          secondary={result.subtitle}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  <Divider sx={{ my: 1 }} />
                </>
              )}

              {groupedResults.categories.length > 0 && (
                <>
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {t('nav.customCategories') || 'Categories'} ({groupedResults.categories.length})
                    </Typography>
                  </Box>
                  {groupedResults.categories.map((result) => (
                    <ListItem key={result.id} disablePadding>
                      <ListItemButton onClick={() => handleSelectResult(result)}>
                        <ListItemIcon>{result.icon}</ListItemIcon>
                        <ListItemText
                          primary={result.title}
                          secondary={result.subtitle}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </>
              )}
            </List>
          ) : (
            <Box sx={{ p: 4 }}>
              <Typography variant="body2" color="text.secondary" textAlign="center" gutterBottom>
                {t('search.startTyping') || 'Start typing to search...'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<ReceiptIcon />}
                  label={t('transactions.title')}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<AccountBalanceWalletIcon />}
                  label={t('budgets.title')}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<FlagIcon />}
                  label={t('goals.title')}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<CategoryIcon />}
                  label={t('nav.customCategories') || 'Categories'}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
          )}
        </Box>

        {searchQuery.trim() && searchResults.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'action.hover' }}>
            <Typography variant="caption" color="text.secondary">
              {t('search.shortcuts') || 'Press Enter to select, Esc to close'}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
