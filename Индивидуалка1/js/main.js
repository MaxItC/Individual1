

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    initNavigation();
    initProducts();
    initFilters();
    initModal();
    initSmoothScroll();
    initScrollAnimations();
    loadProducts();
    updateCartCount();
}

// навигация
function initNavigation() {
    const burgerMenu = document.getElementById('burgerMenu');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Перемикання бургер-меню
    if (burgerMenu) {
        burgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            navList.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                burgerMenu.classList.remove('active');
                navList.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
            
            // Оновлення активної посилання
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Закриття меню при кліку поза ним
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            if (!event.target.closest('.main-nav') && !event.target.closest('.burger-menu')) {
                burgerMenu.classList.remove('active');
                navList.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });
}

window.products = [];


function initProducts() {

}

async function loadProducts() {
    try {

        window.products = [
            {
                id: 1,
                name: "Ноутбук ASUS VivoBook",
                description: "15.6 дюймів, Intel Core i5, 8GB RAM, 512GB SSD",
                price: 25999,
                category: "laptops",
                image: "res/images/product1.jpg"
            },
            {
                id: 2,
                name: "iPhone 14 Pro",
                description: "6.1 дюймів, 128GB, Space Black",
                price: 49999,
                category: "phones",
                image: "res/images/product2.jpg"
            },
            {
                id: 3,
                name: "Планшет Samsung Galaxy Tab",
                description: "10.4 дюймів, 64GB, Wi-Fi, Silver",
                price: 12999,
                category: "tablets",
                image: "res/images/product3.jpg"
            },
            {
                id: 4,
                name: "Навушники Sony WH-1000XM4",
                description: "Бездротові, шумозаглушення, 30 годин роботи",
                price: 8999,
                category: "accessories",
                image: "res/images/product4.jpg"
            },
            {
                id: 5,
                name: "Ноутбук Apple MacBook Air",
                description: "13.3 дюйми, M1, 8GB, 256GB SSD",
                price: 38999,
                category: "laptops",
                image: "res/images/product5.jpg"
            },
            {
                id: 6,
                name: "Samsung Galaxy S23",
                description: "6.1 дюймів, 256GB, Phantom Black",
                price: 41999,
                category: "phones",
                image: "res/images/product6.jpg"
            }
        ];
        
        displayProducts(products);
    } catch (error) {
        console.error('Помилка завантаження продуктів:', error);
        showNotification('Помилка завантаження продуктів', 'error');
    }
}

function displayProducts(productsToDisplay) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">Товари не знайдені</p>';
        return;
    }
    
    productsToDisplay.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card fade-in';
        productCard.style.animationDelay = `${index * 0.1}s`;
        productCard.dataset.category = product.category;
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price.toLocaleString()} грн</div>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Додати в кошик
                </button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            addToCart(productId);
        });
    });
}

function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            filterProducts(category);
        });
    });
}

function filterProducts(category) {
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        displayProducts(filteredProducts);
    }
}

function initModal() {
    const cartModal = document.getElementById('cartModal');
    const cartLinks = document.querySelectorAll('.cart-link, #checkoutBtn');
    const closeModal = document.getElementById('closeModal');
    const continueShopping = document.getElementById('continueShopping');
    
    cartLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!this.classList.contains('nav-link') || this.classList.contains('cart-link')) {
                e.preventDefault();
                openCartModal();
            }
        });
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', closeCartModal);
    }
    
    if (continueShopping) {
        continueShopping.addEventListener('click', closeCartModal);
    }
    
    cartModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeCartModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartModal.classList.contains('active')) {
            closeCartModal();
        }
    });
}

function openCartModal() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    updateModalCart();
}

function closeCartModal() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
}

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#home') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.main-header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function showNotification(message, type = 'success') {

    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    if (type === 'success') {
        notification.style.backgroundColor = '#2ecc71';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#e74c3c';
    } else if (type === 'warning') {
        notification.style.backgroundColor = '#f39c12';
    } else {
        notification.style.backgroundColor = '#3498db';
    }
    
    document.body.appendChild(notification);
    
    // Автоматичне видалення через 3 секунди
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

function formatPrice(price) {
    return price.toLocaleString('uk-UA') + ' грн';
}

// Експорт функцій для використання в інших файлах
window.App = {
    showNotification,
    formatPrice,
    updateCartCount: () => {
        if (window.updateCartCount) {
            window.updateCartCount();
        }
    }
};