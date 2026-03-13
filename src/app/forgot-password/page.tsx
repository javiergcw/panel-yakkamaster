'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Link as MuiLink, Alert } from '@mui/material';
import { Input, Button } from '@/components';
import {
  RequestPasswordResetUseCase,
  ResetPasswordUseCase,
  AuthService,
} from '@/modules/auth';
import { HttpError } from '@/services/http';

const authService = new AuthService();
const requestResetUseCase = new RequestPasswordResetUseCase(authService);
const resetPasswordUseCase = new ResetPasswordUseCase(authService);

type Step = 1 | 2;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await requestResetUseCase.execute(email.trim());
      setSuccess('Password reset email sent. Check your inbox for the code.');
      setStep(2);
    } catch (err) {
      if (err instanceof HttpError && err.body && typeof err.body === 'object' && 'message' in err.body) {
        setError(String((err.body as { message?: string }).message));
      } else {
        setError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await resetPasswordUseCase.execute({
        email: email.trim(),
        otp: otp.trim(),
        new_password: newPassword,
      });
      setSuccess('Password updated. You can now log in with your new password.');
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      if (err instanceof HttpError && err.body && typeof err.body === 'object' && 'message' in err.body) {
        setError(String((err.body as { message?: string }).message));
      } else {
        setError(err instanceof Error ? err.message : 'Failed to reset password. Please try again.');
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
      {/* Left Side - Form */}
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
              Panel Yakka Sport
            </Typography>
          </Box>

          {step === 1 ? (
            <>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 400,
                  mb: 1,
                  color: '#1d1d1f',
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                  textAlign: 'center',
                  letterSpacing: '-0.8px',
                }}
              >
                Forgot password?
              </Typography>
              <Typography
                sx={{
                  color: '#86868b',
                  fontSize: '0.9375rem',
                  textAlign: 'center',
                  mb: 4,
                }}
              >
                Enter your email and we&apos;ll send you a code to reset your password.
              </Typography>

              <Box
                component="form"
                onSubmit={handleRequestReset}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  width: '100%',
                  mt: 2,
                }}
              >
                {error && (
                  <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: '12px' }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" onClose={() => setSuccess(null)} sx={{ borderRadius: '12px' }}>
                    {success}
                  </Alert>
                )}

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

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 2,
                    bgcolor: '#66bb6a',
                    '&:hover': { bgcolor: '#5aae5d' },
                  }}
                >
                  {loading ? 'Sending...' : 'Send reset code'}
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 400,
                  mb: 1,
                  color: '#1d1d1f',
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                  textAlign: 'center',
                  letterSpacing: '-0.8px',
                }}
              >
                Reset password
              </Typography>
              <Typography
                sx={{
                  color: '#86868b',
                  fontSize: '0.9375rem',
                  textAlign: 'center',
                  mb: 4,
                }}
              >
                Enter the code we sent to <strong>{email}</strong> and your new password.
              </Typography>

              <Box
                component="form"
                onSubmit={handleResetPassword}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  width: '100%',
                  mt: 2,
                }}
              >
                {error && (
                  <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: '12px' }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ borderRadius: '12px' }}>
                    {success}
                  </Alert>
                )}

                <Input
                  type="text"
                  placeholder="Verification code (OTP)"
                  fullWidth
                  required
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  autoComplete="one-time-code"
                  inputProps={{ maxLength: 6 }}
                />

                <Input
                  type="password"
                  placeholder="New password"
                  fullWidth
                  required
                  name="new_password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 2,
                    bgcolor: '#66bb6a',
                    '&:hover': { bgcolor: '#5aae5d' },
                  }}
                >
                  {loading ? 'Resetting...' : 'Reset password'}
                </Button>
              </Box>
            </>
          )}

          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              mt: 4,
              color: '#86868b',
              fontSize: '0.8125rem',
              fontWeight: 400,
            }}
          >
            <MuiLink
              component={Link}
              href="/"
              sx={{
                textDecoration: 'none',
                color: '#66bb6a',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Back to log in
            </MuiLink>
          </Typography>
        </Container>
      </Box>

      {/* Right Side - Banner image (hidden on small screens) */}
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
            Panel Yakka Sport
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
