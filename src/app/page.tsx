'use client';

import { Box, Container, Typography, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import LanguageIcon from '@mui/icons-material/Language';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import PremiumModal from '@/components/PremiumModal';
import Testimonials from '@/components/Testimonials';
import PageTransition from '@/components/common/PageTransition';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);

  const features = [
    {
      icon: <TrendingUpIcon sx={{ fontSize: 48 }} />,
      title: t('landing.feature1Title'),
      description: t('landing.feature1Desc'),
    },
    {
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 48 }} />,
      title: t('landing.feature2Title'),
      description: t('landing.feature2Desc'),
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 48 }} />,
      title: t('landing.feature3Title'),
      description: t('landing.feature3Desc'),
    },
    {
      icon: <LanguageIcon sx={{ fontSize: 48 }} />,
      title: t('landing.feature4Title'),
      description: t('landing.feature4Desc'),
    },
  ];

  const plans = [
    {
      name: t('landing.planBasic'),
      price: t('landing.planPriceFree'),
      features: [
        t('landing.planFeature1'),
        t('landing.planFeature2'),
        t('landing.planFeature3'),
        t('landing.planFeature4'),
      ],
      color: 'primary',
    },
    {
      name: t('landing.planStandard'),
      price: '$9.99',
      period: t('landing.planPriceMonthly'),
      features: [
        t('landing.planFeature1'),
        t('landing.planFeature2'),
        t('landing.planFeature3'),
        t('landing.planFeature4'),
        t('landing.planFeature5'),
        t('landing.planFeature6'),
      ],
      color: 'secondary',
      popular: true,
    },
    {
      name: t('landing.planPremium'),
      price: '$19.99',
      period: t('landing.planPriceMonthly'),
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
      color: 'success',
    },
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  };

  return (
    <PageTransition>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, pt: '64px' }}>
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                py: { xs: 8, md: 12 },
                textAlign: 'center',
              }}
            >
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              component="h1"
              fontWeight={700}
              gutterBottom
              sx={{ fontSize: { xs: '2rem', md: '3.5rem' } }}
            >
              {t('landing.heroTitle')}
            </Typography>
            <Typography
              variant="h5"
              sx={{ mb: 4, opacity: 0.9, fontSize: { xs: '1rem', md: '1.5rem' } }}
            >
              {t('landing.heroSubtitle')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleGetStarted}
                sx={{ textTransform: 'none', px: 4, py: 1.5 }}
              >
                {t('landing.getStarted')}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => {
                  const element = document.querySelector('#features');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                sx={{ textTransform: 'none', px: 4, py: 1.5 }}
              >
                {t('landing.learnMore')}
              </Button>
              </Box>
            </Container>
          </Box>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box id="features" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              fontWeight={700}
              textAlign="center"
              gutterBottom
              sx={{ mb: 2 }}
            >
              {t('landing.featuresTitle')}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 6 }}
            >
              {t('landing.featuresSubtitle')}
            </Typography>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
              </Grid>
            </Container>
          </Box>
          </motion.div>

          {/* Video Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Box id="video" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              fontWeight={700}
              textAlign="center"
              gutterBottom
              sx={{ mb: 2 }}
            >
              {t('landing.videoTitle')}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 6, maxWidth: '700px', mx: 'auto' }}
            >
              {t('landing.videoSubtitle')}
            </Typography>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: '900px',
                mx: 'auto',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: 6,
                aspectRatio: '16/9',
              }}
            >
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/mQ1UWPOVCxQ"
                title="Finance Tracker Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
              </Box>
            </Container>
          </Box>
          </motion.div>

          {/* Testimonials Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Box id="testimonials" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              fontWeight={700}
              textAlign="center"
              gutterBottom
              sx={{ mb: 2 }}
            >
              {t('testimonials.title')}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 6 }}
            >
              {t('testimonials.subtitle')}
            </Typography>
              <Testimonials />
            </Container>
          </Box>
          </motion.div>

          {/* Pricing Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Box id="pricing" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              fontWeight={700}
              textAlign="center"
              gutterBottom
              sx={{ mb: 2 }}
            >
              {t('landing.pricingTitle')}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 6 }}
            >
              {t('landing.pricingSubtitle')}
            </Typography>
            <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
              {plans.map((plan, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      border: plan.popular ? 2 : 1,
                      borderColor: plan.popular ? `${plan.color}.main` : 'divider',
                    }}
                  >
                    {plan.popular && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -12,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          bgcolor: `${plan.color}.main`,
                          color: `${plan.color}.contrastText`,
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {t('landing.currentPlan')}
                      </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1, pt: plan.popular ? 4 : 3 }}>
                      <Typography variant="h5" fontWeight={700} gutterBottom>
                        {plan.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                        <Typography variant="h3" fontWeight={700} color={`${plan.color}.main`}>
                          {plan.price}
                        </Typography>
                        {plan.period && (
                          <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                            {plan.period}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {plan.features.map((feature, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon
                              sx={{ fontSize: 20, color: `${plan.color}.main` }}
                            />
                            <Typography variant="body2">{feature}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button
                        fullWidth
                        variant={plan.popular ? 'contained' : 'outlined'}
                        color={plan.color as any}
                        onClick={() => {
                          if (plan.name === t('landing.planPremium')) {
                            setPremiumModalOpen(true);
                          } else if (isAuthenticated) {
                            router.push('/dashboard');
                          } else {
                            router.push('/register');
                          }
                        }}
                        sx={{ textTransform: 'none' }}
                      >
                        {plan.price === t('landing.planPriceFree')
                          ? t('landing.getStarted')
                          : t('landing.selectPlan')}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
              </Grid>
            </Container>
          </Box>
          </motion.div>
        </Box>
        <Footer />
        <PremiumModal open={premiumModalOpen} onClose={() => setPremiumModalOpen(false)} />
      </Box>
    </PageTransition>
  );
}
