'use client';

import { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { UpdateJobsiteUseCase, InstitutionDashboardService } from '@/modules/institution';
import type { Jobsite } from '@/modules/institution';

const service = new InstitutionDashboardService();
const updateJobsiteUseCase = new UpdateJobsiteUseCase(service);

interface EditJobsiteModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  jobsite: Jobsite | null;
}

const defaultForm = {
  address: '',
  latitude: 0,
  longitude: 0,
  city: '',
  suburb: '',
  description: '',
  phone: '',
};

export default function EditJobsiteModal({ open, onClose, onSuccess, jobsite }: EditJobsiteModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && jobsite) {
      setForm({
        address: jobsite.address ?? '',
        latitude: jobsite.latitude ?? 0,
        longitude: jobsite.longitude ?? 0,
        city: jobsite.city ?? '',
        suburb: jobsite.suburb ?? '',
        description: jobsite.description ?? '',
        phone: (jobsite as { phone?: string }).phone ?? '',
      });
      setError(null);
    }
  }, [open, jobsite]);

  const handleClose = () => {
    if (!submitting) {
      setError(null);
      onClose();
    }
  };

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (field === 'latitude' || field === 'longitude') {
      const n = parseFloat(v);
      setForm((prev) => ({ ...prev, [field]: isNaN(n) ? 0 : n }));
    } else {
      setForm((prev) => ({ ...prev, [field]: v }));
    }
    setError(null);
  };

  const handleSubmit = async () => {
    if (!jobsite) return;
    const address = form.address.trim();
    if (address.length < 10) {
      setError('Address must be at least 10 characters.');
      return;
    }
    if (address.length > 500) {
      setError('Address must be at most 500 characters.');
      return;
    }
    if (!form.city.trim()) {
      setError('City is required.');
      return;
    }
    if (!form.suburb.trim()) {
      setError('Suburb is required.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await updateJobsiteUseCase.execute(jobsite.id, {
        address,
        city: form.city.trim(),
        suburb: form.suburb.trim(),
        description: form.description.trim() || null,
        latitude: form.latitude,
        longitude: form.longitude,
        phone: form.phone.trim(),
      });
      onSuccess?.();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update jobsite');
    } finally {
      setSubmitting(false);
    }
  };

  if (!jobsite) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '16px', p: 1 },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1d1d1f' }}>
          Edit Jobsite
        </Typography>
        <IconButton onClick={handleClose} size="small" disabled={submitting}>
          <CloseIcon sx={{ color: '#1d1d1f' }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: '#555555', fontSize: '0.875rem', mb: 3, mt: 1 }}>
          Update the location details. Leave description empty to clear it.
        </Typography>

        <TextField
          fullWidth
          required
          label="Address (min. 10, max. 500 characters)"
          variant="outlined"
          value={form.address}
          onChange={handleChange('address')}
          error={(form.address.length > 0 && form.address.length < 10) || form.address.length > 500}
          helperText={
            form.address.length > 0 && form.address.length < 10
              ? 'At least 10 characters'
              : form.address.length > 500
                ? 'At most 500 characters'
                : undefined
          }
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />

        <TextField
          fullWidth
          required
          label="City"
          variant="outlined"
          value={form.city}
          onChange={handleChange('city')}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />

        <TextField
          fullWidth
          required
          label="Suburb"
          variant="outlined"
          value={form.suburb}
          onChange={handleChange('suburb')}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />

        <TextField
          fullWidth
          type="number"
          label="Latitude"
          variant="outlined"
          value={form.latitude === 0 ? '' : form.latitude}
          onChange={handleChange('latitude')}
          inputProps={{ step: 'any' }}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />

        <TextField
          fullWidth
          type="number"
          label="Longitude"
          variant="outlined"
          value={form.longitude === 0 ? '' : form.longitude}
          onChange={handleChange('longitude')}
          inputProps={{ step: 'any' }}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />

        <TextField
          fullWidth
          label="Phone"
          variant="outlined"
          value={form.phone}
          onChange={handleChange('phone')}
          placeholder="e.g. 61298765432"
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description (optional, leave empty to clear)"
          variant="outlined"
          value={form.description}
          onChange={handleChange('description')}
          placeholder="e.g. Enter through the back gate, ask for John."
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />

        {error && (
          <Alert severity="error" sx={{ borderRadius: '8px', mb: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={
            submitting ||
            form.address.trim().length < 10 ||
            form.address.trim().length > 500 ||
            !form.city.trim() ||
            !form.suburb.trim()
          }
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
              boxShadow: 'none',
            },
            '&.Mui-disabled': {
              bgcolor: '#f5f5f7',
              color: '#bdbdbd',
            },
          }}
        >
          {submitting ? (
            <>
              <CircularProgress size={20} sx={{ color: 'inherit', mr: 1 }} />
              Saving…
            </>
          ) : (
            'Update jobsite'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
