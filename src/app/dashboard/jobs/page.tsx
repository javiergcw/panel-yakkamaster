'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Chip,
    CircularProgress,
    Collapse,
    IconButton,
    Divider,
    Tooltip,
    Grid,
    Button
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {
    GetJobsUseCase,
    InstitutionJobsService,
    type Job,
    type JobsResponse,
} from '@/modules/institution';
import { FetchErrorState } from '@/components/FetchErrorState';

const getJobsUseCase = new GetJobsUseCase(new InstitutionJobsService());

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
                    <Tooltip title="Ver detalle">
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
                    <Tooltip title="Editar">
                        <span>
                            <IconButton
                                size="small"
                                disabled
                                sx={{
                                    color: '#86868b',
                                    '&:hover': { bgcolor: '#eeeeee' },
                                    '&.Mui-disabled': { color: '#bdbdbd' },
                                    ml: 0.5,
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </span>
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
                    {/* Hours & Weekend */}
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

                    {/* Wage breakdown */}
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

                    {/* Dates */}
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

                    {/* Licenses */}
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

                    {/* Skills */}
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

export default function JobsPage() {
    const [data, setData] = useState<JobsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadJobs(setData, setError, setLoading);
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
                onRetry={() => loadJobs(setData, setError, setLoading)}
            />
        );
    }

    if (!data) return null;

    const jobs = data.jobs ?? [];

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
                        Jobs
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: '#86868b', fontSize: '0.9375rem', fontWeight: 400 }}
                    >
                        {data.count} {data.count === 1 ? 'job' : 'jobs'} found
                    </Typography>
                </Box>
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

            {/* Content grid */}
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
        </Box>
    );
}
