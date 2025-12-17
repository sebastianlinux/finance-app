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

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('auth.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || t('auth.invalidCredentials'));
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
                {t('auth.loginTitle')}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
                sx={{ mb: 4 }}
              >
                {t('auth.loginSubtitle')}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label={t('auth.email')}
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: undefined });
                  }}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{ mb: 2 }}
                  autoComplete="email"
                />

                <TextField
                  fullWidth
                  label={t('auth.password')}
                  type="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors({ ...errors, password: undefined });
                  }}
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{ mb: 2 }}
                  autoComplete="current-password"
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={() => router.push('/forgot-password')}
                    sx={{ textDecoration: 'none' }}
                  >
                    {t('auth.forgotPassword')}
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mb: 2, textTransform: 'none', py: 1.5 }}
                >
                  {loading ? t('common.loading') : t('auth.signIn')}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.dontHaveAccount')}{' '}
                    <Link
                      component="button"
                      type="button"
                      onClick={() => router.push('/register')}
                      sx={{ textDecoration: 'none', fontWeight: 600 }}
                    >
                      {t('auth.signUp')}
                    </Link>
                  </Typography>
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
