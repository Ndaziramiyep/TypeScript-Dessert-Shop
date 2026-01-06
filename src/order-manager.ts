// ============================================
// PHASE 3: Task 3.3 - Order Manager Class
// ============================================

import { CartItem, Order, OrderDetails, OrderStatus, OrderEventListener } from './types';

export class OrderManager {
  private orders: Map<string, Order>;
  private listeners: OrderEventListener[];
  private orderCounter: number;
  
  constructor() {
    this.orders = new Map();
    this.listeners = [];
    this.orderCounter = 1000; // Starting order number
  }
  
  /**
   * Create a new order from cart items
   */
  createOrder(orderDetails: OrderDetails, customerInfo?: {
    name?: string;
    email?: string;
    address?: string;
  }): Order {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orderNumber = `ORD-${this.orderCounter++}`;
    
    const newOrder: Order = {
      id: orderId,
      orderNumber,
      items: orderDetails.items,
      total: orderDetails.grandTotal,
      status: 'pending',
      createdAt: new Date(),
      customerName: customerInfo?.name,
      customerEmail: customerInfo?.email,
      deliveryAddress: customerInfo?.address
    };
    
    this.orders.set(orderId, newOrder);
    
    return newOrder;
  }
  
  /**
   * Confirm an existing order
   */
  confirmOrder(orderId: string): Order | null {
    const order = this.orders.get(orderId);
    
    if (!order) {
      console.error(`Order with ID "${orderId}" not found`);
      return null;
    }
    
    if (order.status !== 'pending') {
      console.error(`Order ${order.orderNumber} is already ${order.status}`);
      return null;
    }
    
    const confirmedOrder: Order = {
      ...order,
      status: 'confirmed',
      confirmedAt: new Date()
    };
    
    this.orders.set(orderId, confirmedOrder);
    
    // Notify listeners
    this.notifyOrderConfirmed(confirmedOrder);
    
    return confirmedOrder;
  }
  
  /**
   * Get order by ID
   */
  getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }
  
  /**
   * Get order by order number
   */
  getOrderByNumber(orderNumber: string): Order | undefined {
    return Array.from(this.orders.values()).find(order => order.orderNumber === orderNumber);
  }
  
  /**
   * Get all orders
   */
  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }
  
  /**
   * Get orders by status
   */
  getOrdersByStatus(status: OrderStatus): Order[] {
    return this.getAllOrders().filter(order => order.status === status);
  }
  
  /**
   * Update order status
   */
  updateOrderStatus(orderId: string, status: OrderStatus): boolean {
    const order = this.orders.get(orderId);
    
    if (!order) {
      return false;
    }
    
    const updatedOrder: Order = {
      ...order,
      status
    };
    
    this.orders.set(orderId, updatedOrder);
    
    if (status === 'confirmed') {
      updatedOrder.confirmedAt = new Date();
      this.notifyOrderConfirmed(updatedOrder);
    }
    
    return true;
  }
  
  /**
   * Get order count
   */
  getOrderCount(): number {
    return this.orders.size;
  }
  
  /**
   * Get total revenue from all orders
   */
  getTotalRevenue(): number {
    return Array.from(this.orders.values())
      .reduce((total, order) => total + order.total, 0);
  }
  
  /**
   * Subscribe to order events
   */
  subscribe(listener: OrderEventListener): () => void {
    this.listeners.push(listener);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  /**
   * Notify listeners about order confirmation
   */
  private notifyOrderConfirmed(order: Order): void {
    this.listeners.forEach(listener => {
      try {
        listener(order);
      } catch (error) {
        console.error('Error in order event listener:', error);
      }
    });
  }
}