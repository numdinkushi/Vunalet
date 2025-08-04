export const allProducts = {
    '1': [ // vegetables
        {
            id: 'v1',
            name: 'Organic Tomatoes',
            category: '1',
            price: 45,
            unit: 'KG',
            farmer: 'John Farmer',
            location: 'Stellenbosch, Western Cape',
            rating: 4.8,
            images: [
                '/assets/products/tomatoes/image.jpg',
                '/assets/products/tomatoes/image (7).jpg'
            ],
            quantity: 50,
            harvestDate: '2024-08-01',
            featured: true
        },
        {
            id: 'v2',
            name: 'Fresh Spinach',
            category: '1',
            price: 30,
            unit: 'KG',
            farmer: 'Mary Green',
            location: 'Paarl, Western Cape',
            rating: 4.9,
            images: [
                '/assets/products/spinach/image (1).jpg'
            ],
            quantity: 30,
            harvestDate: '2024-08-02',
            featured: false
        },
        {
            id: 'v3',
            name: 'Sweet Corn',
            category: '1',
            price: 20,
            unit: 'PIECE',
            farmer: 'David Farm',
            location: 'Robertson, Western Cape',
            rating: 4.7,
            images: [
                '/assets/products/corn/image (2).jpg',
                '/assets/products/corn/image (3).jpg'
            ],
            quantity: 100,
            harvestDate: '2024-07-30',
            featured: true
        },
        {
            id: 'v4',
            name: 'Organic Carrots',
            category: '1',
            price: 25,
            unit: 'KG',
            farmer: 'Root Farm',
            location: 'Ceres, Western Cape',
            rating: 4.5,
            images: [
                '/assets/products/carrots/image (6).jpg'
            ],
            quantity: 40,
            harvestDate: '2024-07-29',
            featured: false
        },
        {
            id: 'v5',
            name: 'Fresh Broccoli',
            category: '1',
            price: 35,
            unit: 'KG',
            farmer: 'Green Valley',
            location: 'Wellington, Western Cape',
            rating: 4.6,
            images: [
                '/assets/categories/vegetables/image.jpg'
            ],
            quantity: 25,
            harvestDate: '2024-08-01',
            featured: false
        },
        {
            id: 'v6',
            name: 'Crisp Lettuce',
            category: '1',
            price: 15,
            unit: 'PIECE',
            farmer: 'Leaf Farm',
            location: 'Somerset West, Western Cape',
            rating: 4.4,
            images: [
                '/assets/categories/vegetables/image (1).jpg'
            ],
            quantity: 60,
            harvestDate: '2024-08-02',
            featured: false
        }
    ],
    '2': [ // fruits
        {
            id: 'f1',
            name: 'Fresh Oranges',
            category: '2',
            price: 35,
            unit: 'KG',
            farmer: 'Citrus Valley',
            location: 'Citrusdal, Western Cape',
            rating: 4.6,
            images: [
                '/assets/products/orange/image (4).jpg',
                '/assets/products/orange/image (5).jpg'
            ],
            quantity: 75,
            harvestDate: '2024-08-01',
            featured: false
        },
        {
            id: 'f2',
            name: 'Fresh Strawberries',
            category: '2',
            price: 60,
            unit: 'KG',
            farmer: 'Berry Farm',
            location: 'Stellenbosch, Western Cape',
            rating: 4.9,
            images: [
                '/assets/products/strawberry/image (8).jpg',
                '/assets/products/strawberry/image (9).jpg'
            ],
            quantity: 25,
            harvestDate: '2024-08-02',
            featured: true
        },
        {
            id: 'f3',
            name: 'Sweet Apples',
            category: '2',
            price: 40,
            unit: 'KG',
            farmer: 'Apple Orchard',
            location: 'Elgin, Western Cape',
            rating: 4.7,
            images: [
                '/assets/categories/fruits/image.jpg'
            ],
            quantity: 80,
            harvestDate: '2024-07-28',
            featured: false
        },
        {
            id: 'f4',
            name: 'Ripe Bananas',
            category: '2',
            price: 25,
            unit: 'KG',
            farmer: 'Tropical Farm',
            location: 'Limpopo',
            rating: 4.5,
            images: [
                '/assets/categories/fruits/image (1).jpg'
            ],
            quantity: 100,
            harvestDate: '2024-08-01',
            featured: false
        }
    ],
    '3': [ // grains-and-cereals
        {
            id: 'gc1',
            name: 'Organic Quinoa',
            category: '3',
            price: 85,
            unit: 'KG',
            farmer: 'Grain Masters',
            location: 'Free State',
            rating: 4.8,
            images: [
                '/assets/categories/grains_and_cereal/image.jpg'
            ],
            quantity: 30,
            harvestDate: '2024-07-15',
            featured: true
        },
        {
            id: 'gc2',
            name: 'Brown Rice',
            category: '3',
            price: 45,
            unit: 'KG',
            farmer: 'Rice Valley',
            location: 'KwaZulu-Natal',
            rating: 4.6,
            images: [
                '/assets/categories/grains_and_cereal/image (1).jpg'
            ],
            quantity: 50,
            harvestDate: '2024-07-20',
            featured: false
        }
    ],
    '4': [ // tubers
        {
            id: 't1',
            name: 'Fresh Potatoes',
            category: '4',
            price: 30,
            unit: 'KG',
            farmer: 'Potato Farm',
            location: 'Eastern Cape',
            rating: 4.5,
            images: [
                '/assets/categories/tubers/image.jpg'
            ],
            quantity: 200,
            harvestDate: '2024-07-25',
            featured: false
        },
        {
            id: 't2',
            name: 'Sweet Potatoes',
            category: '4',
            price: 35,
            unit: 'KG',
            farmer: 'Sweet Root Farm',
            location: 'Mpumalanga',
            rating: 4.7,
            images: [
                '/assets/categories/tubers/image (1).jpg'
            ],
            quantity: 150,
            harvestDate: '2024-07-30',
            featured: true
        }
    ],
    '5': [ // legumes
        {
            id: 'l1',
            name: 'Black Beans',
            category: '5',
            price: 55,
            unit: 'KG',
            farmer: 'Bean Farm',
            location: 'Free State',
            rating: 4.6,
            images: [
                '/assets/categories/legumes/image.jpg'
            ],
            quantity: 40,
            harvestDate: '2024-07-20',
            featured: false
        },
        {
            id: 'l2',
            name: 'Chickpeas',
            category: '5',
            price: 50,
            unit: 'KG',
            farmer: 'Pulse Farm',
            location: 'Northern Cape',
            rating: 4.8,
            images: [
                '/assets/categories/legumes/image.jpg'
            ],
            quantity: 35,
            harvestDate: '2024-07-18',
            featured: true
        }
    ],
    '6': [ // nuts-and-seeds
        {
            id: 'ns1',
            name: 'Raw Almonds',
            category: '6',
            price: 120,
            unit: 'KG',
            farmer: 'Nut Farm',
            location: 'Western Cape',
            rating: 4.9,
            images: [
                '/assets/categories/nuts_and_seed/image (1).jpg'
            ],
            quantity: 25,
            harvestDate: '2024-07-10',
            featured: true
        },
        {
            id: 'ns2',
            name: 'Sunflower Seeds',
            category: '6',
            price: 45,
            unit: 'KG',
            farmer: 'Seed Farm',
            location: 'Free State',
            rating: 4.7,
            images: [
                '/assets/categories/nuts_and_seed/image (2).jpg'
            ],
            quantity: 60,
            harvestDate: '2024-07-15',
            featured: false
        }
    ],
    '7': [ // dairy
        {
            id: 'd1',
            name: 'Fresh Milk',
            category: '7',
            price: 25,
            unit: 'LITER',
            farmer: 'Dairy Farm',
            location: 'Western Cape',
            rating: 4.8,
            images: [
                '/assets/categories/dairy/image.jpg'
            ],
            quantity: 100,
            harvestDate: '2024-08-01',
            featured: true
        },
        {
            id: 'd2',
            name: 'Greek Yogurt',
            category: '7',
            price: 35,
            unit: 'KG',
            farmer: 'Yogurt Farm',
            location: 'Western Cape',
            rating: 4.6,
            images: [
                '/assets/categories/dairy/image (1).jpg'
            ],
            quantity: 50,
            harvestDate: '2024-08-01',
            featured: false
        }
    ],
    '8': [ // meat
        {
            id: 'm1',
            name: 'Grass-Fed Beef',
            category: '8',
            price: 180,
            unit: 'KG',
            farmer: 'Beef Farm',
            location: 'Free State',
            rating: 4.9,
            images: [
                '/assets/categories/meat/image.jpg'
            ],
            quantity: 20,
            harvestDate: '2024-07-25',
            featured: true
        },
        {
            id: 'm2',
            name: 'Free-Range Chicken',
            category: '8',
            price: 85,
            unit: 'KG',
            farmer: 'Poultry Farm',
            location: 'Western Cape',
            rating: 4.7,
            images: [
                '/assets/categories/meat/image (1).jpg'
            ],
            quantity: 30,
            harvestDate: '2024-07-28',
            featured: false
        }
    ],
    '9': [ // fish
        {
            id: 'fs1',
            name: 'Fresh Salmon',
            category: '9',
            price: 220,
            unit: 'KG',
            farmer: 'Fish Farm',
            location: 'Western Cape',
            rating: 4.8,
            images: [
                '/assets/categories/fish/image.jpg'
            ],
            quantity: 15,
            harvestDate: '2024-08-01',
            featured: true
        },
        {
            id: 'fs2',
            name: 'Tuna Steaks',
            category: '9',
            price: 180,
            unit: 'KG',
            farmer: 'Ocean Farm',
            location: 'Western Cape',
            rating: 4.6,
            images: [
                '/assets/categories/fish/image (1).jpg'
            ],
            quantity: 25,
            harvestDate: '2024-07-30',
            featured: false
        }
    ],
    '10': [ // eggs
        {
            id: 'e1',
            name: 'Free-Range Eggs',
            category: '10',
            price: 45,
            unit: 'DOZEN',
            farmer: 'Egg Farm',
            location: 'Western Cape',
            rating: 4.7,
            images: [
                '/assets/categories/eggs/image.jpg'
            ],
            quantity: 80,
            harvestDate: '2024-08-01',
            featured: true
        },
        {
            id: 'e2',
            name: 'Organic Eggs',
            category: '10',
            price: 55,
            unit: 'DOZEN',
            farmer: 'Organic Farm',
            location: 'Western Cape',
            rating: 4.9,
            images: [
                '/assets/categories/eggs/image (1).jpg'
            ],
            quantity: 40,
            harvestDate: '2024-08-01',
            featured: false
        }
    ],
    '11': [ // oils
        {
            id: 'o1',
            name: 'Extra Virgin Olive Oil',
            category: '11',
            price: 95,
            unit: 'LITER',
            farmer: 'Olive Farm',
            location: 'Western Cape',
            rating: 4.8,
            images: [
                '/assets/categories/oils/image.jpg'
            ],
            quantity: 30,
            harvestDate: '2024-07-15',
            featured: true
        },
        {
            id: 'o2',
            name: 'Coconut Oil',
            category: '11',
            price: 75,
            unit: 'LITER',
            farmer: 'Coconut Farm',
            location: 'KwaZulu-Natal',
            rating: 4.6,
            images: [
                '/assets/categories/oils/image (1).jpg'
            ],
            quantity: 25,
            harvestDate: '2024-07-20',
            featured: false
        }
    ],
    '12': [ // herbs-and-spices
        {
            id: 'hs1',
            name: 'Fresh Basil',
            category: '12',
            price: 25,
            unit: 'BUNCH',
            farmer: 'Herb Farm',
            location: 'Western Cape',
            rating: 4.7,
            images: [
                '/assets/categories/herbs_and_spices/image.jpg'
            ],
            quantity: 50,
            harvestDate: '2024-08-01',
            featured: true
        },
        {
            id: 'hs2',
            name: 'Organic Turmeric',
            category: '12',
            price: 65,
            unit: 'KG',
            farmer: 'Spice Farm',
            location: 'KwaZulu-Natal',
            rating: 4.8,
            images: [
                '/assets/categories/herbs_and_spices/image (1).jpg'
            ],
            quantity: 20,
            harvestDate: '2024-07-25',
            featured: false
        }
    ]
}; 