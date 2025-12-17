'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  TextField,
  MenuItem,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFinanceStore } from '@/store/financeStore';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import i18n from '@/i18n/config';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppLayout from '@/components/Layout/AppLayout';

const currencies = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
];

function SettingsPage() {
  const { t, i18n: i18nInstance } = useTranslation();
  const settings = useFinanceStore((state) => state.settings);
  const updateSettings = useFinanceStore((state) => state.updateSettings);
  const resetAllData = useFinanceStore((state) => state.resetAllData);

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Sync i18n language when settings change
  useEffect(() => {
    if (settings.language && i18nInstance.language !== settings.language) {
      i18nInstance.changeLanguage(settings.language);
    }
  }, [settings.language, i18nInstance]);

  const handleCurrencyChange = (currency: string) => {
    updateSettings({ currency });
    setSnackbarMessage('Currency updated');
    setSnackbarOpen(true);
  };

  const handleLanguageChange = (language: string) => {
    updateSettings({ language });
    i18nInstance.changeLanguage(language);
    setSnackbarMessage('Language updated');
    setSnackbarOpen(true);
  };

  const handleDarkModeToggle = (darkMode: boolean) => {
    updateSettings({ darkMode });
    setSnackbarMessage(darkMode ? 'Dark mode enabled' : 'Dark mode disabled');
    setSnackbarOpen(true);
  };

  const handleResetConfirm = () => {
    resetAllData();
    setResetDialogOpen(false);
    setSnackbarMessage(t('settings.resetSuccess'));
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {t('settings.title')}
      </Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {t('settings.currency')}
          </Typography>
          <TextField
            select
            value={settings.currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            {currencies.map((currency) => (
              <MenuItem key={currency.value} value={currency.value}>
                {currency.label}
              </MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {t('settings.language')}
          </Typography>
          <TextField
            select
            value={settings.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            {languages.map((language) => (
              <MenuItem key={language.value} value={language.value}>
                {language.label}
              </MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {t('settings.darkMode')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toggle between light and dark theme
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={(e) => handleDarkModeToggle(e.target.checked)}
                />
              }
              label=""
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3, border: '1px solid', borderColor: 'error.main' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom color="error">
            {t('settings.dataReset')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('settings.resetData')}
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setResetDialogOpen(true)}
          >
            {t('settings.resetData')}
          </Button>
        </CardContent>
      </Card>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        open={resetDialogOpen}
        title={t('settings.dataReset')}
        message={t('settings.resetConfirm')}
        onConfirm={handleResetConfirm}
        onCancel={() => setResetDialogOpen(false)}
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

export default function ProtectedSettings() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SettingsPage />
      </AppLayout>
    </ProtectedRoute>
  );
}
