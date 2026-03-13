'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  IconButton,
  Chip,
  Button,
} from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

export interface RecentJobItem {
  id: string;
  jobTitle: string;
  companyName: string;
  companyLogoUrl: string;
  location: string;
  jobType: string;
  timeAgo: string;
  tags: { label: string; color: string }[];
  compensation: string;
  compensationUnit: string;
  unpaid?: boolean;
}

const MOCK_JOBS: RecentJobItem[] = [
  {
    id: '1',
    jobTitle: 'Sport Performance Analyst/Scout',
    companyName: 'Barcelona',
    companyLogoUrl: '/logo/logo.png',
    location: 'New York, NY',
    jobType: 'Full time',
    timeAgo: '3 mins ago',
    tags: [{ label: 'Senior', color: '#e3f2fd' }],
    compensation: '$156,000',
    compensationUnit: '/ year',
  },
  {
    id: '2',
    jobTitle: 'Head coach',
    companyName: 'Real Madrid',
    companyLogoUrl: '/logo/logo.png',
    location: 'New York, NY',
    jobType: 'Full time',
    timeAgo: '3 mins ago',
    tags: [{ label: 'Full time', color: '#f3e5f5' }],
    compensation: '$19.58',
    compensationUnit: '/ Hour',
  },
  {
    id: '3',
    jobTitle: 'Social media Manager',
    companyName: "McDonald's",
    companyLogoUrl: '/logo/logo.png',
    location: 'New York, NY',
    jobType: 'Full time',
    timeAgo: '3 mins ago',
    tags: [{ label: 'Remote', color: '#e8f5e9' }],
    compensation: 'Unpaid',
    compensationUnit: '',
    unpaid: true,
  },
  {
    id: '4',
    jobTitle: 'Software Engineer',
    companyName: 'Dell',
    companyLogoUrl: '/logo/logo.png',
    location: 'New York, NY',
    jobType: 'Full time',
    timeAgo: '3 mins ago',
    tags: [{ label: 'Internship', color: '#e3f2fd' }],
    compensation: '$70',
    compensationUnit: '/ Hour',
  },
  {
    id: '5',
    jobTitle: 'Outdoor Guide',
    companyName: 'The North Face',
    companyLogoUrl: '/logo/logo.png',
    location: 'New York, NY',
    jobType: 'Full time',
    timeAgo: '3 mins ago',
    tags: [{ label: 'Volunteer', color: '#fff8e1' }],
    compensation: '$27',
    compensationUnit: '/ Hour',
  },
];

const TOTAL_PAGES = 5;

export default function RecentJobs() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Card
      sx={{
        bgcolor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #f5f5f7',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 2.5 },
          borderBottom: '1px solid #f5f5f7',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#1d1d1f',
            fontSize: { xs: '1rem', sm: '1.125rem' },
            letterSpacing: '-0.3px',
          }}
        >
          Recent Jobs
        </Typography>
        <Typography
          sx={{
            color: '#86868b',
            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            fontWeight: 500,
          }}
        >
          Education
        </Typography>
      </Box>

      {/* Job list */}
      <Box sx={{ px: { xs: 1.5, sm: 3 }, py: { xs: 1, sm: 1 } }}>
        {MOCK_JOBS.map((job) => (
          <Box
            key={job.id}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'flex-start' },
              gap: { xs: 1.5, md: 2 },
              py: { xs: 2, sm: 2.5 },
              px: { xs: 1.5, sm: 2 },
              borderRadius: '12px',
              bgcolor: '#fafafa',
              mb: 1.5,
              '&:last-of-type': { mb: 0 },
              transition: 'background-color 0.2s ease',
              '&:hover': { bgcolor: '#f5f5f7' },
            }}
          >
            {/* Left: logo + job details */}
            <Box sx={{ display: 'flex', gap: 1.5, flex: 1, minWidth: 0 }}>
              <Box
                component="img"
                src={job.companyLogoUrl}
                alt=""
                sx={{
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  borderRadius: '50%',
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                    color: '#1d1d1f',
                    mb: 0.25,
                    lineHeight: 1.3,
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                >
                  {job.jobTitle}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                    color: '#66bb6a',
                    fontWeight: 500,
                    mb: 0.75,
                  }}
                >
                  {job.companyName}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: { xs: 1, sm: 1.5 },
                    color: '#86868b',
                    fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                  }}
                >
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnOutlinedIcon sx={{ fontSize: 12 }} />
                    {job.location}
                  </Box>
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <WorkOutlineIcon sx={{ fontSize: 12 }} />
                    {job.jobType}
                  </Box>
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ScheduleIcon sx={{ fontSize: 12 }} />
                    {job.timeAgo}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Middle: tags + Right: share + compensation — en móvil misma fila, en desktop junto al bloque anterior */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, alignItems: 'center', maxWidth: { xs: '100%', md: 200 } }}>
                {job.tags.map((tag) => (
                  <Chip
                    key={tag.label}
                    label={tag.label}
                    size="small"
                    sx={{
                      bgcolor: tag.color,
                      color: '#1d1d1f',
                      fontSize: { xs: '0.625rem', sm: '0.6875rem' },
                      fontWeight: 600,
                      height: { xs: 20, sm: 22 },
                      '& .MuiChip-label': { px: { xs: 1, sm: 1.25 } },
                    }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                <IconButton
                  size="small"
                  sx={{
                    color: '#86868b',
                    p: { xs: 0.5, sm: 1 },
                    '&:hover': { bgcolor: 'rgba(102, 187, 106, 0.08)', color: '#66bb6a' },
                  }}
                  aria-label="Share"
                >
                  <ShareOutlinedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                </IconButton>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    color: '#66bb6a',
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                  }}
                >
                  {job.compensation}
                  {job.compensationUnit && (
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 400,
                        fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                        color: '#86868b',
                        ml: 0.25,
                      }}
                    >
                      {job.compensationUnit}
                    </Typography>
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Pagination */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 0.5,
          py: { xs: 2, sm: 2.5 },
          px: 2,
          borderTop: '1px solid #f5f5f7',
        }}
      >
        {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            onClick={() => setCurrentPage(page)}
            sx={{
              minWidth: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              borderRadius: '10px',
              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
              fontWeight: 600,
              textTransform: 'none',
              bgcolor: currentPage === page ? '#66bb6a' : 'transparent',
              color: currentPage === page ? '#fff' : '#86868b',
              border: currentPage === page ? 'none' : '1px solid #e0e0e0',
              '&:hover': {
                bgcolor: currentPage === page ? '#5cb860' : '#f5f5f7',
                color: currentPage === page ? '#fff' : '#1d1d1f',
                borderColor: currentPage === page ? 'none' : '#e0e0e0',
              },
            }}
          >
            {page}
          </Button>
        ))}
        <Button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, TOTAL_PAGES))}
          sx={{
            ml: { xs: 0.5, sm: 1 },
            height: { xs: 32, sm: 36 },
            borderRadius: '10px',
            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            fontWeight: 500,
            textTransform: 'none',
            color: '#1d1d1f',
            border: '1px solid #e0e0e0',
            px: { xs: 1.5, sm: 2 },
            '&:hover': {
              bgcolor: '#f5f5f7',
              borderColor: '#e0e0e0',
            },
          }}
        >
          Next →
        </Button>
      </Box>
    </Card>
  );
}
