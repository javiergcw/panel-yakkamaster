/**
 * Modelo de dominio: Cliente
 */
export type ClientStatus = 'Active' | 'Inactive' | 'New';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: ClientStatus;
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
