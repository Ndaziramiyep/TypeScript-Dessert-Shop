/**
 * Order Manager Class
 * Handles order creation and management
 */
export class OrderManager {
    constructor() {
        this.orders = new Map();
    }
    /**
     * Create a new order from cart items
     * @param orderDetails - Order details including items and total
     * @returns Created order
     */
    createOrder(orderDetails) {
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newOrder = {
            id: orderId,
            items: orderDetails.items,
            total: orderDetails.total,
            status: 'pending',
            createdAt: new Date()
        };
        this.orders.set(orderId, newOrder);
        return newOrder;
    }
    /**
     * Confirm an existing order
     * @param orderId - ID of order to confirm
     * @returns Confirmed order or null if not found
     */
    confirmOrder(orderId) {
        const order = this.orders.get(orderId);
        if (!order) {
            return null;
        }
        const confirmedOrder = {
            ...order,
            status: 'confirmed',
            confirmedAt: new Date()
        };
        this.orders.set(orderId, confirmedOrder);
        return confirmedOrder;
    }
    /**
     * Get order by ID
     * @param orderId - ID of order to get
     * @returns Order or undefined
     */
    getOrder(orderId) {
        return this.orders.get(orderId);
    }
    /**
     * Get all orders
     * @returns Array of all orders
     */
    getAllOrders() {
        return Array.from(this.orders.values());
    }
    /**
     * Get orders by status
     * @param status - Status to filter by
     * @returns Array of orders with given status
     */
    getOrdersByStatus(status) {
        return this.getAllOrders().filter(order => order.status === status);
    }
    /**
     * Get order count
     * @returns Number of orders
     */
    getOrderCount() {
        return this.orders.size;
    }
}
