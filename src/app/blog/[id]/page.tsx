'use client';

import {
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Card, 
  CardContent, 
  Alert,
  Chip,
  Divider,
  IconButton,
  TextField,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PremiumModal from '@/components/PremiumModal';
import { useState, useEffect } from 'react';
import * as React from 'react';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import Avatar from '@mui/material/Avatar';
import { motion } from 'framer-motion';

// Blog articles content
const blogContent: Record<string, { title: string; content: string; category: string; date: string }> = {
  '1': {
    title: '10 Tips for Better Budget Management',
    category: 'Budgeting',
    date: '2024-01-15',
    content: `Creating and maintaining a budget is one of the most important steps you can take toward financial stability. Here are 10 proven tips to help you manage your budget effectively:

1. Track Every Expense: The first step to better budget management is knowing exactly where your money goes. Use our finance tracker to record every transaction, no matter how small.

2. Set Realistic Goals: Your budget should reflect your actual income and expenses. Don't set unrealistic savings goals that you can't maintain.

3. Use the 50/30/20 Rule: Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment.

4. Review Regularly: Check your budget weekly or monthly to ensure you're staying on track and make adjustments as needed.

5. Build an Emergency Fund: Aim to save 3-6 months of expenses in an emergency fund before focusing on other financial goals.

6. Automate Savings: Set up automatic transfers to your savings account so you save money before you have a chance to spend it.

7. Cut Unnecessary Expenses: Review your spending regularly and eliminate subscriptions or services you don't use.

8. Use Budget Categories: Organize your spending into categories to better understand your habits and identify areas for improvement.

9. Plan for Irregular Expenses: Set aside money each month for annual expenses like insurance, taxes, or holiday shopping.

10. Stay Flexible: Life changes, and so should your budget. Be willing to adjust your budget as your circumstances change.

Remember, budgeting is not about restriction—it's about making informed decisions that align with your financial goals. Start implementing these tips today and watch your financial health improve!`,
  },
  '2': {
    title: 'Understanding Your Financial Health',
    category: 'Finance',
    date: '2024-01-10',
    content: `Your financial health is a measure of your overall financial well-being. Just like physical health, it requires regular check-ups and maintenance. Here's how to assess and improve your financial situation:

Understanding Financial Health Indicators:

1. Net Worth: Calculate your net worth by subtracting your liabilities from your assets. A positive and growing net worth indicates good financial health.

2. Debt-to-Income Ratio: This ratio measures how much of your income goes toward debt payments. A ratio below 36% is generally considered healthy.

3. Emergency Fund: Having 3-6 months of expenses saved indicates strong financial preparedness.

4. Credit Score: A good credit score (above 700) shows responsible credit management and can save you money on loans and insurance.

5. Savings Rate: Aim to save at least 20% of your income for long-term financial security.

Improving Your Financial Health:

Start by tracking all your income and expenses using our finance tracker. This will give you a clear picture of your financial situation. Then, focus on:

- Reducing high-interest debt
- Building your emergency fund
- Increasing your savings rate
- Investing for the future
- Protecting your assets with insurance

Regular monitoring and adjustments will help you maintain and improve your financial health over time.`,
  },
  '3': {
    title: 'Investment Strategies for Beginners',
    category: 'Investing',
    date: '2024-01-05',
    content: `Starting your investment journey can be overwhelming, but with the right strategies, anyone can become a successful investor. Here's a beginner's guide to investing:

1. Start Early: The power of compound interest means that starting early can significantly impact your long-term wealth.

2. Diversify Your Portfolio: Don't put all your eggs in one basket. Spread your investments across different asset classes and industries.

3. Invest Regularly: Dollar-cost averaging—investing a fixed amount regularly—helps reduce the impact of market volatility.

4. Understand Your Risk Tolerance: Assess how much risk you're comfortable taking and invest accordingly.

5. Focus on Long-Term Goals: Avoid making investment decisions based on short-term market fluctuations.

6. Keep Costs Low: Choose low-cost index funds and ETFs to minimize fees and maximize returns.

7. Stay Educated: Continuously learn about investing, markets, and financial planning.

8. Avoid Emotional Decisions: Don't let fear or greed drive your investment choices. Stick to your strategy.

9. Consider Tax-Advantaged Accounts: Take advantage of retirement accounts and other tax-advantaged investment vehicles.

10. Review and Rebalance: Regularly review your portfolio and rebalance to maintain your target asset allocation.

Remember, investing is a long-term journey. Start small, stay consistent, and let time work in your favor.`,
  },
  '4': {
    title: 'Saving Money on Daily Expenses',
    category: 'Saving',
    date: '2024-01-01',
    content: `Small daily expenses can add up to significant amounts over time. Here are practical ways to reduce your daily spending without sacrificing your quality of life:

1. Meal Planning: Plan your meals for the week and create a shopping list. This reduces food waste and prevents impulse purchases.

2. Use Cashback Apps: Take advantage of cashback apps and credit card rewards to earn money on purchases you're already making.

3. Buy Generic Brands: Generic products often offer the same quality at a fraction of the cost of name brands.

4. Cancel Unused Subscriptions: Review your subscriptions monthly and cancel services you don't use regularly.

5. Cook at Home: Eating out is expensive. Cooking at home can save hundreds of dollars each month.

6. Use Public Transportation: If possible, use public transportation or carpool to save on gas and parking costs.

7. Shop with a List: Always shop with a list to avoid impulse purchases and stick to your budget.

8. Buy in Bulk: For items you use regularly, buying in bulk can save money in the long run.

9. Use Coupons and Discounts: Look for coupons, discount codes, and sales before making purchases.

10. Track Your Spending: Use our finance tracker to monitor your daily expenses and identify areas where you can cut back.

Small changes in your daily habits can lead to significant savings over time. Start implementing these strategies today!`,
  },
  '5': {
    title: 'Debt Management Best Practices',
    category: 'Debt',
    date: '2023-12-28',
    content: `Managing debt effectively is crucial for financial stability. Here are best practices for handling and paying off debt:

1. List All Your Debts: Create a comprehensive list of all your debts, including balances, interest rates, and minimum payments.

2. Prioritize High-Interest Debt: Focus on paying off debts with the highest interest rates first to minimize total interest paid.

3. Use the Debt Snowball Method: Pay off the smallest debt first, then use that payment amount to tackle the next smallest debt.

4. Consider Debt Consolidation: If you have multiple high-interest debts, consolidating them into a single lower-interest loan can save money.

5. Negotiate with Creditors: Contact your creditors to negotiate lower interest rates or payment plans.

6. Avoid New Debt: While paying off existing debt, avoid taking on new debt whenever possible.

7. Make More Than Minimum Payments: Paying more than the minimum payment will help you pay off debt faster and save on interest.

8. Use Windfalls Wisely: Use tax refunds, bonuses, or other unexpected income to pay down debt.

9. Track Your Progress: Monitor your debt reduction progress using our finance tracker to stay motivated.

10. Seek Professional Help: If you're overwhelmed by debt, consider consulting with a credit counselor or financial advisor.

Remember, getting out of debt is a marathon, not a sprint. Stay consistent and celebrate small victories along the way.`,
  },
  '6': {
    title: 'Building an Emergency Fund',
    category: 'Saving',
    date: '2023-12-25',
    content: `An emergency fund is a financial safety net designed to cover unexpected expenses. Here's how to build one:

Why You Need an Emergency Fund:

Life is full of surprises—car repairs, medical emergencies, job loss, or unexpected home repairs. An emergency fund provides financial security during these challenging times.

How Much to Save:

Financial experts recommend saving 3-6 months of essential expenses. Start with a smaller goal, like $1,000, and gradually build up to your target amount.

Where to Keep Your Emergency Fund:

Keep your emergency fund in a high-yield savings account that's easily accessible but separate from your regular checking account. This prevents you from dipping into it for non-emergencies.

How to Build Your Emergency Fund:

1. Set a Monthly Savings Goal: Determine how much you can realistically save each month and set up automatic transfers.

2. Cut Unnecessary Expenses: Review your budget and identify areas where you can reduce spending to boost your savings.

3. Use Windfalls: Direct tax refunds, bonuses, or gifts toward your emergency fund.

4. Save Your Raises: When you get a raise, save the additional income rather than increasing your spending.

5. Track Your Progress: Use our finance tracker to monitor your emergency fund growth and stay motivated.

What Counts as an Emergency:

- Medical emergencies
- Job loss
- Major car or home repairs
- Unexpected travel for family emergencies

What Doesn't Count:

- Planned expenses (vacations, holidays)
- Non-essential purchases
- Investment opportunities

Building an emergency fund takes time and discipline, but it's one of the most important steps you can take toward financial security. Start today, even if it's just a small amount each month.`,
  },
};

function BlogDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  // Handle both sync and async params (Next.js 13+)
  React.useEffect(() => {
    if (params instanceof Promise) {
      params.then((resolved) => setResolvedParams(resolved));
    } else {
      setResolvedParams(params);
    }
  }, [params]);

  const articleId = resolvedParams?.id;
  const article = articleId ? blogContent[articleId] : null;
  const canAccessFullContent = user?.plan === 'standard' || user?.plan === 'premium';

  if (!resolvedParams) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, pt: '64px', py: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Container maxWidth="md">
            <Typography variant="h6" color="text.secondary">
              {t('common.loading')}
            </Typography>
          </Container>
        </Box>
        <Footer />
      </Box>
    );
  }

  if (!article) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, pt: '64px', py: 8, bgcolor: 'background.default' }}>
          <Container maxWidth="md">
            <Button
              onClick={() => router.push('/blog')}
              sx={{ mb: 4, textTransform: 'none' }}
            >
              ← {t('blog.backToBlog')}
            </Button>
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom color="error">
                {t('blog.articleNotFound') || 'Article Not Found'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {t('blog.articleNotFoundMessage') || 'The article you are looking for does not exist.'}
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push('/blog')}
                sx={{ textTransform: 'none' }}
              >
                {t('blog.backToBlog')}
              </Button>
            </Card>
          </Container>
        </Box>
        <Footer />
      </Box>
    );
  }

  const theme = useTheme();
  const contentPreview = article.content.substring(0, 500);
  const remainingContent = article.content.substring(500);

  // Mock comments data
  const [comments, setComments] = useState([
    {
      id: '1',
      author: 'Sarah Johnson',
      avatar: 'SJ',
      content: 'Great article! These tips really helped me organize my budget better. The 50/30/20 rule is a game changer.',
      likes: 12,
      liked: false,
      date: '2024-01-16T10:30:00',
      replies: [
        {
          id: '1-1',
          author: 'Mike Chen',
          avatar: 'MC',
          content: 'I totally agree! I\'ve been using it for 3 months now and it works perfectly.',
          likes: 5,
          liked: false,
          date: '2024-01-16T14:20:00',
        },
      ],
    },
    {
      id: '2',
      author: 'David Martinez',
      avatar: 'DM',
      content: 'Thanks for sharing. I especially liked the part about automating savings. Setting up automatic transfers made a huge difference for me.',
      likes: 8,
      liked: true,
      date: '2024-01-17T09:15:00',
      replies: [],
    },
    {
      id: '3',
      author: 'Emily Brown',
      avatar: 'EB',
      content: 'This is exactly what I needed! As someone new to budgeting, these tips are very clear and actionable. Looking forward to more articles like this.',
      likes: 15,
      liked: false,
      date: '2024-01-18T16:45:00',
      replies: [],
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (isReply && parentId && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId
                ? { ...reply, liked: !reply.liked, likes: reply.liked ? reply.likes - 1 : reply.likes + 1 }
                : reply
            ),
          };
        }
        if (comment.id === commentId) {
          return {
            ...comment,
            liked: !comment.liked,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      })
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      author: user?.name || 'Anonymous',
      avatar: (user?.name || 'A').charAt(0).toUpperCase(),
      content: newComment,
      likes: 0,
      liked: false,
      date: new Date().toISOString(),
      replies: [],
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: `${parentId}-${Date.now()}`,
                author: user?.name || 'Anonymous',
                avatar: (user?.name || 'A').charAt(0).toUpperCase(),
                content: replyText,
                likes: 0,
                liked: false,
                date: new Date().toISOString(),
              },
            ],
          };
        }
        return comment;
      })
    );

    setReplyText('');
    setReplyingTo(null);
  };

  // Format content with better structure
  const formatContent = (text: string) => {
    const lines = text.split('\n');
    const formatted: React.ReactNode[] = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (!trimmed) {
        formatted.push(<Box key={`spacer-${index}`} sx={{ mb: 2 }} />);
        return;
      }
      
      // Check if it's a numbered list item
      const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
      if (numberedMatch) {
        formatted.push(
          <Box key={`item-${index}`} sx={{ display: 'flex', mb: 1.5, alignItems: 'flex-start' }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: 'primary.main',
                mr: 2,
                minWidth: '24px',
              }}
            >
              {numberedMatch[1]}.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, flex: 1 }}>
              {numberedMatch[2]}
            </Typography>
          </Box>
        );
        return;
      }
      
      // Check if it's a section header (all caps or starts with specific patterns)
      if (trimmed.match(/^[A-Z][A-Z\s:]+$/) || trimmed.match(/^(Why|How|What|Where|When|Remember|Understanding|Improving|Building|Starting)/)) {
        formatted.push(
          <Typography
            key={`header-${index}`}
            variant="h5"
            sx={{
              fontWeight: 700,
              mt: 4,
              mb: 2,
              color: 'primary.main',
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          >
            {trimmed}
          </Typography>
        );
        return;
      }
      
      // Check if it's a bullet point
      if (trimmed.startsWith('- ')) {
        formatted.push(
          <Box key={`bullet-${index}`} sx={{ display: 'flex', mb: 1, alignItems: 'flex-start' }}>
            <Typography
              variant="body1"
              sx={{
                color: 'primary.main',
                mr: 2,
                mt: 0.5,
              }}
            >
              •
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, flex: 1 }}>
              {trimmed.substring(2)}
            </Typography>
          </Box>
        );
        return;
      }
      
      // Regular paragraph
      formatted.push(
        <Typography
          key={`para-${index}`}
          variant="body1"
          sx={{ lineHeight: 1.8, mb: 2 }}
        >
          {trimmed}
        </Typography>
      );
    });
    
    return formatted;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, pt: '64px', bgcolor: 'background.default' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(15, 23, 42, 1) 100%)'
              : 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(255, 255, 255, 1) 100%)',
            py: { xs: 6, md: 8 },
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Container maxWidth="md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push('/blog')}
                sx={{
                  mb: 4,
                  textTransform: 'none',
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                {t('blog.backToBlog')}
              </Button>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  lineHeight: 1.2,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)'
                    : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {article.title}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
                <Chip
                  icon={<CategoryIcon sx={{ fontSize: '18px !important' }} />}
                  label={article.category}
                  color="primary"
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    },
                  }}
                />
                <Chip
                  icon={<CalendarTodayIcon sx={{ fontSize: '18px !important' }} />}
                  label={new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            </motion.div>
          </Container>
        </Box>

        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
          {/* Alert for basic plan users */}
          {!canAccessFullContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Alert
                severity="warning"
                icon={<LockIcon />}
                sx={{
                  mb: 4,
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'warning.main',
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)',
                }}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => setPremiumModalOpen(true)}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    {t('profile.upgradePlan')}
                  </Button>
                }
              >
                <Typography variant="body2" fontWeight={600}>
                  {t('blog.basicPlanRestriction') || 'This article is available for Standard and Premium plans only'}
                </Typography>
              </Alert>
            </motion.div>
          )}

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Paper
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 3,
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                  : '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Box sx={{ mb: 3 }}>
                {formatContent(contentPreview)}
              </Box>

              {!canAccessFullContent ? (
                <Box>
                  <Box
                    sx={{
                      position: 'relative',
                      filter: 'blur(8px)',
                      pointerEvents: 'none',
                      userSelect: 'none',
                      opacity: 0.4,
                      mb: -4,
                    }}
                  >
                    {formatContent(remainingContent)}
                  </Box>
                  <Card
                    sx={{
                      mt: 4,
                      background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(15, 23, 42, 1) 100%)'
                        : 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(255, 255, 255, 1) 100%)',
                      color: 'text.primary',
                      textAlign: 'center',
                      p: { xs: 4, md: 6 },
                      boxShadow: 4,
                      border: 1,
                      borderColor: 'primary.main',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #7c3aed 0%, #f59e0b 100%)',
                      },
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3,
                          boxShadow: 3,
                        }}
                      >
                        <LockIcon sx={{ fontSize: 40, color: 'primary.contrastText' }} />
                      </Box>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        gutterBottom
                        sx={{
                          mb: 2,
                          background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)'
                            : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {t('blog.upgradeRequired')}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 4,
                          color: 'text.secondary',
                          maxWidth: '500px',
                          mx: 'auto',
                          lineHeight: 1.7,
                        }}
                      >
                        {t('blog.upgradeMessage')}
                      </Typography>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => setPremiumModalOpen(true)}
                        sx={{
                          textTransform: 'none',
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          borderRadius: 2,
                          boxShadow: 4,
                          background: 'linear-gradient(135deg, #7c3aed 0%, #f59e0b 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #6d28d9 0%, #d97706 100%)',
                            boxShadow: 6,
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {t('profile.upgradePlan')}
                      </Button>
                    </motion.div>
                  </Card>
                </Box>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {formatContent(remainingContent)}
                </Box>
              )}
            </Paper>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Paper
                sx={{
                  mt: 4,
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                    : '0 8px 32px rgba(0, 0, 0, 0.08)',
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <CommentIcon color="primary" />
                  <Typography variant="h5" fontWeight={700}>
                    {t('blog.comments') || 'Comments'} ({comments.length})
                  </Typography>
                </Box>

                {/* Add Comment */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {(user?.name || 'A').charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder={t('blog.writeComment') || 'Write a comment...'}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          startIcon={<SendIcon />}
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          sx={{ textTransform: 'none' }}
                        >
                          {t('blog.postComment') || 'Post Comment'}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Comments List */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {comments.map((comment) => (
                    <Box key={comment.id}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                          {comment.avatar}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {comment.author}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(comment.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ mb: 1.5, lineHeight: 1.7 }}>
                            {comment.content}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={() => handleLike(comment.id)}
                              color={comment.liked ? 'primary' : 'default'}
                              sx={{
                                '&:hover': { bgcolor: 'action.hover' },
                              }}
                            >
                              <ThumbUpIcon fontSize="small" />
                            </IconButton>
                            <Typography variant="caption" color="text.secondary">
                              {comment.likes} {t('blog.likes') || 'likes'}
                            </Typography>
                            <Button
                              size="small"
                              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                              sx={{ textTransform: 'none', minWidth: 'auto', px: 1 }}
                            >
                              {replyingTo === comment.id
                                ? t('blog.cancel') || 'Cancel'
                                : t('blog.reply') || 'Reply'}
                            </Button>
                          </Box>

                          {/* Reply Input */}
                          {replyingTo === comment.id && (
                            <Box sx={{ mt: 2, ml: 2, pl: 2, borderLeft: 2, borderColor: 'divider' }}>
                              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                                  {(user?.name || 'A').charAt(0).toUpperCase()}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    placeholder={t('blog.writeReply') || 'Write a reply...'}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    sx={{ mb: 1 }}
                                  />
                                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                    <Button
                                      size="small"
                                      onClick={() => {
                                        setReplyingTo(null);
                                        setReplyText('');
                                      }}
                                      sx={{ textTransform: 'none' }}
                                    >
                                      {t('common.cancel')}
                                    </Button>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={() => handleAddReply(comment.id)}
                                      disabled={!replyText.trim()}
                                      sx={{ textTransform: 'none' }}
                                    >
                                      {t('blog.reply') || 'Reply'}
                                    </Button>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          )}

                          {/* Replies */}
                          {comment.replies.length > 0 && (
                            <Box sx={{ mt: 2, ml: 2, pl: 2, borderLeft: 2, borderColor: 'divider' }}>
                              {comment.replies.map((reply) => (
                                <Box key={reply.id} sx={{ mb: 2 }}>
                                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                                    <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                                      {reply.avatar}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <Typography variant="caption" fontWeight={600}>
                                          {reply.author}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                          {new Date(reply.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          })}
                                        </Typography>
                                      </Box>
                                      <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.6, fontSize: '0.875rem' }}>
                                        {reply.content}
                                      </Typography>
                                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <IconButton
                                          size="small"
                                          onClick={() => handleLike(reply.id, true, comment.id)}
                                          color={reply.liked ? 'primary' : 'default'}
                                          sx={{
                                            '&:hover': { bgcolor: 'action.hover' },
                                            padding: '4px',
                                          }}
                                        >
                                          <ThumbUpIcon sx={{ fontSize: '1rem' }} />
                                        </IconButton>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                          {reply.likes}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
      <Footer />
      <PremiumModal open={premiumModalOpen} onClose={() => setPremiumModalOpen(false)} />
    </Box>
  );
}

export default function ProtectedBlogDetail({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  return (
    <ProtectedRoute>
      <BlogDetailPage params={params} />
    </ProtectedRoute>
  );
}
