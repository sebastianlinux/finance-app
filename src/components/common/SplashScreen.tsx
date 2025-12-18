'use client';

import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useState, useEffect } from 'react';

// Generate random values once
const generateParticles = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    width: Math.random() * 4 + 2,
    height: Math.random() * 4 + 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    xOffset: Math.random() * 20 - 10,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));
};

export default function SplashScreen() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Generate particles only on client side to avoid hydration mismatch
  const [particles, setParticles] = useState<ReturnType<typeof generateParticles> | null>(null);

  useEffect(() => {
    // Only generate particles on client side
    setParticles(generateParticles());
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: isDark
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Animated background particles */}
      {particles && (
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            opacity: 0.3,
          }}
        >
          {particles.map((particle) => {
            return (
          <motion.div
            key={particle.id}
            style={{
              position: 'absolute',
              width: particle.width,
              height: particle.height,
              borderRadius: '50%',
              background: isDark ? 'rgba(124, 58, 237, 0.5)' : 'rgba(99, 102, 241, 0.3)',
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, particle.xOffset, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
          />
            );
          })}
        </Box>
      )}

      {/* Main content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {/* Logo/Icon with animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            duration: 0.8,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: 120,
              height: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Outer glow ring */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: {
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                },
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: `3px solid transparent`,
                borderTopColor: theme.palette.primary.main,
                borderRightColor: theme.palette.primary.main,
              }}
            />
            
            {/* Middle ring */}
            <motion.div
              animate={{
                rotate: -360,
                scale: [1, 0.9, 1],
              }}
              transition={{
                rotate: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                },
                scale: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
              style={{
                position: 'absolute',
                width: '80%',
                height: '80%',
                borderRadius: '50%',
                border: `2px solid transparent`,
                borderBottomColor: theme.palette.secondary?.main || theme.palette.warning.main,
                borderLeftColor: theme.palette.secondary?.main || theme.palette.warning.main,
              }}
            />

            {/* Icon container */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                position: 'relative',
                zIndex: 2,
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: isDark
                  ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${theme.palette.primary.main}20`,
                boxShadow: `0 8px 32px ${theme.palette.primary.main}30`,
              }}
            >
              <AccountBalanceWalletIcon
                sx={{
                  fontSize: 40,
                  color: theme.palette.primary.main,
                  filter: `drop-shadow(0 0 8px ${theme.palette.primary.main})`,
                }}
              />
            </motion.div>
          </Box>
        </motion.div>

        {/* App name with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              background: isDark
                ? 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)'
                : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
              letterSpacing: '-0.02em',
            }}
          >
            Finance Tracker
          </Typography>
        </motion.div>

        {/* Loading indicator */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress
            size={40}
            thickness={4}
            sx={{
              color: theme.palette.primary.main,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          
          {/* Animated dots */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: 'easeInOut',
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.main,
                    boxShadow: `0 0 12px ${theme.palette.primary.main}60`,
                  }}
                />
              </motion.div>
            ))}
          </Box>

          {/* Loading text */}
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
              }}
            >
              Loading...
            </Typography>
          </motion.div>
        </Box>
      </Box>

      {/* Bottom gradient fade */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: isDark
            ? 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 100%)'
            : 'linear-gradient(to top, rgba(248, 250, 252, 0.8) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}
