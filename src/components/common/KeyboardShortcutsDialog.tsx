'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Collapse,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import GlobalSearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

interface Shortcut {
  id: string;
  keys: string[];
  description: string;
  category: 'global' | 'forms' | 'navigation';
  icon: React.ReactNode;
  macKeys?: string[];
}

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsDialog({ open, onClose }: KeyboardShortcutsDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    global: true,
    forms: true,
    navigation: true,
  });

  // Detect platform
  const isMac = typeof window !== 'undefined' && /Mac|iPhone|iPod|iPad/i.test(navigator.platform);

  const shortcuts: Shortcut[] = [
    {
      id: 'search',
      keys: isMac ? ['⌘', 'K'] : ['Ctrl', 'K'],
      macKeys: ['⌘', 'K'],
      description: t('shortcuts.search.description') || 'Open global search',
      category: 'global',
      icon: <GlobalSearchIcon />,
    },
    {
      id: 'close',
      keys: ['Esc'],
      description: t('shortcuts.close.description') || 'Close modals and dialogs',
      category: 'global',
      icon: <CloseIcon />,
    },
    {
      id: 'save',
      keys: ['Enter'],
      description: t('shortcuts.save.description') || 'Save form (Transactions, Budgets)',
      category: 'forms',
      icon: <SaveIcon />,
    },
    {
      id: 'cancel',
      keys: ['Esc'],
      description: t('shortcuts.cancel.description') || 'Cancel/Close form',
      category: 'forms',
      icon: <CancelIcon />,
    },
    {
      id: 'shortcuts',
      keys: isMac ? ['⌘', '?'] : ['Ctrl', '?'],
      macKeys: ['⌘', '?'],
      description: t('shortcuts.shortcuts.description') || 'Open keyboard shortcuts',
      category: 'global',
      icon: <KeyboardIcon />,
    },
  ];

  const filteredShortcuts = useMemo(() => {
    if (!searchQuery.trim()) return shortcuts;

    const query = searchQuery.toLowerCase();
    return shortcuts.filter(
      (shortcut) =>
        shortcut.description.toLowerCase().includes(query) ||
        shortcut.keys.some((key) => key.toLowerCase().includes(query)) ||
        shortcut.id.toLowerCase().includes(query)
    );
  }, [searchQuery, shortcuts]);

  const groupedShortcuts = useMemo(() => {
    const groups: Record<string, Shortcut[]> = {
      global: [],
      forms: [],
      navigation: [],
    };

    filteredShortcuts.forEach((shortcut) => {
      groups[shortcut.category].push(shortcut);
    });

    return groups;
  }, [filteredShortcuts]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'global':
        return t('shortcuts.categories.global') || 'Global Shortcuts';
      case 'forms':
        return t('shortcuts.categories.forms') || 'Form Shortcuts';
      case 'navigation':
        return t('shortcuts.categories.navigation') || 'Navigation';
      default:
        return category;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'global':
        return <KeyboardIcon />;
      case 'forms':
        return <SaveIcon />;
      case 'navigation':
        return <GlobalSearchIcon />;
      default:
        return <KeyboardIcon />;
    }
  };

  const renderKey = (key: string) => {
    const isSpecial = ['⌘', 'Ctrl', 'Alt', 'Shift', 'Enter', 'Esc', 'Tab'].includes(key);
    
    return (
      <Chip
        key={key}
        label={key}
        size="small"
        sx={{
          height: 28,
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: '0.75rem',
          fontWeight: 600,
          bgcolor: isSpecial
            ? theme.palette.mode === 'dark'
              ? 'rgba(124, 58, 237, 0.2)'
              : 'rgba(124, 58, 237, 0.1)'
            : theme.palette.mode === 'dark'
            ? 'rgba(148, 163, 184, 0.2)'
            : 'rgba(148, 163, 184, 0.1)',
          color: isSpecial ? 'primary.main' : 'text.primary',
          border: `1px solid ${
            isSpecial
              ? theme.palette.mode === 'dark'
                ? 'rgba(124, 58, 237, 0.4)'
                : 'rgba(124, 58, 237, 0.3)'
              : theme.palette.mode === 'dark'
              ? 'rgba(148, 163, 184, 0.2)'
              : 'rgba(148, 163, 184, 0.2)'
          }`,
          borderRadius: 1.5,
          '& .MuiChip-label': {
            px: 1.5,
          },
        }}
      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.contrastText',
            }}
          >
            <KeyboardIcon />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {t('shortcuts.title') || 'Keyboard Shortcuts'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('shortcuts.subtitle') || 'Speed up your workflow with these shortcuts'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Search Bar */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            autoFocus
            fullWidth
            placeholder={t('shortcuts.searchPlaceholder') || 'Search shortcuts...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
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

        {/* Shortcuts List */}
        <Box sx={{ maxHeight: 'calc(90vh - 200px)', overflow: 'auto', p: 3 }}>
          {Object.keys(groupedShortcuts).map((category) => {
            const categoryShortcuts = groupedShortcuts[category];
            if (categoryShortcuts.length === 0) return null;

            return (
              <Box key={category} sx={{ mb: 3 }}>
                {/* Category Header */}
                <Box
                  onClick={() => toggleCategory(category)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                    cursor: 'pointer',
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(124, 58, 237, 0.05)',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(124, 58, 237, 0.15)' : 'rgba(124, 58, 237, 0.08)',
                    },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.contrastText',
                      }}
                    >
                      {getCategoryIcon(category)}
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      {getCategoryLabel(category)}
                    </Typography>
                    <Chip
                      label={categoryShortcuts.length}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                      }}
                    />
                  </Box>
                  <IconButton size="small">
                    {expandedCategories[category] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>

                {/* Category Shortcuts */}
                <Collapse in={expandedCategories[category]}>
                  <AnimatePresence>
                    {categoryShortcuts.map((shortcut, index) => (
                      <motion.div
                        key={shortcut.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                            mb: 1,
                            borderRadius: 2,
                            border: 1,
                            borderColor: 'divider',
                            bgcolor: 'background.paper',
                            '&:hover': {
                              bgcolor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                              borderColor: 'primary.main',
                            },
                            transition: 'all 0.2s',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                            <Box
                              sx={{
                                color: 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              {shortcut.icon}
                            </Box>
                            <Typography variant="body1" sx={{ flex: 1 }}>
                              {shortcut.description}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {(isMac && shortcut.macKeys ? shortcut.macKeys : shortcut.keys).map((key, keyIndex) => (
                              <Box key={keyIndex} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {renderKey(key)}
                                {keyIndex < (isMac && shortcut.macKeys ? shortcut.macKeys : shortcut.keys).length - 1 && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mx: 0.5 }}>
                                    +
                                  </Typography>
                                )}
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Collapse>
              </Box>
            );
          })}

          {filteredShortcuts.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="body1" color="text.secondary">
                {t('shortcuts.noResults') || 'No shortcuts found'}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.5)' : 'rgba(0, 0, 0, 0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {t('shortcuts.footer') || 'Press Esc to close'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {isMac ? 'Mac' : 'Windows/Linux'}
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Typography variant="caption" color="text.secondary">
            {filteredShortcuts.length} {t('shortcuts.shortcutsCount') || 'shortcuts'}
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
}
