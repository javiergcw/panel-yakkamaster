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
        minHeight: { xs: 240, sm: 280 },
        py: { xs: 3, sm: 4 },
        px: { xs: 2, sm: 3 },
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 500,
          color: '#1d1d1f',
          fontSize: { xs: '1rem', sm: '1.125rem' },
          mb: 1,
          wordBreak: 'break-word',
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          color: '#86868b',
          fontSize: { xs: '0.875rem', sm: '0.9375rem' },
          mb: 3,
          maxWidth: 420,
          width: '100%',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
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
          fontSize: { xs: '0.875rem', sm: '0.9375rem' },
          '&:hover': { bgcolor: '#5cb860' },
        }}
      >
        Reload
      </Button>
    </Box>
  );
}
