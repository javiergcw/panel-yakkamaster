'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import {
  GetJobsitesUseCase,
  InstitutionDashboardService,
  type Jobsite,
  type JobsitesResponse,
} from '@/modules/institution';
import { FetchErrorState } from '@/components/FetchErrorState';
import CreateJobsiteModal from '@/components/jobs/CreateJobsiteModal';
import EditJobsiteModal from '@/components/jobs/EditJobsiteModal';

const institutionService = new InstitutionDashboardService();
const getJobsitesUseCase = new GetJobsitesUseCase(institutionService);

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function JobsiteCard({ jobsite, onEdit }: { jobsite: Jobsite; onEdit: (j: Jobsite) => void }) {
  const address = jobsite.address || '—';
  const citySuburb = [jobsite.city, jobsite.suburb].filter(Boolean).join(', ') || '—';
  const description = jobsite.description?.trim() || null;

  return (
    <Card
      sx={{
        bgcolor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
        border: '1px solid #f5f5f7',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
          <LocationOnOutlinedIcon sx={{ color: '#66bb6a', fontSize: 28, mt: 0.25 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.0625rem',
                fontWeight: 600,
                color: '#1d1d1f',
                lineHeight: 1.35,
                mb: 0.5,
              }}
            >
              {address}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.875rem',
                color: '#86868b',
                fontWeight: 500,
              }}
            >
              {citySuburb}
            </Typography>
          </Box>
        </Box>

        {description && (
          <Typography
            sx={{
              fontSize: '0.875rem',
              color: '#555555',
              lineHeight: 1.5,
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </Typography>
        )}

        {(jobsite.latitude !== 0 || jobsite.longitude !== 0) && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
            <Chip
              size="small"
              label={`Lat ${jobsite.latitude}`}
              sx={{ bgcolor: '#f5f5f7', color: '#555555', fontSize: '0.75rem' }}
            />
            <Chip
              size="small"
              label={`Long ${jobsite.longitude}`}
              sx={{ bgcolor: '#f5f5f7', color: '#555555', fontSize: '0.75rem' }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5, pt: 1.5, borderTop: '1px solid #f0f0f0' }}>
          <Typography sx={{ fontSize: '0.75rem', color: '#86868b' }}>
            Created {formatDate(jobsite.created_at)}
          </Typography>
          <Tooltip title="Edit jobsite">
            <IconButton
              size="small"
              onClick={() => onEdit(jobsite)}
              sx={{
                color: '#86868b',
                '&:hover': { bgcolor: '#e8f5e9', color: '#66bb6a' },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function JobsitesPage() {
  const [data, setData] = useState<JobsitesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingJobsite, setEditingJobsite] = useState<Jobsite | null>(null);

  const loadJobsites = useCallback(() => {
    setError(null);
    setLoading(true);
    getJobsitesUseCase
      .execute()
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load jobsites')
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadJobsites();
  }, [loadJobsites]);

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
        onRetry={loadJobsites}
      />
    );
  }

  const company = data?.company ?? null;
  const jobsites = data?.jobsites ?? [];
  const total = data?.total ?? jobsites.length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
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
            Jobsites
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#86868b', fontSize: '0.9375rem', fontWeight: 400 }}
          >
            {company?.name ? `${company.name} · ` : ''}
            {total} {total === 1 ? 'jobsite' : 'jobsites'} in total
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
          sx={{
            bgcolor: '#66bb6a',
            color: '#ffffff',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#5cb85c',
              boxShadow: '0 4px 12px rgba(102, 187, 106, 0.2)',
            },
          }}
        >
          Create Jobsite
        </Button>
      </Box>

      {/* Content */}
      {jobsites.length === 0 ? (
        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            p: 6,
            textAlign: 'center',
          }}
        >
          <LocationOnOutlinedIcon sx={{ fontSize: 56, color: '#e0e0e0', mb: 2 }} />
          <Typography sx={{ color: '#86868b', fontSize: '0.9375rem', mb: 3 }}>
            No jobsites yet. Create one to assign workers to a location.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
            sx={{
              bgcolor: '#66bb6a',
              color: '#ffffff',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: '#5cb85c' },
            }}
          >
            Create Jobsite
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {jobsites.map((jobsite) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={jobsite.id}>
              <JobsiteCard jobsite={jobsite} onEdit={setEditingJobsite} />
            </Grid>
          ))}
        </Grid>
      )}

      <EditJobsiteModal
        open={!!editingJobsite}
        onClose={() => setEditingJobsite(null)}
        onSuccess={() => {
          loadJobsites();
          setEditingJobsite(null);
        }}
        jobsite={editingJobsite}
      />

      <CreateJobsiteModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={loadJobsites}
      />
    </Box>
  );
}
