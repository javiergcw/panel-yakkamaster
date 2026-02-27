import React from 'react';
import { Box, Typography, TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StepFooter from './StepFooter';

interface Step2SkillsProps {
    searchSkill: string;
    setSearchSkill: (val: string) => void;
    filteredSkills: string[];
    selectedSkill: string | null;
    setSelectedSkill: (skill: string) => void;
    onBack: () => void;
    onNext: () => void;
}

export default function Step2Skills({
    searchSkill,
    setSearchSkill,
    filteredSkills,
    selectedSkill,
    setSelectedSkill,
    onBack,
    onNext
}: Step2SkillsProps) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1 }}>
            {/* Step 2 Content */}
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
                    What kind of worker do you need?
                </Typography>
                <Typography
                    sx={{
                        color: '#555555',
                        fontSize: '1rem',
                        fontWeight: 400,
                        mb: 4,
                        textAlign: 'center'
                    }}
                >
                    You can only choose 1 skill
                </Typography>

                {/* Search Bar */}
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search for a type of labour"
                    value={searchSkill}
                    onChange={(e) => setSearchSkill(e.target.value)}
                    sx={{
                        width: '100%',
                        maxWidth: { xs: '100%', sm: 800 },
                        mb: { xs: 4, sm: 6 },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            bgcolor: '#f5f5f7',
                            '& fieldset': {
                                borderColor: 'transparent',
                            },
                            '&:hover fieldset': {
                                borderColor: '#e5e5ea',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#66bb6a', // Main green focus
                            },
                            p: 0,
                        },
                        '& .MuiOutlinedInput-input': {
                            py: 1.5,
                            px: 2,
                        }
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end" sx={{ m: 0, height: '100%', maxHeight: 'none' }}>
                                <Box
                                    sx={{
                                        bgcolor: '#66bb6a', // Main green
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        px: 2,
                                        borderTopRightRadius: '8px',
                                        borderBottomRightRadius: '8px',
                                        color: '#ffffff',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <SearchIcon />
                                </Box>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Skills Pills */}
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: { xs: 1, sm: 1.5 },
                    justifyContent: 'center',
                    width: '100%',
                    maxWidth: 1400,
                    mb: { xs: 3, sm: 4 }
                }}>
                    {filteredSkills.map((skill) => {
                        const isSelected = selectedSkill === skill;
                        return (
                            <Button
                                key={skill}
                                onClick={() => setSelectedSkill(skill)}
                                sx={{
                                    bgcolor: isSelected ? '#66bb6a' : '#f5f5f7',
                                    color: isSelected ? '#ffffff' : '#555555',
                                    borderRadius: '24px',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    fontSize: { xs: '0.8125rem', sm: '0.85rem' },
                                    px: { xs: 2, sm: 2.5 },
                                    py: { xs: 0.5, sm: 0.75 },
                                    minWidth: 0,
                                    boxShadow: 'none',
                                    border: '1px solid transparent',
                                    '&:hover': {
                                        bgcolor: isSelected ? '#5cb85c' : '#e8e8ed',
                                        boxShadow: 'none',
                                    }
                                }}
                            >
                                {skill}
                            </Button>
                        );
                    })}
                </Box>
            </Box>

            {/* Footer for Step 2 */}
            <StepFooter
                onBack={onBack}
                onNext={onNext}
                nextDisabled={!selectedSkill}
                progressPercent={20}
            />
        </Box>
    );
}
