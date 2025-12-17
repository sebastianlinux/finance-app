'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { useFinanceStore } from '@/store/financeStore';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const language = useFinanceStore((state) => state.settings.language);
  const updateSettings = useFinanceStore((state) => state.updateSettings);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLanding = pathname === '/';
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/forgot-password');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang: string) => {
    updateSettings({ language: lang });
    i18n.changeLanguage(lang);
    handleMenuClose();
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    handleMenuClose();
  };

  const navItems = isAuthenticated
    ? [
        { label: t('nav.dashboard'), path: '/dashboard' },
        { label: t('nav.transactions'), path: '/transactions' },
        { label: t('nav.budgets'), path: '/budgets' },
        { label: t('nav.settings'), path: '/settings' },
      ]
    : [
        { label: t('nav.features'), path: '/#features' },
        { label: t('nav.pricing'), path: '/#pricing' },
        { label: t('nav.contact'), path: '/contact' },
      ];

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: { xs: '1.1rem', md: '1.25rem' },
            }}
            onClick={() => router.push('/')}
          >
            {t('common.appName')}
          </Typography>
        </Box>

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => {
                  if (item.path.startsWith('#')) {
                    const element = document.querySelector(item.path);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    router.push(item.path);
                  }
                }}
                sx={{
                  textTransform: 'none',
                  fontWeight: pathname === item.path ? 600 : 400,
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Language Selector */}
          <IconButton
            color="inherit"
            onClick={(e) => {
              const menu = document.createElement('div');
              menu.style.position = 'absolute';
              menu.style.top = '56px';
              menu.style.right = '16px';
              // Simple language toggle
              const newLang = language === 'en' ? 'es' : 'en';
              handleLanguageChange(newLang);
            }}
            sx={{ fontSize: '0.9rem' }}
          >
            {language.toUpperCase()}
          </IconButton>

          {isMobile && (
            <IconButton color="inherit" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <MenuIcon />
            </IconButton>
          )}

          {isAuthenticated ? (
            <>
              <IconButton onClick={handleMenuOpen} color="inherit">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={() => { router.push('/profile'); handleMenuClose(); }}>
                  <AccountCircleIcon sx={{ mr: 1 }} />
                  {t('nav.profile')}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>{t('nav.logout')}</MenuItem>
              </Menu>
            </>
          ) : (
            !isAuthPage && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button color="inherit" onClick={() => router.push('/login')}>
                  {t('nav.login')}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => router.push('/register')}
                  sx={{ textTransform: 'none' }}
                >
                  {t('nav.signup')}
                </Button>
              </Box>
            )
          )}
        </Box>
      </Toolbar>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <Box
          sx={{
            position: 'absolute',
            top: '64px',
            left: 0,
            right: 0,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            py: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {navItems.map((item) => (
            <Button
              key={item.path}
              fullWidth
              onClick={() => {
                if (item.path.startsWith('#')) {
                  const element = document.querySelector(item.path);
                  element?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  router.push(item.path);
                }
                setMobileMenuOpen(false);
              }}
              sx={{ justifyContent: 'flex-start', px: 3 }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      )}
    </AppBar>
  );
}
