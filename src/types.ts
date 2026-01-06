// ============================================
// PHASE 1: Foundation & Type Definitions
// ============================================

// Task 1.2: Define DessertCategory Enum
export enum DessertCategory {
  Waffle = 'Waffle',
  CremeBrulee = 'Crème Brûlée',
  Macaron = 'Macaron',
  Tiramisu = 'Tiramisu',
  Baklava = 'Baklava',
  Pie = 'Pie',
  Cake = 'Cake',
  Brownie = 'Brownie',
  PannaCotta = 'Panna Cotta'
}

// Task 1.2: Create Type Aliases
export type DessertId = string;
export type Currency = 'USD' | 'EUR' | 'GBP';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';

// Task 1.1: Create Dessert Interface
export interface Dessert {
  id: DessertId;
  name: string;
  category: DessertCategory;
  price: number;
  image: string;
  description: string;
  inStock: boolean;
  calories?: number;
  rating: number;
}

// Task 1.1: Create CartItem Interface
export interface CartItem {
  dessert: Dessert;
  quantity: number;
  addedAt: Date;
}

// Task 3.2: Define CartEvent Discriminated Union
export type CartEventType = 'item_added' | 'item_removed' | 'quantity_updated' | 'cart_cleared' | 'cart_updated';

export interface CartEvent {
  type: CartEventType;
  data: {
    dessertId?: DessertId;
    item?: CartItem;
    quantity?: number;
    cart?: CartItem[];
  };
  timestamp: Date;
}

// Task 3.3: Define Order Interfaces
export interface OrderDetails {
  items: CartItem[];
  total: number;
  tax: number;
  subtotal: number;
  deliveryFee?: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  confirmedAt?: Date;
  customerName?: string;
  customerEmail?: string;
  deliveryAddress?: string;
}

// Type for Event Listener Callback
export type CartEventListener = (event: CartEvent) => void;

// Type for Order Callback
export type OrderEventListener = (order: Order) => void;