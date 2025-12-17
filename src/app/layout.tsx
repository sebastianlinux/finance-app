'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import { useEffect, useState } from 'react';
import { lightTheme, darkTheme } from '@/theme/theme';
import i18n from '@/i18n/config';
import { useFinanceStore } from '@/store/financeStore';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const darkMode = useFinanceStore((state) => state.settings.darkMode);
  const language = useFinanceStore((state) => state.settings.language);

  useEffect(() => {
    setMounted(true);
    // Sync i18n language with store
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  // Show a simple loading state during hydration
  if (!mounted) {
    return (
      <html lang="en">
        <body>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            Loading...
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang={language || 'en'}>
      <body>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </I18nextProvider>
      </body>
    </html>
  );
}
