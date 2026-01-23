// Dashboard Data
export const salesData = [
  { name: 'Jan', sales: 4000, revenue: 2400 },
  { name: 'Feb', sales: 3000, revenue: 1398 },
  { name: 'Mar', sales: 2000, revenue: 9800 },
  { name: 'Apr', sales: 2780, revenue: 3908 },
  { name: 'May', sales: 1890, revenue: 4800 },
  { name: 'Jun', sales: 2390, revenue: 3800 },
];

export const clientData = [
  { name: 'New', value: 35, color: '#66bb6a' },
  { name: 'Active', value: 45, color: '#81c784' },
  { name: 'Inactive', value: 20, color: '#a5d6a7' },
];

export const COLORS = ['#66bb6a', '#81c784', '#a5d6a7'];

// Dashboard Stats
export const dashboardStats = {
  totalSales: 24580,
  clients: 1234,
  orders: 456,
  growth: 12.5,
};

// Clients Data
export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'New';
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
  address?: string;
  lastOrder?: string;
  orders?: Order[];
}

export interface Order {
  id: number;
  date: string;
  product: string;
  quantity: number;
  price: number;
  total: number;
}

export const clients: Client[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 555 123 4567',
    status: 'Active',
    registrationDate: '2024-01-15',
    totalOrders: 12,
    totalSpent: 2450.00,
    address: '123 Main Street, New York, USA',
    lastOrder: '2024-04-10',
    orders: [
      { id: 101, date: '2024-04-10', product: 'Product A', quantity: 2, price: 150.00, total: 300.00 },
      { id: 102, date: '2024-03-25', product: 'Product B', quantity: 1, price: 200.00, total: 200.00 },
      { id: 103, date: '2024-03-15', product: 'Product C', quantity: 3, price: 75.00, total: 225.00 },
      { id: 104, date: '2024-02-28', product: 'Product A', quantity: 1, price: 150.00, total: 150.00 },
    ],
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 555 234 5678',
    status: 'Active',
    registrationDate: '2024-02-20',
    totalOrders: 8,
    totalSpent: 1890.50,
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '+1 555 345 6789',
    status: 'Inactive',
    registrationDate: '2023-11-10',
    totalOrders: 3,
    totalSpent: 450.00,
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '+1 555 456 7890',
    status: 'Active',
    registrationDate: '2024-03-05',
    totalOrders: 15,
    totalSpent: 3200.75,
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    phone: '+1 555 567 8901',
    status: 'New',
    registrationDate: '2024-04-12',
    totalOrders: 1,
    totalSpent: 125.00,
  },
];

// Helper function
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Active':
      return '#66bb6a';
    case 'Inactive':
      return '#86868b';
    case 'New':
      return '#81c784';
    default:
      return '#86868b';
  }
};

// Get client by ID
export const getClientById = (id: number): Client | undefined => {
  return clients.find((client) => client.id === id);
};
