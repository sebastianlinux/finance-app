import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { lightTheme } from '@/theme/theme';
import i18n from '@/i18n/config';

// Initialize i18n for tests
if (!i18n.isInitialized) {
  i18n.init();
}

export function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </ThemeProvider>
  );
}

export function renderWithProviders(ui: React.ReactElement) {
  return render(ui, { wrapper: TestWrapper });
}

// Re-export testing utilities
export * from '@testing-library/react';
export { userEvent };
