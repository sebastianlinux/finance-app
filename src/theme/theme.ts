'use client';

import { createTheme } from '@mui/material/styles';

// Typography configuration
const typographyConfig = {
  fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  h1: {
    fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: 700,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: 600,
  },
  h4: {
    fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: 600,
  },
  h5: {
    fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: 600,
  },
  h6: {
    fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: 600,
  },
  body1: {
    fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  body2: {
    fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  button: {
    fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: 500,
    textTransform: 'none' as const,
  },
  // Custom variants for numbers and financial data
  caption: {
    fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
  typography: typographyConfig,
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.mono': {
            fontFamily: 'var(--font-jetbrains-mono), "Courier New", monospace',
            fontVariantNumeric: 'tabular-nums',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          '&.mono': {
            fontFamily: 'var(--font-jetbrains-mono), "Courier New", monospace',
            fontVariantNumeric: 'tabular-nums',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          '&.mono': {
            fontFamily: 'var(--font-jetbrains-mono), "Courier New", monospace',
            fontVariantNumeric: 'tabular-nums',
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7c3aed', // Púrpura moderno y elegante (violet-600)
      light: '#a78bfa', // violet-400
      dark: '#6d28d9', // violet-700
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f59e0b', // Ámbar cálido para acentos (amber-500)
      light: '#fbbf24', // amber-400
      dark: '#d97706', // amber-600
      contrastText: '#000000',
    },
    success: {
      main: '#10b981', // Verde esmeralda moderno
      light: '#34d399',
      dark: '#059669',
    },
    error: {
      main: '#ef4444', // Rojo moderno
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#3b82f6', // Azul suave solo para info
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: '#0f172a', // Fondo oscuro profundo (slate-900)
      paper: '#1e293b', // Cards con tono slate-800
    },
    text: {
      primary: '#f1f5f9', // Texto principal muy claro (slate-100)
      secondary: '#94a3b8', // Texto secundario (slate-400)
    },
    divider: 'rgba(148, 163, 184, 0.2)', // Divisores más visibles pero sutiles
  },
  typography: typographyConfig,
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.mono': {
            fontFamily: 'var(--font-jetbrains-mono), "Courier New", monospace',
            fontVariantNumeric: 'tabular-nums',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          '&.mono': {
            fontFamily: 'var(--font-jetbrains-mono), "Courier New", monospace',
            fontVariantNumeric: 'tabular-nums',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          '&.mono': {
            fontFamily: 'var(--font-jetbrains-mono), "Courier New", monospace',
            fontVariantNumeric: 'tabular-nums',
          },
        },
      },
    },
  },
});

export default lightTheme;
