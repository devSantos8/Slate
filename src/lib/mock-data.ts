export interface Metric {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  period: string;
  iconName: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: 'Enterprise' | 'Pro' | 'Starter';
  status: 'Active' | 'Pending' | 'Paused' | 'Cancelled';
  revenue: number;
  avatar: string;
  joinedDate: string;
}

export const INITIAL_METRICS: Metric[] = [
  {
    id: '1',
    title: 'Ingresos Mensuales',
    value: '$128,450.00',
    change: '+14.2%',
    isPositive: true,
    period: 'vs. mes anterior',
    iconName: 'DollarSign',
  },
  {
    id: '2',
    title: 'Usuarios Activos',
    value: '2,845',
    change: '+8.1%',
    isPositive: true,
    period: 'vs. mes anterior',
    iconName: 'Users',
  },
  {
    id: '3',
    title: 'Suscripciones Pro',
    value: '1,240',
    change: '+5.4%',
    isPositive: true,
    period: 'vs. mes anterior',
    iconName: 'CreditCard',
  },
  {
    id: '4',
    title: 'Tasa de Conversión',
    value: '4.85%',
    change: '-0.4%',
    isPositive: false,
    period: 'vs. mes anterior',
    iconName: 'TrendingUp',
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Sofia Rodríguez',
    email: 'sofia.rodriguez@techcorp.io',
    company: 'TechCorp Solutions',
    plan: 'Enterprise',
    status: 'Active',
    revenue: 12500,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    joinedDate: '2024-01-15',
  },
  {
    id: 'CUST-002',
    name: 'Carlos Mendoza',
    email: 'carlos@nexuslabs.co',
    company: 'Nexus Labs',
    plan: 'Pro',
    status: 'Active',
    revenue: 4800,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    joinedDate: '2024-02-01',
  },
  {
    id: 'CUST-003',
    name: 'Elena Gómez',
    email: 'elena@innovate.design',
    company: 'Innovate Studio',
    plan: 'Pro',
    status: 'Pending',
    revenue: 3200,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    joinedDate: '2024-02-18',
  },
  {
    id: 'CUST-004',
    name: 'Mateo Morales',
    email: 'mateo@cloudscale.net',
    company: 'CloudScale Inc',
    plan: 'Enterprise',
    status: 'Active',
    revenue: 18900,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    joinedDate: '2023-11-04',
  },
  {
    id: 'CUST-005',
    name: 'Valentina Silva',
    email: 'valentina@startify.app',
    company: 'Startify Apps',
    plan: 'Starter',
    status: 'Paused',
    revenue: 990,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    joinedDate: '2024-03-10',
  },
  {
    id: 'CUST-006',
    name: 'Alejandro Castro',
    email: 'acastro@fintechplus.com',
    company: 'FintechPlus Global',
    plan: 'Enterprise',
    status: 'Active',
    revenue: 24000,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    joinedDate: '2023-09-20',
  },
  {
    id: 'CUST-007',
    name: 'Camila Herrera',
    email: 'camila@biomediq.org',
    company: 'BioMedIQ',
    plan: 'Starter',
    status: 'Cancelled',
    revenue: 490,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    joinedDate: '2024-01-05',
  },
  {
    id: 'CUST-008',
    name: 'Lucas Benítez',
    email: 'lucas@datastream.io',
    company: 'DataStream Analytics',
    plan: 'Pro',
    status: 'Active',
    revenue: 5600,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    joinedDate: '2024-02-28',
  },
];
