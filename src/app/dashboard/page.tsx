'use client';

import { Box, Typography, Card, CardContent } from '@mui/material';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { salesData, clientData, COLORS, dashboardStats } from '@/utils/fake-data';

export default function DashboardPage() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
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
          Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#86868b',
            fontSize: '0.9375rem',
            fontWeight: 400,
          }}
        >
          Business overview
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 3,
          mb: 5,
        }}
      >
        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#e0e0e0',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: '#86868b', fontSize: '0.8125rem', mb: 1.5, fontWeight: 400 }}
            >
              Total Sales
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
                ${dashboardStats.totalSales.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#e0e0e0',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: '#86868b', fontSize: '0.8125rem', mb: 1.5, fontWeight: 400 }}
            >
              Clients
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
                {dashboardStats.clients.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#e0e0e0',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: '#86868b', fontSize: '0.8125rem', mb: 1.5, fontWeight: 400 }}
            >
              Orders
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
                {dashboardStats.orders}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#e0e0e0',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: '#86868b', fontSize: '0.8125rem', mb: 1.5, fontWeight: 400 }}
            >
              Growth
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
                +{dashboardStats.growth}%
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Charts */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '2fr 1fr',
          },
          gap: 3,
          mb: 3,
        }}
      >
        {/* Area Chart */}
        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              color: '#1d1d1f',
              mb: 4,
              fontSize: '1.125rem',
              letterSpacing: '-0.3px',
            }}
          >
            Monthly Sales
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#66bb6a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#66bb6a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f7" />
                <XAxis dataKey="name" stroke="#86868b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#86868b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #f5f5f7',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#66bb6a"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'none',
            border: '1px solid #f5f5f7',
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              color: '#1d1d1f',
              mb: 4,
              fontSize: '1.125rem',
              letterSpacing: '-0.3px',
            }}
          >
            Client Status
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={clientData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {clientData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #f5f5f7',
                  borderRadius: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Box>

      {/* Bar Chart */}
      <Card
        sx={{
          bgcolor: '#ffffff',
          borderRadius: '16px',
          boxShadow: 'none',
          border: '1px solid #f5f5f7',
          p: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 400,
            color: '#1d1d1f',
            mb: 4,
            fontSize: '1.125rem',
            letterSpacing: '-0.3px',
          }}
        >
          Sales vs Revenue Comparison
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f7" />
            <XAxis dataKey="name" stroke="#86868b" tick={{ fontSize: 12 }} />
            <YAxis stroke="#86868b" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #f5f5f7',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            />
            <Bar dataKey="sales" fill="#66bb6a" radius={[8, 8, 0, 0]} />
            <Bar dataKey="revenue" fill="#81c784" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
}
