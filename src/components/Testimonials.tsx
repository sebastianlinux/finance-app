'use client';

import { Grid, Card, CardContent, Box, Avatar, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Testimonials() {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: t('testimonials.testimonial1Name'),
      role: t('testimonials.testimonial1Role'),
      content: t('testimonials.testimonial1Content'),
      avatar: 'JD',
    },
    {
      name: t('testimonials.testimonial2Name'),
      role: t('testimonials.testimonial2Role'),
      content: t('testimonials.testimonial2Content'),
      avatar: 'SM',
    },
    {
      name: t('testimonials.testimonial3Name'),
      role: t('testimonials.testimonial3Role'),
      content: t('testimonials.testimonial3Content'),
      avatar: 'AR',
    },
  ];

  return (
    <Grid container spacing={3}>
      {testimonials.map((testimonial, index) => (
        <Grid size={{ xs: 12, md: 4 }} key={index}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                "{testimonial.content}"
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{testimonial.avatar}</Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {testimonial.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {testimonial.role}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
