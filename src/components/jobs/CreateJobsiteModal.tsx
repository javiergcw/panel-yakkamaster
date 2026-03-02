'use client';

import { useState } from 'react';
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
import { CreateJobsiteUseCase, InstitutionDashboardService } from '@/modules/institution';

const service = new InstitutionDashboardService();
const createJobsiteUseCase = new CreateJobsiteUseCase(service);

interface CreateJobsiteModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
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

export default function CreateJobsiteModal({ open, onClose, onSuccess }: CreateJobsiteModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (!submitting) {
      setForm(defaultForm);
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
    const address = form.address.trim();
    if (address.length < 10) {
      setError('Address must be at least 10 characters.');
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
      await createJobsiteUseCase.execute({
        address,
        latitude: form.latitude,
        longitude: form.longitude,
        city: form.city.trim(),
        suburb: form.suburb.trim(),
        description: form.description.trim() || undefined,
        phone: form.phone.trim() || undefined,
      });
      onSuccess?.();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create jobsite');
    } finally {
      setSubmitting(false);
    }
  };

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
          Create new Jobsite
        </Typography>
        <IconButton onClick={handleClose} size="small" disabled={submitting}>
          <CloseIcon sx={{ color: '#1d1d1f' }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: '#555555', fontSize: '0.875rem', mb: 3, mt: 1 }}>
          Add a new location where the worker should arrive.
        </Typography>

        <TextField
          fullWidth
          required
          label="Address (min. 10 characters)"
          variant="outlined"
          value={form.address}
          onChange={handleChange('address')}
          error={form.address.length > 0 && form.address.length < 10}
          helperText={form.address.length > 0 && form.address.length < 10 ? 'At least 10 characters' : undefined}
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
          placeholder="e.g. 61212345678"
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description (optional)"
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
            'Save jobsite'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
