'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  GetInstitutionDashboardUseCase,
  InstitutionDashboardService,
  type InstitutionDashboardResponse,
  type Labour,
  type Builder,
} from '@/modules/institution';
import { FetchErrorState } from '@/components/FetchErrorState';

const getDashboardUseCase = new GetInstitutionDashboardUseCase(
  new InstitutionDashboardService()
);

const CHART_COLORS = ['#66bb6a', '#81c784', '#a5d6a7'];

function labourPieData(summary: InstitutionDashboardResponse['summary']) {
  return [
    { name: 'Pending', value: summary.labours_pending },
    { name: 'Verified', value: summary.labours_verified },
    { name: 'Not verified', value: summary.labours_not_verified },
  ].filter((d) => d.value > 0);
}

function builderPieData(summary: InstitutionDashboardResponse['summary']) {
  return [
    { name: 'Pending', value: summary.builders_pending },
    { name: 'Verified', value: summary.builders_verified },
    { name: 'Not verified', value: summary.builders_not_verified },
  ].filter((d) => d.value > 0);
}

function displayName(item: Labour | Builder): string {
  const first = 'first_name' in item ? item.first_name : undefined;
  const last = 'last_name' in item ? item.last_name : undefined;
  if (first || last) return [first, last].filter(Boolean).join(' ').trim();
  return item.email ?? item.phone ?? '—';
}

function loadDashboard(
  setData: (d: InstitutionDashboardResponse | null) => void,
  setError: (e: string | null) => void,
  setLoading: (l: boolean) => void
) {
  setError(null);
  setLoading(true);
  getDashboardUseCase
    .execute()
    .then(setData)
    .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dashboard'))
    .finally(() => setLoading(false));
}

