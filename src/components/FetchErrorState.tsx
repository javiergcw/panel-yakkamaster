'use client';

import { Box, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

export interface FetchErrorStateProps {
  /** Error message to show */
  message: string;
  /** Called when user clicks the reload button */
  onRetry: () => void;
  /** Optional title above the message */
  title?: string;
}

/**
 * Reusable UI for failed GET requests: shows message and a reload button.
 */
export function FetchErrorState({ message, onRetry, title = 'Something went wrong' }: FetchErrorStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 280,
        py: 4,
        px: 2,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 500,
          color: '#1d1d1f',
          fontSize: '1.125rem',
          mb: 1,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          color: '#86868b',
          fontSize: '0.9375rem',
          mb: 3,
          maxWidth: 420,
        }}
      >
        {message}
      </Typography>
      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={onRetry}
        sx={{
          bgcolor: '#66bb6a',
          color: '#fff',
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 500,
          '&:hover': { bgcolor: '#5cb860' },
        }}
      >
        Reload
      </Button>
    </Box>
  );
}
