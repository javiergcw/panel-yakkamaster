import React from 'react';
import { Box, Typography, Button, Paper, Checkbox, FormControlLabel } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import StepFooter from './StepFooter';

const GREEN = '#66bb6a';
const GREEN_HOVER = '#5cb860';

function toMidnight(d: Date): Date {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}

function isSameDay(a: Date, b: Date): boolean {
    return toMidnight(a).getTime() === toMidnight(b).getTime();
}

function isInRange(day: Date, start: Date | null, end: Date | null): boolean {
    if (!start || !end) return false;
    const d = toMidnight(day);
    const s = toMidnight(start);
    const e = toMidnight(end);
    return d >= s && d <= e;
}

function isFirstInRange(day: Date, start: Date | null, end: Date | null): boolean {
    return !!start && isSameDay(day, start);
}

function isLastInRange(day: Date, start: Date | null, end: Date | null): boolean {
    return !!end && isSameDay(day, end);
}

function RangePickersDay(
    props: React.ComponentProps<typeof PickersDay> & { startDate?: Date | null; endDate?: Date | null }
) {
    const { startDate = null, endDate = null, day, selected, sx, ...other } = props;
    const inRange = isInRange(day, startDate, endDate);
    const isSelected = selected || inRange;
    const first = isFirstInRange(day, startDate, endDate);
    const last = isLastInRange(day, startDate, endDate);
    const onlyOneDay = startDate && endDate && isSameDay(startDate, endDate);
    const baseSx = Array.isArray(sx) ? sx : sx ? [sx] : [];

    let rangeShape: object = {};
    if (inRange || selected) {
        if (onlyOneDay) {
            rangeShape = { borderRadius: '50%' };
        } else if (first && last) {
            rangeShape = { borderRadius: '50%' };
        } else if (first) {
            rangeShape = {
                borderRadius: 0,
                borderTopLeftRadius: '50%',
                borderBottomLeftRadius: '50%',
            };
        } else if (last) {
            rangeShape = {
                borderRadius: 0,
                borderTopRightRadius: '50%',
                borderBottomRightRadius: '50%',
            };
        } else {
            rangeShape = { borderRadius: 0 };
        }
    }

    return (
        <PickersDay
            {...other}
            day={day}
            selected={isSelected}
            disableMargin={!!(startDate && endDate)}
            sx={[
                ...baseSx,
                inRange || selected
                    ? {
                          bgcolor: GREEN,
                          color: '#fff',
                          '&:hover': { bgcolor: GREEN_HOVER },
                          '&.Mui-selected': { bgcolor: GREEN, '&:hover': { bgcolor: GREEN_HOVER } },
                          ...rangeShape,
                      }
                    : {},
            ]}
        />
    );
}

interface Step5DatesProps {
    onBack: () => void;
    onNext: () => void;
    startDate: Date | null;
    setStartDate: (date: Date | null) => void;
    endDate: Date | null;
    setEndDate: (date: Date | null) => void;
    isOngoing: boolean;
    setIsOngoing: (val: boolean) => void;
    workSaturdays: boolean;
    setWorkSaturdays: (val: boolean) => void;
    workSundays: boolean;
    setWorkSundays: (val: boolean) => void;
}

