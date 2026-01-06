/**
 * Main Application
 * Handles UI rendering and event binding
 */

import { Dessert, CartItem } from './types';
import { desserts } from './data';
import { ShoppingCart } from './shopping-cart';
import { OrderManager } from './order-manager';

// Initialize cart and order manager
const cart = new ShoppingCart();
const orderManager = new OrderManager();

// DOM Elements
const dessertsGrid = document.getElementById('desserts-grid')!;
const cartItemsList = document.getElementById('cart-items-list')!;
const cartEmptyState = document.getElementById('cart-empty-state')!;
const cartItemsContainer = document.getElementById('cart-items-container')!;
const cartCount = document.getElementById('cart-count')!;
const cartTitle = document.getElementById('cart-title')!;
const cartSubtotal = document.getElementById('cart-subtotal')!;
const cartTax = document.getElementById('cart-tax')!;
const cartTotal = document.getElementById('cart-total')!;
const clearCartBtn = document.getElementById('clear-cart-btn')!;
const confirmOrderBtn = document.getElementById('confirm-order-btn')!;
const startNewOrderBtn = document.getElementById('start-new-order-btn')!;
const orderConfirmationModal = document.getElementById('order-confirmation-modal')!;
const orderSummary = document.getElementById('order-summary')!;
const orderConfirmTotal = document.getElementById('order-confirm-total')!;
const closeOrderModalBtn = document.getElementById('close-order-modal-btn')!;

/**
 * Format price as currency
 * @param price - Price to format
 * @returns Formatted price string
 */
function formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
}

/**
 * Render dessert cards
 */
function renderDesserts(): void {
    dessertsGrid.innerHTML = '';
    
    desserts.forEach(dessert => {
        const dessertCard = document.createElement('div');
        dessertCard.className = 'dessert-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-200';
        
        dessertCard.innerHTML = `
            <div class="p-5">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="text-lg font-bold text-gray-800">${dessert.name}</h3>
                        <p class="text-sm text-gray-600 mt-1">${dessert.description}</p>
                    </div>
                    <span class="text-xl font-bold text-yellow-600">${formatPrice(dessert.price)}</span>
                </div>
                
                <div class="flex justify-between items-center mt-4">
                    <span class="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                        ${dessert.category}
                    </span>
                    <button 
                        class="add-to-cart-btn bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
                        data-dessert-id="${dessert.id}"
                    >
                        <i class="fas fa-plus mr-2"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        dessertsGrid.appendChild(dessertCard);
    });
    
    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const button = target.closest('.add-to-cart-btn') as HTMLButtonElement;
            const dessertId = button.dataset.dessertId!;
            const dessert = desserts.find(d => d.id === dessertId);
            
            if (dessert) {
                cart.addItem(dessert);
                
                // Visual feedback
                button.classList.add('bg-green-500');
                button.innerHTML = '<i class="fas fa-check mr-2"></i> Added!';
                
                setTimeout(() => {
                    button.classList.remove('bg-green-500');
                    button.innerHTML = '<i class="fas fa-plus mr-2"></i> Add to Cart';
                }, 1000);
            }
        });
    });
}

/**
 * Render cart items
 */
function renderCartItems(): void {
    const items = cart.getItems();
    
    if (items.length === 0) {
        cartEmptyState.classList.remove('hidden');
        cartItemsContainer.classList.add('hidden');
        clearCartBtn.classList.add('hidden');
        confirmOrderBtn.classList.add('hidden');
        startNewOrderBtn.classList.add('hidden');
        return;
    }
    
    cartEmptyState.classList.add('hidden');
    cartItemsContainer.classList.remove('hidden');
    clearCartBtn.classList.remove('hidden');
    confirmOrderBtn.classList.remove('hidden');
    
    // Update cart count
    const itemCount = cart.getItemCount();
    cartCount.textContent = itemCount.toString();
    
    // Update cart title
    cartTitle.innerHTML = `Your Cart (<span id="cart-count">${itemCount}</span>)`;
    
    // Clear and render cart items
    cartItemsList.innerHTML = '';
    
    items.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item bg-gray-50 p-4 rounded-lg';
        
        cartItemElement.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <h4 class="font-bold text-gray-800">${item.dessert.name}</h4>
                <button class="remove-item-btn text-red-500 hover:text-red-700" data-dessert-id="${item.dessert.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="flex justify-between items-center">
                <div class="flex items-center">
                    <button class="decrement-btn text-gray-600 hover:text-gray-800 p-1" data-dessert-id="${item.dessert.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display mx-3 font-medium">${item.quantity}x</span>
                    <button class="increment-btn text-gray-600 hover:text-gray-800 p-1" data-dessert-id="${item.dessert.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="text-right">
                    <div class="text-sm text-gray-600">@ ${formatPrice(item.dessert.price)}</div>
                    <div class="text-lg font-bold text-gray-800">${formatPrice(item.dessert.price * item.quantity)}</div>
                </div>
            </div>
        `;
        
        cartItemsList.appendChild(cartItemElement);
    });
    
    // Add event listeners to cart item buttons
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const button = target.closest('.remove-item-btn') as HTMLButtonElement;
            const dessertId = button.dataset.dessertId!;
            cart.removeItem(dessertId);
        });
    });
    
    document.querySelectorAll('.increment-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const button = target.closest('.increment-btn') as HTMLButtonElement;
            const dessertId = button.dataset.dessertId!;
            cart.incrementQuantity(dessertId);
        });
    });
    
    document.querySelectorAll('.decrement-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const button = target.closest('.decrement-btn') as HTMLButtonElement;
            const dessertId = button.dataset.dessertId!;
            cart.decrementQuantity(dessertId);
        });
    });
    
    // Update totals
    updateCartTotals();
}

