'use client';

import { Box, Typography, Card, Avatar, Chip, Divider, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GetClientByIdUseCase, ClientRepositoryEmpty, getStatusColor, type Client } from '@/modules/client';

const getClientByIdUseCase = new GetClientByIdUseCase(new ClientRepositoryEmpty());

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params?.id ? Number(params.id) : null;
  const [clientDetail, setClientDetail] = useState<Client | null | undefined>(undefined);

  useEffect(() => {
    if (!clientId) {
      setClientDetail(undefined);
      return;
    }
    setClientDetail(undefined);
    getClientByIdUseCase.execute(clientId).then(setClientDetail);
  }, [clientId]);

  if (clientId == null) {
    return (
      <Box>
        <Typography>Invalid client ID</Typography>
      </Box>
    );
  }
  if (clientDetail === undefined) {
    return (
      <Box>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: '8px' }} />
        </Box>
        <Card sx={{ bgcolor: '#ffffff', borderRadius: '16px', boxShadow: 'none', border: '1px solid #f5f5f7', mb: 4, p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 4 }}>
            <Skeleton variant="circular" width={80} height={80} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Skeleton variant="text" width={200} height={36} />
                <Skeleton variant="rounded" width={80} height={28} />
              </Box>
              <Skeleton variant="text" width="30%" height={22} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="45%" height={22} />
            </Box>
          </Box>
          <Divider sx={{ my: 3, borderColor: '#f5f5f7' }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i}>
                <Skeleton variant="text" width={80} height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="90%" height={24} sx={{ mb: 3 }} />
              </Box>
            ))}
          </Box>
        </Card>
      </Box>
    );
  }
  if (clientDetail === null) {
    return (
      <Box>
        <Typography>Client not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with back button */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard/client')}
          sx={{
            color: '#1d1d1f',
            textTransform: 'none',
            fontWeight: 400,
            '&:hover': {
              bgcolor: '#f5f5f7',
            },
          }}
        >
          Back
        </Button>
      </Box>

      {/* Client Information */}
      <Card
        sx={{
          bgcolor: '#ffffff',
          borderRadius: '16px',
          boxShadow: 'none',
          border: '1px solid #f5f5f7',
          mb: 4,
          p: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 4 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: '#66bb6a', fontSize: '2rem' }}>
            {clientDetail.name.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 300,
                  color: '#1d1d1f',
                  fontSize: '1.75rem',
                  letterSpacing: '-0.5px',
                }}
              >
                {clientDetail.name}
              </Typography>
              <Chip
                label={clientDetail.status}
                sx={{
                  bgcolor: getStatusColor(clientDetail.status),
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  height: 28,
                  fontWeight: 400,
                }}
              />
            </Box>
            <Typography sx={{ color: '#86868b', fontSize: '0.875rem', mb: 0.5 }}>
              ID: {clientDetail.id}
            </Typography>
            <Typography sx={{ color: '#86868b', fontSize: '0.875rem' }}>
              Client since {new Date(clientDetail.registrationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: '#f5f5f7' }} />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
            },
            gap: 4,
          }}
        >
          <Box>
            <Typography sx={{ color: '#86868b', fontSize: '0.8125rem', mb: 1, fontWeight: 500 }}>
              Email
            </Typography>
            <Typography sx={{ color: '#1d1d1f', fontSize: '0.9375rem', mb: 3 }}>
              {clientDetail.email}
            </Typography>

            <Typography sx={{ color: '#86868b', fontSize: '0.8125rem', mb: 1, fontWeight: 500 }}>
              Phone
            </Typography>
            <Typography sx={{ color: '#1d1d1f', fontSize: '0.9375rem', mb: 3 }}>
              {clientDetail.phone}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ color: '#86868b', fontSize: '0.8125rem', mb: 1, fontWeight: 500 }}>
              Address
            </Typography>
            <Typography sx={{ color: '#1d1d1f', fontSize: '0.9375rem', mb: 3 }}>
              {clientDetail.address || 'N/A'}
            </Typography>

            <Typography sx={{ color: '#86868b', fontSize: '0.8125rem', mb: 1, fontWeight: 500 }}>
              Last Order
            </Typography>
            <Typography sx={{ color: '#1d1d1f', fontSize: '0.9375rem' }}>
              {clientDetail.lastOrder ? new Date(clientDetail.lastOrder).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Statistics */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(3, 1fr)',
          },
          gap: 3,
          mb: 4,
        }}
      >
        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            p: 3,
          }}
        >
          <Typography sx={{ color: '#86868b', fontSize: '0.8125rem', mb: 1.5, fontWeight: 400 }}>
            Total Orders
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 300,
              color: '#1d1d1f',
              fontSize: '2rem',
              letterSpacing: '-0.5px',
            }}
          >
            {clientDetail.totalOrders}
          </Typography>
        </Card>

        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            p: 3,
          }}
        >
          <Typography sx={{ color: '#86868b', fontSize: '0.8125rem', mb: 1.5, fontWeight: 400 }}>
            Total Spent
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 300,
              color: '#66bb6a',
              fontSize: '2rem',
              letterSpacing: '-0.5px',
            }}
          >
            ${clientDetail.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Typography>
        </Card>

        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            p: 3,
          }}
        >
          <Typography sx={{ color: '#86868b', fontSize: '0.8125rem', mb: 1.5, fontWeight: 400 }}>
            Average Order Value
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 300,
              color: '#1d1d1f',
              fontSize: '2rem',
              letterSpacing: '-0.5px',
            }}
          >
            ${(clientDetail.totalSpent / clientDetail.totalOrders).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Typography>
        </Card>
      </Box>

      {/* Order History */}
      <Card
        sx={{
          bgcolor: '#ffffff',
          borderRadius: '16px',
          boxShadow: 'none',
          border: '1px solid #f5f5f7',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 4, borderBottom: '1px solid #f5f5f7' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              color: '#1d1d1f',
              fontSize: '1.125rem',
              letterSpacing: '-0.3px',
            }}
          >
            Order History
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fafafa' }}>
                <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2, borderBottom: '1px solid #f5f5f7' }}>
                  Order ID
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2, borderBottom: '1px solid #f5f5f7' }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2, borderBottom: '1px solid #f5f5f7' }}>
                  Product
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2, borderBottom: '1px solid #f5f5f7' }}>
                  Quantity
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2, borderBottom: '1px solid #f5f5f7' }}>
                  Unit Price
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: '#1d1d1f', fontSize: '0.875rem', py: 2, borderBottom: '1px solid #f5f5f7' }}>
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientDetail.orders?.map((order) => (
                <TableRow
                  key={order.id}
                  sx={{
                    '&:hover': {
                      bgcolor: '#fafafa',
                    },
                  }}
                >
                  <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                    <Typography sx={{ color: '#1d1d1f', fontSize: '0.875rem', fontWeight: 400 }}>
                      #{order.id}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                    <Typography sx={{ color: '#86868b', fontSize: '0.875rem' }}>
                      {new Date(order.date).toLocaleDateString('en-US')}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                    <Typography sx={{ color: '#1d1d1f', fontSize: '0.875rem', fontWeight: 400 }}>
                      {order.product}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                    <Typography sx={{ color: '#1d1d1f', fontSize: '0.875rem', fontWeight: 400 }}>
                      {order.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                    <Typography sx={{ color: '#86868b', fontSize: '0.875rem' }}>
                      ${order.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f5f5f7' }}>
                    <Typography sx={{ color: '#1d1d1f', fontSize: '0.875rem', fontWeight: 500 }}>
                      ${order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
