'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Link,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {
  GetOrganizationUseCase,
  UpdateOrganizationUseCase,
  InstitutionDashboardService,
  type OrganizationDetailResponse,
} from '@/modules/institution';
import { HttpError } from '@/services/http';
import { FetchErrorState } from '@/components/FetchErrorState';

const service = new InstitutionDashboardService();
const getOrganizationUseCase = new GetOrganizationUseCase(service);
const updateOrganizationUseCase = new UpdateOrganizationUseCase(service);

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

const label = (s: string) => (
  <Typography sx={{ color: '#86868b', fontSize: '0.8125rem', mb: 1, fontWeight: 500 }}>
    {s}
  </Typography>
);
const value = (s: string | null | undefined, fallback = '—') => (
  <Typography sx={{ color: '#1d1d1f', fontSize: '0.9375rem', mb: 3 }}>
    {s ?? fallback}
  </Typography>
);

export default function OrganizationPage() {
  const [data, setData] = useState<OrganizationDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);

  const loadOrganization = () => {
    setError(null);
    setLoading(true);
    getOrganizationUseCase
      .execute()
      .then((res) => {
        setData(res);
        setEditName(res.name);
        setEditDescription(res.description ?? '');
        setEditWebsite(res.website ?? '');
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load organization')
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrganization();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    const formData = new FormData();
    formData.append('name', editName.trim());
    formData.append('description', editDescription.trim());
    formData.append('website', editWebsite.trim());
    if (editFile) formData.append('file', editFile);
    try {
      const updated = await updateOrganizationUseCase.execute(formData);
      setData(updated);
      setEditFile(null);
      setShowEdit(false);
    } catch (err) {
      let message = 'Failed to update organization';
      if (err instanceof HttpError && err.body && typeof err.body === 'object') {
        const body = err.body as { message?: string; error?: string };
        message = body.message ?? body.error ?? message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 320,
        }}
      >
        <CircularProgress sx={{ color: '#66bb6a' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <FetchErrorState
        message={error}
        onRetry={loadOrganization}
      />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto' }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 300,
          color: '#1d1d1f',
          fontSize: '1.75rem',
          letterSpacing: '-0.5px',
          mb: 4,
        }}
      >
        Organization
      </Typography>

      <Card
        sx={{
          bgcolor: '#ffffff',
          borderRadius: '16px',
          boxShadow: 'none',
          border: '1px solid #f5f5f7',
          p: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                color: '#1d1d1f',
                fontSize: '1.5rem',
                letterSpacing: '-0.5px',
                mb: 1,
              }}
            >
              {data.name}
            </Typography>
            <Typography sx={{ color: '#86868b', fontSize: '0.875rem' }}>
              ID: {data.id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              onClick={() => setShowEdit(true)}
              aria-label="Edit organization"
              sx={{
                color: '#86868b',
                '&:hover': { color: '#66bb6a', bgcolor: 'rgba(102, 187, 106, 0.08)' },
              }}
            >
              <EditIcon />
            </IconButton>
            <Chip
              label={data.is_active ? 'Active' : 'Inactive'}
              sx={{
                bgcolor: data.is_active ? '#66bb6a' : '#d32f2f',
                color: '#fff',
                fontSize: '0.75rem',
                height: 28,
                fontWeight: 400,
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: '#f5f5f7' }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
          <Box>
            {label('Description')}
            {value(data.description)}
            {label('Website')}
            {data.website ? (
              <Typography sx={{ color: '#1d1d1f', fontSize: '0.9375rem', mb: 3 }}>
                <Link
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: '#66bb6a', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  {data.website}
                </Link>
              </Typography>
            ) : (
              value(null)
            )}
          </Box>
          <Box>
            {label('Created at')}
            {value(formatDate(data.created_at))}
            {label('Updated at')}
            {value(formatDate(data.updated_at))}
          </Box>
        </Box>
      </Card>

      {showEdit && (
      <Card
        sx={{
          bgcolor: '#ffffff',
          borderRadius: '16px',
          boxShadow: 'none',
          border: '1px solid #f5f5f7',
          p: 4,
          mt: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              color: '#1d1d1f',
              fontSize: '1.125rem',
            }}
          >
            Edit organization
          </Typography>
          <Button
            size="small"
            onClick={() => setShowEdit(false)}
            sx={{ color: '#86868b', textTransform: 'none' }}
          >
            Close
          </Button>
        </Box>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 480 }}>
            <TextField
              label="Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
              required
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: '#f5f5f7',
                },
              }}
            />
            <TextField
              label="Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: '#f5f5f7',
                },
              }}
            />
            <TextField
              label="Website"
              value={editWebsite}
              onChange={(e) => setEditWebsite(e.target.value)}
              fullWidth
              size="small"
              placeholder="https://"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: '#f5f5f7',
                },
              }}
            />
            <Box>
              <Typography sx={{ color: '#86868b', fontSize: '0.8125rem', mb: 1, fontWeight: 500 }}>
                Logo (jpg, jpeg, png, gif, webp)
              </Typography>
              <Button
                variant="outlined"
                component="label"
                size="small"
                sx={{
                  borderRadius: '12px',
                  borderColor: '#e0e0e0',
                  color: '#1d1d1f',
                  textTransform: 'none',
                }}
              >
                {editFile ? editFile.name : 'Choose file'}
                <input
                  type="file"
                  hidden
                  accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
                  onChange={(e) => setEditFile(e.target.files?.[0] ?? null)}
                />
              </Button>
              {editFile && (
                <Typography component="span" sx={{ ml: 2, fontSize: '0.875rem', color: '#86868b' }}>
                  Optional: clear by choosing again
                </Typography>
              )}
            </Box>
            {submitError && (
              <Alert severity="error" sx={{ borderRadius: '12px' }}>
                {submitError}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{
                bgcolor: '#66bb6a',
                color: '#fff',
                borderRadius: '12px',
                textTransform: 'none',
                py: 1.25,
                '&:hover': { bgcolor: '#5cb860' },
              }}
            >
              {submitting ? 'Saving…' : 'Save'}
            </Button>
          </Box>
        </form>
      </Card>
      )}
    </Box>
  );
}
