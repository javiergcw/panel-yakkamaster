import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Divider, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import StepFooter from './StepFooter';

interface Step4LabourCostsProps {
    onBack: () => void;
    onNext: () => void;
    wage: string;
    setWage: (val: string) => void;
    siteAllowance: string;
    setSiteAllowance: (val: string) => void;
    leadingHandAllowance: string;
    setLeadingHandAllowance: (val: string) => void;
    productivityAllowance: string;
    setProductivityAllowance: (val: string) => void;
    overtimeRate: string;
    setOvertimeRate: (val: string) => void;
    travelAllowance: string;
    setTravelAllowance: (val: string) => void;
}

export default function Step4LabourCosts({
    onBack,
    onNext,
    wage,
    setWage,
    siteAllowance,
    setSiteAllowance,
    leadingHandAllowance,
    setLeadingHandAllowance,
    productivityAllowance,
    setProductivityAllowance,
    overtimeRate,
    setOvertimeRate,
    travelAllowance,
    setTravelAllowance,
}: Step4LabourCostsProps) {

    // Calculations (same logic used when building create-job payload)
    const numWage = parseFloat(wage) || 0;
    const numSite = parseFloat(siteAllowance) || 0;
    const numLeading = parseFloat(leadingHandAllowance) || 0;
    const numProductivity = parseFloat(productivityAllowance) || 0;
    const numOvertime = parseFloat(overtimeRate) || 0;
    const numTravel = parseFloat(travelAllowance) || 0;

    const totalAllowances = numSite + numLeading + numProductivity;
    const baseRate = numWage;

    // According to image: Wage $28.00 -> Service Fee $2.80 (10%)
    const yakkaServiceFee = baseRate * 0.10;
    // GST is 10% of Yakka Service Fee
    const gst = yakkaServiceFee * 0.10;

    // Final Labour Cost (per hour)
    const finalCost = baseRate + totalAllowances + yakkaServiceFee + gst + numOvertime + numTravel;

    const formatCurrency = (val: number) => `$${val.toFixed(2)}`;

    // Modal logic
    const [editModalConfig, setEditModalConfig] = useState<{
        title: string;
        hint?: string;
        initialValue: string;
        onSave: (val: string) => void;
    } | null>(null);
    const [tempValue, setTempValue] = useState<string>('');

    const handleOpenModal = (title: string, initialValue: string, onSave: (val: string) => void, hint?: string) => {
        setTempValue(initialValue);
        setEditModalConfig({ title, hint, initialValue, onSave });
    };

    const handleCloseModal = () => {
        setEditModalConfig(null);
    };

    const handleSaveModal = () => {
        if (editModalConfig) {
            editModalConfig.onSave(tempValue || '0.00');
        }
        handleCloseModal();
    };

    const CostItem = ({ label, value, onClick, required = false, helperText = '' }: any) => (
        <Box sx={{ mb: 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    border: '1px solid #d1d1d6',
                    borderRadius: '8px',
                    bgcolor: '#ffffff',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                    '&:hover': {
                        borderColor: '#1d1d1f'
                    }
                }}
                onClick={onClick}
            >
                <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 600, color: '#1d1d1f', fontSize: '0.95rem' }}>
                        {label}{required ? '*' : ''}
                    </Typography>
                    {helperText && (
                        <Typography sx={{ color: '#86868b', fontSize: '0.75rem', mt: 0.5 }}>
                            {helperText}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600, color: '#86868b', fontSize: '0.95rem', mr: 1 }}>
                        {value ? `$${value}/hr` : '$0.00/hr'}
                    </Typography>
                    <ChevronRightIcon sx={{ color: '#86868b' }} />
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1 }}>
            <Box sx={{
                flexGrow: 1,
                width: '100%',
                maxWidth: 1000,
                margin: '0 auto',
                px: { xs: 2, sm: 4 },
                pt: { xs: 4, md: 6 },
                pb: 4,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 6
            }}>
                {/* Left Column - Form */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#1d1d1f', fontSize: { xs: '1.75rem', md: '2rem' }, mb: 1, letterSpacing: '-0.5px', textAlign: 'center' }}>
                        Calculate your labour costs
                    </Typography>
                    <Typography sx={{ color: '#555555', fontSize: '0.95rem', mb: 4, textAlign: 'center' }}>
                        Tap on and edit each field to calculate your total labour cost.
                    </Typography>

                    <Typography sx={{ fontWeight: 700, color: '#1d1d1f', fontSize: '1rem', mb: 2, textAlign: 'center' }}>
                        Adjustable Costs
                    </Typography>

                    <CostItem
                        label="Wage (Hourly Rate)"
                        value={wage}
                        onClick={() => handleOpenModal('Wage (Hourly Rate)', wage, setWage, 'Enter the hourly rate for the worker.')}
                        required
                        helperText="This field is required."
                    />
                    <CostItem label="Site Allowance" value={siteAllowance} onClick={() => handleOpenModal('Site Allowance', siteAllowance, setSiteAllowance)} />
                    <CostItem label="Leading Hand Allowance" value={leadingHandAllowance} onClick={() => handleOpenModal('Leading Hand Allowance', leadingHandAllowance, setLeadingHandAllowance)} />
                    <CostItem label="Productivity Allowance" value={productivityAllowance} onClick={() => handleOpenModal('Productivity Allowance', productivityAllowance, setProductivityAllowance)} />

                    <Typography sx={{ fontWeight: 700, color: '#1d1d1f', fontSize: '1rem', mt: 4, mb: 0.5, textAlign: 'center' }}>
                        Extras
                    </Typography>
                    <Typography sx={{ color: '#86868b', fontSize: '0.85rem', mb: 2, textAlign: 'center' }}>
                        No additional service fees apply
                    </Typography>

                    <CostItem label="Overtime Rate" value={overtimeRate} onClick={() => handleOpenModal('Overtime Rate', overtimeRate, setOvertimeRate, 'Rate for hours worked beyond the regular schedule.')} helperText="Rate for hours worked beyond the regular schedule. (Hourly Rate)" />
                    {/* Note: Travel Allowance usually isn't /hr, but standardizing for now or just using $ */}
                    <Box sx={{ mb: 2 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: 2,
                                border: '1px solid #d1d1d6',
                                borderRadius: '8px',
                                bgcolor: '#ffffff',
                                cursor: 'pointer',
                                transition: 'border-color 0.2s',
                                '&:hover': {
                                    borderColor: '#1d1d1f'
                                }
                            }}
                            onClick={() => handleOpenModal('Travel Allowance', travelAllowance, setTravelAllowance, 'Compensation for travel-related expenses.')}
                        >
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography sx={{ fontWeight: 600, color: '#1d1d1f', fontSize: '0.95rem' }}>
                                    Travel Allowance
                                </Typography>
                                <Typography sx={{ color: '#86868b', fontSize: '0.75rem', mt: 0.5 }}>
                                    Compensation for travel-related expenses.
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ fontWeight: 600, color: '#86868b', fontSize: '0.95rem', mr: 1 }}>
                                    {travelAllowance ? `$${travelAllowance}` : '$0.00'}
                                </Typography>
                                <ChevronRightIcon sx={{ color: '#86868b' }} />
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Right Column - Summary */}
                <Box sx={{ width: { xs: '100%', md: 380 }, flexShrink: 0 }}>
                    <Paper elevation={0} sx={{ border: '1px solid #e5e5ea', borderRadius: '12px', p: 3, position: 'sticky', top: 24 }}>
                        <Typography sx={{ fontWeight: 800, color: '#1d1d1f', fontSize: '1.2rem', mb: 2 }}>
                            Summary
                        </Typography>

                        <Typography sx={{ fontWeight: 700, color: '#1d1d1f', fontSize: '0.9rem', mb: 1.5 }}>
                            Yakka services
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pl: 2 }}>
                            <Typography sx={{ color: '#555555', fontSize: '0.9rem' }}>Service Fee (Yakka)</Typography>
                            <Typography sx={{ color: '#86868b', fontSize: '0.9rem' }}>{formatCurrency(yakkaServiceFee)}/hr</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, pl: 2 }}>
                            <Typography sx={{ color: '#555555', fontSize: '0.9rem' }}>GST (+10%)</Typography>
                            <Typography sx={{ color: '#86868b', fontSize: '0.9rem' }}>{formatCurrency(gst)}/hr</Typography>
                        </Box>

                        <Divider sx={{ my: 2, borderColor: '#1d1d1f', borderWidth: 1 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography sx={{ fontWeight: 800, color: '#1d1d1f', fontSize: '1.05rem' }}>
                                Final Labour Cost (per hour)
                            </Typography>
                            <Typography sx={{ fontWeight: 800, color: '#1d1d1f', fontSize: '1.25rem' }}>
                                {formatCurrency(finalCost)}/hr
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </Box>

            {/* Footer */}
            <StepFooter
                onBack={onBack}
                onNext={onNext}
                nextDisabled={parseFloat(wage) <= 0}
                progressPercent={60}
            />

            {/* Edit Modal */}
            <Dialog
                open={!!editModalConfig}
                onClose={handleCloseModal}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '16px', p: 1 }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1d1d1f' }}>
                        Edit {editModalConfig?.title}
                    </Typography>
                    <IconButton onClick={handleCloseModal} size="small">
                        <CloseIcon sx={{ color: '#1d1d1f' }} />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {editModalConfig?.hint && (
                        <Typography sx={{ color: '#555555', fontSize: '0.875rem', mb: 2, mt: 1 }}>
                            {editModalConfig.hint}
                        </Typography>
                    )}
                    <TextField
                        autoFocus
                        fullWidth
                        type="number"
                        label="Amount ($)"
                        variant="outlined"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        InputProps={{ inputProps: { step: "0.01", min: "0" } }}
                        sx={{
                            mt: 1,
                            mb: 2,
                            '& .MuiOutlinedInput-root': { borderRadius: '8px' }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSaveModal}
                        sx={{
                            bgcolor: '#66bb6a',
                            color: '#ffffff',
                            py: 1.5,
                            borderRadius: '8px',
                            fontWeight: 700,
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: '#5cb85c',
                                boxShadow: 'none'
                            }
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
