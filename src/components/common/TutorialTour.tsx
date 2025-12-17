'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Reset to step 0 when tour opens
  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      setHighlightedElement(null);
    } else {
      // Clean up when closing
      setCurrentStep(0);
      setHighlightedElement(null);
    }
  }, [open]);

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    if (!open || !currentStepData?.target) {
      setHighlightedElement(null);
      return;
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const element = document.querySelector(currentStepData.target!) as HTMLElement;
      if (element) {
        setHighlightedElement(element);
        
        // Scroll into view with better mobile support
        const mobileCheck = window.innerWidth < 768;
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: mobileCheck ? 'center' : 'center',
          inline: 'center',
        });
        
        // Agregar clase para resaltar
        element.style.transition = 'all 0.3s ease';
        element.style.zIndex = '9999';
        const originalPosition = element.style.position;
        const originalZIndex = element.style.zIndex;
        
        if (getComputedStyle(element).position === 'static') {
          element.style.position = 'relative';
        }
        
        return () => {
          element.style.zIndex = originalZIndex;
          element.style.position = originalPosition;
        };
      } else {
        setHighlightedElement(null);
      }
    }, 100);

    return () => clearTimeout(timer);
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
    if (!highlightedElement) {
      // Centered for steps without target
      return { 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        maxWidth: '90vw',
        width: 'auto',
      };
    }
    
    const rect = highlightedElement.getBoundingClientRect();
    const position = currentStepData.position || 'bottom';
    
    // On mobile, always show below or above, never on sides
    if (isMobile || window.innerWidth < 768) {
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      if (spaceBelow > 200 || spaceBelow > spaceAbove) {
        // Show below
        return {
          top: `${rect.bottom + 20}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: '90vw',
          width: 'calc(100vw - 40px)',
        };
      } else {
        // Show above
        return {
          top: `${rect.top - 20}px`,
          left: '50%',
          transform: 'translate(-50%, -100%)',
          maxWidth: '90vw',
          width: 'calc(100vw - 40px)',
        };
      }
    }
    
    // Desktop positioning
    switch (position) {
      case 'top':
        return {
          top: `${Math.max(20, rect.top - 20)}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, -100%)',
          maxWidth: '400px',
        };
      case 'bottom':
        return {
          top: `${Math.min(window.innerHeight - 300, rect.bottom + 20)}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)',
          maxWidth: '400px',
        };
      case 'left':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${Math.max(20, rect.left - 20)}px`,
          transform: 'translate(-100%, -50%)',
          maxWidth: '350px',
        };
      case 'right':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${Math.min(window.innerWidth - 350, rect.right + 20)}px`,
          transform: 'translateY(-50%)',
          maxWidth: '350px',
        };
      default:
        return {
          top: `${Math.min(window.innerHeight - 300, rect.bottom + 20)}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)',
          maxWidth: '400px',
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
            }}
          >
            <Paper
              elevation={24}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative',
                maxWidth: '100%',
                mx: { xs: 2, sm: 0 },
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

              <Typography 
                variant="h6" 
                fontWeight={700} 
                gutterBottom 
                sx={{ color: 'white', fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                {currentStepData.title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: { xs: 2, sm: 3 }, 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  lineHeight: 1.6,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                {currentStepData.content}
              </Typography>

              {/* Controles de navegación */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 },
              }}>
                <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                  {!isFirstStep && (
                    <Button
                      fullWidth={isMobile}
                      startIcon={<NavigateBeforeIcon />}
                      onClick={handlePrevious}
                      sx={{ color: 'white', textTransform: 'none' }}
                    >
                      {t('tutorial.previous') || 'Previous'}
                    </Button>
                  )}
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1,
                  width: { xs: '100%', sm: 'auto' },
                  flexDirection: { xs: 'column-reverse', sm: 'row' },
                }}>
                  <Button
                    fullWidth={isMobile}
                    onClick={handleSkip}
                    sx={{ color: 'rgba(255, 255, 255, 0.8)', textTransform: 'none' }}
                  >
                    {t('tutorial.skip') || 'Skip'}
                  </Button>
                  <Button
                    fullWidth={isMobile}
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
