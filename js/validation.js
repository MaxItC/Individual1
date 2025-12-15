

document.addEventListener('DOMContentLoaded', function() {
    initFormValidation();
});

function initFormValidation() {
    const orderForm = document.getElementById('orderForm');
    
    if (orderForm) {
        initLiveValidation();
        
        orderForm.addEventListener('submit', handleOrderSubmit);
    }
}

function initLiveValidation() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            validateName(this.value, 'nameError');
        });
        
        nameInput.addEventListener('blur', function() {
            validateName(this.value, 'nameError');
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            validateEmail(this.value, 'emailError');
        });
        
        emailInput.addEventListener('blur', function() {
            validateEmail(this.value, 'emailError');
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            validatePhone(this.value, 'phoneError');
        });
        
        phoneInput.addEventListener('blur', function() {
            validatePhone(this.value, 'phoneError');
        });
    }
    
    if (addressInput) {
        addressInput.addEventListener('input', function() {
            validateAddress(this.value, 'addressError');
        });
        
        addressInput.addEventListener('blur', function() {
            validateAddress(this.value, 'addressError');
        });
    }
}


function validateName(name, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    
    if (!name.trim()) {
        showError(errorElement, "Будь ласка, введіть своє ім'я");
        return false;
    }
    
    if (name.length < 2) {
        showError(errorElement, "Ім'я має містити щонайменше 2 символи");
        return false;
    }
    
    if (!/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ'\-\s]+$/.test(name)) {
        showError(errorElement, "Ім'я містить недопустимі символи");
        return false;
    }
    
    clearError(errorElement);
    return true;
}

function validateEmail(email, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
        showError(errorElement, "Будь ласка, введіть email");
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showError(errorElement, "Будь ласка, введіть коректний email");
        return false;
    }
    
    clearError(errorElement);
    return true;
}


function validatePhone(phone, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    const phoneRegex = /^\+380\d{9}$/;
    
    if (!phone.trim()) {
        showError(errorElement, "Будь ласка, введіть номер телефону");
        return false;
    }
    
    // Видаляємо все крім цифр і плюса
    const cleanedPhone = phone.replace(/[^\d+]/g, '');
    
    if (!phoneRegex.test(cleanedPhone)) {
        showError(errorElement, "Будь ласка, введіть коректний номер телефону у форматі +380XXXXXXXXX");
        return false;
    }
    
    clearError(errorElement);
    return true;
}

function validateAddress(address, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    
    if (!address.trim()) {
        showError(errorElement, "Будь ласка, введіть адресу доставки");
        return false;
    }
    
    if (address.length < 10) {
        showError(errorElement, "Адреса має містити щонайменше 10 символів");
        return false;
    }
    
    clearError(errorElement);
    return true;
}


function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        element.parentElement.classList.add('error');
    }
}

function clearError(element) {
    if (element) {
        element.textContent = '';
        element.style.display = 'none';
        element.parentElement.classList.remove('error');
    }
}

async function handleOrderSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const payment = document.getElementById('payment').value;
    
    const isNameValid = validateName(name, 'nameError');
    const isEmailValid = validateEmail(email, 'emailError');
    const isPhoneValid = validatePhone(phone, 'phoneError');
    const isAddressValid = validateAddress(address, 'addressError');
    
    const cartData = window.getCartForOrder ? window.getCartForOrder() : { totalItems: 0 };
    if (cartData.totalItems === 0) {
        window.App.showNotification('Кошик порожній. Додайте товари перед оформленням замовлення', 'error');
        return;
    }
    
    if (!isNameValid || !isEmailValid || !isPhoneValid || !isAddressValid) {
        window.App.showNotification('Будь ласка, виправте помилки у формі', 'error');
        return;
    }

    const submitBtn = event.target.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обробка...';
    submitBtn.disabled = true;
    
    try {

        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const order = {
            customer: { name, email, phone, address },
            payment,
            cart: cartData,
            orderDate: new Date().toISOString(),
            orderId: 'ORD-' + Date.now()
        };
        
        saveOrderToStorage(order);
        
        if (window.clearCart) {
            window.clearCart();
        }
        
        event.target.reset();
        
        window.App.showNotification(`Замовлення №${order.orderId} успішно оформлено!`, 'success');
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
    } catch (error) {
        console.error('Помилка оформлення замовлення:', error);
        window.App.showNotification('Помилка оформлення замовлення. Спробуйте ще раз.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function saveOrderToStorage(order) {
    try {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        
        localStorage.setItem('orders', JSON.stringify(orders));
        
        return true;
    } catch (error) {
        console.error('Помилка збереження замовлення:', error);
        return false;
    }
}

function validatePassword(password, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    
    if (!password) {
        showError(errorElement, "Будь ласка, введіть пароль");
        return false;
    }
    
    if (password.length < 8) {
        showError(errorElement, "Пароль має містити щонайменше 8 символів");
        return false;
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        showError(errorElement, "Пароль має містити великі та малі літери, а також цифри");
        return false;
    }
    
    clearError(errorElement);
    return true;
}

function validatePasswordConfirm(password, confirmPassword, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    
    if (password !== confirmPassword) {
        showError(errorElement, "Паролі не співпадають");
        return false;
    }
    
    clearError(errorElement);
    return true;
}


window.Validation = {
    validateName,
    validateEmail,
    validatePhone,
    validateAddress,
    validatePassword,
    validatePasswordConfirm
};