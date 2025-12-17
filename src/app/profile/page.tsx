'use client';

import { useState, useMemo } from 'react';
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
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppLayout from '@/components/Layout/AppLayout';
import PremiumModal from '@/components/PremiumModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { PlanType } from '@/types';
import { formatCurrency } from '@/utils/format';

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
  const [selectedPlanToUpgrade, setSelectedPlanToUpgrade] = useState<'standard' | 'premium' | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  
  // Get store data directly
  const allPayments = useAuthStore((state) => state.payments);
  const allInvoices = useAuthStore((state) => state.invoices);
  const allSubscriptions = useAuthStore((state) => state.subscriptions);
  const cancelSubscription = useAuthStore((state) => state.cancelSubscription);
  
  // Filter data based on current user
  const payments = useMemo(() => {
    return allPayments.filter((p) => p.userId === user?.id);
  }, [allPayments, user?.id]);
  
  const invoices = useMemo(() => {
    return allInvoices.filter((i) => i.userId === user?.id);
  }, [allInvoices, user?.id]);
  
  const currentSubscription = useMemo(() => {
    if (!user) return null;
    return allSubscriptions.find(
      (s) => s.userId === user.id && s.status === 'active'
    ) || null;
  }, [allSubscriptions, user]);

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

              {user?.plan === 'basic' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setSelectedPlanToUpgrade('standard');
                      setPremiumModalOpen(true);
                    }}
                    sx={{ textTransform: 'none' }}
                  >
                    {t('profile.upgradeToStandard') || 'Upgrade to Standard'}
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="success"
                    onClick={() => {
                      setSelectedPlanToUpgrade('premium');
                      setPremiumModalOpen(true);
                    }}
                    sx={{ textTransform: 'none' }}
                  >
                    {t('profile.upgradeToPremium') || 'Upgrade to Premium'}
                  </Button>
                </Box>
              )}
              {user?.plan === 'standard' && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="success"
                  onClick={() => {
                    setSelectedPlanToUpgrade('premium');
                    setPremiumModalOpen(true);
                  }}
                  sx={{ textTransform: 'none', mt: 2 }}
                >
                  {t('profile.upgradeToPremium') || 'Upgrade to Premium'}
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Subscription & Payments Section */}
      {(user?.plan === 'standard' || user?.plan === 'premium') && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
              <Tab label={t('profile.subscription') || 'Subscription'} />
              <Tab label={t('profile.paymentHistory') || 'Payment History'} />
              <Tab label={t('profile.invoices') || 'Invoices'} />
            </Tabs>

            {tabValue === 0 && currentSubscription && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {planLabels[currentSubscription.plan]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('profile.status') || 'Status'}: {currentSubscription.status}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('profile.renewalDate') || 'Renewal Date'}: {new Date(currentSubscription.renewalDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  {currentSubscription.status === 'active' && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => setCancelDialogOpen(true)}
                      sx={{ textTransform: 'none' }}
                    >
                      {t('profile.cancelSubscription') || 'Cancel Subscription'}
                    </Button>
                  )}
                </Box>
              </Box>
            )}

            {tabValue === 1 && (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>{t('profile.date') || 'Date'}</strong></TableCell>
                      <TableCell><strong>{t('profile.plan')}</strong></TableCell>
                      <TableCell align="right"><strong>{t('profile.amount') || 'Amount'}</strong></TableCell>
                      <TableCell><strong>{t('profile.status') || 'Status'}</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography color="text.secondary" sx={{ py: 2 }}>
                            {t('profile.noPayments') || 'No payments found'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Chip
                              label={planLabels[payment.plan]}
                              color={payment.plan === 'premium' ? 'success' : 'primary'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right" className="mono">{formatCurrency(payment.amount, payment.currency)}</TableCell>
                          <TableCell>
                            <Chip
                              label={payment.status}
                              color={payment.status === 'completed' ? 'success' : payment.status === 'failed' ? 'error' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {tabValue === 2 && (
              <Box>
                {invoices.length === 0 ? (
                  <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    {t('profile.noInvoices') || 'No invoices found'}
                  </Typography>
                ) : (
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>{t('profile.invoiceId') || 'Invoice ID'}</strong></TableCell>
                          <TableCell><strong>{t('profile.date') || 'Date'}</strong></TableCell>
                          <TableCell align="right"><strong>{t('profile.amount') || 'Amount'}</strong></TableCell>
                          <TableCell><strong>{t('profile.status') || 'Status'}</strong></TableCell>
                          <TableCell align="center"><strong>{t('profile.actions') || 'Actions'}</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {invoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell>{invoice.id}</TableCell>
                            <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                            <TableCell align="right" className="mono">{formatCurrency(invoice.amount, invoice.currency)}</TableCell>
                            <TableCell>
                              <Chip
                                label={invoice.status}
                                color={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'error' : 'warning'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  // Generate PDF invoice
                                  const invoiceContent = `
Invoice #${invoice.id}
Date: ${new Date(invoice.issueDate).toLocaleDateString()}
Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}

Items:
${invoice.items.map((item) => `${item.description} - ${item.quantity}x ${formatCurrency(item.price, invoice.currency)}`).join('\n')}

Total: ${formatCurrency(invoice.amount, invoice.currency)}
Status: ${invoice.status}
                                  `;
                                  const blob = new Blob([invoiceContent], { type: 'text/plain' });
                                  const url = URL.createObjectURL(blob);
                                  const link = document.createElement('a');
                                  link.href = url;
                                  link.download = `invoice-${invoice.id}.txt`;
                                  link.click();
                                  URL.revokeObjectURL(url);
                                }}
                              >
                                <DownloadIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      <PremiumModal
        open={premiumModalOpen}
        onClose={() => {
          setPremiumModalOpen(false);
          setSelectedPlanToUpgrade(null);
        }}
        initialPlan={selectedPlanToUpgrade || undefined}
      />

      <ConfirmDialog
        open={cancelDialogOpen}
        title={t('profile.cancelSubscription') || 'Cancel Subscription'}
        message={t('profile.cancelSubscriptionConfirm') || 'Are you sure you want to cancel your subscription?'}
        onConfirm={() => {
          if (currentSubscription) {
            cancelSubscription(currentSubscription.id);
            updatePlan('basic');
          }
          setCancelDialogOpen(false);
        }}
        onCancel={() => setCancelDialogOpen(false)}
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
