'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinanceStore } from '@/store/financeStore';
import i18n from '@/i18n/config';

interface LanguageModalProps {
  open: boolean;
  onClose: () => void;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export default function LanguageModal({ open, onClose }: LanguageModalProps) {
  const { t, i18n: i18nInstance } = useTranslation();
  const language = useFinanceStore((state) => state.settings.language);
  const updateSettings = useFinanceStore((state) => state.updateSettings);

  const handleLanguageChange = (langCode: string) => {
    updateSettings({ language: langCode });
    i18nInstance.changeLanguage(langCode);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            {t('settings.language')}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <List sx={{ p: 0 }}>
            <AnimatePresence>
              {languages.map((lang, index) => (
                <motion.div
                  key={lang.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleLanguageChange(lang.code)}
                      sx={{
                        py: 2,
                        px: 3,
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Typography variant="h5">{lang.flag}</Typography>
                        <ListItemText
                          primary={lang.name}
                          primaryTypographyProps={{
                            fontWeight: language === lang.code ? 600 : 400,
                          }}
                        />
                        {language === lang.code && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          >
                            <CheckIcon color="primary" />
                          </motion.div>
                        )}
                      </Box>
                    </ListItemButton>
                  </ListItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
