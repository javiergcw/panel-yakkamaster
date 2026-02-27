'use client';

import React from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import StepFooter from './StepFooter';

const GREEN = '#66bb6a';
const GREEN_HOVER = '#5cb860';

export type PaymentScheduleType = 'choose_pay_day' | 'weekly' | 'fortnightly';

interface Step8PaymentScheduleProps {
  onBack: () => void;
  onNext: () => void;
  paymentSchedule: PaymentScheduleType | null;
  setPaymentSchedule: (value: PaymentScheduleType | null) => void;
  payDay: Date | null;
  setPayDay: (date: Date | null) => void;
}

function toMidnight(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isSameDay(a: Date, b: Date): boolean {
  return toMidnight(a).getTime() === toMidnight(b).getTime();
}

function SingleDayPickersDay(
  props: React.ComponentProps<typeof PickersDay> & { selectedDate?: Date | null }
) {
  const { selectedDate = null, day, selected, sx, ...other } = props;
  const isSelected = selected || (!!selectedDate && isSameDay(day, selectedDate));
  const baseSx = Array.isArray(sx) ? sx : sx ? [sx] : [];
  return (
    <PickersDay
      {...other}
      day={day}
      selected={isSelected}
      sx={[
        ...baseSx,
        isSelected
          ? {
              bgcolor: GREEN,
              color: '#fff',
              borderRadius: '50%',
              '&:hover': { bgcolor: GREEN_HOVER },
              '&.Mui-selected': { bgcolor: GREEN, '&:hover': { bgcolor: GREEN_HOVER } },
            }
          : {},
      ]}
    />
  );
}

export default function Step8PaymentSchedule({
  onBack,
  onNext,
  paymentSchedule,
  setPaymentSchedule,
  payDay,
  setPayDay,
}: Step8PaymentScheduleProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextDisabled =
    !paymentSchedule || (paymentSchedule === 'choose_pay_day' && !payDay);

  const optionSx = (selected: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
    mx: 'auto',
    px: 2,
    py: 1.5,
    borderRadius: '12px',
    border: selected ? '2px solid #1d1d1f' : '1px solid #e0e0e0',
    bgcolor: '#fff',
    cursor: 'pointer',
    '&:hover': { borderColor: selected ? '#1d1d1f' : '#d1d1d6' },
  });

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
              mb: 4,
              letterSpacing: '-0.5px',
              textAlign: 'center',
              px: 1,
            }}
          >
            When will the worker be paid?
          </Typography>

          <FormControl component="fieldset" sx={{ width: '100%', maxWidth: 520 }}>
            <RadioGroup
              value={paymentSchedule ?? ''}
              onChange={(e) => setPaymentSchedule(e.target.value as PaymentScheduleType)}
              sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}
            >
              <Box
                onClick={() => setPaymentSchedule('choose_pay_day')}
                sx={optionSx(paymentSchedule === 'choose_pay_day')}
              >
                <FormControlLabel
                  value="choose_pay_day"
                  control={
                    <Radio
                      sx={{
                        color: '#d1d1d6',
                        '&.Mui-checked': { color: '#1d1d1f' },
                      }}
                    />
                  }
                  label="Choose pay day"
                  sx={{ flex: 1, mr: 0 }}
                />
              </Box>

              <Typography
                sx={{
                  fontWeight: 700,
                  color: '#1d1d1f',
                  fontSize: '0.9375rem',
                  mt: 2,
                  mb: 0.5,
                  width: '100%',
                  maxWidth: 420,
                  textAlign: 'center',
                }}
              >
                On going jobs
              </Typography>

              <Box
                onClick={() => setPaymentSchedule('weekly')}
                sx={optionSx(paymentSchedule === 'weekly')}
              >
                <FormControlLabel
                  value="weekly"
                  control={
                    <Radio
                      sx={{
                        color: '#d1d1d6',
                        '&.Mui-checked': { color: '#1d1d1f' },
                      }}
                    />
                  }
                  label="Weekly payment"
                  sx={{ flex: 1, mr: 0 }}
                />
              </Box>

              <Box
                onClick={() => setPaymentSchedule('fortnightly')}
                sx={optionSx(paymentSchedule === 'fortnightly')}
              >
                <FormControlLabel
                  value="fortnightly"
                  control={
                    <Radio
                      sx={{
                        color: '#d1d1d6',
                        '&.Mui-checked': { color: '#1d1d1f' },
                      }}
                    />
                  }
                  label="Fortnightly payment"
                  sx={{ flex: 1, mr: 0 }}
                />
              </Box>
            </RadioGroup>
          </FormControl>

          {paymentSchedule === 'choose_pay_day' && (
            <Box
              sx={{
                width: '100%',
                maxWidth: 360,
                mt: 4,
                '& .MuiPickersDay-today': { borderColor: GREEN },
                '& .MuiPickersCalendarHeader-root': { flexWrap: 'wrap' },
                '& .MuiDayCalendar-header': { justifyContent: 'space-between' },
              }}
            >
              <DateCalendar
                minDate={today}
                value={payDay}
                slots={{ day: SingleDayPickersDay }}
                slotProps={{ day: { selectedDate: payDay } as object }}
                onChange={(newDate) => {
                  if (!newDate) return;
                  const d = new Date(newDate);
                  d.setHours(0, 0, 0, 0);
                  if (d < today) return;
                  setPayDay(d);
                }}
              />
            </Box>
          )}

          <Paper
            elevation={0}
            sx={{
              mt: 4,
              width: '100%',
              maxWidth: 520,
              p: 2,
              borderRadius: '12px',
              bgcolor: '#f5f5f7',
              border: '1px solid #e5e5ea',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <WarningAmberRoundedIcon sx={{ color: '#b45309', fontSize: 24, mt: 0.25 }} />
              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: '#1d1d1f',
                    fontSize: '0.9375rem',
                    mb: 0.5,
                  }}
                >
                  What happens if I don&apos;t pay the labourer?
                </Typography>
                <Typography
                  sx={{
                    color: '#555555',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                  }}
                >
                  YAKKA cannot get involved. However, if payment is not made, the worker may take
                  legal action, and your reputation on the platform may be affected.
                </Typography>
              </Box>
            </Box>
          </Paper>
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
