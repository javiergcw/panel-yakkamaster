'use client';

import { Box, Typography } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

export interface UnderConstructionProps {
  /** Título de la sección (ej. "Dashboard") */
  title?: string;
  /** Mensaje adicional bajo el título (opcional) */
  message?: string;
}

const defaultTitle = 'Under construction';
const defaultMessage = 'This section is not available yet. We are working on it.';

export function UnderConstruction({ title = defaultTitle, message = defaultMessage }: UnderConstructionProps) {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: { xs: 320, sm: 400 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3,
        py: 6,
      }}
    >
      <ConstructionIcon
        sx={{
          fontSize: { xs: 48, sm: 56, md: 64 },
          color: '#86868b',
          mb: { xs: 2, sm: 3 },
        }}
      />
      <Typography
        variant="h4"
        sx={{
          fontWeight: 300,
          color: '#1d1d1f',
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
          letterSpacing: '-0.5px',
          mb: 1.5,
          px: 1,
          wordBreak: 'break-word',
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: '#86868b',
          fontSize: { xs: '0.875rem', sm: '0.9375rem' },
          fontWeight: 400,
          maxWidth: 360,
          width: '100%',
          lineHeight: 1.5,
          px: 1,
          boxSizing: 'border-box',
          wordBreak: 'break-word',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}
