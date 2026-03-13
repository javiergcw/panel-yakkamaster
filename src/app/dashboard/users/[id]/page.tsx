'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Avatar,
  Chip,
  Divider,
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import {
  GetBuilderByIdUseCase,
  GetLabourByIdUseCase,
  UpdateLabourVerificationUseCase,
  UpdateBuilderVerificationUseCase,
  InstitutionDashboardService,
  type BuilderDetailResponse,
  type LabourDetailResponse,
} from '@/modules/institution';
import { HttpError } from '@/services/http';
import { getVerificationStatusColors, getStatusColors } from '@/utils/statusColors';
import { FetchErrorState } from '@/components/FetchErrorState';

const service = new InstitutionDashboardService();
const getBuilderByIdUseCase = new GetBuilderByIdUseCase(service);
const getLabourByIdUseCase = new GetLabourByIdUseCase(service);
const updateLabourVerificationUseCase = new UpdateLabourVerificationUseCase(service);
const updateBuilderVerificationUseCase = new UpdateBuilderVerificationUseCase(service);

type VerificationStatusValue = 'verified' | 'not_verified' | 'pending';

type DetailState =
  | { status: 'loading' }
  | { status: 'builder'; data: BuilderDetailResponse }
  | { status: 'labour'; data: LabourDetailResponse }
  | { status: 'error'; message: string }
  | { status: 'invalid' };

