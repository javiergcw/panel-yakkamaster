'use client';

import { Box, Typography, Button, Radio, Divider, IconButton, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import BusinessIcon from '@mui/icons-material/Business';
import type { InstitutionProfileCompany } from '@/modules/institution';
import type { Jobsite } from '@/modules/institution';
import { FetchErrorState } from '@/components/FetchErrorState';

interface Step1JobsitesProps {
    company: InstitutionProfileCompany | null;
    jobsites: Jobsite[];
    loading: boolean;
    error: string | null;
    onRetry: () => void;
    selectedJobsite: string | null;
    setSelectedJobsite: (id: string) => void;
    onOpenCreateModal: () => void;
    onNext: () => void;
}

function jobsiteLocation(site: Jobsite): string {
    const parts = [site.city, site.suburb].filter(Boolean);
    if (parts.length) return parts.join(', ');
    return site.address;
}

export default function Step1Jobsites({
    company,
    jobsites,
    loading,
    error,
    onRetry,
    selectedJobsite,
    setSelectedJobsite,
    onOpenCreateModal,
    onNext
}: Step1JobsitesProps) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1 }}>
            {/* Title & Actions Section */}
            <Box
                sx={{
                    width: '100%',
                    px: { xs: 2, sm: 4, md: 8 },
                    pt: { xs: 4, md: 6 },
                    pb: { xs: 3, md: 4 },
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', md: 'center' },
                    gap: 3,
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 800,
                        color: '#1d1d1f',
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        letterSpacing: '-1px'
                    }}
                >
                    Jobsites
                </Typography>

                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'stretch'
                }}>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={onOpenCreateModal}
                        sx={{
                            color: '#1d1d1f',
                            borderColor: '#d1d1d6',
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 2,
                            py: 1,
                            width: { xs: '100%', sm: 'auto' },
                            '&:hover': {
                                bgcolor: '#fafafa',
                                borderColor: '#1d1d1f',
                            }
                        }}
                    >
                        Create new a jobsite
                    </Button>
                    <Button
                        variant="contained"
                        onClick={onNext}
                        disabled={!selectedJobsite}
                        sx={{
                            bgcolor: '#66bb6a',
                            color: '#ffffff',
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 4,
                            py: 1,
                            width: { xs: '100%', sm: 'auto' },
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: '#5cb85c',
                                boxShadow: 'none',
                            },
                            '&.Mui-disabled': {
                                bgcolor: '#f5f5f7',
                                color: '#bdbdbd'
                            }
                        }}
                    >
                        Next
                    </Button>
                </Box>
            </Box>

            <Divider sx={{ borderColor: '#e5e5ea' }} />

            {/* List Section */}
            <Box
                sx={{
                    width: '100%',
                    px: { xs: 2, sm: 4, md: 8 },
                    py: { xs: 3, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: { xs: 'stretch', md: 'center' },
                    flexGrow: 1,
                }}
            >
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress sx={{ color: '#66bb6a' }} />
                    </Box>
                ) : error ? (
                    <FetchErrorState message={error} onRetry={onRetry} />
                ) : (
                    <>
                        {company && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    width: '100%',
                                    maxWidth: 600,
                                    mb: 1,
                                }}
                            >
                                <BusinessIcon sx={{ color: '#86868b', fontSize: '1.25rem' }} />
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        color: '#1d1d1f',
                                        fontSize: { xs: '1rem', sm: '1.1rem' },
                                    }}
                                >
                                    {company.name}
                                </Typography>
                            </Box>
                        )}
                        {jobsites.length === 0 ? (
                            <Typography sx={{ color: '#86868b', fontSize: '0.9375rem' }}>
                                No jobsites available. Create one to continue.
                            </Typography>
                        ) : (
                            jobsites.map((site) => {
                                const isSelected = selectedJobsite === site.id;
                                const location = jobsiteLocation(site);
                                return (
                                    <Box
                                        key={site.id}
                                        onClick={() => setSelectedJobsite(site.id)}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: { xs: 1.5, sm: 2 },
                                            width: '100%',
                                            maxWidth: 600,
                                            border: '1px solid',
                                            borderColor: isSelected ? '#1d1d1f' : '#d1d1d6',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'border-color 0.2s',
                                            '&:hover': {
                                                borderColor: '#1d1d1f',
                                            },
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 2, minWidth: 0 }}>
                                            <Radio
                                                checked={isSelected}
                                                onChange={() => setSelectedJobsite(site.id)}
                                                value={site.id}
                                                sx={{
                                                    color: '#d1d1d6',
                                                    '&.Mui-checked': {
                                                        color: '#1d1d1f',
                                                    },
                                                    p: 0,
                                                }}
                                            />
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: '#1d1d1f',
                                                        fontSize: { xs: '1rem', sm: '1.1rem' },
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {site.address || site.description || 'Jobsite'}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: '#555555',
                                                        fontSize: { xs: '0.8125rem', sm: '0.9rem' },
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {location || site.description || '—'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <IconButton
                                            size="small"
                                            sx={{ color: '#1d1d1f', '&:hover': { bgcolor: '#f5f5f7' } }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Handle edit action
                                            }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                );
                            })
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
}
