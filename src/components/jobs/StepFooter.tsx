import React from 'react';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface StepFooterProps {
    onBack: () => void;
    onNext: () => void;
    nextDisabled: boolean;
    progressPercent: number; // e.g., 20, 40, 60, 80, 100
    nextText?: string;
}

export default function StepFooter({
    onBack,
    onNext,
    nextDisabled,
    progressPercent,
    nextText = "Next",
}: StepFooterProps) {
    return (
        <Box sx={{ width: '100%', mt: 'auto' }}>
            {/* Progress Bar */}
            <Box sx={{ width: '100%', height: '4px', bgcolor: '#e5e5ea', position: 'relative' }}>
                <Box sx={{ width: `${progressPercent}%`, height: '100%', bgcolor: '#66bb6a', position: 'absolute', top: 0, left: 0, transition: 'width 0.3s ease' }} />
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1,
                px: { xs: 2, sm: 4, md: 8 },
                py: { xs: 2, sm: 3 },
                bgcolor: '#ffffff'
            }}>
                <Button
                    startIcon={<ArrowBackIcon fontSize="small" />}
                    onClick={onBack}
                    sx={{
                        color: '#1d1d1f',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: { xs: '0.875rem', sm: '0.95rem' },
                        minWidth: 0,
                        px: { xs: 1, sm: 2 },
                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                    }}
                >
                    Back
                </Button>

                <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon fontSize="small" />}
                    onClick={onNext}
                    disabled={nextDisabled}
                    sx={{
                        bgcolor: '#66bb6a',
                        color: '#ffffff',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 700,
                        px: { xs: 2, sm: 3 },
                        py: { xs: 0.875, sm: 1 },
                        fontSize: { xs: '0.875rem', sm: '0.95rem' },
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
                    {nextText}
                </Button>
            </Box>
        </Box>
    );
}
