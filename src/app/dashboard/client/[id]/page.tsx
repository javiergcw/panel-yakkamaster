'use client';

import { Box, Typography, Card, CardContent, Grid, Avatar, Chip, Divider, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter, useParams } from 'next/navigation';
import { getClientById, getStatusColor } from '@/utils/fake-data';

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params?.id ? Number(params.id) : null;
  
  const clientDetail = clientId ? getClientById(clientId) : null;

  if (!clientDetail) {
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

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
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
          </Grid>
          <Grid item xs={12} md={6}>
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
          </Grid>
        </Grid>
      </Card>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
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
        </Grid>
        <Grid item xs={12} sm={4}>
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
        </Grid>
        <Grid item xs={12} sm={4}>
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
        </Grid>
      </Grid>

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
