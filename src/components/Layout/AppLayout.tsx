'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Switch,
  FormControlLabel,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import LanguageIcon from '@mui/icons-material/Language';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { useFinanceStore } from '@/store/financeStore';
import LanguageModal from '@/components/common/LanguageModal';
import AlertsPanel from '@/components/common/AlertsPanel';
import DemoModeBanner from '@/components/common/DemoModeBanner';
import TutorialLauncher from '@/components/common/TutorialLauncher';
import { useTutorial } from '@/hooks/useTutorial';

const drawerWidth = 240;

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [tutorialLauncherOpen, setTutorialLauncherOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const darkMode = useFinanceStore((state) => state.settings.darkMode);
  const updateSettings = useFinanceStore((state) => state.updateSettings);
  const { demoMode, disableDemoMode } = useTutorial();

  const mainMenuItems = [
    { text: t('common.dashboard'), icon: <DashboardIcon />, path: '/dashboard', tutorialId: 'dashboard-link' },
    { text: t('common.transactions'), icon: <ReceiptIcon />, path: '/transactions' },
    { text: t('common.budgets'), icon: <AccountBalanceWalletIcon />, path: '/budgets' },
    { text: t('nav.recurring') || 'Recurring', icon: <ReceiptIcon />, path: '/recurring' },
  ];

  const secondaryMenuItems = [
    { text: t('nav.blog'), icon: <ArticleIcon />, path: '/blog' },
    { text: t('nav.reports') || 'Reports', icon: <ArticleIcon />, path: '/reports' },
    { text: t('nav.goals') || 'Goals', icon: <ArticleIcon />, path: '/goals' },
    { text: t('nav.customCategories') || 'Categories', icon: <ArticleIcon />, path: '/categories' },
    { text: t('nav.support') || 'Support', icon: <ArticleIcon />, path: '/support' },
    { text: t('nav.profile'), icon: <PersonIcon />, path: '/profile' },
    { text: t('common.settings'), icon: <SettingsIcon />, path: '/settings' },
    { text: t('nav.home') || 'Home', icon: <HomeIcon />, path: '/' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDarkModeToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ darkMode: event.target.checked });
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    handleMenuClose();
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" fontWeight={700}>
          {t('common.appName')}
        </Typography>
      </Toolbar>
      <Divider />
        <List>
          {mainMenuItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                data-tutorial={item.tutorialId}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      <Divider sx={{ my: 1 }} />
      <List>
        {secondaryMenuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {[...mainMenuItems, ...secondaryMenuItems].find((item) => item.path === pathname)?.text || t('common.appName')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Dark Mode Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={handleDarkModeToggle}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'secondary.main',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'secondary.main',
                    },
                  }}
                />
              }
              label=""
              sx={{ m: 0, mr: 1 }}
            />

            {/* Tutorial/Help */}
            <IconButton
              color="inherit"
              onClick={() => setTutorialLauncherOpen(true)}
              sx={{ fontSize: '0.9rem' }}
              title={t('tutorial.help') || 'Help & Tutorial'}
            >
              <HelpOutlineIcon />
            </IconButton>

            {/* Language Selector */}
            <IconButton
              color="inherit"
              onClick={() => setLanguageModalOpen(true)}
              sx={{ fontSize: '0.9rem' }}
              title={t('settings.language')}
            >
              <LanguageIcon />
            </IconButton>

            {/* Alerts Panel */}
            <AlertsPanel />

            {/* Profile Menu */}
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
          </Box>
        </Toolbar>

        {/* Language Modal */}
        <LanguageModal open={languageModalOpen} onClose={() => setLanguageModalOpen(false)} />
      </AppBar>
      
      {/* Demo Mode Banner */}
      {demoMode && <DemoModeBanner onDisable={disableDemoMode} />}
      
      {/* Tutorial Launcher */}
      <TutorialLauncher
        open={tutorialLauncherOpen}
        onClose={() => setTutorialLauncherOpen(false)}
      />
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          data-tutorial="sidebar"
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
          data-tutorial="sidebar"
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
