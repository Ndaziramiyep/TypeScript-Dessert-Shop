import { Product, CartItem, Cart } from './types'; // Importing necessary types
import { products } from './data/products'; // Importing product data

class DessertShop {
  private cart: Cart = { items: [], total: 0 };

  constructor() {
    this.init();
  }

  private init(): void {
    this.renderProducts();
    this.setupEventListeners();
  }

  private renderProducts(): void {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = products.map(product => `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image">
          <picture>
            <source media="(min-width: 1024px)" srcset="${product.image.desktop}">
            <source media="(min-width: 768px)" srcset="${product.image.tablet}">
            <img src="${product.image.mobile}" alt="${product.name}">
          </picture>
          <button class="add-to-cart-btn" data-id="${product.id}">
            <img src="./Project asset/assets/images/icon-add-to-cart.svg" alt="Add to cart">
            Add to Cart
          </button>
        </div>
        <div class="product-info">
          <p class="product-category">${product.category}</p>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">$${product.price.toFixed(2)}</p>
        </div>
      </div>
    `).join('');
  }

  private setupEventListeners(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.closest('.add-to-cart-btn')) {
        const btn = target.closest('.add-to-cart-btn') as HTMLButtonElement;
        const productId = parseInt(btn.dataset.id || '0');
        this.addToCart(productId);
      }

      if (target.closest('.increment-btn')) {
        const btn = target.closest('.increment-btn') as HTMLButtonElement;
        const productId = parseInt(btn.dataset.id || '0');
        this.incrementQuantity(productId);
      }

      if (target.closest('.decrement-btn')) {
        const btn = target.closest('.decrement-btn') as HTMLButtonElement;
        const productId = parseInt(btn.dataset.id || '0');
        this.decrementQuantity(productId);
      }

      if (target.closest('.remove-item-btn')) {
        const btn = target.closest('.remove-item-btn') as HTMLButtonElement;
        const productId = parseInt(btn.dataset.id || '0');
        this.removeFromCart(productId);
      }

      if (target.id === 'confirm-order' || target.id === 'mobile-confirm-order') {
        this.confirmOrder();
      }

      if (target.id === 'start-new-order') {
        this.startNewOrder();
      }

      if (target.id === 'view-all-order-items') {
        this.showAllOrderItems();
      }

