'use client';

import { Button, Typography, Container } from '@mui/material';

export default function Home() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Personal Finance Tracker
      </Typography>
      <Button variant="contained">
        MUI is working
      </Button>
    </Container>
  );
}
