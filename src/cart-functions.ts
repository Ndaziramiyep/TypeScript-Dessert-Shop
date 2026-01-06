// ============================================
// PHASE 2: Cart Logic & Pure Functions
// ============================================

import { CartItem, Dessert, DessertId } from './types';

/**
 * Task 2.1: Add to Cart Function
 * Adds a dessert to the cart or updates quantity if already exists
 * @param cart - Current cart array
 * @param dessert - Dessert to add
 * @param quantity - Quantity to add (default: 1)
 * @returns New cart array (immutable)
 */
export const addToCart = (cart: CartItem[], dessert: Dessert, quantity: number = 1): CartItem[] => {
  // Validate quantity
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }
  
  if (!dessert.inStock) {
    throw new Error(`"${dessert.name}" is currently out of stock`);
  }
  
  // Check if dessert already exists in cart
  const existingItemIndex = cart.findIndex(item => item.dessert.id === dessert.id);
  
  if (existingItemIndex !== -1) {
    // Update quantity for existing item (immutable update)
    return cart.map((item, index) => 
      index === existingItemIndex 
        ? { 
            ...item, 
            quantity: item.quantity + quantity,
            addedAt: new Date() // Update timestamp
          }
        : item
    );
  } else {
    // Add new item to cart
    const newItem: CartItem = {
      dessert,
      quantity,
      addedAt: new Date()
    };
    return [...cart, newItem];
  }
};

/**
 * Task 2.2: Remove from Cart Function
 * Removes an item from cart by dessert ID
 * @param cart - Current cart array
 * @param dessertId - ID of dessert to remove
 * @returns New cart array without the item
 */
export const removeFromCart = (cart: CartItem[], dessertId: string): CartItem[] => {
  const itemIndex = cart.findIndex(item => item.dessert.id === dessertId);
  
  if (itemIndex === -1) {
    console.warn(`Item with ID "${dessertId}" not found in cart`);
    return cart; // Return original cart if item not found
  }
  
  // Return new array without the item (immutable removal)
  return cart.filter((_, index) => index !== itemIndex);
};

/**
 * Task 2.3: Update Quantity Function
 * Updates quantity of a specific item in cart
 * @param cart - Current cart array
 * @param dessertId - ID of dessert to update
 * @param newQuantity - New quantity (if <= 0, removes item)
 * @returns New cart array with updated quantity
 */
export const updateQuantity = (cart: CartItem[], dessertId: string, newQuantity: number): CartItem[] => {
  // If quantity is 0 or negative, remove the item
  if (newQuantity <= 0) {
    return removeFromCart(cart, dessertId);
  }
  
  const itemIndex = cart.findIndex(item => item.dessert.id === dessertId);
  
  if (itemIndex === -1) {
    console.warn(`Item with ID "${dessertId}" not found in cart`);
    return cart;
  }
  
  // Validate stock availability
  const dessert = cart[itemIndex].dessert;
  if (newQuantity > 10) { // Arbitrary limit for demo
    throw new Error(`Maximum quantity of 10 allowed for "${dessert.name}"`);
  }
  
  // Update quantity for existing item (immutable update)
  return cart.map((item, index) => 
    index === itemIndex 
      ? { 
          ...item, 
          quantity: newQuantity,
          addedAt: new Date() // Update timestamp
        }
      : item
  );
};

/**
 * Task 2.3: Increment Quantity Helper
 * Increases quantity of an item by 1
 * @param cart - Current cart array
 * @param dessertId - ID of dessert to increment
 * @returns New cart array with incremented quantity
 */
export const incrementQuantity = (cart: CartItem[], dessertId: string): CartItem[] => {
  const item = cart.find(item => item.dessert.id === dessertId);
  if (!item) return cart;
  
  return updateQuantity(cart, dessertId, item.quantity + 1);
};

/**
 * Task 2.3: Decrement Quantity Helper
 * Decreases quantity of an item by 1
 * @param cart - Current cart array
 * @param dessertId - ID of dessert to decrement
 * @returns New cart array with decremented quantity
 */
export const decrementQuantity = (cart: CartItem[], dessertId: string): CartItem[] => {
  const item = cart.find(item => item.dessert.id === dessertId);
  if (!item) return cart;
  
  return updateQuantity(cart, dessertId, item.quantity - 1);
};

/**
 * Task 2.4: Calculate Cart Total
 * Calculates subtotal, tax, and grand total
 * @param cart - Cart array
 * @returns Object with subtotal, tax, and grand total
 */
export const calculateTotal = (cart: CartItem[]): { 
  subtotal: number; 
  tax: number; 
  grandTotal: number;
  itemCount: number;
} => {
  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => {
    return sum + (item.dessert.price * item.quantity);
  }, 0);
  
  // Calculate tax (10% for demo)
  const taxRate = 0.10;
  const tax = subtotal * taxRate;
  
  // Calculate grand total
  const grandTotal = subtotal + tax;
  
  // Calculate total item count
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
  
  // Round to 2 decimal places
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    grandTotal: parseFloat(grandTotal.toFixed(2)),
    itemCount
  };
};

/**
 * Check if cart is empty
 */
export const isCartEmpty = (cart: CartItem[]): boolean => {
  return cart.length === 0;
};

/**
 * Get cart item by dessert ID
 */
export const getCartItem = (cart: CartItem[], dessertId: string): CartItem | undefined => {
  return cart.find(item => item.dessert.id === dessertId);
};

/**
 * Clear entire cart
 */
export const clearCart = (): CartItem[] => {
  return [];
};