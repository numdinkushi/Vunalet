import { OrderStats, Order } from './types';

// South African mock data
export const mockOrderStats: OrderStats = {
    total: 24,
    pending: 3,
    confirmed: 2,
    preparing: 1,
    ready: 1,
    inTransit: 2,
    delivered: 15,
    totalRevenue: 2850.75
};

export const mockOrders: Order[] = [
    {
        _id: 'ord_123456789',
        products: [
            { name: 'Organic Tomatoes', quantity: 5, price: 45 },
            { name: 'Fresh Spinach', quantity: 2, price: 25 }
        ],
        totalCost: 70,
        orderStatus: 'in_transit',
        paymentStatus: 'paid',
        createdAt: '2025-01-07T10:30:00Z',
        deliveryAddress: '123 Green Valley Estate, Sandton, Johannesburg',
        estimatedDeliveryTime: 'Today, 2:00 PM',
        riderId: 'rider_001',
        riderName: 'John Mokoena',
        farmName: 'Sunshine Organic Farm'
    },
    {
        _id: 'ord_987654321',
        products: [
            { name: 'Sweet Potatoes', quantity: 3, price: 60 }
        ],
        totalCost: 60,
        orderStatus: 'preparing',
        paymentStatus: 'paid',
        createdAt: '2025-01-07T08:15:00Z',
        deliveryAddress: '456 Market Street, Cape Town CBD',
        estimatedDeliveryTime: 'Tomorrow, 10:00 AM',
        riderId: 'rider_002',
        riderName: 'Sarah Ndlovu',
        farmName: 'Valley Fresh Farms'
    },
    {
        _id: 'ord_456789123',
        products: [
            { name: 'Organic Carrots', quantity: 4, price: 80 },
            { name: 'Green Beans', quantity: 2, price: 35 }
        ],
        totalCost: 115,
        orderStatus: 'delivered',
        paymentStatus: 'paid',
        createdAt: '2025-01-05T14:20:00Z',
        deliveryAddress: '789 Garden City, Durban North',
        farmName: 'Eden Organic Gardens'
    },
    {
        _id: 'ord_789123456',
        products: [
            { name: 'Fresh Avocados', quantity: 6, price: 90 },
            { name: 'Baby Spinach', quantity: 3, price: 30 }
        ],
        totalCost: 120,
        orderStatus: 'pending',
        paymentStatus: 'paid',
        createdAt: '2025-01-07T12:45:00Z',
        deliveryAddress: '321 Rosebank, Johannesburg',
        estimatedDeliveryTime: 'Tomorrow, 3:00 PM',
        farmName: 'Highveld Fresh Produce'
    },
    {
        _id: 'ord_321654987',
        products: [
            { name: 'Organic Onions', quantity: 2, price: 40 },
            { name: 'Fresh Garlic', quantity: 1, price: 25 }
        ],
        totalCost: 65,
        orderStatus: 'confirmed',
        paymentStatus: 'paid',
        createdAt: '2025-01-07T09:20:00Z',
        deliveryAddress: '654 Sea Point, Cape Town',
        estimatedDeliveryTime: 'Today, 5:00 PM',
        farmName: 'Western Cape Organics'
    }
];

// South African farm names
export const farmNames = [
    'Highveld Fresh Produce',
    'Western Cape Organics',
    'KwaZulu-Natal Farm Fresh',
    'Gauteng Green Farms',
    'Free State Fresh',
    'Mpumalanga Organics',
    'Limpopo Valley Farms',
    'Eastern Cape Fresh',
    'Northern Cape Organics',
    'North West Fresh Produce'
];

// South African delivery addresses
export const deliveryAddresses = [
    '123 Green Valley Estate, Sandton, Johannesburg',
    '456 Market Street, Cape Town CBD',
    '789 Garden City, Durban North',
    '321 Rosebank, Johannesburg',
    '654 Sea Point, Cape Town',
    '987 Pretoria East, Gauteng',
    '147 Morningside, Durban',
    '258 Stellenbosch, Western Cape',
    '369 Bryanston, Johannesburg',
    '741 Camps Bay, Cape Town'
];

// South African rider names
export const riderNames = [
    'John Mokoena',
    'Sarah Ndlovu',
    'David Zulu',
    'Lisa Xaba',
    'Michael Dlamini',
    'Thandi Nkosi',
    'Sipho Mthembu',
    'Nokuthula Zuma',
    'Themba Khumalo',
    'Zanele Cele'
]; 