export default function Step5Dates({
    onBack,
    onNext,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isOngoing,
    setIsOngoing,
    workSaturdays,
    setWorkSaturdays,
    workSundays,
    setWorkSundays
}: Step5DatesProps) {

    // A simple handler for the single DateCalendar to act somewhat like a range selector
    // For a true range picker without MUI Pro, we can just let them pick a start date then end date,
    // or just use 2 standard DatePickers. The design shows a single open calendar.

    // Let's use standard DateCalendar and manage start/end manually if needed, 
    // but a simpler approach for the exact UI is to just show a generic calendar.
    // For now, let's just let them pick 'startDate' on the calendar and maybe add a second for 'endDate'.
    // To match the UI tightly, we'll just have one DateCalendar that sets Start Date.

    const formatDate = (date: Date | null) => {
        if (!date) return '-';
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
                            fontSize: { xs: '1.75rem', md: '2rem' },
                            mb: 1,
                            letterSpacing: '-0.5px',
                            textAlign: 'center'
                        }}
                    >
                        When is the job?
                    </Typography>
                    <Typography
                        sx={{
                            color: '#555555',
                            fontSize: '1rem',
                            fontWeight: 400,
                            mb: 6,
                            textAlign: 'center'
                        }}
                    >
                        Select the start and end date
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 6 }, alignItems: 'flex-start', justifyContent: 'center', width: '100%', maxWidth: 900, overflow: 'hidden' }}>
                        {/* Left Side: Calendar & Checkboxes */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: { xs: '100%', md: 380 } }}>
                            {/* Standard MUI Calendar */}
                            <Box sx={{
                                width: '100%',
                                maxWidth: 360,
                                '& .MuiPickersDay-today': { borderColor: GREEN },
                                '& .MuiPickersCalendarHeader-root': { flexWrap: 'wrap' },
                                '& .MuiDayCalendar-header': { justifyContent: 'space-between' }
                            }}>
                                <DateCalendar
                                    minDate={today}
                                    value={startDate}
                                    slots={{ day: RangePickersDay }}
                                    slotProps={{ day: { startDate, endDate } as object }}
                                    onChange={(newDate) => {
                                        if (!newDate) return;
                                        const d = new Date(newDate);
                                        d.setHours(0, 0, 0, 0);
                                        if (d < today) return;
                                        if (!startDate || (startDate && endDate)) {
                                            setStartDate(d);
                                            setEndDate(null);
                                        } else {
                                            if (startDate && d < startDate) {
                                                setStartDate(d);
                                            } else {
                                                setEndDate(d);
                                            }
                                        }
                                    }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, sm: 3 }, mt: 3, justifyContent: 'center' }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={workSaturdays}
                                            onChange={(e) => setWorkSaturdays(e.target.checked)}
                                            sx={{ color: '#d1d1d6', '&.Mui-checked': { color: GREEN } }}
                                        />
                                    }
                                    label={<Typography sx={{ fontSize: '0.9rem', color: '#1d1d1f', fontWeight: 500 }}>Work on Saturdays</Typography>}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={workSundays}
                                            onChange={(e) => setWorkSundays(e.target.checked)}
                                            sx={{ color: '#d1d1d6', '&.Mui-checked': { color: GREEN } }}
                                        />
                                    }
                                    label={<Typography sx={{ fontSize: '0.9rem', color: '#1d1d1f', fontWeight: 500 }}>Work on Sundays</Typography>}
                                />
                            </Box>
                        </Box>

                        {/* Right Side: Summary Card */}
                        <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: 320 }, alignSelf: { xs: 'stretch', md: 'flex-start' } }}>
                            <Paper elevation={0} sx={{ border: '1px solid #e5e5ea', borderRadius: '12px', p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                                    <Typography sx={{ color: '#555555', fontSize: '0.95rem', fontWeight: 500 }}>Start Date</Typography>
                                    <Typography sx={{ color: '#1d1d1f', fontSize: '0.95rem', fontWeight: 800 }}>{formatDate(startDate)}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                                    <Typography sx={{ color: '#555555', fontSize: '0.95rem', fontWeight: 500 }}>End date</Typography>
                                    <Typography sx={{ color: '#1d1d1f', fontSize: '0.95rem', fontWeight: 800 }}>{formatDate(endDate)}</Typography>
                                </Box>

                                <Box sx={{ pt: 1, borderTop: '1px solid #f5f5f7' }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={isOngoing}
                                                onChange={(e) => setIsOngoing(e.target.checked)}
                                                sx={{ color: '#d1d1d6', '&.Mui-checked': { color: GREEN } }}
                                            />
                                        }
                                        label={<Typography sx={{ fontSize: '0.9rem', color: '#555555', fontWeight: 500 }}>Ongoing work?</Typography>}
                                    />
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                </Box>

                {/* Footer for Step 5 */}
                <StepFooter
                    onBack={onBack}
                    onNext={onNext}
                    nextDisabled={!startDate || (!endDate && !isOngoing)}
                    progressPercent={80}
                />
            </Box>
        </LocalizationProvider>
    );
}
