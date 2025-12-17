'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogContent,
  DialogActions,
  Chip,
  Fade,
  Zoom,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export interface TutorialStep {
  id: string;
  target?: string; // CSS selector del elemento a resaltar
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void; // Acción opcional a ejecutar antes de mostrar el paso
}

interface TutorialTourProps {
  steps: TutorialStep[];
  open: boolean;
  onClose: () => void;
  onComplete?: () => void;
  showProgress?: boolean;
}

export default function TutorialTour({
  steps,
  open,
  onClose,
  onComplete,
  showProgress = true,
}: TutorialTourProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    if (!open || !currentStepData?.target) return;

    const element = document.querySelector(currentStepData.target) as HTMLElement;
    if (element) {
      setHighlightedElement(element);
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Agregar clase para resaltar
      element.style.transition = 'all 0.3s ease';
      element.style.zIndex = '9999';
      element.style.position = 'relative';
      
      return () => {
        element.style.zIndex = '';
        element.style.position = '';
      };
    } else {
      setHighlightedElement(null);
    }
  }, [open, currentStep, currentStepData]);

  const handleNext = () => {
    if (currentStepData?.action) {
      currentStepData.action();
    }
    
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setHighlightedElement(null);
    if (onComplete) {
      onComplete();
    }
    onClose();
  };

  if (!open || !currentStepData) return null;

  const getTooltipPosition = () => {
    if (!highlightedElement) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    
    const rect = highlightedElement.getBoundingClientRect();
    const position = currentStepData.position || 'bottom';
    
    switch (position) {
      case 'top':
        return {
          top: `${rect.top - 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, -100%)',
        };
      case 'bottom':
        return {
          top: `${rect.bottom + 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.left - 20}px`,
          transform: 'translate(-100%, -50%)',
        };
      case 'right':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + 20}px`,
          transform: 'translateY(-50%)',
        };
      default:
        return {
          top: `${rect.bottom + 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)',
        };
    }
  };

  return (
    <>
      {/* Overlay oscuro */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={overlayRef}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9998,
              pointerEvents: 'auto',
            }}
            onClick={handleSkip}
          />
        )}
      </AnimatePresence>

      {/* Tooltip del paso actual */}
      <AnimatePresence>
        {open && currentStepData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'fixed',
              ...getTooltipPosition(),
              zIndex: 10000,
              maxWidth: 400,
              minWidth: 300,
            }}
          >
            <Paper
              elevation={24}
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative',
              }}
            >
              {/* Indicador de paso */}
              {showProgress && (
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={`${currentStep + 1} / ${steps.length}`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              )}

              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: 'white' }}>
                {currentStepData.title}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6 }}>
                {currentStepData.content}
              </Typography>

              {/* Controles de navegación */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  {!isFirstStep && (
                    <Button
                      startIcon={<NavigateBeforeIcon />}
                      onClick={handlePrevious}
                      sx={{ color: 'white', textTransform: 'none' }}
                    >
                      {t('tutorial.previous') || 'Previous'}
                    </Button>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    onClick={handleSkip}
                    sx={{ color: 'rgba(255, 255, 255, 0.8)', textTransform: 'none' }}
                  >
                    {t('tutorial.skip') || 'Skip'}
                  </Button>
                  <Button
                    variant="contained"
                    endIcon={isLastStep ? undefined : <NavigateNextIcon />}
                    onClick={handleNext}
                    sx={{
                      bgcolor: 'white',
                      color: '#667eea',
                      textTransform: 'none',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                    }}
                  >
                    {isLastStep ? (t('tutorial.finish') || 'Finish') : (t('tutorial.next') || 'Next')}
                  </Button>
                </Box>
              </Box>

              {/* Flecha indicadora */}
              {highlightedElement && currentStepData.position && (
                <Box
                  sx={{
                    position: 'absolute',
                    ...(currentStepData.position === 'bottom' && {
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      borderLeft: '10px solid transparent',
                      borderRight: '10px solid transparent',
                      borderBottom: '10px solid #667eea',
                    }),
                    ...(currentStepData.position === 'top' && {
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      borderLeft: '10px solid transparent',
                      borderRight: '10px solid transparent',
                      borderTop: '10px solid #667eea',
                    }),
                    ...(currentStepData.position === 'left' && {
                      left: '100%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      borderTop: '10px solid transparent',
                      borderBottom: '10px solid transparent',
                      borderLeft: '10px solid #667eea',
                    }),
                    ...(currentStepData.position === 'right' && {
                      right: '100%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      borderTop: '10px solid transparent',
                      borderBottom: '10px solid transparent',
                      borderRight: '10px solid #667eea',
                    }),
                  }}
                />
              )}
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
