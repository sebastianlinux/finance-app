'use client';

import { Container, Typography, Box, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, pt: '64px', py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            {t('privacy.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {t('privacy.lastUpdated')}: {new Date().toLocaleDateString()}
          </Typography>

          <Paper sx={{ p: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {t('privacy.section1Title')}
              </Typography>
              <Typography variant="body1" paragraph>
                {t('privacy.section1Content')}
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {t('privacy.section2Title')}
              </Typography>
              <Typography variant="body1" paragraph>
                {t('privacy.section2Content')}
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {t('privacy.section3Title')}
              </Typography>
              <Typography variant="body1" paragraph>
                {t('privacy.section3Content')}
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {t('privacy.section4Title')}
              </Typography>
              <Typography variant="body1" paragraph>
                {t('privacy.section4Content')}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {t('privacy.section5Title')}
              </Typography>
              <Typography variant="body1" paragraph>
                {t('privacy.section5Content')}
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