const label = (s: string) => (
  <Typography sx={{ color: '#86868b', fontSize: '0.8125rem', mb: 1, fontWeight: 500 }}>
    {s}
  </Typography>
);
const value = (s: string | null | undefined, fallback = '—') => (
  <Typography sx={{ color: '#1d1d1f', fontSize: '0.9375rem', mb: 3 }}>
    {s ?? fallback}
  </Typography>
);

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string | undefined;
  const roleParam = searchParams?.get('role');
  const verificationStatusFromList = searchParams?.get('verification_status') ?? null;
  const statusFromList = searchParams?.get('status') ?? null;
  const [state, setState] = useState<DetailState>({ status: 'loading' });
  const [retryKey, setRetryKey] = useState(0);
  const [updatingVerification, setUpdatingVerification] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const handleVerificationUpdate = async (newStatus: VerificationStatusValue) => {
    if (!id || state.status !== 'labour' && state.status !== 'builder') return;
    setVerificationError(null);
    setUpdatingVerification(true);
    try {
      if (state.status === 'labour') {
        await updateLabourVerificationUseCase.execute(id, { verification_status: newStatus });
      } else {
        await updateBuilderVerificationUseCase.execute(id, { verification_status: newStatus });
      }
      const params = new URLSearchParams();
      params.set('role', roleParam === 'builder' ? 'builder' : 'labour');
      if (statusFromList) params.set('status', statusFromList);
      params.set('verification_status', newStatus);
      router.replace(`/dashboard/users/${id}?${params.toString()}`);
    } catch (err) {
      setVerificationError(err instanceof Error ? err.message : 'Failed to update verification');
    } finally {
      setUpdatingVerification(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setState({ status: 'invalid' });
      return;
    }
    setState({ status: 'loading' });

    const fetchLabour = () => getLabourByIdUseCase.execute(id);
    const fetchBuilder = () => getBuilderByIdUseCase.execute(id);

    if (roleParam === 'labour') {
      fetchLabour()
        .then((data) => setState({ status: 'labour', data }))
        .catch((err) =>
          setState({
            status: 'error',
            message: err instanceof Error ? err.message : 'Failed to load labour',
          })
        );
      return;
    }
    if (roleParam === 'builder') {
      fetchBuilder()
        .then((data) => setState({ status: 'builder', data }))
        .catch((err) =>
          setState({
            status: 'error',
            message: err instanceof Error ? err.message : 'Failed to load builder',
          })
        );
      return;
    }

    // No role: try labour first, then builder
    fetchLabour()
      .then((data) => setState({ status: 'labour', data }))
      .catch(() =>
        fetchBuilder()
          .then((data) => setState({ status: 'builder', data }))
          .catch((err) =>
            setState({
              status: 'error',
              message: err instanceof HttpError && err.status === 404
                ? 'User not found'
                : err instanceof Error
                  ? err.message
                  : 'Failed to load user',
            })
          )
      );
  }, [id, roleParam, retryKey]);

  if (id == null || state.status === 'invalid') {
    return (
      <Box>
        <Typography>Invalid user ID</Typography>
      </Box>
    );
  }
  if (state.status === 'loading') {
    return (
      <Box>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: '8px' }} />
        </Box>
        <Card sx={{ bgcolor: '#ffffff', borderRadius: '16px', boxShadow: 'none', border: '1px solid #f5f5f7', mb: 4, p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 4, flexWrap: 'wrap' }}>
            <Skeleton variant="circular" width={80} height={80} />
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Skeleton variant="text" width="50%" height={36} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="35%" height={22} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Skeleton variant="rounded" width={100} height={28} />
              <Skeleton variant="rounded" width={90} height={28} />
              <Skeleton variant="rounded" width={120} height={28} />
            </Box>
          </Box>
          <Skeleton variant="rounded" width={140} height={32} sx={{ mb: 3 }} />
          <Divider sx={{ my: 3, borderColor: '#f5f5f7' }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
            <Box>
              <Skeleton variant="text" width={50} height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="70%" height={24} sx={{ mb: 3 }} />
              <Skeleton variant="text" width={45} height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={24} />
            </Box>
          </Box>
        </Card>
        <Card sx={{ bgcolor: '#ffffff', borderRadius: '16px', boxShadow: 'none', border: '1px solid #f5f5f7', overflow: 'hidden' }}>
          <Box sx={{ p: 4, borderBottom: '1px solid #f5f5f7' }}>
            <Skeleton variant="text" width={140} height={28} />
          </Box>
          <Skeleton variant="rectangular" height={52} sx={{ bgcolor: '#fafafa' }} />
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
              <Skeleton variant="text" width="25%" height={22} />
              <Skeleton variant="text" width="35%" height={20} />
              <Skeleton variant="text" width="20%" height={20} />
              <Skeleton variant="rounded" width={60} height={24} />
            </Box>
          ))}
        </Card>
      </Box>
    );
  }
  if (state.status === 'error') {
    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/dashboard/users')}
            sx={{
              color: '#1d1d1f',
              textTransform: 'none',
              fontWeight: 400,
              '&:hover': { bgcolor: '#f5f5f7' },
            }}
          >
            Back
          </Button>
        </Box>
        <FetchErrorState
          message={state.message}
          onRetry={() => setRetryKey((k) => k + 1)}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard/users')}
          sx={{
            color: '#1d1d1f',
            textTransform: 'none',
            fontWeight: 400,
            '&:hover': { bgcolor: '#f5f5f7' },
          }}
        >
          Back
        </Button>
      </Box>

      {state.status === 'builder' && (
        <BuilderDetail
          data={state.data}
          verificationStatus={verificationStatusFromList}
          status={statusFromList}
          onVerificationUpdate={handleVerificationUpdate}
          updatingVerification={updatingVerification}
          verificationError={verificationError}
        />
      )}
      {state.status === 'labour' && (
        <LabourDetail
          data={state.data}
          verificationStatus={verificationStatusFromList}
          status={statusFromList}
          onVerificationUpdate={handleVerificationUpdate}
          updatingVerification={updatingVerification}
          verificationError={verificationError}
        />
      )}
    </Box>
  );
}

function VerificationChip({ verificationStatus }: { verificationStatus: string | null }) {
  if (!verificationStatus) return null;
  const colors = getVerificationStatusColors(verificationStatus);
  const label = `Verification: ${verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1).replace('_', ' ')}`;
  return (
    <Chip
      label={label}
      sx={{
        bgcolor: colors.bg,
        color: colors.color,
        fontSize: '0.75rem',
        height: 28,
        fontWeight: 400,
      }}
    />
  );
}

