'use client';

import { Box, Typography, Button } from '@mui/material';
import StepFooter from './StepFooter';

interface Step3WorkersProps {
    workersAmount: string | null;
    setWorkersAmount: (val: string | null) => void;
    setIsCustomAmountModalOpen: (val: boolean) => void;
    onBack: () => void;
    onNext: () => void;
}

export default function Step3Workers({
    workersAmount,
    setWorkersAmount,
    setIsCustomAmountModalOpen,
    onBack,
    onNext
}: Step3WorkersProps) {
    const predefinedAmounts = ['1', '2', '3', '4', '5'];
    const isMoreThan5Selected = workersAmount && parseInt(workersAmount) > 5;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1 }}>
            {/* Step 3 Content */}
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
                        mb: 6,
                        letterSpacing: '-0.5px',
                        textAlign: 'center'
                    }}
                >
                    How many labourers do you need?
                </Typography>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 2,
                        width: '100%',
                        maxWidth: 600
                    }}
                >
                    {predefinedAmounts.map((amount) => (
                        <Button
                            key={amount}
                            variant="outlined"
                            onClick={() => setWorkersAmount(amount)}
                            sx={{
                                py: 2,
                                borderRadius: '8px',
                                borderColor: workersAmount === amount ? '#66bb6a' : '#d1d1d6',
                                bgcolor: workersAmount === amount ? '#66bb6a' : 'transparent',
                                color: workersAmount === amount ? '#ffffff' : '#1d1d1f',
                                fontWeight: 600,
                                fontSize: '1rem',
                                textTransform: 'none',
                                '&:hover': {
                                    borderColor: workersAmount === amount ? '#66bb6a' : '#1d1d1f',
                                    bgcolor: workersAmount === amount ? '#66bb6a' : '#fafafa',
                                }
                            }}
                        >
                            {amount}
                        </Button>
                    ))}
                    <Button
                        variant="outlined"
                        onClick={() => setIsCustomAmountModalOpen(true)}
                        sx={{
                            py: 2,
                            borderRadius: '8px',
                            borderColor: isMoreThan5Selected ? '#66bb6a' : '#d1d1d6',
                            bgcolor: isMoreThan5Selected ? '#66bb6a' : 'transparent',
                            color: isMoreThan5Selected ? '#ffffff' : '#1d1d1f',
                            fontWeight: 600,
                            fontSize: '1rem',
                            textTransform: 'none',
                            '&:hover': {
                                borderColor: isMoreThan5Selected ? '#66bb6a' : '#1d1d1f',
                                bgcolor: isMoreThan5Selected ? '#66bb6a' : '#fafafa',
                            }
                        }}
                    >
                        {isMoreThan5Selected ? workersAmount : 'More than 5'}
                    </Button>
                </Box>
            </Box>

            {/* Footer for Step 3 */}
            <StepFooter
                onBack={onBack}
                onNext={onNext}
                nextDisabled={!workersAmount}
                progressPercent={40}
            />
        </Box>
    );
}
