document.addEventListener('DOMContentLoaded', () => {
    // FILTRO DE PRODUCTOS
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    // Añadir calificación por defecto (5 estrellas) en cada tarjeta si no existe
    productCards.forEach(card => {
        if (!card.querySelector('.rating')) {
            const priceEl = card.querySelector('.price');
            if (priceEl) {
                const ratingWrap = document.createElement('div');
                ratingWrap.className = 'rating';
                // insertar 5 estrellas por defecto
                ratingWrap.innerHTML = '<i class="fas fa-star" aria-hidden="true"></i>'.repeat(5);
                // insertar antes del precio
                priceEl.parentNode.insertBefore(ratingWrap, priceEl);
            }
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.getAttribute('data-category');

            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // CARRITO
    const cartToggle = document.getElementById('cart-toggle');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsList = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    let cart = [];

    function saveCart() {
        localStorage.setItem('espejito_cart', JSON.stringify(cart));
    }

    function loadCart() {
        const stored = localStorage.getItem('espejito_cart');
        if (stored) {
            try {
                cart = JSON.parse(stored);
            } catch (e) {
                cart = [];
            }
        }
    }

    function formatPrice(num) {
        return '$' + Number(num).toLocaleString('es-CL');
    }

    function updateCartUI() {
        // actualizar contador
        const totalCount = cart.reduce((s, it) => s + it.qty, 0);
        cartCount.textContent = totalCount;

        // render items
        cartItemsList.innerHTML = '';
        cart.forEach((item, idx) => {
            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="name">${item.name}</div>
                    <div class="qty">${formatPrice(item.price)}</div>
                    <div class="qty-controls">
                        <button class="qty-btn qty-decrease" data-index="${idx}">-</button>
                        <div class="qty-number" data-index="${idx}">${item.qty}</div>
                        <button class="qty-btn qty-increase" data-index="${idx}">+</button>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-item" data-index="${idx}">Eliminar</button>
                </div>
            `;
            cartItemsList.appendChild(li);
        });

        const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
        cartTotal.textContent = formatPrice(total);
        saveCart();
    }

    function addToCart(product) {
        const existing = cart.find(it => it.name === product.name);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push(Object.assign({}, product, { qty: 1 }));
        }
        updateCartUI();
        // Mostrar toast de confirmación "Agregado al carrito"
        try {
            const toastEl = document.getElementById('addCartToast');
            if (toastEl && typeof bootstrap !== 'undefined') {
                const body = toastEl.querySelector('.toast-body');
                if (body) body.textContent = 'Agregado al carrito';
                const toast = new bootstrap.Toast(toastEl);
                toast.show();
            }
        } catch (err) {
            console.warn('No se pudo mostrar toast:', err);
        }
    }

    function removeFromCart(index) {
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            updateCartUI();
        }
    }

    // Delegación para botones dentro del carrito (Eliminar, +, -)
    cartItemsList.addEventListener('click', (e) => {
        if (e.target.matches('.remove-item')) {
            const idx = parseInt(e.target.getAttribute('data-index'), 10);
            removeFromCart(idx);
            return;
        }

        if (e.target.matches('.qty-increase')) {
            const idx = parseInt(e.target.getAttribute('data-index'), 10);
            changeQty(idx, 1);
            return;
        }

        if (e.target.matches('.qty-decrease')) {
            const idx = parseInt(e.target.getAttribute('data-index'), 10);
            changeQty(idx, -1);
            return;
        }
    });

    function changeQty(index, delta) {
        if (index >= 0 && index < cart.length) {
            cart[index].qty += delta;
            if (cart[index].qty <= 0) {
                // si llega a 0, eliminar del carrito
                cart.splice(index, 1);
            }
            updateCartUI();
        }
    }

    // Añadir listeners a los botones de cada tarjeta de producto
    productCards.forEach(card => {
        const btn = card.querySelector('button');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const nameEl = card.querySelector('.product-name');
            const priceEl = card.querySelector('.price');
            const imgEl = card.querySelector('img');
            const name = nameEl ? nameEl.textContent.trim() : 'Producto';
            let priceText = priceEl ? priceEl.textContent.trim() : '$0';
            // limpiar precio: eliminar símbolos y comas
            priceText = priceText.replace(/[^0-9.,]/g, '').replace(/,/g, '');
            const price = parseFloat(priceText) || 0;
            const img = imgEl ? imgEl.getAttribute('src') : '';

            addToCart({ name, price, img });
        });
    });

    // Toggle del sidebar del carrito
    cartToggle.addEventListener('click', () => {
        cartSidebar.classList.toggle('open');
    });
    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Añade productos antes de pagar.');
            return;
        }
        // Aquí podrías integrar el flujo de pago o redirigir a una página de checkout
        alert('Proceder al pago (demo). Total: ' + cartTotal.textContent);
    });

    // Cargar carrito al inicio
    loadCart();
    updateCartUI();
});