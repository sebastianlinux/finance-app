'use client';

import { Container, Typography, Box, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';

export default function TermsOfServicePage() {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, pt: '64px', py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            {t('terms.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {t('terms.lastUpdated')}: {new Date().toLocaleDateString()}
          </Typography>

          <Paper sx={{ p: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {t('terms.section1Title')}
              </Typography>
              <Typography variant="body1" paragraph>
                {t('terms.section1Content')}
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {t('terms.section2Title')}
              </Typography>
              <Typography variant="body1" paragraph>
                {t('terms.section2Content')}
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {t('terms.section3Title')}
              </Typography>
              <Typography variant="body1" paragraph>
                {t('terms.section3Content')}
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {t('terms.section4Title')}
              </Typography>
              <Typography variant="body1" paragraph>
                {t('terms.section4Content')}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {t('terms.section5Title')}
              </Typography>
              <Typography variant="body1" paragraph>
                {t('terms.section5Content')}
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
