'use client';

import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, AppBar, Toolbar, IconButton, Avatar } from '@mui/material';
import { useState } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { usePathname, useRouter } from 'next/navigation';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
  { text: 'Clients', icon: PeopleIcon, path: '/dashboard/client' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 4, borderBottom: '1px solid #f5f5f7' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 300,
            color: '#1d1d1f',
            letterSpacing: '-0.5px',
            fontSize: '1.25rem',
          }}
        >
          Panel Yakka Sporty
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname?.startsWith(item.path));
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => router.push(item.path)}
                sx={{
                  borderRadius: '12px',
                  bgcolor: isActive ? '#f5f5f7' : 'transparent',
                  color: isActive ? '#66bb6a' : '#1d1d1f',
                  '&:hover': {
                    bgcolor: '#f5f5f7',
                  },
                  py: 1.5,
                  px: 2.5,
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 44,
                    color: isActive ? '#66bb6a' : '#86868b',
                  }}
                >
                  <Icon sx={{ fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9375rem',
                    fontWeight: isActive ? 500 : 400,
                    letterSpacing: '-0.2px',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User Section */}
      <Box sx={{ p: 2, borderTop: '1px solid #f5f5f7' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: 1 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: '#66bb6a', mr: 1.5 }}>
            U
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: '#1d1d1f',
                fontSize: '0.875rem',
              }}
            >
              User
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#86868b',
                fontSize: '0.75rem',
              }}
            >
              user@example.com
            </Typography>
          </Box>
        </Box>
        <ListItemButton
          onClick={() => router.push('/')}
          sx={{
            borderRadius: '12px',
            py: 1.5,
            px: 2.5,
            color: '#86868b',
            '&:hover': {
              bgcolor: '#f5f5f7',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 44, color: '#86868b' }}>
            <LogoutIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Sign out"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 400,
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* AppBar para móviles */}
      <AppBar
        position="fixed"
        sx={{
          display: { md: 'none' },
          bgcolor: '#ffffff',
          boxShadow: '0 1px 0 0 rgba(0,0,0,0.05)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ px: 2 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ color: '#1d1d1f' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 300,
              color: '#1d1d1f',
              ml: 2,
              letterSpacing: '-0.5px',
            }}
          >
            Panel Yakka Sporty
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Desktop */}
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid #f5f5f7',
              boxShadow: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Sidebar Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 3, sm: 4, md: 5 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, md: 0 },
          maxWidth: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
