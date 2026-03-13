'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  Chip,
  Divider,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Alert,
  Link as MuiLink,
  IconButton,
  Skeleton,
} from '@mui/material';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import {
  GetInstitutionProfileUseCase,
  UpdateInstitutionProfileUseCase,
  GetOrganizationUseCase,
  UpdateOrganizationUseCase,
  InstitutionDashboardService,
  type InstitutionProfileResponse,
  type OrganizationDetailResponse,
} from '@/modules/institution';
import { HttpError } from '@/services/http';
import {
  GetCompaniesUseCase,
  CompaniesService,
  type Company,
} from '@/modules/companies';
import { FetchErrorState } from '@/components/FetchErrorState';

const service = new InstitutionDashboardService();
const getProfileUseCase = new GetInstitutionProfileUseCase(service);
const updateProfileUseCase = new UpdateInstitutionProfileUseCase(service);
const getOrganizationUseCase = new GetOrganizationUseCase(service);
const updateOrganizationUseCase = new UpdateOrganizationUseCase(service);
const companiesService = new CompaniesService();
const getCompaniesUseCase = new GetCompaniesUseCase(companiesService);

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
  <Typography
    sx={{
      color: '#86868b',
      fontSize: { xs: '0.75rem', sm: '0.8125rem' },
      mb: 1,
      fontWeight: 500,
    }}
  >
    {s}
  </Typography>
);
const value = (s: string | null | undefined, fallback = '—') => (
  <Typography
    sx={{
      color: '#1d1d1f',
      fontSize: { xs: '0.875rem', sm: '0.9375rem' },
      mb: 3,
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
    }}
  >
    {s ?? fallback}
  </Typography>
);

