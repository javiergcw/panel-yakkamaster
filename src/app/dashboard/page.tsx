'use client';

import { Box, Typography } from '@mui/material';
import RecentJobs from '@/components/dashboard/RecentJobs';

export default function DashboardPage() {
  return (
    <Box sx={{ width: '100%', minWidth: 0, overflow: 'hidden' }}>
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 300,
            color: '#1d1d1f',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.25rem' },
            letterSpacing: '-1px',
            mb: 1,
            wordBreak: 'break-word',
          }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#86868b',
            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
            fontWeight: 400,
          }}
        >
          Recent job postings
        </Typography>
      </Box>
      <RecentJobs />
    </Box>
  );
}
