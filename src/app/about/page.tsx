'use client';

import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import Testimonials from '@/components/Testimonials';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import SupportIcon from '@mui/icons-material/Support';

export default function AboutPage() {
  const { t } = useTranslation();

  const values = [
    {
      icon: <TrendingUpIcon sx={{ fontSize: 48 }} />,
      title: t('about.value1Title'),
      description: t('about.value1Desc'),
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48 }} />,
      title: t('about.value2Title'),
      description: t('about.value2Desc'),
    },
    {
      icon: <SupportIcon sx={{ fontSize: 48 }} />,
      title: t('about.value3Title'),
      description: t('about.value3Desc'),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, pt: '64px', bgcolor: 'background.default' }}>
        {/* Hero Section */}
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            py: { xs: 6, md: 10 },
            textAlign: 'center',
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              component="h1"
              fontWeight={700}
              gutterBottom
              sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
            >
              {t('about.title')}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: '800px', mx: 'auto' }}>
              {t('about.subtitle')}
            </Typography>
          </Container>
        </Box>

        {/* Mission Section */}
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Container maxWidth="lg">
            <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
              {t('about.missionTitle')}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              sx={{ maxWidth: '800px', mx: 'auto', mb: 6 }}
            >
              {t('about.missionContent')}
            </Typography>

            <Grid container spacing={4}>
              {values.map((value, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>{value.icon}</Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Testimonials Section */}
        <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
              {t('testimonials.title')}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 6 }}
            >
              {t('testimonials.subtitle')}
            </Typography>
            <Testimonials />
          </Container>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