export default function DashboardPage() {
  const [data, setData] = useState<InstitutionDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard(setData, setError, setLoading);
  }, []);

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
        onRetry={() => loadDashboard(setData, setError, setLoading)}
      />
    );
  }

  if (!data) return null;

  const { organization, summary, labours, builders } = data;
  const labourPie = labourPieData(summary);
  const builderPie = builderPieData(summary);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
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
          Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#86868b',
            fontSize: '0.9375rem',
            fontWeight: 400,
          }}
        >
          {organization.name}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 3,
          mb: 5,
        }}
      >
        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            transition: 'all 0.2s ease',
            '&:hover': { borderColor: '#e0e0e0' },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: '#86868b', fontSize: '0.8125rem', mb: 1.5, fontWeight: 400 }}
            >
              Total Labours
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 300,
                color: '#1d1d1f',
                fontSize: '2rem',
                letterSpacing: '-0.5px',
              }}
            >
              {summary.total_labours.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            transition: 'all 0.2s ease',
            '&:hover': { borderColor: '#e0e0e0' },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: '#86868b', fontSize: '0.8125rem', mb: 1.5, fontWeight: 400 }}
            >
              Total Builders
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 300,
                color: '#1d1d1f',
                fontSize: '2rem',
                letterSpacing: '-0.5px',
              }}
            >
              {summary.total_builders.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            transition: 'all 0.2s ease',
            '&:hover': { borderColor: '#e0e0e0' },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: '#86868b', fontSize: '0.8125rem', mb: 1.5, fontWeight: 400 }}
            >
              Labours Pending
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 300,
                color: '#1d1d1f',
                fontSize: '2rem',
                letterSpacing: '-0.5px',
              }}
            >
              {summary.labours_pending.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            transition: 'all 0.2s ease',
            '&:hover': { borderColor: '#e0e0e0' },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: '#86868b', fontSize: '0.8125rem', mb: 1.5, fontWeight: 400 }}
            >
              Builders Pending
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 300,
                color: '#1d1d1f',
                fontSize: '2rem',
                letterSpacing: '-0.5px',
              }}
            >
              {summary.builders_pending.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Pie Charts */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          mb: 5,
        }}
      >
        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              color: '#1d1d1f',
              mb: 4,
              fontSize: '1.125rem',
              letterSpacing: '-0.3px',
            }}
          >
            Labour verification
          </Typography>
          <ResponsiveContainer width="100%" height={260}>
            {labourPie.length > 0 ? (
              <PieChart>
                <Pie
                  data={labourPie}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {labourPie.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #f5f5f7',
                    borderRadius: '12px',
                  }}
                />
              </PieChart>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography color="text.secondary">No data</Typography>
              </Box>
            )}
          </ResponsiveContainer>
        </Card>

        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              color: '#1d1d1f',
              mb: 4,
              fontSize: '1.125rem',
              letterSpacing: '-0.3px',
            }}
          >
            Builder verification
          </Typography>
          <ResponsiveContainer width="100%" height={260}>
            {builderPie.length > 0 ? (
              <PieChart>
                <Pie
                  data={builderPie}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {builderPie.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #f5f5f7',
                    borderRadius: '12px',
                  }}
                />
              </PieChart>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography color="text.secondary">No data</Typography>
              </Box>
            )}
          </ResponsiveContainer>
        </Card>
      </Box>

      {/* Labours list */}
      <Card
        sx={{
          bgcolor: '#ffffff',
          borderRadius: '16px',
          boxShadow: 'none',
          border: '1px solid #f5f5f7',
          p: 4,
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 400,
            color: '#1d1d1f',
            mb: 3,
            fontSize: '1.125rem',
            letterSpacing: '-0.3px',
          }}
        >
          Labours
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {labours.slice(0, 10).map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 1.5,
                px: 2,
                borderRadius: '12px',
                bgcolor: '#fafafa',
              }}
            >
              <Avatar
                src={item.photo ?? undefined}
                sx={{ width: 40, height: 40, bgcolor: '#66bb6a' }}
              >
                {(item.first_name?.[0] ?? item.email?.[0] ?? 'L').toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 500, fontSize: '0.9375rem', color: '#1d1d1f' }}>
                  {displayName(item)}
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: '#86868b' }}>
                  {item.email}
                </Typography>
              </Box>
              <Chip
                label={item.verification_status}
                size="small"
                sx={{
                  bgcolor: item.verification_status === 'verified' ? '#66bb6a' : '#f5f5f7',
                  color: item.verification_status === 'verified' ? '#fff' : '#1d1d1f',
                  textTransform: 'capitalize',
                }}
              />
            </Box>
          ))}
          {labours.length === 0 && (
            <Typography color="text.secondary">No labours yet.</Typography>
          )}
        </Box>
      </Card>

      {/* Builders list */}
      <Card
        sx={{
          bgcolor: '#ffffff',
          borderRadius: '16px',
          boxShadow: 'none',
          border: '1px solid #f5f5f7',
          p: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 400,
            color: '#1d1d1f',
            mb: 3,
            fontSize: '1.125rem',
            letterSpacing: '-0.3px',
          }}
        >
          Builders
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {builders.slice(0, 10).map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 1.5,
                px: 2,
                borderRadius: '12px',
                bgcolor: '#fafafa',
              }}
            >
              <Avatar
                src={item.photo ?? undefined}
                sx={{ width: 40, height: 40, bgcolor: '#81c784' }}
              >
                {(item.first_name?.[0] ?? item.email?.[0] ?? item.phone?.[0] ?? 'B').toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 500, fontSize: '0.9375rem', color: '#1d1d1f' }}>
                  {displayName(item)}
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: '#86868b' }}>
                  {item.email ?? item.phone}
                </Typography>
              </Box>
              <Chip
                label={item.verification_status}
                size="small"
                sx={{
                  bgcolor: item.verification_status === 'verified' ? '#66bb6a' : '#f5f5f7',
                  color: item.verification_status === 'verified' ? '#fff' : '#1d1d1f',
                  textTransform: 'capitalize',
                }}
              />
            </Box>
          ))}
          {builders.length === 0 && (
            <Typography color="text.secondary">No builders yet.</Typography>
          )}
        </Box>
      </Card>
    </Box>
  );
}
