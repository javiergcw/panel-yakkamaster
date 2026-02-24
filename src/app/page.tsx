'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Link as MuiLink, Alert } from '@mui/material';
import { Input, Button } from '@/components';
import { LoginUseCase, AuthService, setAccessToken, setUser } from '@/modules/auth';
import { HttpError } from '@/services/http';

const loginUseCase = new LoginUseCase(new AuthService());

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginUseCase.execute({ email, password });
      if (res.user.role !== 'institution') {
        setError('Please use the mobile app to access your account.');
        return;
      }
      setAccessToken(res.access_token, res.expires_in);
      setUser(res.user, res.expires_in);
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      if (err instanceof HttpError && err.body && typeof err.body === 'object' && 'message' in err.body) {
        setError(String((err.body as { message?: string }).message));
      } else if (err instanceof HttpError) {
        setError(err.status === 401 ? 'Invalid email or password.' : err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

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
            onSubmit={handleSubmit}
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3,
              width: '100%',
              mt: 4,
            }}
          >
            {error && (
              <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: '12px' }}>
                {error}
              </Alert>
            )}

            {/* Email Input */}
            <Input
              type="email"
              placeholder="Email"
              fullWidth
              required
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            {/* Password Input */}
            <Input
              type="password"
              placeholder="Password"
              fullWidth
              required
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            {/* Forgot password */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
              <MuiLink 
                component={Link}
                href="/forgot-password" 
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
              </MuiLink>
            </Box>

            {/* Login Button */}
            <Button 
              type="submit"
              variant="contained" 
              fullWidth 
              disabled={loading}
              sx={{ 
                mt: 2,
                bgcolor: '#66bb6a',
                '&:hover': {
                  bgcolor: '#5aae5d',
                },
              }}
            >
              {loading ? 'Signing in...' : 'Log in'}
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
              <MuiLink 
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
              </MuiLink>
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Right Side - Banner image - Oculto en móviles */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: 'url(/Login_banner.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: { xs: 'none', lg: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: { xs: 'auto', lg: '100vh' },
          overflow: 'hidden',
        }}
      >
        {/* Overlay oscuro para contraste del texto */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
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
