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
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';

export default function ContactPage() {
  const { t } = useTranslation();
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, pt: '64px', py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              {t('contact.title')}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {t('contact.subtitle')}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                      {t('contact.success')}
                    </Alert>
                  )}

                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {t('contact.error')}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
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
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={loading}
                          startIcon={<SendIcon />}
                          sx={{ textTransform: 'none', py: 1.5, px: 4 }}
                        >
                          {loading ? t('contact.sending') : t('contact.send')}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {t('contact.getInTouch')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {t('contact.description')}
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {t('contact.email')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      support@financetracker.com
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
