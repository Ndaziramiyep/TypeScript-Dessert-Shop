// ============================================
// PHASE 1: Task 1.3 - Create Dessert Data Array
// ============================================

import { Dessert, DessertCategory } from './types';

// Generate unique ID helper
const generateId = (name: string): string => {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Task 1.3: Build array of 9 dessert objects matching UI images
export const desserts: Dessert[] = [
  {
    id: generateId('Waffle with Berries'),
    name: 'Waffle with Berries',
    category: DessertCategory.Waffle,
    price: 6.50,
    image: 'assets/images/waffle-berries.jpg',
    description: 'Crispy Belgian waffle topped with fresh mixed berries, whipped cream, and maple syrup',
    inStock: true,
    calories: 420,
    rating: 4.8
  },
  {
    id: generateId('Vanilla Bean Crème Brûlée'),
    name: 'Vanilla Bean Crème Brûlée',
    category: DessertCategory.CremeBrulee,
    price: 7.00,
    image: 'assets/images/creme-brulee.jpg',
    description: 'Classic French dessert with rich vanilla bean custard and caramelized sugar crust',
    inStock: true,
    calories: 320,
    rating: 4.9
  },
  {
    id: generateId('Macaron Mix of Five'),
    name: 'Macaron Mix of Five',
    category: DessertCategory.Macaron,
    price: 8.00,
    image: 'assets/images/macaron-mix.jpg',
    description: 'Assortment of five delicate French macarons in various flavors and colors',
    inStock: true,
    calories: 180,
    rating: 4.7
  },
  {
    id: generateId('Classic Tiramisu'),
    name: 'Classic Tiramisu',
    category: DessertCategory.Tiramisu,
    price: 5.50,
    image: 'assets/images/tiramisu.jpg',
    description: 'Layers of coffee-soaked ladyfingers and mascarpone cream, dusted with cocoa',
    inStock: true,
    calories: 380,
    rating: 4.8
  },
  {
    id: generateId('Pistachio Baklava'),
    name: 'Pistachio Baklava',
    category: DessertCategory.Baklava,
    price: 4.00,
    image: 'assets/images/baklava.jpg',
    description: 'Flaky phyllo pastry layered with crushed pistachios and sweet honey syrup',
    inStock: true,
    calories: 280,
    rating: 4.6
  },
  {
    id: generateId('Lemon Meringue Pie'),
    name: 'Lemon Meringue Pie',
    category: DessertCategory.Pie,
    price: 5.00,
    image: 'assets/images/lemon-pie.jpg',
    description: 'Tangy lemon filling topped with fluffy toasted meringue in a buttery crust',
    inStock: true,
    calories: 350,
    rating: 4.7
  },
  {
    id: generateId('Red Velvet Cake'),
    name: 'Red Velvet Cake',
    category: DessertCategory.Cake,
    price: 4.50,
    image: 'assets/images/red-velvet.jpg',
    description: 'Moist red velvet layers with creamy cheesecake frosting and chocolate shavings',
    inStock: true,
    calories: 420,
    rating: 4.8
  },
  {
    id: generateId('Salted Caramel Brownie'),
    name: 'Salted Caramel Brownie',
    category: DessertCategory.Brownie,
    price: 5.50,
    image: 'assets/images/brownie.jpg',
    description: 'Fudgy chocolate brownie with sea salt caramel swirl and walnut pieces',
    inStock: true,
    calories: 450,
    rating: 4.9
  },
  {
    id: generateId('Vanilla Panna Cotta'),
    name: 'Vanilla Panna Cotta',
    category: DessertCategory.PannaCotta,
    price: 6.50,
    image: 'assets/images/panna-cotta.jpg',
    description: 'Italian cooked cream dessert with vanilla bean, served with berry compote',
    inStock: true,
    calories: 290,
    rating: 4.7
  }
];

// Utility function to get dessert by ID
export const getDessertById = (id: string): Dessert | undefined => {
  return desserts.find(dessert => dessert.id === id);
};

// Utility function to get desserts by category
export const getDessertsByCategory = (category: DessertCategory): Dessert[] => {
  return desserts.filter(dessert => dessert.category === category);
};