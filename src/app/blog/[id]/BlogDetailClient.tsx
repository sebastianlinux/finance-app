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
import { blogContent } from './blogContent';

interface BlogDetailClientProps {
  articleId: string;
}

export default function BlogDetailClient({ articleId }: BlogDetailClientProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const theme = useTheme();
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);

  // Mock comments data - MUST be before early returns to follow Rules of Hooks
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

  const article = articleId ? blogContent[articleId] : null;
  const canAccessFullContent = user?.plan === 'standard' || user?.plan === 'premium';
  const contentPreview = article?.content.substring(0, 500) || '';
  const remainingContent = article?.content.substring(500) || '';

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
            }}
          >
            {trimmed}
          </Typography>
        );
        return;
      }
      
      // Regular paragraph
      formatted.push(
        <Typography key={`para-${index}`} variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
          {trimmed}
        </Typography>
      );
    });
    
    return formatted;
  };

  return (
    <ProtectedRoute>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, pt: '64px', bgcolor: 'background.default' }}>
          <Container maxWidth="md" sx={{ py: 6 }}>
            <Button
              onClick={() => router.push('/blog')}
              startIcon={<ArrowBackIcon />}
              sx={{ mb: 4, textTransform: 'none' }}
            >
              {t('blog.backToBlog')}
            </Button>

            <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, mb: 4, borderRadius: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Chip
                  label={article.category}
                  icon={<CategoryIcon />}
                  sx={{ mb: 2 }}
                  color="primary"
                />
                <Typography variant="h3" fontWeight={700} gutterBottom>
                  {article.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, color: 'text.secondary' }}>
                  <CalendarTodayIcon fontSize="small" />
                  <Typography variant="body2">
                    {new Date(article.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ typography: 'body1', lineHeight: 1.8 }}>
                {formatContent(contentPreview)}
                {!canAccessFullContent && remainingContent && (
                  <>
                    <Alert severity="info" sx={{ my: 3, borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LockIcon />
                        <Typography variant="subtitle2" fontWeight={600}>
                          {t('blog.premiumContent') || 'Premium Content'}
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {t('blog.premiumContentMessage') || 'Upgrade to Standard or Premium plan to access the full article.'}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => setPremiumModalOpen(true)}
                        sx={{ mt: 2, textTransform: 'none' }}
                      >
                        {t('blog.upgradeNow') || 'Upgrade Now'}
                      </Button>
                    </Alert>
                  </>
                )}
                {canAccessFullContent && formatContent(remainingContent)}
              </Box>
            </Paper>

            {/* Comments Section */}
            <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CommentIcon />
                {t('blog.comments') || 'Comments'} ({comments.length})
              </Typography>

              {/* Add Comment Form */}
              <Box sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder={t('blog.addComment') || 'Add a comment...'}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddComment}
                  startIcon={<SendIcon />}
                  disabled={!newComment.trim()}
                  sx={{ textTransform: 'none' }}
                >
                  {t('blog.postComment') || 'Post Comment'}
                </Button>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Comments List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {comments.map((comment) => (
                  <Card key={comment.id} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {comment.avatar}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
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
                      </Box>
                      <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                        {comment.content}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleLike(comment.id)}
                          color={comment.liked ? 'primary' : 'default'}
                        >
                          <ThumbUpIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="body2" color="text.secondary">
                          {comment.likes}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          sx={{ textTransform: 'none', ml: 'auto' }}
                        >
                          {replyingTo === comment.id ? t('blog.cancel') || 'Cancel' : t('blog.reply') || 'Reply'}
                        </Button>
                      </Box>

                      {/* Reply Form */}
                      {replyingTo === comment.id && (
                        <Box sx={{ mt: 2, pl: 4, borderLeft: '2px solid', borderColor: 'divider' }}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            placeholder={t('blog.addReply') || 'Write a reply...'}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleAddReply(comment.id)}
                            disabled={!replyText.trim()}
                            sx={{ textTransform: 'none' }}
                          >
                            {t('blog.postReply') || 'Post Reply'}
                          </Button>
                        </Box>
                      )}

                      {/* Replies */}
                      {comment.replies.length > 0 && (
                        <Box sx={{ mt: 2, pl: 4, borderLeft: '2px solid', borderColor: 'divider' }}>
                          {comment.replies.map((reply) => (
                            <Box key={reply.id} sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: '0.875rem' }}>
                                  {reply.avatar}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="caption" fontWeight={600}>
                                    {reply.author}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                    {new Date(reply.date).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </Typography>
                                </Box>
                              </Box>
                              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                {reply.content}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => handleLike(reply.id, true, comment.id)}
                                color={reply.liked ? 'primary' : 'default'}
                                sx={{ mt: 0.5 }}
                              >
                                <ThumbUpIcon fontSize="small" />
                              </IconButton>
                              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                {reply.likes}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          </Container>
        </Box>
        <Footer />
        <PremiumModal open={premiumModalOpen} onClose={() => setPremiumModalOpen(false)} />
      </Box>
    </ProtectedRoute>
  );
}