      if (target.id === 'close-order-modal') {
        this.closeOrderModal();
      }
    });
  }

  private addToCart(productId: number): void {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = this.cart.items.find(item => item.product.id === productId);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.items.push({ product, quantity: 1 });
    }

    this.updateCart();
    this.updateProductButton(productId);
  }

  private incrementQuantity(productId: number): void {
    const item = this.cart.items.find(item => item.product.id === productId);
    if (item) {
      item.quantity++;
      this.updateCart();
      this.updateProductButton(productId);
    }
  }

  private decrementQuantity(productId: number): void {
    const item = this.cart.items.find(item => item.product.id === productId);
    if (item && item.quantity > 1) {
      item.quantity--;
      this.updateCart();
      this.updateProductButton(productId);
    }
  }

  private removeFromCart(productId: number): void {
    this.cart.items = this.cart.items.filter(item => item.product.id !== productId);
    this.updateCart();
    this.updateProductButton(productId);
  }

  private updateCart(): void {
    this.cart.total = this.cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    this.renderCart();
  }

  private renderCart(): void {
    const cartElement = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartElement || !cartCount || !cartTotal) return;

    const totalItems = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems.toString();

    if (this.cart.items.length === 0) {
      cartElement.innerHTML = `
        <div class="empty-cart">
          <img src="./Project asset/assets/images/illustration-empty-cart.svg" alt="Empty cart">
          <p>Your added items will appear here</p>
        </div>
      `;
      cartTotal.style.display = 'none';
    } else {
      cartElement.innerHTML = this.cart.items.map(item => `
        <div class="cart-item">
          <div class="item-info">
            <h4>${item.product.name}</h4>
            <div class="item-details">
              <span class="quantity">${item.quantity}x</span>
              <span class="unit-price">@ $${item.product.price.toFixed(2)}</span>
              <span class="total-price">$${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
          <button class="remove-item-btn" data-id="${item.product.id}">
            <img src="./Project asset/assets/images/icon-remove-item.svg" alt="Remove item">
          </button>
        </div>
      `).join('');

      cartTotal.style.display = 'block';
      cartTotal.querySelector('.total-price')!.textContent = `$${this.cart.total.toFixed(2)}`;
    }
  }

  private updateProductButton(productId: number): void {
    const productCard = document.querySelector(`[data-id="${productId}"]`);
    if (!productCard) return;

    const cartItem = this.cart.items.find(item => item.product.id === productId);
    const buttonContainer = productCard.querySelector('.product-image');
    
    if (cartItem) {
      buttonContainer!.innerHTML = `
        <picture>
          <source media="(min-width: 1024px)" srcset="${cartItem.product.image.desktop}">
          <source media="(min-width: 768px)" srcset="${cartItem.product.image.tablet}">
          <img src="${cartItem.product.image.mobile}" alt="${cartItem.product.name}">
        </picture>
        <div class="quantity-controls">
          <button class="decrement-btn" data-id="${productId}">
            <img src="./Project asset/assets/images/icon-decrement-quantity.svg" alt="Decrease quantity">
          </button>
          <span class="quantity">${cartItem.quantity}</span>
          <button class="increment-btn" data-id="${productId}">
            <img src="./Project asset/assets/images/icon-increment-quantity.svg" alt="Increase quantity">
          </button>
        </div>
      `;
      productCard.classList.add('selected');
    } else {
      const product = products.find(p => p.id === productId)!;
      buttonContainer!.innerHTML = `
        <picture>
          <source media="(min-width: 1024px)" srcset="${product.image.desktop}">
          <source media="(min-width: 768px)" srcset="${product.image.tablet}">
          <img src="${product.image.mobile}" alt="${product.name}">
        </picture>
        <button class="add-to-cart-btn" data-id="${productId}">
          <img src="./Project asset/assets/images/icon-add-to-cart.svg" alt="Add to cart">
          Add to Cart
        </button>
      `;
      productCard.classList.remove('selected');
    }
  }

  private confirmOrder(): void {
    const modal = document.getElementById('order-modal');
    const orderSummary = document.getElementById('order-summary');
    const modalContent = modal ? modal.querySelector('.modal-content') as HTMLElement | null : null;
    
    if (!modal || !orderSummary) return;

    const itemsToShow = this.cart.items.slice(0, 2);
    const showViewAll = this.cart.items.length > 2;

    if (modalContent) {
      modalContent.classList.remove('scrollable');
    }

    orderSummary.innerHTML = `
      <div class="order-items">
        ${itemsToShow.map(item => `
          <div class="order-item">
            <img src="${item.product.image.thumbnail}" alt="${item.product.name}">
            <div class="item-details">
              <h4>${item.product.name}</h4>
              <div class="item-pricing">
                <span class="quantity">${item.quantity}x</span>
                <span class="unit-price">@ $${item.product.price.toFixed(2)}</span>
              </div>
            </div>
            <span class="item-total">$${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join('')}
        ${showViewAll ? `<button class="view-all-btn" id="view-all-order-items">View all (${this.cart.items.length})</button>` : ''}
      </div>
      <div class="order-total">
        <span>Order Total</span>
        <span class="total-amount">$${this.cart.total.toFixed(2)}</span>
      </div>
    `;

    modal.style.display = 'flex';
  }

  private showAllOrderItems(): void {
    const modal = document.getElementById('order-modal');
    const orderSummary = document.getElementById('order-summary');
    const modalContent = modal ? modal.querySelector('.modal-content') as HTMLElement | null : null;

    if (!modal || !orderSummary || !modalContent) return;

    orderSummary.innerHTML = `
      <div class="order-items">
        ${this.cart.items.map(item => `
          <div class="order-item">
            <img src="${item.product.image.thumbnail}" alt="${item.product.name}">
            <div class="item-details">
              <h4>${item.product.name}</h4>
              <div class="item-pricing">
                <span class="quantity">${item.quantity}x</span>
                <span class="unit-price">@ $${item.product.price.toFixed(2)}</span>
              </div>
            </div>
            <span class="item-total">$${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join('')}
      </div>
      <div class="order-total">
        <span>Order Total</span>
        <span class="total-amount">$${this.cart.total.toFixed(2)}</span>
      </div>
    `;

    modalContent.classList.add('scrollable');
  }

  private closeOrderModal(): void {
    const modal = document.getElementById('order-modal');
    if (modal) {
      const modalContent = modal.querySelector('.modal-content') as HTMLElement | null;
      if (modalContent) {
        modalContent.classList.remove('scrollable');
      }
      modal.style.display = 'none';
    }
  }

  private startNewOrder(): void {
    this.cart = { items: [], total: 0 };
    this.updateCart();
    
    // Reset all product buttons
    products.forEach(product => this.updateProductButton(product.id));
    
    const modal = document.getElementById('order-modal');
    if (modal) modal.style.display = 'none';
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  new DessertShop();
});
