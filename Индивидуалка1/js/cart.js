

let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            closeCartModal();
            const orderSection = document.getElementById('order');
            if (orderSection) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = orderSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
});

// Додавання товару в кошик
function addToCart(productId) {
    const product = window.products?.find(p => p.id === productId);
    
    if (!product) {
        console.error('Товар не знайдений');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }
    
    saveCartToStorage();
    updateCartDisplay();
    
    window.App.showNotification(`${product.name} додано до кошика`);
    
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.classList.add('updated');
        setTimeout(() => {
            cartCount.classList.remove('updated');
        }, 500);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartDisplay();
    window.App.showNotification('Товар видалено з кошика');
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCartToStorage();
        updateCartDisplay();
    }
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartDisplay() {
    updateCartCount();
    updateCartItems();
    updateOrderSummary();
    updateModalCart();
}


function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
        element.style.display = totalItems > 0 ? 'flex' : 'none';
    });
    
    return totalItems;
}

function updateCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Кошик порожній</p>';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-details">
                    <span>${window.App.formatPrice(item.price)} × ${item.quantity}</span>
                </div>
            </div>
            <div class="cart-item-actions">
                <button class="remove-item" data-id="${item.id}" aria-label="Видалити">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            removeFromCart(productId);
        });
    });
}

function updateOrderSummary() {
    const totalItemsElement = document.getElementById('totalItems');
    const totalPriceElement = document.getElementById('totalPrice');
    
    if (!totalItemsElement || !totalPriceElement) return;
    
    const totalItems = updateCartCount();
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    totalItemsElement.textContent = totalItems;
    totalPriceElement.textContent = window.App.formatPrice(totalPrice);
}

function updateModalCart() {
    const modalCartItems = document.getElementById('modalCartItems');
    const modalTotalPrice = document.getElementById('modalTotalPrice');
    
    if (!modalCartItems || !modalTotalPrice) return;
    
    if (cart.length === 0) {
        modalCartItems.innerHTML = '<p class="empty-cart">Кошик порожній</p>';
        modalTotalPrice.textContent = '0';
        return;
    }
    
    modalCartItems.innerHTML = '';
    let totalPrice = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-details">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <div class="cart-item-price">${window.App.formatPrice(itemTotal)}</div>
                </div>
            </div>
            <div class="cart-item-actions">
                <button class="remove-item" data-id="${item.id}" aria-label="Видалити">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        modalCartItems.appendChild(cartItem);
    });
    
    modalTotalPrice.textContent = window.App.formatPrice(totalPrice);
    
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const item = cart.find(item => item.id === productId);
            
            if (!item) return;
            
            if (this.classList.contains('minus')) {
                updateQuantity(productId, item.quantity - 1);
            } else if (this.classList.contains('plus')) {
                updateQuantity(productId, item.quantity + 1);
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            removeFromCart(productId);
        });
    });
}

// Отримання даних кошика для оформлення замовлення
function getCartForOrder() {
    return {
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity
        })),
        totalItems: updateCartCount(),
        totalPrice: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    };
}

// Очищення кошика після успішного оформлення замовлення
function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartDisplay();
}

// Експорт функцій
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.getCartForOrder = getCartForOrder;
window.clearCart = clearCart;
window.updateCartCount = updateCartCount;