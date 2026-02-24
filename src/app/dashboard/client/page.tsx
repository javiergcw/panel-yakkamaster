'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import { GetClientsUseCase, ClientRepositoryEmpty, getStatusColor, type Client } from '@/modules/client';
import { FetchErrorState } from '@/components/FetchErrorState';

const getClientsUseCase = new GetClientsUseCase(new ClientRepositoryEmpty());

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClients = () => {
    setError(null);
    setLoading(true);
    getClientsUseCase
      .execute()
      .then(setClients)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load clients'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadClients();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
        <CircularProgress sx={{ color: '#66bb6a' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <FetchErrorState
        message={error}
        onRetry={loadClients}
      />
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 300,
              color: '#1d1d1f',
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              letterSpacing: '-1px',
              mb: 1,
            }}
          >
            Clients
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#86868b',
              fontSize: '0.9375rem',
              fontWeight: 400,
            }}
          >
            Manage and view all your clients
          </Typography>
        </Box>
      </Box>

      {/* Search Bar */}
      <Card
        sx={{
          bgcolor: '#ffffff',
          borderRadius: '16px',
          boxShadow: 'none',
          border: '1px solid #f5f5f7',
          mb: 4,
          p: 2,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search clients by name, email or phone..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#86868b', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              bgcolor: '#fafafa',
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: '#e0e0e0',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#66bb6a',
              },
            },
          }}
        />
      </Card>

      {/* Table */}
      <Card
        sx={{
          bgcolor: '#ffffff',
          borderRadius: '16px',
          boxShadow: 'none',
          border: '1px solid #f5f5f7',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fafafa' }}>
                <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2, borderBottom: '1px solid #f5f5f7' }}>
                  Client
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2, borderBottom: '1px solid #f5f5f7' }}>
                  Contact
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2, borderBottom: '1px solid #f5f5f7' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2, borderBottom: '1px solid #f5f5f7' }}>
                  Orders
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2, borderBottom: '1px solid #f5f5f7' }}>
                  Total Spent
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2, borderBottom: '1px solid #f5f5f7' }}>
                  Registration Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow
                  key={client.id}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#fafafa',
                    },
                  }}
                  onClick={() => router.push(`/dashboard/client/${client.id}`)}
                >
                  <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: '#66bb6a', fontSize: '0.875rem' }}>
                        {client.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.9375rem' }}>
                          {client.name}
                        </Typography>
                        <Typography sx={{ color: '#86868b', fontSize: '0.8125rem' }}>
                          ID: {client.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                    <Typography sx={{ color: '#1d1d1f', fontSize: '0.875rem', mb: 0.5 }}>
                      {client.email}
                    </Typography>
                    <Typography sx={{ color: '#86868b', fontSize: '0.8125rem' }}>
                      {client.phone}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                    <Chip
                      label={client.status}
                      sx={{
                        bgcolor: getStatusColor(client.status),
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        height: 24,
                        fontWeight: 400,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                    <Typography sx={{ color: '#1d1d1f', fontSize: '0.875rem', fontWeight: 400 }}>
                      {client.totalOrders}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                    <Typography sx={{ color: '#1d1d1f', fontSize: '0.875rem', fontWeight: 400 }}>
                      ${client.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                    <Typography sx={{ color: '#86868b', fontSize: '0.875rem' }}>
                      {new Date(client.registrationDate).toLocaleDateString('en-US')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
