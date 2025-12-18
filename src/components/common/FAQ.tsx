'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  subtitle?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  columns?: { xs?: number; sm?: number; md?: number };
}

export default function FAQ({ items, title, subtitle, maxWidth = 'md', columns }: FAQProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqContent = (
    <Box>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Accordion
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{
              mb: 2,
              borderRadius: 2,
              boxShadow: 2,
              '&:before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                margin: '0 0 16px 0',
              },
              '&:hover': {
                boxShadow: 4,
              },
              transition: 'all 0.3s ease',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
              sx={{
                px: 3,
                py: 2,
                '&.Mui-expanded': {
                  borderBottom: 1,
                  borderColor: 'divider',
                },
              }}
            >
              <Typography variant="h6" fontWeight={600} sx={{ pr: 2 }}>
                {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, py: 3 }}>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {item.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </motion.div>
      ))}
    </Box>
  );

  if (columns) {
    return (
      <Container maxWidth={maxWidth}>
        {title && (
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body1" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
        <Grid container spacing={3}>
          <Grid size={{ xs: columns.xs || 12, sm: columns.sm || 12, md: columns.md || 12 }}>
            {faqContent}
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth={maxWidth}>
      {title && (
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      {faqContent}
    </Container>
  );
}
