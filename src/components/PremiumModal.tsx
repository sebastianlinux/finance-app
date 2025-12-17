'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PremiumModal({ open, onClose }: PremiumModalProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const updatePlan = useAuthStore((state) => state.updatePlan);
  const [step, setStep] = useState<'plan' | 'payment'>('plan');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const handleUpgrade = () => {
    updatePlan('premium');
    onClose();
    router.push('/dashboard');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing
    setTimeout(() => {
      handleUpgrade();
    }, 1500);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight={700}>
          {step === 'plan' ? t('landing.planPremium') : t('auth.payment')}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {step === 'plan' ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('landing.planPremium')} - $19.99/{t('landing.planPriceMonthly')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('landing.pricingSubtitle')}
            </Typography>
            <Grid container spacing={2}>
              {[
                t('landing.planFeature1'),
                t('landing.planFeature2'),
                t('landing.planFeature3'),
                t('landing.planFeature4'),
                t('landing.planFeature5'),
                t('landing.planFeature6'),
                t('landing.planFeature7'),
                t('landing.planFeature8'),
                t('landing.planFeature9'),
              ].map((feature, idx) => (
                <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="body2">{feature}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box component="form" id="payment-form" onSubmit={handlePaymentSubmit}>
            <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <CreditCardIcon sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {t('landing.planPremium')}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      $19.99/{t('landing.planPriceMonthly')}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={t('auth.cardName')}
                  value={paymentData.cardName}
                  onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={t('auth.cardNumber')}
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label={t('auth.expiryDate')}
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                  placeholder="MM/YY"
                  required
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label={t('auth.cvv')}
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                  type="password"
                  required
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        {step === 'plan' ? (
          <>
            <Button onClick={onClose}>{t('common.cancel')}</Button>
            <Button variant="contained" onClick={() => setStep('payment')}>
              {t('landing.selectPlan')}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setStep('plan')}>{t('common.cancel')}</Button>
            <Button
              type="submit"
              variant="contained"
              onClick={handlePaymentSubmit}
              form="payment-form"
            >
              {t('auth.processPayment')}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
