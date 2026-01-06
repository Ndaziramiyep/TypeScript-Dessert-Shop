/**
 * ShoppingCart Class
 * Object-oriented approach with private state and event system
 */
export class ShoppingCart {
    constructor(initialItems = []) {
        // Event listeners array
        this.listeners = [];
        this.items = new Map();
        initialItems.forEach(item => {
            this.items.set(item.dessert.id, item);
        });
    }
    /**
     * Add item to cart
     * @param dessert - Dessert to add
     * @param quantity - Quantity to add (default: 1)
     */
    addItem(dessert, quantity = 1) {
        if (quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }
        if (!dessert.inStock) {
            throw new Error(`Dessert "${dessert.name}" is out of stock`);
        }
        const existingItem = this.items.get(dessert.id);
        if (existingItem) {
            // Update existing item
            const updatedItem = {
                ...existingItem,
                quantity: existingItem.quantity + quantity
            };
            this.items.set(dessert.id, updatedItem);
            // Emit event
            this.emitEvent({
                type: 'quantity_updated',
                dessertId: dessert.id,
                quantity: updatedItem.quantity
            });
        }
        else {
            // Add new item
            const newItem = {
                dessert,
                quantity,
                addedAt: new Date()
            };
            this.items.set(dessert.id, newItem);
            // Emit event
            this.emitEvent({
                type: 'item_added',
                item: newItem
            });
        }
    }
    /**
     * Remove item from cart by ID
     * @param dessertId - ID of dessert to remove
     */
    removeItem(dessertId) {
        if (this.items.has(dessertId)) {
            this.items.delete(dessertId);
            // Emit event
            this.emitEvent({
                type: 'item_removed',
                dessertId
            });
        }
    }
    /**
     * Update quantity of an item
     * @param dessertId - ID of dessert to update
     * @param quantity - New quantity (0 or less removes the item)
     */
    updateQuantity(dessertId, quantity) {
        if (quantity <= 0) {
            this.removeItem(dessertId);
            return;
        }
        const item = this.items.get(dessertId);
        if (item) {
            const updatedItem = {
                ...item,
                quantity
            };
            this.items.set(dessertId, updatedItem);
            // Emit event
            this.emitEvent({
                type: 'quantity_updated',
                dessertId,
                quantity
            });
        }
    }
    /**
     * Increment quantity of an item by 1
     * @param dessertId - ID of dessert to increment
     */
    incrementQuantity(dessertId) {
        const item = this.items.get(dessertId);
        if (item) {
            this.updateQuantity(dessertId, item.quantity + 1);
        }
    }
    /**
     * Decrement quantity of an item by 1
     * @param dessertId - ID of dessert to decrement
     */
    decrementQuantity(dessertId) {
        const item = this.items.get(dessertId);
        if (item) {
            this.updateQuantity(dessertId, item.quantity - 1);
        }
    }
    /**
     * Calculate total price
     * @returns Object with subtotal, tax, and grand total
     */
    getTotal() {
        let subtotal = 0;
        this.items.forEach(item => {
            subtotal += item.dessert.price * item.quantity;
        });
        const tax = parseFloat((subtotal * 0.10).toFixed(2));
        const grandTotal = parseFloat((subtotal + tax).toFixed(2));
        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            tax,
            grandTotal
        };
    }
    /**
     * Get total number of items in cart
     * @returns Total item count
     */
    getItemCount() {
        let count = 0;
        this.items.forEach(item => {
            count += item.quantity;
        });
        return count;
    }
    /**
     * Get all cart items as array
     * @returns Array of cart items
     */
    getItems() {
        return Array.from(this.items.values());
    }
    /**
     * Clear all items from cart
     */
    clear() {
        this.items.clear();
        // Emit event
        this.emitEvent({
            type: 'cart_cleared'
        });
    }
    /**
     * Check if cart is empty
     * @returns True if cart is empty
     */
    get isEmpty() {
        return this.items.size === 0;
    }
    /**
     * Check if cart contains specific item
     * @param dessertId - ID to check
     * @returns True if item exists in cart
     */
    hasItem(dessertId) {
        return this.items.has(dessertId);
    }
    /**
     * Get specific item by ID
     * @param dessertId - ID of item to get
     * @returns CartItem or undefined
     */
    getItem(dessertId) {
        return this.items.get(dessertId);
    }
    /**
     * Subscribe to cart events
     * @param listener - Callback function for events
     * @returns Unsubscribe function
     */
    subscribe(listener) {
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
     * Emit event to all listeners
     * @param event - Event to emit
     */
    emitEvent(event) {
        this.listeners.forEach(listener => {
            try {
                listener(event);
            }
            catch (error) {
                console.error('Error in cart event listener:', error);
            }
        });
    }
}
