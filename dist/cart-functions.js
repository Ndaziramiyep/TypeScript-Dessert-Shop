/**
 * Pure Functions for Cart Operations
 * Immutable operations that return new arrays
 */
/**
 * Add a dessert to the cart
 * @param cart - Current cart array
 * @param dessert - Dessert to add
 * @param quantity - Quantity to add (default: 1)
 * @returns New cart array with item added
 */
export function addToCart(cart, dessert, quantity = 1) {
    // Validate quantity
    if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
    }
    if (!dessert.inStock) {
        throw new Error(`Dessert "${dessert.name}" is out of stock`);
    }
    // Check if dessert already exists in cart
    const existingItemIndex = cart.findIndex(item => item.dessert.id === dessert.id);
    if (existingItemIndex !== -1) {
        // Update quantity for existing item
        const newCart = [...cart];
        newCart[existingItemIndex] = {
            ...newCart[existingItemIndex],
            quantity: newCart[existingItemIndex].quantity + quantity
        };
        return newCart;
    }
    else {
        // Add new item to cart
        const newItem = {
            dessert,
            quantity,
            addedAt: new Date()
        };
        return [...cart, newItem];
    }
}
/**
 * Remove a dessert from the cart by ID
 * @param cart - Current cart array
 * @param dessertId - ID of dessert to remove
 * @returns New cart array with item removed
 */
export function removeFromCart(cart, dessertId) {
    const itemIndex = cart.findIndex(item => item.dessert.id === dessertId);
    if (itemIndex === -1) {
        // Item not found, return original cart
        console.warn(`Item with ID ${dessertId} not found in cart`);
        return cart;
    }
    // Return new array without the item
    return cart.filter((_, index) => index !== itemIndex);
}
/**
 * Update quantity of a dessert in the cart
 * @param cart - Current cart array
 * @param dessertId - ID of dessert to update
 * @param newQuantity - New quantity (if 0 or less, item is removed)
 * @returns New cart array with updated quantity
 */
export function updateQuantity(cart, dessertId, newQuantity) {
    // If quantity is 0 or negative, remove the item
    if (newQuantity <= 0) {
        return removeFromCart(cart, dessertId);
    }
    const itemIndex = cart.findIndex(item => item.dessert.id === dessertId);
    if (itemIndex === -1) {
        // Item not found, return original cart
        console.warn(`Item with ID ${dessertId} not found in cart`);
        return cart;
    }
    // Update quantity for existing item
    const newCart = [...cart];
    newCart[itemIndex] = {
        ...newCart[itemIndex],
        quantity: newQuantity
    };
    return newCart;
}
/**
 * Helper function to increment quantity
 * @param cart - Current cart array
 * @param dessertId - ID of dessert to increment
 * @returns New cart array with incremented quantity
 */
export function incrementQuantity(cart, dessertId) {
    const item = cart.find(item => item.dessert.id === dessertId);
    if (!item)
        return cart;
    return updateQuantity(cart, dessertId, item.quantity + 1);
}
/**
 * Helper function to decrement quantity
 * @param cart - Current cart array
 * @param dessertId - ID of dessert to decrement
 * @returns New cart array with decremented quantity
 */
export function decrementQuantity(cart, dessertId) {
    const item = cart.find(item => item.dessert.id === dessertId);
    if (!item)
        return cart;
    return updateQuantity(cart, dessertId, item.quantity - 1);
}
/**
 * Calculate cart totals
 * @param cart - Cart array
 * @returns Object containing subtotal, tax, and grand total
 */
export function calculateTotal(cart) {
    const subtotal = cart.reduce((sum, item) => {
        return sum + (item.dessert.price * item.quantity);
    }, 0);
    // Calculate tax (10%)
    const tax = parseFloat((subtotal * 0.10).toFixed(2));
    const grandTotal = parseFloat((subtotal + tax).toFixed(2));
    return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax,
        grandTotal
    };
}
/**
 * Get the total number of items in cart (sum of quantities)
 * @param cart - Cart array
 * @returns Total number of items
 */
export function getItemCount(cart) {
    return cart.reduce((count, item) => count + item.quantity, 0);
}
/**
 * Check if cart is empty
 * @param cart - Cart array
 * @returns True if cart is empty
 */
export function isCartEmpty(cart) {
    return cart.length === 0;
}
