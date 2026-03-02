'use client';

import React from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import StepFooter from './StepFooter';
import { FetchErrorState } from '@/components/FetchErrorState';
import type { JobRequirement, License } from '@/modules/masters';

const GREEN = '#66bb6a';

interface Step7JobDetailsProps {
  onBack: () => void;
  onNext: () => void;
  requirements: JobRequirement[];
  licensesList: License[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  jobRequirements: string[];
  setJobRequirements: (value: string[] | ((prev: string[]) => string[])) => void;
  licenses: string[];
  setLicenses: (value: string[] | ((prev: string[]) => string[])) => void;
  description: string;
  setDescription: (value: string) => void;
}

export default function Step7JobDetails({
  onBack,
  onNext,
  requirements,
  licensesList,
  loading,
  error,
  onRetry,
  jobRequirements,
  setJobRequirements,
  licenses: selectedLicenses,
  setLicenses,
  description,
  setDescription,
}: Step7JobDetailsProps) {
  const activeRequirements = requirements.filter((r) => r.is_active);
  const activeLicenses = licensesList.filter((l) => l.active);

  const toggleRequirement = (id: string) => {
    setJobRequirements((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleLicense = (id: string) => {
    setLicenses((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1 }}>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
          <FetchErrorState message={error} onRetry={onRetry} />
        </Box>
        <StepFooter onBack={onBack} onNext={onNext} nextDisabled={true} progressPercent={100} />
      </Box>
    );
  }

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
          {loading ? (
            <Typography sx={{ color: '#86868b', fontSize: '0.875rem', mb: 3 }}>
              Loading requirements...
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(2, 1fr)' },
                gap: 1.5,
                mb: 3,
              }}
            >
              {activeRequirements.map((req) => {
                const selected = jobRequirements.includes(req.id);
                return (
                  <Button
                    key={req.id}
                    variant="outlined"
                    onClick={() => toggleRequirement(req.id)}
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
                    {req.name}
                  </Button>
                );
              })}
            </Box>
          )}

          <Typography
            sx={{
              fontWeight: 700,
              color: '#1d1d1f',
              fontSize: { xs: '1rem', sm: '1.0625rem' },
              mb: 2,
            }}
          >
            Licenses, tickets, or insurances
          </Typography>
          {loading ? (
            <Typography sx={{ color: '#86868b', fontSize: '0.875rem', mb: 3 }}>
              Loading licenses...
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(2, 1fr)' },
                gap: 1.5,
                mb: 4,
              }}
            >
              {activeLicenses.map((lic) => {
                const selected = selectedLicenses.includes(lic.id);
                return (
                  <Button
                    key={lic.id}
                    variant="outlined"
                    onClick={() => toggleLicense(lic.id)}
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
                    {lic.name}
                  </Button>
                );
              })}
            </Box>
          )}

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
