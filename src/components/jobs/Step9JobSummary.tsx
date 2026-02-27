'use client';

import React from 'react';
import { Box, Typography, Paper, Button, Switch, FormControlLabel } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import StepFooter from './StepFooter';
import type { PaymentScheduleType } from './Step8PaymentSchedule';

const GREEN = '#66bb6a';

function formatDate(d: Date | null): string {
  if (!d) return '—';
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function formatTime(d: Date | null): string {
  if (!d) return '—';
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const am = hours < 12;
  const h = hours % 12 || 12;
  const m = minutes < 10 ? `0${minutes}` : minutes;
  return `${h}:${m} ${am ? 'AM' : 'PM'}`;
}

function formatPaymentLabel(
  paymentSchedule: PaymentScheduleType | null,
  payDay: Date | null
): string {
  if (!paymentSchedule) return '—';
  if (paymentSchedule === 'choose_pay_day') return payDay ? formatDate(payDay) : '—';
  if (paymentSchedule === 'weekly') return 'Weekly payment';
  if (paymentSchedule === 'fortnightly') return 'Fortnightly payment';
  return '—';
}

interface SummaryRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onEdit: () => void;
}

function SummaryRow({ icon, label, value, onEdit }: SummaryRowProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        py: 1.5,
        borderBottom: '1px solid #f0f0f0',
        '&:last-of-type': { borderBottom: 'none' },
      }}
    >
      <Box sx={{ color: '#86868b', display: 'flex', alignItems: 'center' }}>{icon}</Box>
      <Typography sx={{ fontSize: '0.9375rem', color: '#555555', fontWeight: 500, flex: 1 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: '0.9375rem',
          color: '#1d1d1f',
          fontWeight: 600,
          flex: 1,
          textAlign: 'right',
        }}
      >
        {value || '—'}
      </Typography>
      <Button
        size="small"
        startIcon={<EditOutlinedIcon sx={{ fontSize: '1rem' }} />}
        onClick={onEdit}
        sx={{
          color: GREEN,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.8125rem',
          minWidth: 0,
          '&:hover': { bgcolor: 'rgba(102, 187, 106, 0.08)' },
        }}
      >
        Edit
      </Button>
    </Box>
  );
}

export interface Step9JobSummaryProps {
  onBack: () => void;
  onNext: () => void;
  jobTitle: string;
  wage: string;
  jobsiteName: string;
  startDate: Date | null;
  endDate: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  paymentSchedule: PaymentScheduleType | null;
  payDay: Date | null;
  description: string;
  showJobPublic: boolean;
  setShowJobPublic: (value: boolean) => void;
  onEditJobsite: () => void;
  onEditDates: () => void;
  onEditTime: () => void;
  onEditPayment: () => void;
  onEditDescription: () => void;
}

export default function Step9JobSummary({
  onBack,
  onNext,
  jobTitle,
  wage,
  jobsiteName,
  startDate,
  endDate,
  startTime,
  endTime,
  paymentSchedule,
  payDay,
  description,
  showJobPublic,
  setShowJobPublic,
  onEditJobsite,
  onEditDates,
  onEditTime,
  onEditPayment,
  onEditDescription,
}: Step9JobSummaryProps) {
  const datesText =
    startDate && endDate
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : startDate
        ? formatDate(startDate)
        : '—';
  const timeText =
    startTime && endTime
      ? `${formatTime(startTime)} - ${formatTime(endTime)}`
      : startTime
        ? formatTime(startTime)
        : '—';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1 }}>
      <Box
        sx={{
          width: '100%',
          px: { xs: 2, sm: 4, md: 8 },
          pt: { xs: 5, md: 7 },
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
            mb: 4,
            letterSpacing: '-0.5px',
            textAlign: 'center',
            px: 1,
          }}
        >
          Ready to post your job?
        </Typography>

        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 560,
            borderRadius: '14px',
            border: '1px solid #e5e5ea',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2.5,
              py: 2,
              borderBottom: '1px solid #f0f0f0',
              bgcolor: '#fafafa',
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#1d1d1f' }}>
              {jobTitle || '—'}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#1d1d1f' }}>
              ${wage}/hr
            </Typography>
          </Box>

          <Box sx={{ px: 2.5 }}>
            <SummaryRow
              icon={<LocationOnOutlinedIcon sx={{ fontSize: '1.25rem' }} />}
              label="Jobsite"
              value={jobsiteName}
              onEdit={onEditJobsite}
            />
            <SummaryRow
              icon={<CalendarMonthOutlinedIcon sx={{ fontSize: '1.25rem' }} />}
              label="Dates"
              value={datesText}
              onEdit={onEditDates}
            />
            <SummaryRow
              icon={<AccessTimeOutlinedIcon sx={{ fontSize: '1.25rem' }} />}
              label="Time"
              value={timeText}
              onEdit={onEditTime}
            />
            <SummaryRow
              icon={<DescriptionOutlinedIcon sx={{ fontSize: '1.25rem' }} />}
              label="Payment is expected"
              value={formatPaymentLabel(paymentSchedule, payDay)}
              onEdit={onEditPayment}
            />
            <SummaryRow
              icon={<ListOutlinedIcon sx={{ fontSize: '1.25rem' }} />}
              label="Description"
              value={description}
              onEdit={onEditDescription}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              px: 2.5,
              py: 2,
              borderTop: '1px solid #f0f0f0',
              bgcolor: '#fafafa',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
              <VisibilityOutlinedIcon sx={{ color: '#86868b', fontSize: '1.25rem' }} />
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1d1d1f' }}>
                  Show job public
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.8125rem',
                    color: '#86868b',
                    mt: 0.25,
                  }}
                >
                  Turn off job visibility to hide this job temporarily. Only you&apos;ll see it.
                </Typography>
              </Box>
            </Box>
            <Switch
              checked={showJobPublic}
              onChange={(e) => setShowJobPublic(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: GREEN },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: GREEN },
              }}
            />
          </Box>
        </Paper>
      </Box>

      <StepFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={false}
        progressPercent={100}
        nextText="Post job"
      />
    </Box>
  );
}
