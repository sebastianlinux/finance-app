'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DataObjectIcon from '@mui/icons-material/DataObject';
import SchoolIcon from '@mui/icons-material/School';
import { useTranslation } from 'react-i18next';
import { useTutorial } from '@/hooks/useTutorial';
import TutorialTour, { TutorialStep } from './TutorialTour';
import { getMainTutorialSteps } from '@/utils/tutorialSteps';

interface TutorialLauncherProps {
  open: boolean;
  onClose: () => void;
}

export default function TutorialLauncher({ open, onClose }: TutorialLauncherProps) {
  const { t } = useTranslation();
  const { startTutorial, enableDemoMode, markTutorialCompleted } = useTutorial();
  const [tourOpen, setTourOpen] = useState(false);

  const handleStartTour = () => {
    onClose();
    setTourOpen(true);
  };

  const handleStartDemo = () => {
    enableDemoMode();
    onClose();
    // Opcional: iniciar tour después de cargar demo
    setTimeout(() => {
      setTourOpen(true);
    }, 500);
  };

  const handleTourComplete = () => {
    setTourOpen(false);
    markTutorialCompleted();
  };

  const mainSteps: TutorialStep[] = getMainTutorialSteps((key: string) => t(key) || key);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight={700}>
            {t('tutorial.welcome') || 'Welcome to Finance Tracker!'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t('tutorial.welcomeDescription') || 'Get started with our interactive tutorial or explore the app with demo data.'}
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={handleStartTour}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {t('tutorial.interactiveTour') || 'Interactive Tour'}
                      </Typography>
                      <Chip label={t('tutorial.recommended') || 'Recommended'} size="small" color="primary" sx={{ mt: 0.5 }} />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('tutorial.tourDescription') || 'Take a guided tour through the main features of the app. Learn how to use each section step by step.'}
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PlayArrowIcon />}
                    sx={{ mt: 2, textTransform: 'none' }}
                    onClick={handleStartTour}
                  >
                    {t('tutorial.startTour') || 'Start Tour'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={handleStartDemo}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <DataObjectIcon sx={{ fontSize: 40, color: 'success.main' }} />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {t('tutorial.demoMode') || 'Demo Mode'}
                      </Typography>
                      <Chip label={t('tutorial.explore') || 'Explore'} size="small" color="success" sx={{ mt: 0.5 }} />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('tutorial.demoDescription') || 'Explore the app with sample data. See how everything works without affecting your real data.'}
                  </Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="success"
                    startIcon={<PlayArrowIcon />}
                    sx={{ mt: 2, textTransform: 'none' }}
                    onClick={handleStartDemo}
                  >
                    {t('tutorial.startDemo') || 'Start Demo'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ textTransform: 'none' }}>
            {t('tutorial.skip') || 'Skip for now'}
          </Button>
        </DialogActions>
      </Dialog>

      <TutorialTour
        steps={mainSteps}
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        onComplete={handleTourComplete}
      />
    </>
  );
}
