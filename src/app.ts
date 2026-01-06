// ============================================
// Main Application File (complete)
// ============================================

import { CartItem } from './types';
import { desserts } from './data';
import { ShoppingCart } from './shopping-cart';
import { OrderManager } from './order-manager';

const cart = new ShoppingCart();
const orderManager = new OrderManager();

const elements = {
  dessertsGrid: document.getElementById('desserts-grid') as HTMLDivElement,
  cartCount: document.getElementById('cart-count') as HTMLSpanElement,
  cartItemsList: document.getElementById('cart-items-list') as HTMLDivElement,
  cartEmptyState: document.getElementById('cart-empty-state') as HTMLDivElement,
  cartItemsContainer: document.getElementById('cart-items-container') as HTMLDivElement,
  cartSubtotal: document.getElementById('cart-subtotal') as HTMLSpanElement,
  cartTax: document.getElementById('cart-tax') as HTMLSpanElement,
  cartTotal: document.getElementById('cart-total') as HTMLSpanElement,
  clearCartBtn: document.getElementById('clear-cart-btn') as HTMLButtonElement,
  checkoutBtn: document.getElementById('checkout-btn') as HTMLButtonElement,

  toast: document.getElementById('toast') as HTMLDivElement,
  toastMessage: document.getElementById('toast-message') as HTMLSpanElement,

  orderFormModal: document.getElementById('order-form-modal') as HTMLDivElement,
  orderForm: document.getElementById('order-form') as HTMLFormElement,
  customerName: document.getElementById('customer-name') as HTMLInputElement,
  customerEmail: document.getElementById('customer-email') as HTMLInputElement,
  deliveryAddress: document.getElementById('delivery-address') as HTMLTextAreaElement,
  specialInstructions: document.getElementById('special-instructions') as HTMLTextAreaElement,
  orderReviewItems: document.getElementById('order-review-items') as HTMLDivElement,
  orderFormTotal: document.getElementById('order-form-total') as HTMLSpanElement,

  orderConfirmationModal: document.getElementById('order-confirmation-modal') as HTMLDivElement,
  orderNumber: document.getElementById('order-number') as HTMLSpanElement,
  orderTime: document.getElementById('order-time') as HTMLSpanElement,
  orderSummaryItems: document.getElementById('order-summary-items') as HTMLDivElement,
  orderConfirmTotal: document.getElementById('order-confirm-total') as HTMLSpanElement,
  startNewOrderBtn: document.getElementById('start-new-order-btn') as HTMLButtonElement,

  ordersModal: document.getElementById('orders-modal') as HTMLDivElement,
  ordersList: document.getElementById('orders-list') as HTMLDivElement,
  ordersTotal: document.getElementById('orders-total') as HTMLSpanElement,
  ordersRevenue: document.getElementById('orders-revenue') as HTMLSpanElement,

  viewOrdersBtn: document.getElementById('view-orders-btn') as HTMLButtonElement,
  exploreDessertsBtns: Array.from(document.querySelectorAll('.explore-btn')) as HTMLButtonElement[],
  modalCloseButtons: Array.from(document.querySelectorAll('.modal-close')) as HTMLButtonElement[],
  cancelOrderBtn: document.querySelector('.cancel-btn') as HTMLButtonElement,
  closeOrdersBtn: document.querySelector('.close-orders-btn') as HTMLButtonElement,

  totalOrders: document.getElementById('total-orders') as HTMLSpanElement,
  totalRevenue: document.getElementById('total-revenue') as HTMLSpanElement
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(price);
}

function showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  elements.toastMessage.textContent = message;
  elements.toast.className = `toast toast-${type}`;
  elements.toast.classList.remove('hidden');
  setTimeout(() => elements.toast.classList.add('hidden'), 3000);
}

