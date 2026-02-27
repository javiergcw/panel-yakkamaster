'use client';

import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import StepFooter from './StepFooter';

const GREEN = '#66bb6a';

const timePickerSx = {
  '& .MuiOutlinedInput-root': {
    minHeight: { xs: 56, sm: 64 },
    borderRadius: '14px',
    bgcolor: '#f5f5f7',
    border: 'none',
    boxShadow: 'none',
    '& fieldset': { border: 'none' },
    '&:hover': { bgcolor: '#ebebed' },
    '&.Mui-focused': {
      bgcolor: '#fff',
      boxShadow: '0 0 0 2px rgba(102, 187, 106, 0.35)',
      '& fieldset': { border: 'none' },
    },
  },
  '& .MuiOutlinedInput-input': {
    py: { xs: 1.75, sm: 2 },
    px: { xs: 2, sm: 2.5 },
    fontSize: { xs: '1.125rem', sm: '1.25rem' },
    fontWeight: 600,
    color: '#1d1d1f',
    letterSpacing: '-0.02em',
    cursor: 'pointer',
  },
  '& .MuiInputAdornment-root': {
    '& .MuiIconButton-root': {
      color: '#86868b',
      '&:hover': { color: '#1d1d1f', bgcolor: 'rgba(0,0,0,0.04)' },
    },
  },
};

const popperPaperSx = {
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  mt: 1.5,
  '& .MuiTimeClock-root': { height: 280 },
  '& .MuiPickersLayout-root': {
    '& .MuiPickersLayout-contentWrapper': { minHeight: 320 },
    '& .MuiTimePickerToolbar-root': {
      padding: '16px 20px',
      backgroundColor: '#f5f5f7',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      '& .MuiTimePickerToolbar-separator': { mx: 0.5, color: '#1d1d1f' },
      '& .MuiTimePickerToolbar-ampmSelection button': {
        borderRadius: '10px',
        fontSize: '0.8125rem',
        fontWeight: 600,
        '&.Mui-selected': { bgcolor: GREEN, color: '#fff', '&:hover': { bgcolor: '#5cb860' } },
      },
    },
    '& .MuiPickersActionBar-root': {
      padding: '12px 16px',
      borderTop: '1px solid rgba(0,0,0,0.06)',
      '& button': { borderRadius: '10px', fontWeight: 600, textTransform: 'none' },
      '& button:last-of-type': { bgcolor: GREEN, color: '#fff', '&:hover': { bgcolor: '#5cb860' } },
    },
  },
  '& .MuiClockNumber-root': { fontWeight: 500 },
  '& .MuiClock-pin': { bgcolor: GREEN },
  '& .MuiClockPointer-thumb': { border: `2px solid ${GREEN}`, bgcolor: '#fff' },
  '& .MuiClockPointer-noPoint': { bgcolor: GREEN },
};

const JOB_TYPES = [
  'Casual Job',
  'Part time',
  'Full time',
  'Farms Job',
  'Mining Job',
  'FIFO',
  'Seasonal job',
  'W&H visa',
  'Other',
];

interface Step6TimeAndJobTypeProps {
  onBack: () => void;
  onNext: () => void;
  startTime: Date | null;
  setStartTime: (date: Date | null) => void;
  endTime: Date | null;
  setEndTime: (date: Date | null) => void;
  jobType: string | null;
  setJobType: (value: string | null) => void;
}

export default function Step6TimeAndJobType({
  onBack,
  onNext,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  jobType,
  setJobType,
}: Step6TimeAndJobTypeProps) {
  const nextDisabled = !startTime || !endTime || !jobType;
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            At what time?
          </Typography>
          <Typography
            sx={{
              color: '#555555',
              fontSize: { xs: '0.9375rem', sm: '1rem' },
              fontWeight: 400,
              mb: { xs: 3, sm: 4 },
              textAlign: 'center',
              px: 1,
            }}
          >
            Select the start and end time
          </Typography>

          <Box sx={{ width: '100%', maxWidth: 560, mb: { xs: 4, sm: 6 } }}>
            <Typography sx={{ color: '#86868b', fontSize: '0.875rem', fontWeight: 500, mb: 1.5 }}>
              Start time
            </Typography>
            <TimePicker
              value={startTime}
              onChange={(v) => setStartTime(v)}
              open={openStart}
              onOpen={() => setOpenStart(true)}
              onClose={() => setOpenStart(false)}
              views={['hours', 'minutes']}
              timeSteps={{ minutes: 5 }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: timePickerSx,
                  onClick: () => setOpenStart(true),
                  inputProps: { readOnly: true },
                },
                desktopPaper: { sx: popperPaperSx },
              }}
            />
            <Typography sx={{ color: '#86868b', fontSize: '0.875rem', fontWeight: 500, mb: 1.5, mt: { xs: 3, sm: 4 } }}>
              End time
            </Typography>
            <TimePicker
              value={endTime}
              onChange={(v) => setEndTime(v)}
              open={openEnd}
              onOpen={() => setOpenEnd(true)}
              onClose={() => setOpenEnd(false)}
              views={['hours', 'minutes']}
              timeSteps={{ minutes: 5 }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: timePickerSx,
                  onClick: () => setOpenEnd(true),
                  inputProps: { readOnly: true },
                },
                desktopPaper: { sx: popperPaperSx },
              }}
            />
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#1d1d1f',
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              mb: { xs: 2, sm: 3 },
              letterSpacing: '-0.3px',
              textAlign: 'center',
              width: '100%',
              px: 1,
            }}
          >
            What kind of job are you offering?
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 1, sm: 1.5 },
              width: '100%',
              maxWidth: 720,
              justifyContent: 'center',
            }}
          >
            {JOB_TYPES.map((label) => {
              const selected = jobType === label;
              return (
                <Button
                  key={label}
                  variant={selected ? 'contained' : 'outlined'}
                  onClick={() => setJobType(selected ? null : label)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: { xs: '0.8125rem', sm: '0.9rem' },
                    borderRadius: '12px',
                    borderColor: '#e0e0e0',
                    color: selected ? '#fff' : '#1d1d1f',
                    bgcolor: selected ? GREEN : 'transparent',
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.75, sm: 1 },
                    minWidth: 0,
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
        </Box>

        <StepFooter
          onBack={onBack}
          onNext={onNext}
          nextDisabled={nextDisabled}
          progressPercent={100}
        />
      </Box>
    </LocalizationProvider>
  );
}
