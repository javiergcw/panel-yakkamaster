'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StepFooter from './StepFooter';
import { FetchErrorState } from '@/components/FetchErrorState';
import type { Skill } from '@/modules/masters';

/** Display value when a subcategory is selected (used for selectedSkill comparison). */
export function skillDisplayLabel(categoryName: string, subcategoryName: string): string {
  return `${categoryName} – ${subcategoryName}`;
}

interface Step2SkillsProps {
  skills: Skill[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  searchSkill: string;
  setSearchSkill: (val: string) => void;
  selectedSkill: string | null;
  setSelectedSkill: (skill: string | null) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step2Skills({
  skills,
  loading,
  error,
  onRetry,
  searchSkill,
  setSearchSkill,
  selectedSkill,
  setSelectedSkill,
  onBack,
  onNext,
}: Step2SkillsProps) {
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  const searchLower = searchSkill.trim().toLowerCase();
  const filteredCategories = useMemo(() => {
    if (!searchLower) return skills;
    return skills.filter(
      (s) =>
        s.name.toLowerCase().includes(searchLower) ||
        s.subcategories.some((sub) => sub.name.toLowerCase().includes(searchLower))
    );
  }, [skills, searchLower]);

  /** When a skill is selected, the category it belongs to (only show its subcategories). */
  const selectedCategory = useMemo(() => {
    if (!selectedSkill) return null;
    return (
      skills.find((cat) =>
        cat.subcategories.some(
          (sub) => skillDisplayLabel(cat.name, sub.name) === selectedSkill
        )
      ) ?? null
    );
  }, [skills, selectedSkill]);

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
            fontSize: { xs: '1.75rem', md: '2rem' },
            mb: 1,
            letterSpacing: '-0.5px',
            textAlign: 'center',
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
            textAlign: 'center',
          }}
        >
          Choose a category, then select one skill (subcategory).
        </Typography>

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
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: '#e5e5ea' },
              '&.Mui-focused fieldset': { borderColor: '#66bb6a' },
              p: 0,
            },
            '& .MuiOutlinedInput-input': { py: 1.5, px: 2 },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ m: 0, height: '100%', maxHeight: 'none' }}>
                <Box
                  sx={{
                    bgcolor: '#66bb6a',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 2,
                    borderTopRightRadius: '8px',
                    borderBottomRightRadius: '8px',
                    color: '#ffffff',
                  }}
                >
                  <SearchIcon />
                </Box>
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#66bb6a' }} />
          </Box>
        ) : error ? (
          <FetchErrorState message={error} onRetry={onRetry} />
        ) : selectedCategory ? (
          /* Skill selected: show category and subcategory as text + link to go back */
          (() => {
            const category = selectedCategory;
            const selectedSub = category.subcategories.find(
              (sub) => skillDisplayLabel(category.name, sub.name) === selectedSkill
            );
            const subcategoryName = selectedSub?.name ?? selectedSkill;
            return (
              <Box sx={{ textAlign: 'center', width: '100%', maxWidth: 1400 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: '#1d1d1f',
                    fontSize: { xs: '1rem', sm: '1.0625rem' },
                    mb: 0.5,
                  }}
                >
                  {category.name}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: '#555555',
                    fontSize: { xs: '0.9375rem', sm: '1rem' },
                    mb: 2,
                  }}
                >
                  {subcategoryName}
                </Typography>
                <Button
                  onClick={() => setSelectedSkill(null)}
                  sx={{
                    color: '#86868b',
                    fontSize: '0.8125rem',
                    textTransform: 'none',
                    p: 0,
                    minWidth: 0,
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: '#66bb6a',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Change subcategory
                </Button>
              </Box>
            );
          })()
        ) : expandedCategoryId ? (
          /* Category selected: show only this category (pill) + its subcategories */
          (() => {
            const category = skills.find((c) => c.id === expandedCategoryId);
            if (!category) return null;
            const subcategories = category.subcategories || [];
            const filteredSubs = searchLower
              ? subcategories.filter((sub) => sub.name.toLowerCase().includes(searchLower))
              : subcategories;
            const pillStyle = {
              borderRadius: '24px',
              textTransform: 'none' as const,
              fontWeight: 500,
              fontSize: { xs: '0.8125rem', sm: '0.85rem' },
              px: { xs: 2, sm: 2.5 },
              py: { xs: 0.5, sm: 0.75 },
              minWidth: 0,
              boxShadow: 'none',
              border: '1px solid transparent',
            };
            return (
              <>
                {/* Selected category as text + link to change */}
                <Box sx={{ textAlign: 'center', width: '100%', mb: 2 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: '#1d1d1f',
                      fontSize: { xs: '1rem', sm: '1.0625rem' },
                    }}
                  >
                    {category.name}
                  </Typography>
                  <Button
                    onClick={() => setExpandedCategoryId(null)}
                    sx={{
                      color: '#86868b',
                      fontSize: '0.8125rem',
                      textTransform: 'none',
                      p: 0,
                      minWidth: 0,
                      mt: 0.5,
                      '&:hover': { bgcolor: 'transparent', color: '#66bb6a', textDecoration: 'underline' },
                    }}
                  >
                    Change category
                  </Button>
                </Box>
                {/* Subcategories of selected category */}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: { xs: 1, sm: 1.5 },
                    justifyContent: 'center',
                    width: '100%',
                    maxWidth: 1400,
                    mb: { xs: 3, sm: 4 },
                  }}
                >
                  {filteredSubs.length === 0 ? (
                    <Typography sx={{ color: '#86868b', fontSize: '0.9375rem' }}>
                      No subcategories match your search.
                    </Typography>
                  ) : (
                    filteredSubs.map((sub) => {
                      const label = skillDisplayLabel(category.name, sub.name);
                      const isSelected = selectedSkill === label;
                      return (
                        <Button
                          key={sub.id}
                          onClick={() => setSelectedSkill(label)}
                          sx={{
                            ...pillStyle,
                            bgcolor: isSelected ? '#66bb6a' : '#f5f5f7',
                            color: isSelected ? '#ffffff' : '#555555',
                            '&:hover': {
                              bgcolor: isSelected ? '#5cb85c' : '#e8e8ed',
                              boxShadow: 'none',
                            },
                          }}
                        >
                          {sub.name}
                        </Button>
                      );
                    })
                  )}
                </Box>
              </>
            );
          })()
        ) : (
          /* No category selected: show all category pills */
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 1, sm: 1.5 },
              justifyContent: 'center',
              width: '100%',
              maxWidth: 1400,
              mb: { xs: 3, sm: 4 },
            }}
          >
            {filteredCategories.length === 0 ? (
              <Typography sx={{ color: '#86868b', fontSize: '0.9375rem' }}>
                No categories match your search.
              </Typography>
            ) : (
              filteredCategories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setExpandedCategoryId(category.id)}
                  sx={{
                    bgcolor: '#f5f5f7',
                    color: '#555555',
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
                      bgcolor: '#e8e8ed',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {category.name}
                </Button>
              ))
            )}
          </Box>
        )}
      </Box>

      <StepFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!selectedSkill}
        progressPercent={20}
      />
    </Box>
  );
}
