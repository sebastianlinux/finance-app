'use client';

import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Blog articles data
const blogArticles = [
  {
    id: '1',
    title: '10 Tips for Better Budget Management',
    excerpt: 'Learn how to create and stick to a budget that works for your lifestyle.',
    image: '💰',
    category: 'Budgeting',
    readTime: '5 min read',
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'Understanding Your Financial Health',
    excerpt: 'A comprehensive guide to assessing and improving your financial situation.',
    image: '📊',
    category: 'Finance',
    readTime: '8 min read',
    date: '2024-01-10',
  },
  {
    id: '3',
    title: 'Investment Strategies for Beginners',
    excerpt: 'Start your investment journey with these proven strategies for new investors.',
    image: '📈',
    category: 'Investing',
    readTime: '10 min read',
    date: '2024-01-05',
  },
  {
    id: '4',
    title: 'Saving Money on Daily Expenses',
    excerpt: 'Simple tricks to reduce your daily spending without sacrificing quality of life.',
    image: '💵',
    category: 'Saving',
    readTime: '6 min read',
    date: '2024-01-01',
  },
  {
    id: '5',
    title: 'Debt Management Best Practices',
    excerpt: 'How to effectively manage and pay off debt while maintaining financial stability.',
    image: '💳',
    category: 'Debt',
    readTime: '7 min read',
    date: '2023-12-28',
  },
  {
    id: '6',
    title: 'Building an Emergency Fund',
    excerpt: 'Why an emergency fund is essential and how to build one step by step.',
    image: '🏦',
    category: 'Saving',
    readTime: '5 min read',
    date: '2023-12-25',
  },
];

function BlogPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const canAccessBlog = user?.plan === 'standard' || user?.plan === 'premium';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, pt: '64px', py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            {t('blog.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
            {t('blog.subtitle')}
          </Typography>

          {!canAccessBlog && (
            <Card sx={{ mb: 4, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('blog.upgradeRequired')}
                </Typography>
                <Typography variant="body2">
                  {t('blog.upgradeMessage')}
                </Typography>
              </CardContent>
            </Card>
          )}

          <Grid container spacing={4}>
            {blogArticles.map((article) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={article.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => router.push(`/blog/${article.id}`)}
                >
                  <Box
                    sx={{
                      height: 200,
                      bgcolor: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 64,
                    }}
                  >
                    {article.image}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip label={article.category} size="small" color="primary" />
                      <Typography variant="caption" color="text.secondary">
                        {article.readTime}
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {article.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {article.excerpt}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(article.date).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}

export default function ProtectedBlog() {
  return (
    <ProtectedRoute>
      <BlogPage />
    </ProtectedRoute>
  );
}
