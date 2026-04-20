    // ========== МЕНЮ МААЛЫМАТТАРЫ ==========
    const menuData = {
        shaurma: [
            { name: "Шаурма тоок этинен", price: 220, id: "sh1" },
            { name: "Шаурма уй этинен", price: 230, id: "sh2" },
            { name: "Бышырылган Шаурма", price: 240, id: "sh3" },
            { name: "Шурма питеде", price: 250, id: "sh4" },
            { name: "Эттуу нан", price: 280, id: "sh5" }
        ],
        hotdog: [
            { name: "Классика Хот-Дог", price: 160, id: "hd1" },
            { name: "Острый Хот-Дог", price: 170, id: "hd2" },
            { name: "Чиз Хот-Дог", price: 180, id: "hd3" }
        ],
        burger: [
            { name: "Кинг Бургер", price: 210, id: "bg1" },
            { name: "Чизбургер", price: 200, id: "bg2" },
            { name: "Двойной Чизбургер", price: 230, id: "bg3" },
            { name: "Чикен бургер", price: 190, id: "bg4" },
            { name: "Двойной Чикен бургер", price: 220, id: "bg5" }
        ],
        combo: [
            { name: "Кинг комбо", price: 600, id: "cb1" },
            { name: "03 комбо", price: 500, id: "cb2" }
        ],
        drinks: [
            { name: "Фри S 150гр", price: 130, id: "dr1" },
            { name: "Фри M 220гр", price: 150, id: "dr2" },
            { name: "Чеддер Фрайс", price: 160, id: "dr3" },
            { name: "Наггетсы", price: 150, id: "dr4" },
            { name: "Султан чай 1л", price: 60, id: "dr5" },
            { name: "Мохито 0.5л", price: 80, id: "dr6" },
            { name: "Нитро 0.5л", price: 80, id: "dr7" },
            { name: "Летс гоу 1.25л", price: 100, id: "dr8" },
            { name: " груша 0.5л", price: 60, id: "dr9" },
            { name: "Кола/Фанта/Пепси 1л", price: 100, id: "dr10" },
            // { name: "Кофе 3/1", price: 40, id: "dr11" },
            // { name: "Чай", price: 20, id: "dr12" }
        ]
    };

    let cart = [];

    function showToast(msg) {
        let toast = document.createElement('div');
        toast.className = 'toast-msg';
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    function saveCart() {
        localStorage.setItem('king_food_cart', JSON.stringify(cart));
    }

    function loadCart() {
        let saved = localStorage.getItem('king_food_cart');
        if (saved) {
            cart = JSON.parse(saved);
            updateCartDisplay();
        }
    }

    function updateCartDisplay() {
        let count = cart.reduce((s, i) => s + i.qty, 0);
        document.getElementById('cartCounter').innerText = count;
        document.getElementById('cartCountBadge').innerText = count;
        
        let total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
        document.getElementById('cartTotalPrice').innerHTML = `Жалпы сумма: ${total} сом`;
        
        let container = document.getElementById('cartItemsList');
        if (cart.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:gray;">🛒 Корзина бош</div>';
            return;
        }
        
        let html = '';
        cart.forEach((item, idx) => {
            html += `
                <div class="cart-item">
                    <div>
                        <strong>${item.name}</strong><br>
                        ${item.price} сом
                    </div>
                    <div class="cart-qty">
                        <button onclick="changeQty('${item.id}', -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty('${item.id}', 1)">+</button>
                        <button onclick="removeItem('${item.id}')">✕</button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    function changeQty(id, delta) {
        let index = cart.findIndex(i => i.id === id);
        if (index !== -1) {
            let newQty = cart[index].qty + delta;
            if (newQty <= 0) {
                cart.splice(index, 1);
                showToast("Алып салынды");
            } else {
                cart[index].qty = newQty;
                showToast(delta > 0 ? "Көбөйтүлдү" : "Азайтылды");
            }
            updateCartDisplay();
            saveCart();
        }
    }

    function removeItem(id) {
        cart = cart.filter(i => i.id !== id);
        updateCartDisplay();
        saveCart();
        showToast("Толугу менен алып салынды");
    }

    function addToCart(item) {
        let existing = cart.find(i => i.id === item.id);
        if (existing) {
            existing.qty++;
            showToast(`${item.name} +1 (эми ${existing.qty} шт)`);
        } else {
            cart.push({ ...item, qty: 1 });
            showToast(`${item.name} кoрзинага кошулды`);
        }
        updateCartDisplay();
        saveCart();
    }

    function renderMenu() {
        renderCategory('shaurma-grid', menuData.shaurma);
        renderCategory('hotdog-grid', menuData.hotdog);
        renderCategory('burger-grid', menuData.burger);
        renderCategory('combo-grid', menuData.combo);
        renderCategory('drinks-grid', menuData.drinks);
    }

    function renderCategory(containerId, items) {
        let container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        items.forEach(item => {
            let card = document.createElement('div');
            card.className = 'menu-item';
            card.innerHTML = `
                <div>
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">${item.price} сом</div>
                </div>
                <button class="add-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
                    <i class="fas fa-plus-circle"></i> Кошуу
                </button>
            `;
            container.appendChild(card);
        });
        
        container.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                let id = btn.getAttribute('data-id');
                let name = btn.getAttribute('data-name');
                let price = parseInt(btn.getAttribute('data-price'));
                addToCart({ id, name, price });
            });
        });
    }

    function getOrderText() {
        let address = document.getElementById('deliveryAddress').value.trim();
        if (address === "") address = "Адрес көрсөтүлгөн жок";
        
        let itemsList = "";
        let total = 0;
        cart.forEach(item => {
            itemsList += `${item.name} x${item.qty} = ${item.price * item.qty} сом\n`;
            total += item.price * item.qty;
        });
        
        return `🛒 *KING FOOD HALAL ЗАКАЗЫ* 🍔\n\n${itemsList}\n━━━━━━━━━━━━━━━━\n💰 *Жалпы сумма: ${total} сом*\n\n📍 *Даставка дареги:* ${address}\n\n  `;
    }

    function sendOrder(platform) {
        if (cart.length === 0) {
            alert("❌ Кoрзина бош! Тамактарды кошуңуз.");
            return;
        }
        let address = document.getElementById('deliveryAddress').value.trim();
        if (address === "") {
            if (!confirm("⚠️ Адрес киргизилген жок! Дарегиңизди киргизүүнү унутуп калдыңыз. Улантасызбы?")) return;
        }
        let text = encodeURIComponent(getOrderText());
        if (platform === 'whatsapp') {
            window.open(`https://wa.me/996778031203?text=${text}`, '_blank');
        } else if (platform === 'telegram') {
            window.open(`https://t.me/share/url?url=${encodeURIComponent("KING FOOD HALAL заказ")}&text=${text}`, '_blank');
        }
    }

    // Карзина ачуу/жабуу
    let overlay = document.getElementById('cartOverlay');
    document.getElementById('cartIcon').addEventListener('click', () => overlay.classList.add('open'));
    document.getElementById('closeCartBtn').addEventListener('click', () => overlay.classList.remove('open'));
    document.getElementById('closeCartFooter').addEventListener('click', () => overlay.classList.remove('open'));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });
    
    document.getElementById('whatsappOrderBtn').addEventListener('click', () => sendOrder('whatsapp'));
    document.getElementById('telegramOrderBtn').addEventListener('click', () => sendOrder('telegram'));
    
    renderMenu();
    loadCart();
