'use client';

import { Alert, Box, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

interface DemoModeBannerProps {
  onDisable: () => void;
}

export default function DemoModeBanner({ onDisable }: DemoModeBannerProps) {
  const { t } = useTranslation();

  return (
    <Alert
      severity="info"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderRadius: 0,
        alignItems: 'center',
      }}
      action={
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            size="small"
            startIcon={<DeleteIcon />}
            onClick={onDisable}
            sx={{ textTransform: 'none' }}
          >
            {t('tutorial.exitDemo') || 'Exit Demo Mode'}
          </Button>
          <IconButton
            size="small"
            onClick={onDisable}
            sx={{ ml: 1 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      }
    >
      <Box>
        <strong>{t('tutorial.demoMode') || 'Demo Mode Active'}</strong>
        <Box component="span" sx={{ ml: 1 }}>
          {t('tutorial.demoModeDescription') || 'You are viewing the app with sample data. Your real data is safe.'}
        </Box>
      </Box>
    </Alert>
  );
}
