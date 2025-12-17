'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  Alert,
  Button,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next';
import { useFinanceStore } from '@/store/financeStore';
import { useRouter } from 'next/navigation';

export default function AlertsPanel() {
  const { t } = useTranslation();
  const router = useRouter();
  const alerts = useFinanceStore((state) => state.alerts);
  const markAlertAsRead = useFinanceStore((state) => state.markAlertAsRead);
  const deleteAlert = useFinanceStore((state) => state.deleteAlert);
  const checkBudgetAlerts = useFinanceStore((state) => state.checkBudgetAlerts);
  const checkBalanceAlerts = useFinanceStore((state) => state.checkBalanceAlerts);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check for alerts periodically
    checkBudgetAlerts();
    checkBalanceAlerts();
    const interval = setInterval(() => {
      checkBudgetAlerts();
      checkBalanceAlerts();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkBudgetAlerts, checkBalanceAlerts]);

  const unreadAlerts = alerts.filter((a) => !a.isRead);

  const handleAlertClick = (alertId: string, actionUrl?: string) => {
    markAlertAsRead(alertId);
    if (actionUrl) {
      router.push(actionUrl);
    }
    setOpen(false);
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={() => setOpen(!open)}
        sx={{ position: 'relative' }}
      >
        <Badge badgeContent={unreadAlerts.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {open && (
        <Card
          sx={{
            position: 'absolute',
            top: 56,
            right: 16,
            width: 400,
            maxHeight: 500,
            overflow: 'auto',
            zIndex: 1300,
            boxShadow: 6,
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                {t('alerts.title') || 'Alerts'}
              </Typography>
              <IconButton size="small" onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {alerts.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                {t('alerts.noAlerts') || 'No alerts'}
              </Typography>
            ) : (
              <List sx={{ p: 0 }}>
                {alerts.slice(0, 10).map((alert) => (
                  <ListItem
                    key={alert.id}
                    disablePadding
                    sx={{
                      bgcolor: alert.isRead ? 'transparent' : 'action.selected',
                      mb: 1,
                      borderRadius: 1,
                    }}
                  >
                    <ListItemButton
                      onClick={() => handleAlertClick(alert.id, alert.actionUrl)}
                      sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1.5 }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {alert.title}
                        </Typography>
                        {!alert.isRead && (
                          <Chip
                            label={t('alerts.new') || 'New'}
                            color="primary"
                            size="small"
                            sx={{ height: 20 }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {alert.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
