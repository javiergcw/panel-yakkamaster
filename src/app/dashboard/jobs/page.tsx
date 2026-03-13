'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Collapse,
  IconButton,
  Divider,
  Tooltip,
  Grid,
  Button,
  Tabs,
  Tab,
  Skeleton,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import {
  GetJobsUseCase,
  GetJobsitesUseCase,
  InstitutionJobsService,
  InstitutionDashboardService,
  type Job,
  type JobsResponse,
  type Jobsite,
  type JobsitesResponse,
} from '@/modules/institution';
import { FetchErrorState } from '@/components/FetchErrorState';
import CreateJobsiteModal from '@/components/jobs/CreateJobsiteModal';
import EditJobsiteModal from '@/components/jobs/EditJobsiteModal';

const institutionService = new InstitutionDashboardService();
const getJobsUseCase = new GetJobsUseCase(new InstitutionJobsService());
const getJobsitesUseCase = new GetJobsitesUseCase(institutionService);

function loadJobs(
  setData: (d: JobsResponse | null) => void,
  setError: (e: string | null) => void,
  setLoading: (l: boolean) => void
) {
  setError(null);
  setLoading(true);
  getJobsUseCase
    .execute()
    .then(setData)
    .catch((err) =>
      setError(err instanceof Error ? err.message : 'Failed to load jobs')
    )
    .finally(() => setLoading(false));
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function JobCard({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);

  const wages = [
    { label: 'Hourly Rate', value: `$${job.wage_hourly_rate.toFixed(2)}` },
    { label: 'Site Allowance', value: `$${job.wage_site_allowance}` },
    { label: 'Leading Hand', value: `$${job.wage_leading_hand_allowance}` },
    { label: 'Productivity', value: `$${job.wage_productivity_allowance}` },
    { label: 'Overtime Rate', value: `${job.extras_overtime_rate}×` },
    { label: 'Meal', value: `$${job.wage_meal}` },
    { label: 'Travel', value: `$${job.travel_allowance}` },
    { label: 'GST', value: `$${job.gst}` },
  ];

  const dates = [
    { label: 'Start', value: formatDate(job.start_date_work) },
    { label: 'End', value: formatDate(job.end_date_work) },
    { label: 'Closing', value: formatDate(job.closing_date) },
    { label: 'Payment Day', value: formatDate(job.payment_day) },
  ];

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
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontSize: '1.125rem', fontWeight: 600, color: '#1d1d1f', flex: 1, pr: 2, lineHeight: 1.3 }}>
            {job.description}
          </Typography>
          <Chip
            label={job.visibility}
            size="small"
            sx={{
              bgcolor: job.visibility === 'PUBLIC' ? '#e8f5e9' : '#f5f5f7',
              color: job.visibility === 'PUBLIC' ? '#388e3c' : '#86868b',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: '24px',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip label={`Labours: ${job.many_labours}`} size="small" sx={{ bgcolor: '#f5f5f7', color: '#1d1d1f', fontSize: '0.75rem', fontWeight: 500 }} />
          <Chip label={`$${job.wage_hourly_rate.toFixed(2)} / hr`} size="small" sx={{ bgcolor: '#f5f5f7', color: '#1d1d1f', fontSize: '0.75rem', fontWeight: 500 }} />
          {job.asap && (
            <Chip label="ASAP" size="small" sx={{ bgcolor: '#fff3e0', color: '#e65100', fontSize: '0.7rem', fontWeight: 600 }} />
          )}
          {job.ongoing_work && (
            <Chip label="Ongoing" size="small" sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontSize: '0.7rem', fontWeight: 600 }} />
          )}
        </Box>

        <Typography sx={{ fontSize: '0.875rem', color: '#86868b', mb: 1, display: 'flex', alignItems: 'center' }}>
          <Box component="span" sx={{ fontWeight: 500, color: '#1d1d1f', mr: 1 }}>Period:</Box>
          {formatDate(job.start_date_work)} – {formatDate(job.end_date_work)}
        </Typography>

        <Typography sx={{ fontSize: '0.8125rem', color: '#86868b' }}>
          Created on {formatDate(job.created_at)}
        </Typography>
      </CardContent>

      <Divider />

      <CardActions sx={{ px: 3, py: 1.5, justifyContent: 'space-between', bgcolor: '#fafafa', borderTop: '1px solid #f5f5f7' }}>
        <Box>
          <Tooltip title="View detail">
            <span>
              <IconButton
                size="small"
                disabled
                sx={{
                  color: '#66bb6a',
                  '&:hover': { bgcolor: '#e8f5e9' },
                  '&.Mui-disabled': { color: '#a5d6a7' },
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              component={Link}
              href={`/dashboard/jobs/${job.id}/edit`}
              size="small"
              sx={{
                color: '#86868b',
                '&:hover': { bgcolor: '#eeeeee' },
                ml: 0.5,
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Button
          size="small"
          onClick={() => setOpen(!open)}
          endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          sx={{
            color: open ? '#1d1d1f' : '#86868b',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.8125rem',
            '&:hover': { bgcolor: 'transparent', color: '#1d1d1f' }
          }}
        >
          {open ? 'Hide Details' : 'View Details'}
        </Button>
      </CardActions>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ p: 3, borderTop: '1px solid #f5f5f7', bgcolor: '#ffffff' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip
              label={`${job.start_time} – ${job.end_time}`}
              size="small"
              sx={{ bgcolor: '#f5f5f7', color: '#1d1d1f', fontSize: '0.75rem', fontWeight: 500 }}
            />
            <Chip
              label="Saturday"
              size="small"
              sx={{
                bgcolor: job.work_saturday ? '#e8f5e9' : '#f5f5f7',
                color: job.work_saturday ? '#388e3c' : '#bdbdbd',
                fontSize: '0.75rem',
                fontWeight: 500
              }}
            />
            <Chip
              label="Sunday"
              size="small"
              sx={{
                bgcolor: job.work_sunday ? '#e8f5e9' : '#f5f5f7',
                color: job.work_sunday ? '#388e3c' : '#bdbdbd',
                fontSize: '0.75rem',
                fontWeight: 500
              }}
            />
            {job.requires_supervisor_signature && (
              <Chip
                label={`Supervisor: ${job.supervisor_name}`}
                size="small"
                sx={{ bgcolor: '#fce4ec', color: '#c62828', fontSize: '0.75rem', fontWeight: 500 }}
              />
            )}
          </Box>

          <Divider sx={{ mb: 2, borderColor: '#f0f0f0' }} />

          <Typography
            sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#86868b', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}
          >
            Wage Breakdown
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
              gap: 1,
              mb: 2.5,
            }}
          >
            {wages.map((w) => (
              <Box
                key={w.label}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  px: 1.5,
                  py: 1,
                  bgcolor: '#fafafa',
                  borderRadius: '8px',
                  border: '1px solid #f5f5f7',
                }}
              >
                <Typography sx={{ fontSize: '0.7rem', color: '#86868b', mb: 0.25 }}>{w.label}</Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1d1d1f' }}>{w.value}</Typography>
              </Box>
            ))}
          </Box>

          <Typography
            sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#86868b', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}
          >
            Dates
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
              gap: 1,
              mb: 2.5,
            }}
          >
            {dates.map((d) => (
              <Box
                key={d.label}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  px: 1.5,
                  py: 1,
                  bgcolor: '#fafafa',
                  borderRadius: '8px',
                  border: '1px solid #f5f5f7',
                }}
              >
                <Typography sx={{ fontSize: '0.7rem', color: '#86868b', mb: 0.25 }}>{d.label}</Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1d1d1f' }}>{d.value}</Typography>
              </Box>
            ))}
          </Box>

          {(job.job_licenses ?? []).length > 0 && (
            <>
              <Typography
                sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#86868b', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}
              >
                Licenses
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
                {(job.job_licenses ?? []).map((l) => (
                  <Chip
                    key={l.id}
                    label={l.license_id.slice(0, 8) + '…'}
                    size="small"
                    sx={{ bgcolor: '#f5f5f7', color: '#1d1d1f', fontSize: '0.75rem', fontWeight: 500 }}
                  />
                ))}
              </Box>
            </>
          )}

          {(job.job_skills ?? []).length > 0 && (
            <>
              <Typography
                sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#86868b', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}
              >
                Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {(job.job_skills ?? []).map((s) => (
                  <Chip
                    key={s.id}
                    label={s.skill_subcategory_id.slice(0, 8) + '…'}
                    size="small"
                    sx={{ bgcolor: '#e8f5e9', color: '#388e3c', fontSize: '0.75rem', fontWeight: 500 }}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>
      </Collapse>
    </Card>
  );
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

function JobsPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [tabValue, setTabValue] = useState(tabParam === 'jobsites' ? 1 : 0);

  useEffect(() => {
    if (searchParams.get('tab') === 'jobsites') setTabValue(1);
  }, [searchParams]);

  const [jobsData, setJobsData] = useState<JobsResponse | null>(null);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);

  const [jobsitesData, setJobsitesData] = useState<JobsitesResponse | null>(null);
  const [jobsitesLoading, setJobsitesLoading] = useState(true);
  const [jobsitesError, setJobsitesError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingJobsite, setEditingJobsite] = useState<Jobsite | null>(null);

  const loadJobsites = useCallback(() => {
    setJobsitesError(null);
    setJobsitesLoading(true);
    getJobsitesUseCase
      .execute()
      .then(setJobsitesData)
      .catch((err) =>
        setJobsitesError(err instanceof Error ? err.message : 'Failed to load jobsites')
      )
      .finally(() => setJobsitesLoading(false));
  }, []);

  useEffect(() => {
    loadJobs(setJobsData, setJobsError, setJobsLoading);
  }, []);

  useEffect(() => {
    loadJobsites();
  }, [loadJobsites]);

  const jobs = jobsData?.jobs ?? [];
  const company = jobsitesData?.company ?? null;
  const jobsites = jobsitesData?.jobsites ?? [];
  const jobsitesTotal = jobsitesData?.total ?? jobsites.length;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
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
          Post a job
        </Typography>
      </Box>

      <Tabs
        value={tabValue}
        onChange={(_, v) => setTabValue(v)}
        sx={{
          borderBottom: '1px solid #f5f5f7',
          mb: 3,
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.9375rem' },
          '& .Mui-selected': { color: '#66bb6a' },
          '& .MuiTabs-indicator': { bgcolor: '#66bb6a' },
        }}
      >
        <Tab label="Jobs" />
        <Tab label="Jobsites" />
      </Tabs>

      {tabValue === 0 && (
        <>
          {jobsLoading ? (
            <Box>
              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Skeleton variant="text" width={120} height={24} />
                <Skeleton variant="rounded" width={120} height={36} sx={{ borderRadius: '8px' }} />
              </Box>
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Grid size={{ xs: 12, md: 6, xl: 4 }} key={i}>
                    <Card sx={{ bgcolor: '#ffffff', borderRadius: '16px', boxShadow: 'none', border: '1px solid #f5f5f7', overflow: 'hidden', height: '100%' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Skeleton variant="text" width="80%" height={28} />
                          <Skeleton variant="rounded" width={60} height={24} />
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          <Skeleton variant="rounded" width={72} height={24} />
                          <Skeleton variant="rounded" width={88} height={24} />
                        </Box>
                        <Skeleton variant="text" width="70%" height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="50%" height={18} />
                      </CardContent>
                      <Divider />
                      <Box sx={{ px: 3, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Skeleton variant="circular" width={32} height={32} />
                          <Skeleton variant="circular" width={32} height={32} />
                        </Box>
                        <Skeleton variant="text" width={100} height={24} />
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : jobsError ? (
            <FetchErrorState
              message={jobsError}
              onRetry={() => loadJobs(setJobsData, setJobsError, setJobsLoading)}
            />
          ) : !jobsData ? null : (
            <>
              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="body1" sx={{ color: '#86868b', fontSize: '0.9375rem', fontWeight: 400 }}>
                  {jobsData.count} {jobsData.count === 1 ? 'job' : 'jobs'} found
                </Typography>
                <Button
                  component={Link}
                  href="/dashboard/jobs/create"
                  variant="contained"
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
                    }
                  }}
                >
                  Create Job
                </Button>
              </Box>

              {jobs.length === 0 ? (
                <Card sx={{ bgcolor: '#ffffff', borderRadius: '16px', boxShadow: 'none', border: '1px solid #f5f5f7', p: 6, textAlign: 'center' }}>
                  <Typography sx={{ color: '#86868b', fontSize: '0.9375rem' }}>
                    No jobs available.
                  </Typography>
                </Card>
              ) : (
                <Grid container spacing={3}>
                  {jobs.map((job) => (
                    <Grid size={{ xs: 12, md: 6, xl: 4 }} key={job.id}>
                      <JobCard job={job} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </>
      )}

      {tabValue === 1 && (
        <>
          {jobsitesLoading ? (
            <Box>
              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Skeleton variant="text" width={180} height={24} />
                <Skeleton variant="rounded" width={140} height={36} sx={{ borderRadius: '8px' }} />
              </Box>
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                    <Card sx={{ bgcolor: '#ffffff', borderRadius: '16px', boxShadow: 'none', border: '1px solid #f5f5f7', overflow: 'hidden', height: '100%' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                          <Skeleton variant="circular" width={28} height={28} />
                          <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="85%" height={24} sx={{ mb: 0.5 }} />
                            <Skeleton variant="text" width="60%" height={20} />
                          </Box>
                        </Box>
                        <Skeleton variant="text" width="100%" height={18} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="80%" height={18} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 1.5, borderTop: '1px solid #f0f0f0' }}>
                          <Skeleton variant="text" width={100} height={18} />
                          <Skeleton variant="circular" width={32} height={32} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : jobsitesError ? (
            <FetchErrorState message={jobsitesError} onRetry={loadJobsites} />
          ) : (
            <>
              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="body1" sx={{ color: '#86868b', fontSize: '0.9375rem', fontWeight: 400 }}>
                  {company?.name ? `${company.name} · ` : ''}
                  {jobsitesTotal} {jobsitesTotal === 1 ? 'jobsite' : 'jobsites'} in total
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
            </>
          )}
        </>
      )}
    </Box>
  );
}

function JobsPageFallback() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width={180} height={40} sx={{ mb: 1 }} />
      </Box>
      <Box sx={{ borderBottom: '1px solid #f5f5f7', mb: 3, display: 'flex', gap: 2 }}>
        <Skeleton variant="rounded" width={80} height={40} sx={{ borderRadius: 0 }} />
        <Skeleton variant="rounded" width={90} height={40} sx={{ borderRadius: 0 }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: '16px' }} />
      </Box>
    </Box>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<JobsPageFallback />}>
      <JobsPageContent />
    </Suspense>
  );
}
