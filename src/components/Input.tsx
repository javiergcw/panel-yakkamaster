'use client';

import { TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    height: 52,
    [theme.breakpoints.down('sm')]: {
      height: 48,
    },
    fontSize: '1rem',
    backgroundColor: '#fafafa',
    borderRadius: '12px', // Más redondeado
    transition: 'all 0.2s ease',
    '& fieldset': {
      borderColor: '#e0e0e0', // Borde muy sutil
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: '#d0d0d0',
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
      '& fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: '2px',
      },
    },
  },
  '& .MuiInputLabel-root': {
    display: 'none', // Sin labels flotantes
  },
  '& .MuiInputBase-input': {
    padding: '16px 20px',
    [theme.breakpoints.down('sm')]: {
      padding: '14px 16px',
      fontSize: '16px', // evita zoom en iOS
    },
    fontSize: '1rem',
    fontWeight: 400,
    '&::placeholder': {
      color: '#999',
      opacity: 1,
    },
  },
}));

export interface InputProps extends Omit<TextFieldProps, 'variant' | 'label'> {
  variant?: 'outlined' | 'filled' | 'standard';
}

export const Input = ({ variant = 'outlined', ...props }: InputProps) => {
  return <StyledTextField variant={variant} {...props} />;
};
