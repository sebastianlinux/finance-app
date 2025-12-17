'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset);

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError(t('auth.emailRequired'));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('auth.emailInvalid'));
      return;
    }

    setLoading(true);
    const result = await requestPasswordReset(email);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message || 'An error occurred');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          pt: { xs: 12, sm: 16 },
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="sm">
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom textAlign="center">
                {t('auth.resetPasswordTitle')}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
                sx={{ mb: 4 }}
              >
                {t('auth.resetPasswordSubtitle')}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {t('auth.passwordResetSent')}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label={t('auth.email')}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  error={!!error && !success}
                  sx={{ mb: 3 }}
                  autoComplete="email"
                  disabled={success}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || success}
                  sx={{ mb: 2, textTransform: 'none', py: 1.5 }}
                >
                  {loading ? t('common.loading') : t('auth.sendResetLink')}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={() => router.push('/login')}
                    sx={{ textDecoration: 'none' }}
                  >
                    {t('auth.backToLogin')}
                  </Link>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
