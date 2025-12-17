'use client';

import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Divider,
  Chip,
  useTheme,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import PageTransition from '@/components/common/PageTransition';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import SecurityIcon from '@mui/icons-material/Security';
import CookieIcon from '@mui/icons-material/Cookie';
import ShieldIcon from '@mui/icons-material/Shield';

const sections = [
  { icon: <DataUsageIcon />, number: '1', color: '#1976d2' },
  { icon: <SecurityIcon />, number: '2', color: '#9c27b0' },
  { icon: <CookieIcon />, number: '3', color: '#2e7d32' },
  { icon: <ShieldIcon />, number: '4', color: '#ed6c02' },
  { icon: <PrivacyTipIcon />, number: '5', color: '#d32f2f' },
];

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const theme = useTheme();

  const privacyHighlights = [
    { icon: <SecurityIcon />, title: t('privacy.highlight1') || 'Secure Data', desc: t('privacy.highlight1Desc') || 'Your data is encrypted and secure' },
    { icon: <ShieldIcon />, title: t('privacy.highlight2') || 'No Sharing', desc: t('privacy.highlight2Desc') || 'We never share your personal information' },
    { icon: <PrivacyTipIcon />, title: t('privacy.highlight3') || 'Your Control', desc: t('privacy.highlight3Desc') || 'You control your data at all times' },
  ];

  return (
    <PageTransition>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            pt: '64px',
            background: theme.palette.mode === 'light'
              ? 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%)'
              : 'background.default',
          }}
        >
          {/* Hero Section */}
          <Box
            sx={{
              background: theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, #2e7d32 0%, #1976d2 100%)'
                : 'linear-gradient(135deg, #1b5e20 0%, #0d47a1 100%)',
              color: 'white',
              py: { xs: 6, md: 10 },
              textAlign: 'center',
            }}
          >
            <Container maxWidth="lg">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <PrivacyTipIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
                <Typography 
                  variant="h2" 
                  fontWeight={700} 
                  gutterBottom
                  sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
                >
                  {t('privacy.title')}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: '600px', mx: 'auto' }}>
                  {t('privacy.subtitle') || 'Your privacy is important to us. Learn how we protect your data.'}
                </Typography>
                <Chip
                  label={`${t('privacy.lastUpdated')}: ${new Date().toLocaleDateString()}`}
                  sx={{ 
                    mt: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 500,
                  }}
                />
              </motion.div>
            </Container>
          </Box>

          {/* Privacy Highlights */}
          <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: 'background.paper' }}>
            <Container maxWidth="lg">
              <Grid container spacing={3}>
                {privacyHighlights.map((highlight, index) => (
                  <Grid size={{ xs: 12, md: 4 }} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          textAlign: 'center',
                          p: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            color: 'primary.main',
                            mb: 2,
                            '& svg': { fontSize: 40 },
                          }}
                        >
                          {highlight.icon}
                        </Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {highlight.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {highlight.desc}
                        </Typography>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>

          {/* Content Section */}
          <Box sx={{ py: { xs: 6, md: 10 } }}>
            <Container maxWidth="lg">
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 6 },
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  background: theme.palette.mode === 'light'
                    ? 'rgba(255, 255, 255, 0.8)'
                    : 'background.paper',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {[1, 2, 3, 4, 5].map((sectionNum, index) => (
                  <motion.div
                    key={sectionNum}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: (index + 3) * 0.1 }}
                  >
                    <Box sx={{ mb: index < 4 ? 6 : 0 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 3,
                          pb: 2,
                          borderBottom: '2px solid',
                          borderColor: sections[index].color,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            bgcolor: sections[index].color,
                            color: 'white',
                            fontSize: 24,
                            fontWeight: 700,
                          }}
                        >
                          {sections[index].number}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h5" fontWeight={700} gutterBottom>
                            {t(`privacy.section${sectionNum}Title`)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            color: sections[index].color,
                            '& svg': { fontSize: 32 },
                          }}
                        >
                          {sections[index].icon}
                        </Box>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.8,
                          color: 'text.primary',
                          fontSize: { xs: '0.95rem', md: '1rem' },
                        }}
                      >
                        {t(`privacy.section${sectionNum}Content`)}
                      </Typography>
                    </Box>
                    {index < 4 && (
                      <Divider 
                        sx={{ 
                          my: 4,
                          borderColor: 'divider',
                          opacity: 0.5,
                        }} 
                      />
                    )}
                  </motion.div>
                ))}
              </Paper>

              {/* Footer Note */}
              <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('privacy.footerNote') || 'Your privacy matters. We are committed to protecting your personal information.'}
                </Typography>
              </Box>
            </Container>
          </Box>
        </Box>
        <Footer />
      </Box>
    </PageTransition>
  );
}
