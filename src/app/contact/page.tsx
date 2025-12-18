'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  useTheme,
  IconButton,
  InputAdornment,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import PageTransition from '@/components/common/PageTransition';

const contactInfo = [
  {
    icon: <EmailIcon />,
    title: 'Email',
    value: 'support@financetracker.com',
    link: 'mailto:support@financetracker.com',
  },
  {
    icon: <PhoneIcon />,
    title: 'Phone',
    value: '+1 (555) 123-4567',
    link: 'tel:+15551234567',
  },
  {
    icon: <LocationOnIcon />,
    title: 'Address',
    value: '123 Finance Street, Suite 100\nNew York, NY 10001',
    link: null,
  },
  {
    icon: <AccessTimeIcon />,
    title: 'Business Hours',
    value: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM',
    link: null,
  },
];

export default function ContactPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    } = {};

    if (!formData.name.trim()) {
      newErrors.name = t('contact.required');
    }

    if (!formData.email) {
      newErrors.email = t('contact.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contact.emailInvalid');
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t('contact.required');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('contact.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

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
                ? 'linear-gradient(135deg, #9c27b0 0%, #1976d2 100%)'
                : 'linear-gradient(135deg, #4a148c 0%, #0d47a1 100%)',
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
                <EmailIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
                <Typography 
                  variant="h2" 
                  fontWeight={700} 
                  gutterBottom
                  sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
                >
                  {t('contact.title')}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: '600px', mx: 'auto' }}>
                  {t('contact.subtitle')}
                </Typography>
              </motion.div>
            </Container>
          </Box>

          {/* Content Section */}
          <Box sx={{ py: { xs: 6, md: 10 } }}>
            <Container maxWidth="lg">
              <Grid container spacing={4}>
                {/* Contact Form */}
                <Grid size={{ xs: 12, md: 8 }}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 4,
                        background: theme.palette.mode === 'light'
                          ? 'rgba(255, 255, 255, 0.8)'
                          : 'background.paper',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                        {success && (
                          <Alert 
                            severity="success" 
                            sx={{ mb: 3, borderRadius: 2 }}
                            onClose={() => setSuccess(false)}
                          >
                            {t('contact.success')}
                          </Alert>
                        )}

                        {error && (
                          <Alert 
                            severity="error" 
                            sx={{ mb: 3, borderRadius: 2 }}
                            onClose={() => setError('')}
                          >
                            {t('contact.error')}
                          </Alert>
                        )}

                        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 4 }}>
                          {t('contact.sendMessage') || 'Send us a Message'}
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit}>
                          <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label={t('contact.name')}
                                value={formData.name}
                                onChange={(e) => {
                                  setFormData({ ...formData, name: e.target.value });
                                  setErrors({ ...errors, name: undefined });
                                }}
                                error={!!errors.name}
                                helperText={errors.name}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                  },
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label={t('contact.email')}
                                type="email"
                                value={formData.email}
                                onChange={(e) => {
                                  setFormData({ ...formData, email: e.target.value });
                                  setErrors({ ...errors, email: undefined });
                                }}
                                error={!!errors.email}
                                helperText={errors.email}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <EmailIcon fontSize="small" color="action" />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                  },
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                fullWidth
                                label={t('contact.subject')}
                                value={formData.subject}
                                onChange={(e) => {
                                  setFormData({ ...formData, subject: e.target.value });
                                  setErrors({ ...errors, subject: undefined });
                                }}
                                error={!!errors.subject}
                                helperText={errors.subject}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                  },
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                fullWidth
                                label={t('contact.message')}
                                multiline
                                rows={6}
                                value={formData.message}
                                onChange={(e) => {
                                  setFormData({ ...formData, message: e.target.value });
                                  setErrors({ ...errors, message: undefined });
                                }}
                                error={!!errors.message}
                                helperText={errors.message}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                  },
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={<SendIcon />}
                                sx={{ 
                                  textTransform: 'none', 
                                  py: 1.5, 
                                  px: 4,
                                  borderRadius: 2,
                                  fontSize: '1rem',
                                  fontWeight: 600,
                                }}
                              >
                                {loading ? t('contact.sending') : t('contact.send')}
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>

                {/* Contact Information */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Box sx={{ position: 'sticky', top: 80 }}>
                      <Card
                        elevation={0}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 4,
                          background: theme.palette.mode === 'light'
                            ? 'rgba(255, 255, 255, 0.8)'
                            : 'background.paper',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                          <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                            {t('contact.getInTouch') || 'Get In Touch'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            {t('contact.description')}
                          </Typography>

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {contactInfo.map((info, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                              >
                                <Box
                                  component={info.link ? 'a' : 'div'}
                                  href={info.link || undefined}
                                  target={info.link ? '_blank' : undefined}
                                  rel={info.link ? 'noopener noreferrer' : undefined}
                                  sx={{
                                    display: 'flex',
                                    gap: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    cursor: info.link ? 'pointer' : 'default',
                                    '&:hover': {
                                      bgcolor: 'action.hover',
                                      transform: 'translateX(4px)',
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: 48,
                                      height: 48,
                                      borderRadius: 2,
                                      bgcolor: 'primary.main',
                                      color: 'white',
                                      flexShrink: 0,
                                    }}
                                  >
                                    {info.icon}
                                  </Box>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                      {info.title}
                                    </Typography>
                                    <Typography 
                                      variant="body2" 
                                      color="text.secondary"
                                      sx={{ whiteSpace: 'pre-line' }}
                                    >
                                      {info.value}
                                    </Typography>
                                  </Box>
                                </Box>
                              </motion.div>
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Box>
        <Footer />
      </Box>
    </PageTransition>
  );
}