/**
 * Update cart totals display
 */
function updateCartTotals(): void {
    const totals = cart.getTotal();
    
    cartSubtotal.textContent = formatPrice(totals.subtotal);
    cartTax.textContent = formatPrice(totals.tax);
    cartTotal.textContent = formatPrice(totals.grandTotal);
}

/**
 * Show order confirmation modal
 */
function showOrderConfirmation(orderId: string): void {
    const order = orderManager.getOrder(orderId);
    
    if (!order) {
        console.error('Order not found:', orderId);
        return;
    }
    
    // Update order summary
    orderSummary.innerHTML = '';
    
    order.items.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'mb-4 pb-4 border-b last:border-b-0';
        
        orderItem.innerHTML = `
            <div class="flex justify-between mb-1">
                <span class="font-medium">${item.dessert.name}</span>
                <span class="text-gray-600">${item.quantity}x @ ${formatPrice(item.dessert.price)}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-sm text-gray-500">${item.dessert.category}</span>
                <span class="font-bold">${formatPrice(item.dessert.price * item.quantity)}</span>
            </div>
        `;
        
        orderSummary.appendChild(orderItem);
    });
    
    orderConfirmTotal.textContent = formatPrice(order.total);
    
    // Show modal
    orderConfirmationModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

/**
 * Handle order confirmation
 */
function handleOrderConfirmation(): void {
    const items = cart.getItems();
    
    if (items.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const totals = cart.getTotal();
    const orderDetails = {
        items,
        total: totals.grandTotal
    };
    
    const order = orderManager.createOrder(orderDetails);
    const confirmedOrder = orderManager.confirmOrder(order.id);
    
    if (confirmedOrder) {
        // Clear cart
        cart.clear();
        
        // Show confirmation modal
        showOrderConfirmation(confirmedOrder.id);
    }
}

/**
 * Initialize event listeners
 */
function initializeEventListeners(): void {
    // Clear cart button
    clearCartBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            cart.clear();
        }
    });
    
    // Confirm order button
    confirmOrderBtn.addEventListener('click', handleOrderConfirmation);
    
    // Start new order button (in modal)
    closeOrderModalBtn.addEventListener('click', () => {
        orderConfirmationModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });
    
    // Start new order button (in cart when empty)
    startNewOrderBtn.addEventListener('click', () => {
        // In a real app, this might reset the UI state
        renderDesserts();
    });
    
    // Close modal when clicking outside
    orderConfirmationModal.addEventListener('click', (e) => {
        if (e.target === orderConfirmationModal) {
            orderConfirmationModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Subscribe to cart changes
    cart.subscribe((event) => {
        console.log('Cart event:', event);
        renderCartItems();
        
        // Add animation effect
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.classList.add('cart-update');
            setTimeout(() => {
                cartCountElement.classList.remove('cart-update');
            }, 300);
        }
    });
}

/**
 * Initialize the application
 */
function initApp(): void {
    console.log('TypeScript Dessert Shop initialized');
    
    // Render initial state
    renderDesserts();
    renderCartItems();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Add some sample items to cart for demo (optional)
    // Uncomment to start with sample items
    /*
    setTimeout(() => {
        const tiramisu = desserts.find(d => d.name.includes('Tiramisu'));
        const cremeBrulee = desserts.find(d => d.name.includes('Crème Brûlée'));
        const pannaCotta = desserts.find(d => d.name.includes('Panna Cotta'));
        
        if (tiramisu) cart.addItem(tiramisu, 1);
        if (cremeBrulee) cart.addItem(cremeBrulee, 4);
        if (pannaCotta) cart.addItem(pannaCotta, 2);
    }, 1000);
    */
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);