export default function ProfilePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [data, setData] = useState<InstitutionProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignCompanyOpen, setAssignCompanyOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companiesError, setCompaniesError] = useState<string | null>(null);
  const [companySearch, setCompanySearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [assignSubmitting, setAssignSubmitting] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  const [orgData, setOrgData] = useState<OrganizationDetailResponse | null>(null);
  const [orgLoading, setOrgLoading] = useState(true);
  const [orgError, setOrgError] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const [orgSubmitting, setOrgSubmitting] = useState(false);
  const [orgSubmitError, setOrgSubmitError] = useState<string | null>(null);
  const [showOrgEdit, setShowOrgEdit] = useState(false);

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(companySearch.trim().toLowerCase())
  );

  const loadCompanies = useCallback(() => {
    setCompaniesError(null);
    setCompaniesLoading(true);
    getCompaniesUseCase
      .execute()
      .then((res) => setCompanies(res.companies))
      .catch((err) =>
        setCompaniesError(err instanceof Error ? err.message : 'Failed to load companies')
      )
      .finally(() => setCompaniesLoading(false));
  }, []);

  const openAssignModal = () => {
    setAssignCompanyOpen(true);
    setCompanySearch('');
    setSelectedCompany(null);
    setAssignError(null);
    loadCompanies();
  };

  const handleConfirmAssign = async () => {
    if (!selectedCompany) return;
    setAssignError(null);
    setAssignSubmitting(true);
    try {
      await updateProfileUseCase.execute(selectedCompany.id);
      await loadProfile();
      setAssignCompanyOpen(false);
      setSelectedCompany(null);
    } catch (err) {
      setAssignError(err instanceof Error ? err.message : 'Failed to assign company');
    } finally {
      setAssignSubmitting(false);
    }
  };

  const closeConfirmDialog = () => {
    if (!assignSubmitting) {
      setSelectedCompany(null);
      setAssignError(null);
    }
  };

  const loadProfile = () => {
    setError(null);
    setLoading(true);
    getProfileUseCase
      .execute()
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      )
      .finally(() => setLoading(false));
  };

  const loadOrganization = useCallback(() => {
    setOrgError(null);
    setOrgLoading(true);
    getOrganizationUseCase
      .execute()
      .then((res) => {
        setOrgData(res);
        setEditName(res.name);
        setEditDescription(res.description ?? '');
        setEditWebsite(res.website ?? '');
      })
      .catch((err) =>
        setOrgError(err instanceof Error ? err.message : 'Failed to load organization')
      )
      .finally(() => setOrgLoading(false));
  }, []);

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrgSubmitError(null);
    setOrgSubmitting(true);
    const formData = new FormData();
    formData.append('name', editName.trim());
    formData.append('description', editDescription.trim());
    formData.append('website', editWebsite.trim());
    if (editFile) formData.append('file', editFile);
    try {
      const updated = await updateOrganizationUseCase.execute(formData);
      setOrgData(updated);
      setEditFile(null);
      setShowOrgEdit(false);
    } catch (err) {
      let message = 'Failed to update organization';
      if (err instanceof HttpError && err.body && typeof err.body === 'object') {
        const body = err.body as { message?: string; error?: string };
        message = body.message ?? body.error ?? message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setOrgSubmitError(message);
    } finally {
      setOrgSubmitting(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    loadOrganization();
  }, [loadOrganization]);

  if (loading) {
    return (
      <Box sx={{ width: '100%', maxWidth: 960, mx: 'auto', px: { xs: 0, sm: 1 }, boxSizing: 'border-box' }}>
        <Skeleton variant="text" width={100} height={40} sx={{ mb: { xs: 3, md: 4 } }} />
        <Card sx={{ bgcolor: '#ffffff', borderRadius: { xs: '12px', sm: '16px' }, boxShadow: 'none', border: '1px solid #f5f5f7', p: { xs: 2, sm: 3, md: 4 }, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 2, sm: 3 }, mb: { xs: 3, md: 4 }, flexWrap: 'wrap' }}>
            <Skeleton variant="circular" width={72} height={72} sx={{ flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Skeleton variant="text" width="70%" height={32} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="50%" height={22} sx={{ mb: 1 }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="rounded" width={60} height={28} />
                <Skeleton variant="rounded" width={50} height={28} />
              </Box>
            </Box>
          </Box>
          <Divider sx={{ my: { xs: 2, md: 3 }, borderColor: '#f5f5f7' }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: { xs: 3, md: 4 } }}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i}>
                <Skeleton variant="text" width={100} height={18} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={24} sx={{ mb: 3 }} />
                <Skeleton variant="text" width={90} height={18} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="70%" height={24} />
              </Box>
            ))}
          </Box>
          <Divider sx={{ my: { xs: 2, md: 3 }, borderColor: '#f5f5f7' }} />
          <Box>
            <Skeleton variant="text" width={70} height={18} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" width={140} height={40} sx={{ mt: 0.5, borderRadius: '12px' }} />
          </Box>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <FetchErrorState
        message={error}
        onRetry={loadProfile}
      />
    );
  }

  if (!data) {
    return null;
  }

  const { user } = data;
  const initial = (user.email?.[0] ?? 'U').toUpperCase();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 960,
        mx: 'auto',
        px: { xs: 0, sm: 1 },
        boxSizing: 'border-box',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 300,
          color: '#1d1d1f',
          fontSize: { xs: '1.375rem', sm: '1.5rem', md: '1.75rem' },
          letterSpacing: '-0.5px',
          mb: { xs: 3, md: 4 },
        }}
      >
        Profile
      </Typography>

      <Card
        sx={{
          bgcolor: '#ffffff',
          borderRadius: { xs: '12px', sm: '16px' },
          boxShadow: 'none',
          border: '1px solid #f5f5f7',
          p: { xs: 2, sm: 3, md: 4 },
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: { xs: 2, sm: 3 },
            mb: { xs: 3, md: 4 },
            flexWrap: 'wrap',
          }}
        >
          <Avatar
            sx={{
              width: { xs: 56, sm: 64, md: 72 },
              height: { xs: 56, sm: 64, md: 72 },
              bgcolor: '#66bb6a',
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
              flexShrink: 0,
            }}
          >
            {initial}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                color: '#1d1d1f',
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                letterSpacing: '-0.5px',
                mb: 0.5,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              {user.email}
            </Typography>
            <Typography
              sx={{
                color: '#86868b',
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                mb: 1,
                wordBreak: 'break-all',
                overflowWrap: 'break-word',
              }}
            >
              User ID: {user.id}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              <Chip
                label={user.status}
                sx={{
                  bgcolor: user.status === 'active' ? '#66bb6a' : '#d32f2f',
                  color: '#fff',
                  fontSize: '0.75rem',
                  height: 28,
                  fontWeight: 400,
                }}
              />
              <Chip
                label={user.role}
                variant="outlined"
                sx={{
                  borderColor: '#e0e0e0',
                  color: '#1d1d1f',
                  fontSize: '0.75rem',
                  height: 28,
                  fontWeight: 400,
                }}
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: { xs: 2, md: 3 }, borderColor: '#f5f5f7' }} />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: { xs: 3, md: 4 },
          }}
        >
          <Box>
            {label('Organization')}
            {value(data.organization_name)}
            {label('Organization ID')}
            {value(data.organization_id)}
          </Box>
          <Box>
            {label('Institution ID')}
            {value(data.id)}
            {label('User ID')}
            {value(data.user_id)}
          </Box>
          <Box>
            {label('User: created')}
            {value(formatDate(user.created_at))}
            {label('User: updated')}
            {value(formatDate(user.updated_at))}
          </Box>
          <Box>
            {label('Institution: created')}
            {value(formatDate(data.created_at))}
            {label('Institution: updated')}
            {value(formatDate(data.updated_at))}
          </Box>
        </Box>

        <Divider sx={{ my: { xs: 2, md: 3 }, borderColor: '#f5f5f7' }} />
        <Box sx={{ width: '100%', minWidth: 0 }}>
          {label('Company')}
          {data.company == null ? (
            <Button
              variant="outlined"
              startIcon={<AddBusinessIcon />}
              onClick={openAssignModal}
              fullWidth={isMobile}
              sx={{
                borderRadius: '12px',
                borderColor: '#e0e0e0',
                color: '#1d1d1f',
                textTransform: 'none',
                mt: 0.5,
                '&:hover': {
                  borderColor: '#66bb6a',
                  bgcolor: 'rgba(102, 187, 106, 0.08)',
                  color: '#66bb6a',
                },
              }}
            >
              Assign company
            </Button>
          ) : (
            <Box sx={{ mt: 0.5 }}>
              <Typography
                sx={{
                  color: '#1d1d1f',
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                  fontWeight: 500,
                  mb: 0.5,
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}
              >
                {data.company.name}
              </Typography>
              {data.company.description != null && data.company.description !== '' && (
                <Typography
                  sx={{
                    color: '#86868b',
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    mb: 0.5,
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                >
                  {data.company.description}
                </Typography>
              )}
              {data.company.website != null && data.company.website !== '' && (
                <Typography
                  component="a"
                  href={data.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: '#66bb6a',
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                    wordBreak: 'break-all',
                    overflowWrap: 'break-word',
                  }}
                >
                  {data.company.website}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Card>

      {/* Organization section */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 300,
          color: '#1d1d1f',
          fontSize: { xs: '1.375rem', sm: '1.5rem', md: '1.75rem' },
          letterSpacing: '-0.5px',
          mt: { xs: 4, md: 5 },
          mb: { xs: 2, md: 3 },
        }}
      >
        Organization
      </Typography>

      {orgLoading ? (
        <Card sx={{ bgcolor: '#ffffff', borderRadius: { xs: '12px', sm: '16px' }, boxShadow: 'none', border: '1px solid #f5f5f7', p: { xs: 2, sm: 3, md: 4 }, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 4, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Skeleton variant="text" width="50%" height={36} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="35%" height={22} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="rounded" width={70} height={28} />
            </Box>
          </Box>
          <Divider sx={{ my: 3, borderColor: '#f5f5f7' }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
            <Box>
              <Skeleton variant="text" width={80} height={18} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="90%" height={24} sx={{ mb: 3 }} />
              <Skeleton variant="text" width={60} height={18} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="70%" height={24} />
            </Box>
            <Box>
              <Skeleton variant="text" width={75} height={18} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="85%" height={24} sx={{ mb: 3 }} />
              <Skeleton variant="text" width={70} height={18} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={24} />
            </Box>
          </Box>
        </Card>
      ) : orgError ? (
        <FetchErrorState message={orgError} onRetry={loadOrganization} />
      ) : orgData ? (
        <>
          <Card
            sx={{
              bgcolor: '#ffffff',
              borderRadius: { xs: '12px', sm: '16px' },
              boxShadow: 'none',
              border: '1px solid #f5f5f7',
              p: { xs: 2, sm: 3, md: 4 },
              overflow: 'hidden',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 4, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 400,
                    color: '#1d1d1f',
                    fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                    letterSpacing: '-0.5px',
                    mb: 1,
                  }}
                >
                  {orgData.name}
                </Typography>
                <Typography sx={{ color: '#86868b', fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                  ID: {orgData.id}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton
                  onClick={() => setShowOrgEdit(true)}
                  aria-label="Edit organization"
                  sx={{
                    color: '#86868b',
                    '&:hover': { color: '#66bb6a', bgcolor: 'rgba(102, 187, 106, 0.08)' },
                  }}
                >
                  <EditIcon />
                </IconButton>
                <Chip
                  label={orgData.is_active ? 'Active' : 'Inactive'}
                  sx={{
                    bgcolor: orgData.is_active ? '#66bb6a' : '#d32f2f',
                    color: '#fff',
                    fontSize: '0.75rem',
                    height: 28,
                    fontWeight: 400,
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: { xs: 2, md: 3 }, borderColor: '#f5f5f7' }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: { xs: 3, md: 4 } }}>
              <Box>
                {label('Description')}
                {value(orgData.description)}
                {label('Website')}
                {orgData.website ? (
                  <Typography sx={{ color: '#1d1d1f', fontSize: { xs: '0.875rem', sm: '0.9375rem' }, mb: 3 }}>
                    <MuiLink
                      href={orgData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: '#66bb6a', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {orgData.website}
                    </MuiLink>
                  </Typography>
                ) : (
                  value(null)
                )}
              </Box>
              <Box>
                {label('Created at')}
                {value(formatDate(orgData.created_at))}
                {label('Updated at')}
                {value(formatDate(orgData.updated_at))}
              </Box>
            </Box>
          </Card>

          {showOrgEdit && (
            <Card
              sx={{
                bgcolor: '#ffffff',
                borderRadius: { xs: '12px', sm: '16px' },
                boxShadow: 'none',
                border: '1px solid #f5f5f7',
                p: { xs: 2, sm: 3, md: 4 },
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
                  onClick={() => setShowOrgEdit(false)}
                  sx={{ color: '#86868b', textTransform: 'none' }}
                >
                  Close
                </Button>
              </Box>
              <form onSubmit={handleOrgSubmit}>
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
                  {orgSubmitError && (
                    <Alert severity="error" sx={{ borderRadius: '12px' }}>
                      {orgSubmitError}
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={orgSubmitting}
                    sx={{
                      bgcolor: '#66bb6a',
                      color: '#fff',
                      borderRadius: '12px',
                      textTransform: 'none',
                      py: 1.25,
                      '&:hover': { bgcolor: '#5cb860' },
                    }}
                  >
                    {orgSubmitting ? 'Saving…' : 'Save'}
                  </Button>
                </Box>
              </form>
            </Card>
          )}
        </>
      ) : null}

      <Dialog
        open={assignCompanyOpen}
        onClose={() => setAssignCompanyOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : '16px',
            border: isMobile ? 'none' : '1px solid #f5f5f7',
            boxShadow: 'none',
            maxHeight: isMobile ? '100%' : '90vh',
            mx: isMobile ? 0 : 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: 500,
            color: '#1d1d1f',
            fontSize: { xs: '1.125rem', sm: '1.25rem' },
            borderBottom: '1px solid #f5f5f7',
            py: { xs: 1.5, sm: 2 },
            px: { xs: 2, sm: 3 },
            flexShrink: 0,
          }}
        >
          Assign company
          <Button
            size="small"
            onClick={() => setAssignCompanyOpen(false)}
            sx={{ minWidth: 0, p: 0.5, color: '#86868b' }}
            aria-label="Close"
          >
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {companiesLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Box sx={{ px: 2, py: 2, borderBottom: '1px solid #f5f5f7' }}>
                <Skeleton variant="rounded" height={40} sx={{ borderRadius: '12px' }} />
              </Box>
              <Box sx={{ py: 2 }}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, px: 2, borderBottom: '1px solid #f5f5f7' }}>
                    <Skeleton variant="circular" width={44} height={44} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="40%" height={22} />
                      <Skeleton variant="text" width="60%" height={18} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : companiesError ? (
            <Box
              sx={{
                px: { xs: 2, sm: 3 },
                py: 4,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ color: '#86868b', mb: 2, wordBreak: 'break-word' }}>
                {companiesError}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={loadCompanies}
                sx={{
                  borderRadius: '12px',
                  borderColor: '#e0e0e0',
                  color: '#1d1d1f',
                  textTransform: 'none',
                }}
              >
                Retry
              </Button>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  flexShrink: 0,
                  px: { xs: 2, sm: 3 },
                  py: 2,
                  borderBottom: '1px solid #f5f5f7',
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by name"
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#86868b', fontSize: '1.25rem' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '12px',
                      bgcolor: '#f5f5f7',
                      '& fieldset': { border: 'none' },
                    },
                  }}
                />
              </Box>
              <List
                sx={{
                  maxHeight: { xs: 'calc(100vh - 56px - 72px)', sm: 328 },
                  overflow: 'auto',
                  py: 0,
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {filteredCompanies.length === 0 ? (
                  <Box sx={{ py: 4, px: 2, textAlign: 'center' }}>
                    <Typography sx={{ color: '#86868b', fontSize: '0.9375rem' }}>
                      {companySearch.trim() ? 'No companies match your search.' : 'No companies available.'}
                    </Typography>
                  </Box>
                ) : (
                  filteredCompanies.map((company) => (
                <ListItemButton
                  key={company.id}
                  onClick={() => setSelectedCompany(company)}
                  sx={{
                    py: { xs: 1.5, sm: 2 },
                    px: { xs: 2, sm: 3 },
                    borderBottom: '1px solid #f5f5f7',
                    '&:hover': { bgcolor: 'rgba(102, 187, 106, 0.06)' },
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: { xs: 40, sm: 56 } }}>
                    <Avatar
                      src={company.logo ?? undefined}
                      sx={{
                        width: { xs: 40, sm: 44 },
                        height: { xs: 40, sm: 44 },
                        bgcolor: '#f5f5f7',
                        color: '#86868b',
                      }}
                    >
                      <BusinessIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={company.name}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 500,
                        color: '#1d1d1f',
                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                        wordBreak: 'break-word',
                      },
                    }}
                    secondary={
                      <>
                        {company.description && (
                          <Typography
                            component="span"
                            sx={{
                              display: 'block',
                              color: '#86868b',
                              fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                              mt: 0.25,
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                            }}
                          >
                            {company.description}
                          </Typography>
                        )}
                        {company.website && (
                          <Typography
                            component="span"
                            sx={{
                              display: 'block',
                              color: '#66bb6a',
                              fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                              mt: 0.25,
                              wordBreak: 'break-all',
                              overflowWrap: 'break-word',
                            }}
                          >
                            {company.website}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItemButton>
                  ))
                )}
              </List>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectedCompany !== null}
        onClose={closeConfirmDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            border: '1px solid #f5f5f7',
            boxShadow: 'none',
            p: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 500,
            color: '#1d1d1f',
            fontSize: '1.125rem',
            px: 0,
            pt: 0,
          }}
        >
          Assign company
        </DialogTitle>
        <DialogContent sx={{ px: 0, pb: 0 }}>
          <Typography sx={{ color: '#86868b', fontSize: '0.9375rem', mb: 2 }}>
            Assign <strong>{selectedCompany?.name}</strong> as your company?
          </Typography>
          {assignError && (
            <Typography sx={{ color: '#d32f2f', fontSize: '0.875rem', mb: 2 }}>
              {assignError}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Button
              onClick={closeConfirmDialog}
              disabled={assignSubmitting}
              sx={{
                color: '#86868b',
                textTransform: 'none',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmAssign}
              disabled={assignSubmitting}
              sx={{
                bgcolor: '#66bb6a',
                color: '#fff',
                textTransform: 'none',
                borderRadius: '12px',
                '&:hover': { bgcolor: '#5cb860' },
              }}
            >
              {assignSubmitting ? 'Assigning…' : 'Confirm'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
