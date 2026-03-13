'use client';

import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(MuiButton)(({ theme }) => ({
  minHeight: 44, // touch target mínimo en móvil
  height: 52,
  padding: '0 24px',
  fontSize: '1rem',
  fontWeight: 400, // Más ligero
  textTransform: 'none',
  borderRadius: '12px', // Más redondeado
  transition: 'all 0.2s ease',
  [theme.breakpoints.down('sm')]: {
    height: 48,
    padding: '0 20px',
    fontSize: '0.9375rem',
  },
  '&.MuiButton-contained': {
    boxShadow: 'none', // Sin sombra
    '&:hover': {
      boxShadow: 'none',
      opacity: 0.9,
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
  },
}));

export interface ButtonProps extends MuiButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit';
}

export const Button = ({ variant = 'contained', ...props }: ButtonProps) => {
  return <StyledButton variant={variant} {...props} />;
};
