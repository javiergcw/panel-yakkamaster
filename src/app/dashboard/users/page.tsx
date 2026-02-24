'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import {
  GetLaboursUseCase,
  GetBuildersUseCase,
  InstitutionDashboardService,
  type Labour,
  type Builder,
} from '@/modules/institution';
import { getVerificationStatusColors, getStatusColors } from '@/utils/statusColors';
import { FetchErrorState } from '@/components/FetchErrorState';

const service = new InstitutionDashboardService();
const getLaboursUseCase = new GetLaboursUseCase(service);
const getBuildersUseCase = new GetBuildersUseCase(service);

function displayName(item: Labour | Builder): string {
  const first = 'first_name' in item ? item.first_name : undefined;
  const last = 'last_name' in item ? item.last_name : undefined;
  if (first || last) return [first, last].filter(Boolean).join(' ').trim();
  return item.email ?? ('email' in item ? item.email : item.phone) ?? '—';
}

const tableCellHead = {
  fontWeight: 500,
  color: '#1d1d1f',
  fontSize: '0.875rem',
  py: 2,
  borderBottom: '1px solid #f5f5f7',
} as const;

const tableCellBody = {
  py: 2.5,
  borderBottom: '1px solid #f5f5f7',
} as const;

export default function UsersPage() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [labours, setLabours] = useState<Labour[]>([]);
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [totalLabours, setTotalLabours] = useState(0);
  const [totalBuilders, setTotalBuilders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = () => {
    setError(null);
    setLoading(true);
    Promise.all([getLaboursUseCase.execute(), getBuildersUseCase.execute()])
      .then(([laboursRes, buildersRes]) => {
        setLabours(laboursRes.labours);
        setBuilders(buildersRes.builders);
        setTotalLabours(laboursRes.total);
        setTotalBuilders(buildersRes.total);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const searchLower = search.trim().toLowerCase();
  const filteredLabours = useMemo(
    () =>
      !searchLower
        ? labours
        : labours.filter(
            (u) =>
              displayName(u).toLowerCase().includes(searchLower) ||
              u.email.toLowerCase().includes(searchLower) ||
              u.phone.includes(search)
          ),
    [labours, searchLower]
  );
  const filteredBuilders = useMemo(
    () =>
      !searchLower
        ? builders
        : builders.filter(
            (u) =>
              displayName(u).toLowerCase().includes(searchLower) ||
              (u.email && u.email.toLowerCase().includes(searchLower)) ||
              u.phone.includes(search)
          ),
    [builders, searchLower]
  );

  const handleRowClick = (user: Labour | Builder) => {
    const role = tab === 0 ? 'labour' : 'builder';
    const params = new URLSearchParams({ role });
    params.set('status', user.status);
    params.set('verification_status', user.verification_status);
    router.push(`/dashboard/users/${user.id}?${params.toString()}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
        <CircularProgress sx={{ color: '#66bb6a' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <FetchErrorState
        message={error}
        onRetry={loadUsers}
      />
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 300,
              color: '#1d1d1f',
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              letterSpacing: '-1px',
              mb: 1,
            }}
          >
            Users
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#86868b',
              fontSize: '0.9375rem',
              fontWeight: 400,
            }}
          >
            Manage labours and builders
          </Typography>
        </Box>
      </Box>

      <Card
        sx={{
          bgcolor: '#ffffff',
          borderRadius: '16px',
          boxShadow: 'none',
          border: '1px solid #f5f5f7',
          mb: 4,
          p: 2,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#86868b', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              bgcolor: '#fafafa',
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: '#e0e0e0' },
              '&.Mui-focused fieldset': { borderColor: '#66bb6a' },
            },
          }}
        />
      </Card>

      <Card
        sx={{
          bgcolor: '#ffffff',
          borderRadius: '16px',
          boxShadow: 'none',
          border: '1px solid #f5f5f7',
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            borderBottom: '1px solid #f5f5f7',
            px: 2,
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 },
            '& .Mui-selected': { color: '#66bb6a' },
            '& .MuiTabs-indicator': { bgcolor: '#66bb6a' },
          }}
        >
          <Tab label={`Labours (${totalLabours})`} />
          <Tab label={`Builders (${totalBuilders})`} />
        </Tabs>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fafafa' }}>
                <TableCell sx={tableCellHead}>User</TableCell>
                <TableCell sx={tableCellHead}>Contact</TableCell>
                <TableCell sx={tableCellHead}>Status</TableCell>
                <TableCell sx={tableCellHead}>Verification</TableCell>
                <TableCell sx={tableCellHead}>Associated at</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tab === 0 &&
                filteredLabours.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': { bgcolor: '#fafafa' },
                    }}
                    onClick={() => handleRowClick(user)}
                  >
                    <TableCell sx={tableCellBody}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={user.photo ?? undefined}
                          sx={{ width: 40, height: 40, bgcolor: '#66bb6a', fontSize: '0.875rem' }}
                        >
                          {(user.first_name?.[0] ?? user.email?.[0] ?? 'L').toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.9375rem' }}>
                            {displayName(user)}
                          </Typography>
                          <Typography sx={{ color: '#86868b', fontSize: '0.8125rem' }}>
                            ID: {user.id.slice(0, 8)}…
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={tableCellBody}>
                      <Typography sx={{ color: '#1d1d1f', fontSize: '0.875rem', mb: 0.5 }}>
                        {user.email}
                      </Typography>
                      <Typography sx={{ color: '#86868b', fontSize: '0.8125rem' }}>
                        {user.phone}
                      </Typography>
                    </TableCell>
                    <TableCell sx={tableCellBody}>
                      {(() => {
                        const c = getStatusColors(user.status);
                        return (
                          <Chip
                            label={user.status}
                            size="small"
                            sx={{
                              bgcolor: c.bg,
                              color: c.color,
                              fontSize: '0.75rem',
                              height: 24,
                              fontWeight: 400,
                              textTransform: 'capitalize',
                            }}
                          />
                        );
                      })()}
                    </TableCell>
                    <TableCell sx={tableCellBody}>
                      {(() => {
                        const c = getVerificationStatusColors(user.verification_status);
                        return (
                          <Chip
                            label={user.verification_status}
                            size="small"
                            sx={{
                              bgcolor: c.bg,
                              color: c.color,
                              fontSize: '0.75rem',
                              height: 24,
                              fontWeight: 400,
                              textTransform: 'capitalize',
                            }}
                          />
                        );
                      })()}
                    </TableCell>
                    <TableCell sx={tableCellBody}>
                      <Typography sx={{ color: '#86868b', fontSize: '0.875rem' }}>
                        {new Date(user.associated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              {tab === 1 &&
                filteredBuilders.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': { bgcolor: '#fafafa' },
                    }}
                    onClick={() => handleRowClick(user)}
                  >
                    <TableCell sx={tableCellBody}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={user.photo ?? undefined}
                          sx={{ width: 40, height: 40, bgcolor: '#81c784', fontSize: '0.875rem' }}
                        >
                          {(user.first_name?.[0] ?? user.email?.[0] ?? user.phone?.[0] ?? 'B').toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.9375rem' }}>
                            {displayName(user)}
                          </Typography>
                          <Typography sx={{ color: '#86868b', fontSize: '0.8125rem' }}>
                            ID: {user.id.slice(0, 8)}…
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={tableCellBody}>
                      <Typography sx={{ color: '#1d1d1f', fontSize: '0.875rem', mb: 0.5 }}>
                        {user.email ?? '—'}
                      </Typography>
                      <Typography sx={{ color: '#86868b', fontSize: '0.8125rem' }}>
                        {user.phone}
                      </Typography>
                    </TableCell>
                    <TableCell sx={tableCellBody}>
                      {(() => {
                        const c = getStatusColors(user.status);
                        return (
                          <Chip
                            label={user.status}
                            size="small"
                            sx={{
                              bgcolor: c.bg,
                              color: c.color,
                              fontSize: '0.75rem',
                              height: 24,
                              fontWeight: 400,
                              textTransform: 'capitalize',
                            }}
                          />
                        );
                      })()}
                    </TableCell>
                    <TableCell sx={tableCellBody}>
                      {(() => {
                        const c = getVerificationStatusColors(user.verification_status);
                        return (
                          <Chip
                            label={user.verification_status}
                            size="small"
                            sx={{
                              bgcolor: c.bg,
                              color: c.color,
                              fontSize: '0.75rem',
                              height: 24,
                              fontWeight: 400,
                              textTransform: 'capitalize',
                            }}
                          />
                        );
                      })()}
                    </TableCell>
                    <TableCell sx={tableCellBody}>
                      <Typography sx={{ color: '#86868b', fontSize: '0.875rem' }}>
                        {new Date(user.associated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {tab === 0 && filteredLabours.length === 0 && (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {search ? 'No labours match your search.' : 'No labours yet.'}
            </Typography>
          </Box>
        )}
        {tab === 1 && filteredBuilders.length === 0 && (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {search ? 'No builders match your search.' : 'No builders yet.'}
            </Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
}
