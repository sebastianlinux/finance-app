'use client';

import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import PageTransition from '@/components/common/PageTransition';
import GavelIcon from '@mui/icons-material/Gavel';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CancelIcon from '@mui/icons-material/Cancel';

const sections = [
  { icon: <DescriptionIcon />, number: '1' },
  { icon: <SecurityIcon />, number: '2' },
  { icon: <AccountBalanceIcon />, number: '3' },
  { icon: <CancelIcon />, number: '4' },
  { icon: <GavelIcon />, number: '5' },
];

export default function TermsOfServicePage() {
  const { t } = useTranslation();
  const theme = useTheme();

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
                ? 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)'
                : 'linear-gradient(135deg, #0d47a1 0%, #4a148c 100%)',
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
                <GavelIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
                <Typography 
                  variant="h2" 
                  fontWeight={700} 
                  gutterBottom
                  sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
                >
                  {t('terms.title')}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: '600px', mx: 'auto' }}>
                  {t('terms.subtitle') || 'Please read these terms carefully before using our service'}
                </Typography>
                <Chip
                  label={`${t('terms.lastUpdated')}: ${new Date().toLocaleDateString()}`}
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
                    transition={{ duration: 0.5, delay: index * 0.1 }}
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
                          borderColor: 'primary.main',
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
                            bgcolor: 'primary.main',
                            color: 'white',
                            fontSize: 24,
                            fontWeight: 700,
                          }}
                        >
                          {sections[index].number}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h5" fontWeight={700} gutterBottom>
                            {t(`terms.section${sectionNum}Title`)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            color: 'primary.main',
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
                        {t(`terms.section${sectionNum}Content`)}
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
                  {t('terms.footerNote') || 'By using our service, you agree to these terms and conditions.'}
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
