'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import LanguageIcon from '@mui/icons-material/Language';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InfoIcon from '@mui/icons-material/Info';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import PremiumModal from '@/components/PremiumModal';
import Testimonials from '@/components/Testimonials';
import PageTransition from '@/components/common/PageTransition';
import FAQ from '@/components/common/FAQ';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  const features = [
    {
      icon: <TrendingUpIcon sx={{ fontSize: 48 }} />,
      title: t('landing.feature1Title'),
      description: t('landing.feature1Desc'),
      details: [
        t('landing.feature1Detail1') || 'Track all your income and expenses in one place',
        t('landing.feature1Detail2') || 'Categorize transactions automatically',
        t('landing.feature1Detail3') || 'View detailed financial reports and analytics',
        t('landing.feature1Detail4') || 'Export data in multiple formats (CSV, PDF, Excel)',
      ],
      benefits: [
        t('landing.feature1Benefit1') || 'Better financial visibility',
        t('landing.feature1Benefit2') || 'Identify spending patterns',
        t('landing.feature1Benefit3') || 'Make informed decisions',
      ],
    },
    {
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 48 }} />,
      title: t('landing.feature2Title'),
      description: t('landing.feature2Desc'),
      details: [
        t('landing.feature2Detail1') || 'Set monthly and yearly budgets by category',
        t('landing.feature2Detail2') || 'Get real-time alerts when approaching limits',
        t('landing.feature2Detail3') || 'Track budget progress with visual indicators',
        t('landing.feature2Detail4') || 'Save and reuse budget templates',
      ],
      benefits: [
        t('landing.feature2Benefit1') || 'Control your spending',
        t('landing.feature2Benefit2') || 'Avoid overspending',
        t('landing.feature2Benefit3') || 'Achieve financial goals faster',
      ],
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 48 }} />,
      title: t('landing.feature3Title'),
      description: t('landing.feature3Desc'),
      details: [
        t('landing.feature3Detail1') || 'Interactive charts and graphs',
        t('landing.feature3Detail2') || 'Monthly and yearly financial reports',
        t('landing.feature3Detail3') || 'Period comparison and trend analysis',
        t('landing.feature3Detail4') || 'Financial projections and forecasting',
      ],
      benefits: [
        t('landing.feature3Benefit1') || 'Understand your finances better',
        t('landing.feature3Benefit2') || 'Spot trends and opportunities',
        t('landing.feature3Benefit3') || 'Plan for the future',
      ],
    },
    {
      icon: <LanguageIcon sx={{ fontSize: 48 }} />,
      title: t('landing.feature4Title'),
      description: t('landing.feature4Desc'),
      details: [
        t('landing.feature4Detail1') || 'Multi-language support (English, Spanish)',
        t('landing.feature4Detail2') || 'Multiple currency options',
        t('landing.feature4Detail3') || 'Dark and light themes',
        t('landing.feature4Detail4') || 'Responsive design for all devices',
      ],
      benefits: [
        t('landing.feature4Benefit1') || 'Use in your preferred language',
        t('landing.feature4Benefit2') || 'Work with your local currency',
        t('landing.feature4Benefit3') || 'Customize your experience',
      ],
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
                position: 'relative',
                backgroundImage: 'url(/header.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                color: 'white',
                py: { xs: 8, md: 12 },
                textAlign: 'center',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  zIndex: 0,
                },
                '& > *': {
                  position: 'relative',
                  zIndex: 1,
                },
              }}
            >
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              component="h1"
              fontWeight={700}
              gutterBottom
              sx={{ 
                fontSize: { xs: '2rem', md: '3.5rem' },
                color: 'white',
              }}
            >
              {t('landing.heroTitle')}
            </Typography>
            <Typography
              variant="h5"
              sx={{ 
                mb: 4, 
                opacity: 0.9, 
                fontSize: { xs: '1rem', md: '1.5rem' },
                color: 'white',
              }}
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
                size="large"
                onClick={() => {
                  const element = document.querySelector('#features');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                sx={{ 
                  textTransform: 'none', 
                  px: 4, 
                  py: 1.5,
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
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
            <Box 
              id="features" 
              sx={{ 
                py: { xs: 8, md: 12 }, 
                bgcolor: 'background.default',
                background: (theme) => 
                  theme.palette.mode === 'light'
                    ? 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'
                    : 'background.default',
              }}
            >
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              fontWeight={700}
              textAlign="center"
              gutterBottom
              sx={{ 
                mb: 2,
                background: (theme) => 
                  theme.palette.mode === 'light'
                    ? 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)'
                    : 'none',
                backgroundClip: theme => theme.palette.mode === 'light' ? 'text' : 'unset',
                WebkitBackgroundClip: theme => theme.palette.mode === 'light' ? 'text' : 'unset',
                WebkitTextFillColor: theme => theme.palette.mode === 'light' ? 'transparent' : 'inherit',
              }}
            >
              {t('landing.featuresTitle')}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}
            >
              {t('landing.featuresSubtitle')}
            </Typography>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center', 
                      p: 3,
                      transition: 'all 0.3s ease',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6,
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <Box 
                      sx={{ 
                        mb: 2,
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: (theme) => 
                          theme.palette.mode === 'light' 
                            ? 'rgba(25, 118, 210, 0.1)' 
                            : 'rgba(144, 202, 249, 0.1)',
                        '& svg': {
                          color: (theme) => 
                            theme.palette.mode === 'light' 
                              ? theme.palette.primary.main 
                              : theme.palette.primary.light,
                          fontSize: 48,
                        },
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: '60px' }}>
                      {feature.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => setSelectedFeature(index)}
                      sx={{ 
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 3,
                      }}
                    >
                      {t('landing.learnMore') || 'Learn More'}
                    </Button>
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
            <Box 
              id="video" 
              sx={{ 
                py: { xs: 8, md: 12 }, 
                bgcolor: 'background.paper',
                background: (theme) => 
                  theme.palette.mode === 'light'
                    ? 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)'
                    : 'background.paper',
              }}
            >
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
            <Box 
              id="testimonials" 
              sx={{ 
                py: { xs: 8, md: 12 }, 
                bgcolor: 'background.default',
                background: (theme) => 
                  theme.palette.mode === 'light'
                    ? 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'
                    : 'background.default',
              }}
            >
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
            <Box 
              id="pricing" 
              sx={{ 
                py: { xs: 8, md: 12 }, 
                bgcolor: 'background.default',
                background: (theme) => 
                  theme.palette.mode === 'light'
                    ? 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)'
                    : 'background.default',
              }}
            >
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
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: plan.popular ? 8 : 4,
                      },
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
                        color={plan.color === 'primary' ? 'primary' : plan.color === 'secondary' ? 'secondary' : 'success'}
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

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                py: { xs: 8, md: 12 },
                bgcolor: 'background.default',
              }}
            >
              <FAQ
                title={t('landing.faqTitle')}
                subtitle={t('landing.faqSubtitle')}
                maxWidth="md"
                items={[
                  {
                    question: t('faq.q1'),
                    answer: t('faq.a1'),
                  },
                  {
                    question: t('faq.q2'),
                    answer: t('faq.a2'),
                  },
                  {
                    question: t('faq.q3'),
                    answer: t('faq.a3'),
                  },
                  {
                    question: t('faq.q4'),
                    answer: t('faq.a4'),
                  },
                  {
                    question: t('faq.q5'),
                    answer: t('faq.a5'),
                  },
                  {
                    question: t('faq.q6'),
                    answer: t('faq.a6'),
                  },
                ]}
              />
          </Box>
          </motion.div>
        </Box>
        <Footer />
        <PremiumModal open={premiumModalOpen} onClose={() => setPremiumModalOpen(false)} />
        
        {/* Feature Detail Modal */}
        <Dialog
          open={selectedFeature !== null}
          onClose={() => setSelectedFeature(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: (theme) =>
                theme.palette.mode === 'light'
                  ? 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'
                  : 'background.paper',
            },
          }}
        >
          {selectedFeature !== null && (
            <>
              <DialogTitle
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  pb: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: (theme) =>
                        theme.palette.mode === 'light'
                          ? 'rgba(25, 118, 210, 0.1)'
                          : 'rgba(144, 202, 249, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        color: 'primary.main',
                        '& svg': {
                          fontSize: 40,
                        },
                      }}
                    >
                      {features[selectedFeature].icon}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {features[selectedFeature].title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {features[selectedFeature].description}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={() => setSelectedFeature(null)}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <Divider />
              <DialogContent sx={{ pt: 3 }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon color="primary" />
                    {t('landing.featureDetails') || 'Key Features'}
                  </Typography>
                  <List sx={{ mt: 1 }}>
                    {features[selectedFeature].details.map((detail, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <CheckCircleIcon color="primary" sx={{ fontSize: 24 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={detail}
                          primaryTypographyProps={{
                            variant: 'body1',
                            sx: { fontWeight: 500 },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SpeedIcon color="primary" />
                    {t('landing.featureBenefits') || 'Benefits'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
                    {features[selectedFeature].benefits.map((benefit, idx) => (
                      <Chip
                        key={idx}
                        label={benefit}
                        icon={<SecurityIcon />}
                        color="primary"
                        variant="outlined"
                        sx={{
                          fontWeight: 500,
                          py: 2.5,
                          '& .MuiChip-icon': {
                            color: 'primary.main',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </DialogContent>
              <Divider />
              <DialogActions sx={{ p: 3, pt: 2 }}>
                <Button
                  onClick={() => setSelectedFeature(null)}
                  sx={{ textTransform: 'none' }}
                >
                  {t('common.close') || 'Close'}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setSelectedFeature(null);
                    handleGetStarted();
                  }}
                  sx={{ textTransform: 'none', px: 4 }}
                  endIcon={<ArrowForwardIcon />}
                >
                  {t('landing.getStarted') || 'Get Started'}
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </PageTransition>
  );
}