function VerificationUpdateButtons({
  currentStatus,
  onUpdate,
  loading,
  error,
}: {
  currentStatus: string | null;
  onUpdate: (status: VerificationStatusValue) => void;
  loading: boolean;
  error: string | null;
}) {
  const options: { value: VerificationStatusValue; label: string; bg: string; color: string }[] = [
    { value: 'verified', label: 'Verified', bg: '#66bb6a', color: '#fff' },
    { value: 'not_verified', label: 'Not verified', bg: '#d32f2f', color: '#fff' },
    { value: 'pending', label: 'Pending', bg: '#f9a825', color: '#1d1d1f' },
  ];
  return (
    <Box sx={{ mt: 3 }}>
      <Typography sx={{ color: '#86868b', fontSize: '0.8125rem', mb: 1.5, fontWeight: 500 }}>
        Update verification status
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {options.map(({ value, label, bg, color }) => (
          <Button
            key={value}
            size="small"
            variant="contained"
            disabled={loading || currentStatus === value}
            onClick={() => onUpdate(value)}
            sx={{
              bgcolor: bg,
              color,
              textTransform: 'none',
              '&:hover': { bgcolor: bg, opacity: 0.9 },
              '&.Mui-disabled': { bgcolor: bg, color, opacity: 0.7 },
            }}
          >
            {label}
          </Button>
        ))}
      </Box>
      {error && (
        <Typography color="error" sx={{ fontSize: '0.875rem', mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

function BuilderDetail({
  data,
  verificationStatus,
  status,
  onVerificationUpdate,
  updatingVerification,
  verificationError,
}: {
  data: BuilderDetailResponse;
  verificationStatus: string | null;
  status: string | null;
  onVerificationUpdate: (status: VerificationStatusValue) => void;
  updatingVerification: boolean;
  verificationError: string | null;
}) {
  return (
    <>
      <Card
        sx={{
          bgcolor: '#ffffff',
          borderRadius: '16px',
          boxShadow: 'none',
          border: '1px solid #f5f5f7',
          mb: 4,
          p: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Avatar
            src={data.photo ?? undefined}
            sx={{ width: 80, height: 80, bgcolor: '#81c784', fontSize: '2rem' }}
          >
            {(data.display_name?.[0] ?? data.name?.[0] ?? data.email?.[0] ?? 'B').toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 300,
                color: '#1d1d1f',
                fontSize: '1.75rem',
                letterSpacing: '-0.5px',
                mb: 1,
              }}
            >
              {data.display_name || data.name}
            </Typography>
            <Typography sx={{ color: '#86868b', fontSize: '0.875rem', mb: 0.5 }}>
              ID: {data.user_id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="Role: Builder"
              sx={{
                bgcolor: '#81c784',
                color: '#fff',
                fontSize: '0.75rem',
                height: 28,
                fontWeight: 400,
              }}
            />
            {status && (() => {
              const statusColors = getStatusColors(status);
              return (
                <Chip
                  label={`Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`}
                  sx={{
                    bgcolor: statusColors.bg,
                    color: statusColors.color,
                    fontSize: '0.75rem',
                    height: 28,
                    fontWeight: 400,
                  }}
                />
              );
            })()}
            <VerificationChip verificationStatus={verificationStatus} />
          </Box>
        </Box>
        <VerificationUpdateButtons
          currentStatus={verificationStatus}
          onUpdate={onVerificationUpdate}
          loading={updatingVerification}
          error={verificationError}
        />
        <Divider sx={{ my: 3, borderColor: '#f5f5f7' }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
          <Box>
            {label('Email')}
            {value(data.email)}
            {label('Name')}
            {value(data.name)}
          </Box>
        </Box>
      </Card>

      {data.organizations.length > 0 && (
        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 4, borderBottom: '1px solid #f5f5f7' }}>
            <Typography variant="h6" sx={{ fontWeight: 400, color: '#1d1d1f', fontSize: '1.125rem' }}>
              Organizations
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2 }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2 }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2 }}>
                    Website
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2 }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.organizations.map((org) => (
                  <TableRow key={org.id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                    <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                      <Typography sx={{ color: '#1d1d1f', fontSize: '0.875rem' }}>
                        {org.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                      <Typography sx={{ color: '#86868b', fontSize: '0.875rem' }}>
                        {org.description || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                      {org.website ? (
                        <Link href={org.website} target="_blank" rel="noopener" sx={{ fontSize: '0.875rem' }}>
                          {org.website}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                      <Chip
                        label={org.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          bgcolor: org.is_active ? '#66bb6a' : '#f5f5f7',
                          color: org.is_active ? '#fff' : '#1d1d1f',
                          textTransform: 'capitalize',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </>
  );
}

function LabourDetail({
  data,
  verificationStatus,
  status,
  onVerificationUpdate,
  updatingVerification,
  verificationError,
}: {
  data: LabourDetailResponse;
  verificationStatus: string | null;
  status: string | null;
  onVerificationUpdate: (status: VerificationStatusValue) => void;
  updatingVerification: boolean;
  verificationError: string | null;
}) {
  const { user, profile } = data;
  const skills = data.skills ?? [];
  const qualifications = data.qualifications ?? [];
  const documents = data.documents ?? [];
  const displayStatus = status ?? user.status;

  return (
    <>
      <Card
        sx={{
          bgcolor: '#ffffff',
          borderRadius: '16px',
          boxShadow: 'none',
          border: '1px solid #f5f5f7',
          mb: 4,
          p: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Avatar
            src={user.photo ?? profile.avatar_url ?? undefined}
            sx={{ width: 80, height: 80, bgcolor: '#66bb6a', fontSize: '2rem' }}
          >
            {(user.first_name?.[0] ?? user.email?.[0] ?? 'L').toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 300,
                color: '#1d1d1f',
                fontSize: '1.75rem',
                letterSpacing: '-0.5px',
                mb: 1,
              }}
            >
              {[user.first_name, user.last_name].filter(Boolean).join(' ') || user.email}
            </Typography>
            <Typography sx={{ color: '#86868b', fontSize: '0.875rem', mb: 0.5 }}>
              ID: {user.id}
            </Typography>
            <Typography sx={{ color: '#86868b', fontSize: '0.875rem' }}>
              Member since {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="Role: Labour"
              sx={{
                bgcolor: '#66bb6a',
                color: '#fff',
                fontSize: '0.75rem',
                height: 28,
                fontWeight: 400,
              }}
            />
            {(() => {
              const statusColors = getStatusColors(displayStatus);
              return (
                <Chip
                  label={`Status: ${(displayStatus ?? '').charAt(0).toUpperCase() + (displayStatus ?? '').slice(1)}`}
                  sx={{
                    bgcolor: statusColors.bg,
                    color: statusColors.color,
                    fontSize: '0.75rem',
                    height: 28,
                  }}
                />
              );
            })()}
            <VerificationChip verificationStatus={verificationStatus} />
          </Box>
        </Box>
        <VerificationUpdateButtons
          currentStatus={verificationStatus}
          onUpdate={onVerificationUpdate}
          loading={updatingVerification}
          error={verificationError}
        />
        <Divider sx={{ my: 3, borderColor: '#f5f5f7' }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
          <Box>
            {label('Email')}
            {value(user.email)}
            {label('Phone')}
            {value(user.phone)}
            {label('Address')}
            {value(user.address)}
          </Box>
          <Box>
            {label('Location')}
            {value(profile.location)}
            {label('Bio')}
            {value(profile.bio)}
          </Box>
        </Box>
      </Card>

      {skills.length > 0 && (
        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            mb: 3,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 4, borderBottom: '1px solid #f5f5f7' }}>
            <Typography variant="h6" sx={{ fontWeight: 400, color: '#1d1d1f', fontSize: '1.125rem' }}>
              Skills
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2 }}>
                    Category
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2 }}>
                    Subcategory
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2 }}>
                    Experience
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2 }}>
                    Years
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {skills.map((s) => (
                  <TableRow key={s.id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                    <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                      {s.category.name}
                    </TableCell>
                    <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                      {s.subcategory.name}
                    </TableCell>
                    <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                      {s.experience_level.name}
                    </TableCell>
                    <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                      {s.years_experience}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {qualifications.length > 0 && (
        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            mb: 3,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 4, borderBottom: '1px solid #f5f5f7' }}>
            <Typography variant="h6" sx={{ fontWeight: 400, color: '#1d1d1f', fontSize: '1.125rem' }}>
              Qualifications
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2 }}>
                    Title
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2 }}>
                    Organization
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2 }}>
                    Sport
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2 }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {qualifications.map((q) => (
                  <TableRow key={q.id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                    <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>{q.title}</TableCell>
                    <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>{q.organization}</TableCell>
                    <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>{q.sport}</TableCell>
                    <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                      <Chip label={q.status} size="small" sx={{ textTransform: 'capitalize' }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {documents.length > 0 && (
        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 4, borderBottom: '1px solid #f5f5f7' }}>
            <Typography variant="h6" sx={{ fontWeight: 400, color: '#1d1d1f', fontSize: '1.125rem' }}>
              Documents / Licenses
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2 }}>
                    License
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2 }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2 }}>
                    Document
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((d) => (
                  <TableRow key={d.id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                    <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                      {d.license.name}
                    </TableCell>
                    <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                      {d.license.description || '—'}
                    </TableCell>
                    <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                      {d.photo_url ? (
                        <Link href={d.photo_url} target="_blank" rel="noopener">
                          View
                        </Link>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </>
  );
}
