'use client';

import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {t('common.appName')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('footer.description')}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {t('footer.quickLinks')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component="button"
                variant="body2"
                color="text.secondary"
                onClick={() => router.push('/')}
                sx={{ textAlign: 'left', cursor: 'pointer' }}
              >
                {t('nav.features')}
              </Link>
              <Link
                component="button"
                variant="body2"
                color="text.secondary"
                onClick={() => router.push('/contact')}
                sx={{ textAlign: 'left', cursor: 'pointer' }}
              >
                {t('nav.contact')}
              </Link>
              <Link
                component="button"
                variant="body2"
                color="text.secondary"
                onClick={() => router.push('/login')}
                sx={{ textAlign: 'left', cursor: 'pointer' }}
              >
                {t('nav.login')}
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {t('footer.legal')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component="button"
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'left', cursor: 'pointer' }}
              >
                {t('footer.privacy')}
              </Link>
              <Link
                component="button"
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'left', cursor: 'pointer' }}
              >
                {t('footer.terms')}
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {t('footer.followUs')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <IconButton size="small" color="inherit">
                <FacebookIcon />
              </IconButton>
              <IconButton size="small" color="inherit">
                <TwitterIcon />
              </IconButton>
              <IconButton size="small" color="inherit">
                <LinkedInIcon />
              </IconButton>
              <IconButton size="small" color="inherit">
                <InstagramIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {t('footer.copyright')}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
