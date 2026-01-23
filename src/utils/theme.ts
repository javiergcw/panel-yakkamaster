'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#66bb6a', // Verde claro
    },
    secondary: {
      main: '#dc004e',
    },
  },
  shape: {
    borderRadius: 4,
  },
});
