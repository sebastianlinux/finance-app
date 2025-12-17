'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Grid,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppLayout from '@/components/Layout/AppLayout';
import PremiumModal from '@/components/PremiumModal';
import { PlanType } from '@/types';

function ProfilePage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const updatePlan = useAuthStore((state) => state.updatePlan);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);

  const planLabels: Record<PlanType, string> = {
    basic: t('profile.planBasic'),
    standard: t('profile.planStandard'),
    premium: t('profile.planPremium'),
  };

  const planColors: Record<PlanType, 'default' | 'primary' | 'success'> = {
    basic: 'default',
    standard: 'primary',
    premium: 'success',
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = t('auth.nameRequired');
    }

    if (!formData.email) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('auth.emailInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    updateUser(formData);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleUpgradeClick = () => {
    if (user?.plan === 'premium') return;
    setPremiumModalOpen(true);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {t('profile.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t('profile.subtitle')}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                {t('profile.personalInfo')}
              </Typography>

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {t('profile.profileUpdated')}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label={t('profile.name')}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setErrors({ ...errors, name: undefined });
                  }}
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label={t('profile.email')}
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: undefined });
                  }}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ textTransform: 'none' }}
                >
                  {loading ? t('common.loading') : t('profile.updateProfile')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                {t('profile.accountSettings')}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('profile.currentPlan')}
                </Typography>
                <Chip
                  label={planLabels[user?.plan || 'basic']}
                  color={planColors[user?.plan || 'basic']}
                  sx={{ mt: 1 }}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('profile.memberSince')}
                </Typography>
                <Typography variant="body1">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('profile.lastUpdated')}
                </Typography>
                <Typography variant="body1">
                  {user?.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString()
                    : 'N/A'}
                </Typography>
              </Box>

              {user?.plan !== 'premium' && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="success"
                  onClick={handleUpgradeClick}
                  sx={{ textTransform: 'none', mt: 2 }}
                >
                  {t('profile.upgradePlan')}
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <PremiumModal
        open={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
      />
    </Container>
  );
}

export default function ProtectedProfile() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ProfilePage />
      </AppLayout>
    </ProtectedRoute>
  );
}
