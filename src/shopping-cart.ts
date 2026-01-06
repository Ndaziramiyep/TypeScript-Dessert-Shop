// ============================================
// PHASE 3: Object-Oriented Shopping Cart
// ============================================

import { CartItem, Dessert, DessertId, CartEvent, CartEventListener, CartEventType } from './types';

/**
 * Task 3.1: ShoppingCart Class
 * Manages cart items with private Map storage
 */
export class ShoppingCart {
  // Private properties
  private items: Map<DessertId, CartItem>;
  private listeners: CartEventListener[];
  
  constructor(initialItems: CartItem[] = []) {
    this.items = new Map();
    this.listeners = [];
    
    // Initialize with items if provided
    initialItems.forEach(item => {
      this.items.set(item.dessert.id, item);
    });
  }
  
  /**
   * Add item to cart
   */
  addItem(dessert: Dessert, quantity: number = 1): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    
    if (!dessert.inStock) {
      throw new Error(`"${dessert.name}" is currently out of stock`);
    }
    
    const existingItem = this.items.get(dessert.id);
    
    if (existingItem) {
      // Update existing item
      const updatedItem: CartItem = {
        ...existingItem,
        quantity: existingItem.quantity + quantity,
        addedAt: new Date()
      };
      this.items.set(dessert.id, updatedItem);
      
      this.emitEvent({
        type: 'quantity_updated',
        data: { dessertId: dessert.id, quantity: updatedItem.quantity },
        timestamp: new Date()
      });
    } else {
      // Add new item
      const newItem: CartItem = {
        dessert,
        quantity,
        addedAt: new Date()
      };
      this.items.set(dessert.id, newItem);
      
      this.emitEvent({
        type: 'item_added',
        data: { item: newItem },
        timestamp: new Date()
      });
    }
    
    // Emit cart updated event
    this.emitCartUpdated();
  }
  
  /**
   * Remove item from cart
   */
  removeItem(dessertId: DessertId): void {
    if (this.items.has(dessertId)) {
      this.items.delete(dessertId);
      
      this.emitEvent({
        type: 'item_removed',
        data: { dessertId },
        timestamp: new Date()
      });
      
      this.emitCartUpdated();
    }
  }
  
  /**
   * Update item quantity
   */
  updateQuantity(dessertId: DessertId, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(dessertId);
      return;
    }
    
    const item = this.items.get(dessertId);
    if (item) {
      const updatedItem: CartItem = {
        ...item,
        quantity,
        addedAt: new Date()
      };
      this.items.set(dessertId, updatedItem);
      
      this.emitEvent({
        type: 'quantity_updated',
        data: { dessertId, quantity },
        timestamp: new Date()
      });
      
      this.emitCartUpdated();
    }
  }
  
  /**
   * Increment item quantity by 1
   */
  incrementQuantity(dessertId: DessertId): void {
    const item = this.items.get(dessertId);
    if (item) {
      this.updateQuantity(dessertId, item.quantity + 1);
    }
  }
  
  /**
   * Decrement item quantity by 1
   */
  decrementQuantity(dessertId: DessertId): void {
    const item = this.items.get(dessertId);
    if (item) {
      this.updateQuantity(dessertId, item.quantity - 1);
    }
  }
  
  /**
   * Calculate cart totals
   */
  getTotal(): { subtotal: number; tax: number; grandTotal: number; itemCount: number } {
    let subtotal = 0;
    let itemCount = 0;
    
    this.items.forEach(item => {
      subtotal += item.dessert.price * item.quantity;
      itemCount += item.quantity;
    });
    
    const taxRate = 0.10;
    const tax = subtotal * taxRate;
    const grandTotal = subtotal + tax;
    
    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      itemCount
    };
  }
  
  /**
   * Get item count (sum of quantities)
   */
  getItemCount(): number {
    return Array.from(this.items.values()).reduce((sum, item) => sum + item.quantity, 0);
  }
  
  /**
   * Get all cart items as array
   */
  getItems(): CartItem[] {
    return Array.from(this.items.values());
  }
  
  /**
   * Clear all items from cart
   */
  clear(): void {
    this.items.clear();
    
    this.emitEvent({
      type: 'cart_cleared',
      data: {},
      timestamp: new Date()
    });
    
    this.emitCartUpdated();
  }
  
  // ========== GETTERS ==========
  
  /**
   * Check if cart is empty
   */
  get isEmpty(): boolean {
    return this.items.size === 0;
  }
  
  /**
   * Check if item exists in cart
   */
  hasItem(dessertId: DessertId): boolean {
    return this.items.has(dessertId);
  }
  
  /**
   * Get specific item by ID
   */
  getItem(dessertId: DessertId): CartItem | undefined {
    return this.items.get(dessertId);
  }
  
  /**
   * Get unique item count (different desserts)
   */
  getUniqueItemCount(): number {
    return this.items.size;
  }
  
  // ========== EVENT SYSTEM ==========
  
  /**
   * Task 3.2: Subscribe to cart events
   * @param listener - Callback function
   * @returns Unsubscribe function
   */
  subscribe(listener: CartEventListener): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  /**
   * Emit cart updated event
   */
  private emitCartUpdated(): void {
    this.emitEvent({
      type: 'cart_updated',
      data: { cart: this.getItems() },
      timestamp: new Date()
    });
  }
  
  /**
   * Emit event to all listeners
   */
  private emitEvent(event: CartEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in cart event listener:', error);
      }
    });
  }
}