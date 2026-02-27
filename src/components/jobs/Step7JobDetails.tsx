'use client';

import React from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import StepFooter from './StepFooter';

const GREEN = '#66bb6a';

const JOB_REQUIREMENTS = [
  'White Card',
  'Heavy Lifting',
  'Apprenticeship',
  'Must have experience',
  'Women Only',
  'Good English Level',
  'ABN Payment',
  'RSA',
  'PWD Opportunity',
  'Full PPE',
];

interface Step7JobDetailsProps {
  onBack: () => void;
  onNext: () => void;
  jobRequirements: string[];
  setJobRequirements: (value: string[] | ((prev: string[]) => string[])) => void;
  licensesText: string;
  setLicensesText: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
}

export default function Step7JobDetails({
  onBack,
  onNext,
  jobRequirements,
  setJobRequirements,
  licensesText,
  setLicensesText,
  description,
  setDescription,
}: Step7JobDetailsProps) {
  const toggleRequirement = (label: string) => {
    setJobRequirements((prev) =>
      prev.includes(label) ? prev.filter((r) => r !== label) : [...prev, label]
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1 }}>
      <Box
        sx={{
          width: '100%',
          px: { xs: 2, sm: 4, md: 8 },
          pt: { xs: 6, md: 8 },
          pb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexGrow: 1,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: '#1d1d1f',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            mb: 1,
            letterSpacing: '-0.5px',
            textAlign: 'center',
            px: 1,
          }}
        >
          What details do you need for this job?
        </Typography>

        <Box sx={{ width: '100%', maxWidth: 720, mt: 5, textAlign: 'center' }}>
          {/* Job Requirements */}
          <Typography
            sx={{
              fontWeight: 700,
              color: '#1d1d1f',
              fontSize: { xs: '1rem', sm: '1.0625rem' },
              mb: 2,
            }}
          >
            Job Requirements
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(2, 1fr)' },
              gap: 1.5,
              mb: 3,
            }}
          >
            {JOB_REQUIREMENTS.map((label) => {
              const selected = jobRequirements.includes(label);
              return (
                <Button
                  key={label}
                  variant="outlined"
                  onClick={() => toggleRequirement(label)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    borderRadius: '12px',
                    borderColor: selected ? GREEN : '#e0e0e0',
                    color: selected ? '#fff' : '#1d1d1f',
                    bgcolor: selected ? GREEN : 'transparent',
                    py: 1.25,
                    '&:hover': {
                      borderColor: selected ? GREEN : '#d0d0d0',
                      bgcolor: selected ? '#5cb860' : '#f5f5f7',
                    },
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Box>

          <Typography
            sx={{
              color: '#86868b',
              fontSize: '0.875rem',
              fontWeight: 500,
              mb: 1,
            }}
          >
            List any required licenses, tickets, or insurances
          </Typography>
          <TextField
            fullWidth
            placeholder="Add tickets/license or other"
            value={licensesText}
            onChange={(e) => setLicensesText(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              mb: 4,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: '#ffffff',
                '& fieldset': { borderColor: '#e5e5ea' },
                '&:hover fieldset': { borderColor: '#d1d1d6' },
                '&.Mui-focused fieldset': { borderColor: GREEN, borderWidth: 2 },
              },
            }}
          />

          {/* Description */}
          <Typography
            sx={{
              fontWeight: 700,
              color: '#1d1d1f',
              fontSize: { xs: '1rem', sm: '1.0625rem' },
              mb: 1,
            }}
          >
            Description
          </Typography>
          <Typography
            sx={{
              color: '#555555',
              fontSize: '0.875rem',
              mb: 2,
            }}
          >
            Briefly explain what the worker will be doing and if they need to bring their own tools.
          </Typography>
          <TextField
            fullWidth
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            multiline
            rows={5}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: '#ffffff',
                '& fieldset': { borderColor: '#e5e5ea' },
                '&:hover fieldset': { borderColor: '#d1d1d6' },
                '&.Mui-focused fieldset': { borderColor: GREEN, borderWidth: 2 },
              },
            }}
          />
        </Box>
      </Box>

      <StepFooter onBack={onBack} onNext={onNext} nextDisabled={false} progressPercent={100} />
    </Box>
  );
}
