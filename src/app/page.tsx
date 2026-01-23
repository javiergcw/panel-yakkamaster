'use client';

import { Box, Container, Typography, Link } from '@mui/material';
import { Input, Button } from '@/components';

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: '#fafafa',
      }}
    >
      {/* Left Side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#ffffff',
          p: { xs: 3, sm: 4, md: 6 },
          minHeight: { xs: 'auto', md: '100vh' },
        }}
      >
        <Container 
          maxWidth="xs" 
          sx={{ 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Logo - Simple y centrado */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 300, 
                color: '#1d1d1f',
                letterSpacing: '-0.5px',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                mb: 0.5,
              }}
            >
              Panel Yakka Sporty
            </Typography>
          </Box>

          {/* Title */}
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 400, 
              mb: 2, 
              color: '#1d1d1f',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              textAlign: 'center',
              letterSpacing: '-0.8px',
            }}
          >
            Log in to your account
          </Typography>

          {/* Form */}
          <Box 
            component="form" 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3,
              width: '100%',
              mt: 4,
            }}
          >
            {/* Email Input */}
            <Input
              type="email"
              placeholder="Email"
              fullWidth
            />

            {/* Password Input */}
            <Input
              type="password"
              placeholder="Password"
              fullWidth
            />

            {/* Forgot password */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
              <Link 
                href="#" 
                sx={{ 
                  fontSize: '0.875rem', 
                  textDecoration: 'none',
                  color: '#66bb6a',
                  fontWeight: 400,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot password?
              </Link>
            </Box>

            {/* Login Button */}
            <Button 
              variant="contained" 
              fullWidth 
              sx={{ 
                mt: 2,
                bgcolor: '#66bb6a',
                '&:hover': {
                  bgcolor: '#5aae5d',
                },
              }}
            >
              Log in
            </Button>

            {/* Footer - Simplificado */}
            <Typography 
              variant="body2" 
              sx={{ 
                textAlign: 'center', 
                mt: 4, 
                color: '#86868b',
                fontSize: '0.8125rem',
                fontWeight: 400,
                lineHeight: 1.5,
              }}
            >
              By continuing, you agree to our{' '}
              <Link 
                href="#" 
                sx={{ 
                  textDecoration: 'none', 
                  color: '#66bb6a',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Terms of Use
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Right Side - Green Container - Oculto en móviles */}
      <Box
        sx={{
          flex: 1,
          bgcolor: '#66bb6a',
          display: { xs: 'none', lg: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: { xs: 'auto', lg: '100vh' },
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            color: 'white',
            p: 4,
            maxWidth: 400,
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 300, 
              mb: 2, 
              letterSpacing: '-1px',
              fontSize: '2.5rem',
            }}
          >
            Panel Yakka Sporty
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              opacity: 0.9, 
              fontWeight: 300,
              fontSize: '1.125rem',
            }}
          >
            Empowering healthier communities
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
