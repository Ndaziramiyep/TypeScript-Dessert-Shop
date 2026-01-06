/**
 * Dessert Data Array
 * Contains 9 dessert objects matching the UI images
 */
import { DessertCategory } from './types';
// Helper function to generate unique IDs
const generateId = (prefix) => {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
};
// Dessert data array with 9 items matching the images
export const desserts = [
    {
        id: generateId('waffle'),
        name: 'Waffle with Berries',
        category: DessertCategory.Waffle,
        price: 6.50,
        image: 'waffle-berries',
        description: 'Crispy waffle topped with fresh berries and maple syrup',
        inStock: true
    },
    {
        id: generateId('creme_brulee'),
        name: 'Vanilla Bean Crème Brûlée',
        category: DessertCategory.CremeBrulee,
        price: 7.00,
        image: 'creme-brulee',
        description: 'Classic French dessert with caramelized sugar topping',
        inStock: true
    },
    {
        id: generateId('macaron'),
        name: 'Macaron Mix of Five',
        category: DessertCategory.Macaron,
        price: 8.00,
        image: 'macaron-mix',
        description: 'Assortment of five colorful French macarons',
        inStock: true
    },
    {
        id: generateId('tiramisu'),
        name: 'Classic Tiramisu',
        category: DessertCategory.Tiramisu,
        price: 5.50,
        image: 'tiramisu',
        description: 'Italian dessert with layers of coffee-soaked ladyfingers',
        inStock: true
    },
    {
        id: generateId('baklava'),
        name: 'Pistachio Baklava',
        category: DessertCategory.Baklava,
        price: 4.00,
        image: 'baklava',
        description: 'Layered pastry with nuts and sweet syrup',
        inStock: true
    },
    {
        id: generateId('pie'),
        name: 'Lemon Meringue Pie',
        category: DessertCategory.Pie,
        price: 5.00,
        image: 'lemon-pie',
        description: 'Tangy lemon filling with fluffy meringue topping',
        inStock: true
    },
    {
        id: generateId('cake'),
        name: 'Red Velvet Cake',
        category: DessertCategory.Cake,
        price: 4.50,
        image: 'red-velvet',
        description: 'Moist red velvet cake with cream cheese frosting',
        inStock: true
    },
    {
        id: generateId('brownie'),
        name: 'Salted Caramel Brownie',
        category: DessertCategory.Brownie,
        price: 5.50,
        image: 'brownie',
        description: 'Rich chocolate brownie with salted caramel swirl',
        inStock: true
    },
    {
        id: generateId('panna_cotta'),
        name: 'Vanilla Panna Cotta',
        category: DessertCategory.PannaCotta,
        price: 6.50,
        image: 'panna-cotta',
        description: 'Italian cooked cream dessert with vanilla bean',
        inStock: true
    }
];