function renderDesserts(): void {
  elements.dessertsGrid.innerHTML = '';

  desserts.forEach(dessert => {
    const item = cart.getItem(dessert.id);
    const qty = item ? item.quantity : 0;

    const card = document.createElement('article');
    card.className = 'dessert-card';
    card.innerHTML = `
      <div class="dessert-image-wrapper">
        <div class="dessert-image">
          <img src="${dessert.image}" alt="${dessert.name}">
        </div>
        ${qty > 0 ? `<div class="dessert-quantity-badge">${qty}</div>` : ''}
      </div>
      <div class="dessert-content">
        <div class="dessert-meta-top">
          <div>
            <h3 class="dessert-title">${dessert.name}</h3>
            <p class="dessert-category">${dessert.category}</p>
          </div>
          <div class="dessert-price">${formatPrice(dessert.price)}</div>
        </div>
        <p class="dessert-description">${dessert.description}</p>
        <div class="dessert-meta-bottom">
          <span class="star">★</span>
          <span>${dessert.rating.toFixed(1)}</span>
          <span>•</span>
          <span>${dessert.calories ?? 0} cal</span>
        </div>
        <div class="dessert-footer">
          ${dessert.inStock && qty > 0 ? `
            <div class="quantity-controls" data-id="${dessert.id}">
              <button type="button" class="quantity-btn quantity-minus" aria-label="Decrease">−</button>
              <span class="quantity-value">${qty}</span>
              <button type="button" class="quantity-btn quantity-plus" aria-label="Increase">+</button>
            </div>
          ` : ''}
          <button type="button" class="add-to-cart-btn" data-id="${dessert.id}" ${dessert.inStock ? '' : 'disabled'}>
            <i class="fas fa-shopping-basket"></i>
            ${qty > 0 ? 'Add More' : 'Add to Cart'}
          </button>
        </div>
      </div>
    `;
    elements.dessertsGrid.appendChild(card);
  });

  attachDessertEvents();
}

function attachDessertEvents(): void {
  document.querySelectorAll<HTMLButtonElement>('.add-to-cart-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const dessert = id ? desserts.find(d => d.id === id) : undefined;
      if (!dessert) return;
      try {
        cart.addItem(dessert, 1);
        showToast(`${dessert.name} added to cart`, 'success');
      } catch (e) {
        showToast((e as Error).message, 'error');
      }
    };
  });

  document.querySelectorAll<HTMLButtonElement>('.quantity-plus').forEach(btn => {
    btn.onclick = () => {
      const wrap = btn.closest<HTMLElement>('.quantity-controls');
      const id = wrap?.dataset.id;
      if (id) cart.incrementQuantity(id);
    };
  });

  document.querySelectorAll<HTMLButtonElement>('.quantity-minus').forEach(btn => {
    btn.onclick = () => {
      const wrap = btn.closest<HTMLElement>('.quantity-controls');
      const id = wrap?.dataset.id;
      if (id) cart.decrementQuantity(id);
    };
  });
}

