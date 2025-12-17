'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Grid,
  Chip,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppLayout from '@/components/Layout/AppLayout';
import EmptyState from '@/components/common/EmptyState';

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  responses?: Array<{ message: string; from: 'user' | 'support'; createdAt: string }>;
}

function SupportPage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium' as SupportTicket['priority'],
  });

  const [errors, setErrors] = useState<{ subject?: string; message?: string }>({});

  const handleSubmit = () => {
    const newErrors: { subject?: string; message?: string } = {};

    if (!formData.subject.trim()) {
      newErrors.subject = t('support.subjectRequired') || 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = t('support.messageRequired') || 'Message is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Only premium users can create tickets
    if (user?.plan !== 'premium') {
      setSnackbarMessage(t('support.premiumRequired') || 'Premium plan required for priority support');
      setSnackbarOpen(true);
      return;
    }

    const newTicket: SupportTicket = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      subject: formData.subject,
      message: formData.message,
      status: 'open',
      priority: formData.priority,
      createdAt: new Date().toISOString(),
      responses: [],
    };

    setTickets([newTicket, ...tickets]);
    setFormData({ subject: '', message: '', priority: 'medium' });
    setErrors({});
    setOpenDialog(false);
    setSnackbarMessage(t('support.ticketCreated') || 'Support ticket created successfully');
    setSnackbarOpen(true);
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'default';
    }
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return 'error';
      case 'in_progress':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'default';
    }
  };

  const isPremium = user?.plan === 'premium';

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          {t('support.title') || 'Priority Support'}
        </Typography>
        {isPremium ? (
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => setOpenDialog(true)}
          >
            {t('support.newTicket') || 'New Ticket'}
          </Button>
        ) : (
          <Alert severity="info" sx={{ flex: 1, maxWidth: 500 }}>
            {t('support.upgradeMessage') || 'Upgrade to Premium for priority support'}
          </Alert>
        )}
      </Box>

      {!isPremium && (
        <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('support.premiumFeature') || 'Premium Feature'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {t('support.premiumDescription') || 'Priority support is available for Premium plan users. Get faster response times and dedicated support.'}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => window.location.href = '/profile'}
            >
              {t('profile.upgradeToPremium') || 'Upgrade to Premium'}
            </Button>
          </CardContent>
        </Card>
      )}

      {tickets.length === 0 ? (
        <EmptyState
          message={
            isPremium
              ? t('support.noTickets') || 'No support tickets yet. Create your first ticket!'
              : t('support.upgradeRequired') || 'Upgrade to Premium to access priority support'
          }
          icon={<SupportAgentIcon sx={{ fontSize: 64 }} />}
        />
      ) : (
        <Grid container spacing={3}>
          {tickets.map((ticket) => (
            <Grid size={{ xs: 12 }} key={ticket.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {ticket.subject}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip
                          label={t(`support.status.${ticket.status}`) || ticket.status}
                          color={getStatusColor(ticket.status) as any}
                          size="small"
                        />
                        <Chip
                          label={t(`support.priority.${ticket.priority}`) || ticket.priority}
                          color={getPriorityColor(ticket.priority) as any}
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
                    {ticket.message}
                  </Typography>

                  {ticket.responses && ticket.responses.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        {t('support.responses') || 'Responses'}
                      </Typography>
                      <List>
                        {ticket.responses.map((response, idx) => (
                          <ListItem key={idx} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                              <Chip
                                label={response.from === 'support' ? t('support.supportTeam') || 'Support Team' : t('support.you') || 'You'}
                                size="small"
                                color={response.from === 'support' ? 'primary' : 'default'}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(response.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                              {response.message}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* New Ticket Dialog */}
      {openDialog && (
        <Card
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 600,
            zIndex: 1300,
            maxHeight: '90vh',
            overflow: 'auto',
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                {t('support.newTicket') || 'New Support Ticket'}
              </Typography>
              <Button onClick={() => setOpenDialog(false)}>×</Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label={t('support.subject') || 'Subject'}
                value={formData.subject}
                onChange={(e) => {
                  setFormData({ ...formData, subject: e.target.value });
                  setErrors({ ...errors, subject: undefined });
                }}
                fullWidth
                error={!!errors.subject}
                helperText={errors.subject}
              />

              <TextField
                select
                label={t('support.priorityLabel') || 'Priority'}
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as SupportTicket['priority'] })}
                fullWidth
                SelectProps={{ native: true }}
              >
                <option value="low">{t('support.priority.low') || 'Low'}</option>
                <option value="medium">{t('support.priority.medium') || 'Medium'}</option>
                <option value="high">{t('support.priority.high') || 'High'}</option>
                <option value="urgent">{t('support.priority.urgent') || 'Urgent'}</option>
              </TextField>

              <TextField
                label={t('support.message') || 'Message'}
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  setErrors({ ...errors, message: undefined });
                }}
                fullWidth
                multiline
                rows={6}
                error={!!errors.message}
                helperText={errors.message}
              />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button onClick={() => setOpenDialog(false)}>
                  {t('common.cancel')}
                </Button>
                <Button variant="contained" onClick={handleSubmit} startIcon={<SendIcon />}>
                  {t('support.submit') || 'Submit Ticket'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default function ProtectedSupport() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SupportPage />
      </AppLayout>
    </ProtectedRoute>
  );
}
