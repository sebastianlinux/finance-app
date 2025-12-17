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
  initialPlan?: 'standard' | 'premium';
}

export default function PremiumModal({ open, onClose, initialPlan }: PremiumModalProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const updatePlan = useAuthStore((state) => state.updatePlan);
  const addPayment = useAuthStore((state) => state.addPayment);
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'premium'>(initialPlan || 'standard');
  const [step, setStep] = useState<'plan' | 'payment'>('plan');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const planDetails = {
    standard: {
      name: t('landing.planStandard'),
      price: 9.99,
      features: [
        t('landing.planFeature1'),
        t('landing.planFeature2'),
        t('landing.planFeature3'),
        t('landing.planFeature4'),
        t('landing.planFeature5'),
        t('landing.planFeature6'),
      ],
    },
    premium: {
      name: t('landing.planPremium'),
      price: 19.99,
      features: [
        t('landing.planFeature1'),
        t('landing.planFeature2'),
        t('landing.planFeature3'),
        t('landing.planFeature4'),
        t('landing.planFeature5'),
        t('landing.planFeature6'),
        t('landing.planFeature7'),
        t('landing.planFeature8'),
        t('landing.planFeature9'),
      ],
    },
  };

  const handleUpgrade = () => {
    if (user) {
      // Create payment record
      addPayment({
        userId: user.id,
        plan: selectedPlan,
        amount: planDetails[selectedPlan].price,
        currency: 'USD',
        status: 'completed',
        paymentMethod: 'card',
      });
      
      updatePlan(selectedPlan);
      onClose();
      router.push('/dashboard');
    }
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
          {step === 'plan' ? t('profile.upgradePlan') : t('auth.payment')}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {step === 'plan' ? (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              {t('profile.selectPlan') || 'Select a Plan'}
            </Typography>
            
            {/* Plan Selection */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: selectedPlan === 'standard' ? 2 : 1,
                    borderColor: selectedPlan === 'standard' ? 'primary.main' : 'divider',
                    bgcolor: selectedPlan === 'standard' ? 'action.selected' : 'background.paper',
                    '&:hover': { borderColor: 'primary.main' },
                  }}
                  onClick={() => setSelectedPlan('standard')}
                >
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {planDetails.standard.name}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
                    ${planDetails.standard.price}
                    <Typography component="span" variant="body2" color="text.secondary">
                      /{t('landing.planPriceMonthly')}
                    </Typography>
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {planDetails.standard.features.map((feature, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16 }} />
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: selectedPlan === 'premium' ? 2 : 1,
                    borderColor: selectedPlan === 'premium' ? 'success.main' : 'divider',
                    bgcolor: selectedPlan === 'premium' ? 'action.selected' : 'background.paper',
                    '&:hover': { borderColor: 'success.main' },
                  }}
                  onClick={() => setSelectedPlan('premium')}
                >
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {planDetails.premium.name}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="success.main" gutterBottom>
                    ${planDetails.premium.price}
                    <Typography component="span" variant="body2" color="text.secondary">
                      /{t('landing.planPriceMonthly')}
                    </Typography>
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {planDetails.premium.features.map((feature, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16 }} />
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box component="form" id="payment-form" onSubmit={handlePaymentSubmit}>
            <Card sx={{ mb: 3, bgcolor: selectedPlan === 'premium' ? 'success.main' : 'primary.main', color: 'primary.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <CreditCardIcon sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {planDetails[selectedPlan].name}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      ${planDetails[selectedPlan].price}/{t('landing.planPriceMonthly')}
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
            <Button 
              variant="contained" 
              onClick={() => setStep('payment')}
              disabled={user?.plan === selectedPlan}
            >
              {user?.plan === selectedPlan ? t('profile.currentPlan') : t('landing.selectPlan')}
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