function renderCart(): void {
  const items = cart.getItems();
  const totals = cart.getTotal();

  elements.cartCount.textContent = totals.itemCount.toString();
  elements.cartSubtotal.textContent = formatPrice(totals.subtotal);
  elements.cartTax.textContent = formatPrice(totals.tax);
  elements.cartTotal.textContent = formatPrice(totals.grandTotal);

  if (!items.length) {
    elements.cartEmptyState.classList.remove('hidden');
    elements.cartItemsContainer.classList.add('hidden');
    elements.cartItemsList.innerHTML = '';
    return;
  }

  elements.cartEmptyState.classList.add('hidden');
  elements.cartItemsContainer.classList.remove('hidden');

  const fragment = document.createDocumentFragment();
  items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-item-header">
        <div class="cart-item-name">${item.dessert.name}</div>
        <button type="button" class="remove-item-btn" data-id="${item.dessert.id}" aria-label="Remove ${item.dessert.name}">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="cart-item-body">
        <div class="cart-item-quantity">
          <button type="button" class="quantity-control" data-action="decrement" data-id="${item.dessert.id}">
            <i class="fas fa-minus"></i>
          </button>
          <span class="cart-item-quantity-value">${item.quantity}</span>
          <button type="button" class="quantity-control" data-action="increment" data-id="${item.dessert.id}">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="cart-item-price">
          <div class="price-per-item">${formatPrice(item.dessert.price)} each</div>
          <div class="price-total">${formatPrice(item.dessert.price * item.quantity)}</div>
        </div>
      </div>
    `;
    fragment.appendChild(row);
  });

  elements.cartItemsList.innerHTML = '';
  elements.cartItemsList.appendChild(fragment);
  attachCartEvents();
}

function attachCartEvents(): void {
  document.querySelectorAll<HTMLButtonElement>('.remove-item-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      if (id) cart.removeItem(id);
    };
  });

  document.querySelectorAll<HTMLButtonElement>('.quantity-control').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (!id || !action) return;
      if (action === 'increment') cart.incrementQuantity(id);
      else cart.decrementQuantity(id);
    };
  });
}

function openOrderForm(): void {
  const items = cart.getItems();
  if (!items.length) {
    showToast('Your cart is empty.', 'info');
    return;
  }

  const totals = cart.getTotal();
  elements.orderFormTotal.textContent = formatPrice(totals.grandTotal);

  const fragment = document.createDocumentFragment();
  items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'order-review-item';
    row.innerHTML = `
      <div>
        <div class="order-review-item-name">${item.dessert.name}</div>
        <div class="order-review-item-quantity">${item.quantity} × ${formatPrice(item.dessert.price)}</div>
      </div>
      <div class="order-review-item-price">${formatPrice(item.dessert.price * item.quantity)}</div>
    `;
    fragment.appendChild(row);
  });
  elements.orderReviewItems.innerHTML = '';
  elements.orderReviewItems.appendChild(fragment);
  elements.orderFormModal.classList.remove('hidden');
}

function closeOrderForm(): void {
  elements.orderFormModal.classList.add('hidden');
}

function openOrdersModal(): void {
  const orders = orderManager.getAllOrders();
  const fragment = document.createDocumentFragment();
  orders.forEach(order => {
    const block = document.createElement('div');
    block.className = 'order-history-item';
    block.innerHTML = `
      <div class="order-history-header">
        <div class="order-history-number">${order.orderNumber}</div>
        <div class="order-history-status status-${order.status}">${order.status.toUpperCase()}</div>
      </div>
      <div class="order-history-items">
        ${order.items.map(i => `
          <div class="order-history-item-row">
            <span>${i.quantity} × ${i.dessert.name}</span>
            <span>${formatPrice(i.dessert.price * i.quantity)}</span>
          </div>
        `).join('')}
      </div>
      <div class="order-history-footer">
        <span>${order.createdAt.toLocaleString()}</span>
        <strong>${formatPrice(order.total)}</strong>
      </div>
    `;
    fragment.appendChild(block);
  });
  elements.ordersList.innerHTML = '';
  elements.ordersList.appendChild(fragment);
  elements.ordersTotal.textContent = orderManager.getOrderCount().toString();
  elements.ordersRevenue.textContent = formatPrice(orderManager.getTotalRevenue());
  elements.ordersModal.classList.remove('hidden');
}

function closeOrdersModal(): void {
  elements.ordersModal.classList.add('hidden');
}

function showOrderConfirmation(orderId: string): void {
  const order = orderManager.getOrder(orderId);
  if (!order) return;

  elements.orderNumber.textContent = order.orderNumber;
  elements.orderTime.textContent = 'Just now';
  elements.orderConfirmTotal.textContent = formatPrice(order.total);

  const fragment = document.createDocumentFragment();
  order.items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'order-summary-item';
    row.innerHTML = `
      <span>${item.quantity} × ${item.dessert.name}</span>
      <span>${formatPrice(item.dessert.price * item.quantity)}</span>
    `;
    fragment.appendChild(row);
  });
  elements.orderSummaryItems.innerHTML = '';
  elements.orderSummaryItems.appendChild(fragment);

  elements.totalOrders.textContent = orderManager.getOrderCount().toString();
  elements.totalRevenue.textContent = formatPrice(orderManager.getTotalRevenue());
  elements.orderConfirmationModal.classList.remove('hidden');
}

function closeOrderConfirmation(): void {
  elements.orderConfirmationModal.classList.add('hidden');
}

function handleOrderSubmit(event: SubmitEvent): void {
  event.preventDefault();
  const items = cart.getItems();
  if (!items.length) {
    showToast('Your cart is empty.', 'info');
    return;
  }
  const totals = cart.getTotal();
  const order = orderManager.createOrder(
    {
      items,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.grandTotal,
      grandTotal: totals.grandTotal
    } as any,
    {
      name: elements.customerName.value,
      email: elements.customerEmail.value,
      address: elements.deliveryAddress.value
    }
  );
  const confirmed = orderManager.confirmOrder(order.id);
  if (!confirmed) {
    showToast('Unable to confirm order. Please try again.', 'error');
    return;
  }
  closeOrderForm();
  showOrderConfirmation(order.id);
  cart.clear();
}

function setupEvents(): void {
  elements.clearCartBtn.onclick = () => { if (!cart.isEmpty) cart.clear(); };
  elements.checkoutBtn.onclick = () => openOrderForm();
  elements.orderForm.addEventListener('submit', handleOrderSubmit);
  elements.cancelOrderBtn.onclick = () => closeOrderForm();

  elements.modalCloseButtons.forEach(btn => {
    btn.onclick = () => {
      const overlay = btn.closest<HTMLElement>('.modal-overlay');
      if (overlay) overlay.classList.add('hidden');
    };
  });

  elements.startNewOrderBtn.onclick = () => closeOrderConfirmation();
  elements.viewOrdersBtn.onclick = () => openOrdersModal();
  elements.closeOrdersBtn.onclick = () => closeOrdersModal();
  elements.exploreDessertsBtns.forEach(btn => {
    btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function bootstrap(): void {
  cart.subscribe(() => {
    renderCart();
    renderDesserts();
  });
  renderDesserts();
  renderCart();
  setupEvents();
}

bootstrap();

