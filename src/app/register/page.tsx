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

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!formData.name.trim()) {
      newErrors.name = t('auth.nameRequired');
    }

    if (!formData.email) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('auth.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.passwordMinLength');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordsDontMatch');
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
    const result = await register(formData.email, formData.password, formData.name);
    setLoading(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || t('auth.emailExists'));
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
                {t('auth.registerTitle')}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
                sx={{ mb: 4 }}
              >
                {t('auth.registerSubtitle')}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label={t('auth.name')}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setErrors({ ...errors, name: undefined });
                  }}
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={{ mb: 2 }}
                  autoComplete="name"
                />

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
                  autoComplete="new-password"
                />

                <TextField
                  fullWidth
                  label={t('auth.confirmPassword')}
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  sx={{ mb: 3 }}
                  autoComplete="new-password"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mb: 2, textTransform: 'none', py: 1.5 }}
                >
                  {loading ? t('common.loading') : t('auth.signUp')}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.alreadyHaveAccount')}{' '}
                    <Link
                      component="button"
                      type="button"
                      onClick={() => router.push('/login')}
                      sx={{ textDecoration: 'none', fontWeight: 600 }}
                    >
                      {t('auth.signIn')}
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
