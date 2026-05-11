
        let globalMenu = {
            shaurma: [
                { id: "sh1", name: "Шаурма тоок этинен", price: 220 },
                { id: "sh2", name: "Шаурма уй этинен", price: 230 },
                { id: "sh3", name: "Бышырылган Шаурма", price: 240 }
            ],
            burger: [
                { id: "bg1", name: "Кинг Бургер", price: 210 },
                { id: "bg2", name: "Кош Кинг Бургер", price: 240 },
                { id: "bg3", name: "Чизбургер", price: 210 },
                { id: "bg4", name: "Кош Чизбургер", price: 240 },
                { id: "bg5", name: "Чикен бургер", price: 190 },
                { id: "bg6", name: "Кош Чикен бургер", price: 220 }
            ],
            hotdog: [
                { id: "hd1", name: "Классика Хот-Дог", price: 140 },
                { id: "hd2", name: "Острый Хот-Дог", price: 150 },
                { id: "hd3", name: "Чиз Хот-Дог", price: 160 }
            ],
            combo: [
                { id: "cb1", name: "Кинг комбо", price: 600 },
                { id: "cb2", name: "03 комбо", price: 500 }
            ],
            drinks: [
                { id: "dr1", name: "Султан чай 1л", price: 65 },
                { id: "dr2", name: "Мохито 0.5л", price: 85 },
                { id: "dr3", name: "Нитро 0.5л", price: 85 },
                { id: "dr4", name: "Летс гоу 1.25л", price: 100 },
                { id: "dr5", name: "Летс гоу (груша) 0.5л", price: 60 },
                { id: "dr6", name: "Кола/Фанта/Пепси 1л", price: 100 },
                { id: "dr7", name: "Кофе 3/1", price: 40 },
                { id: "dr8", name: "Чай", price: 20 }
            ],
            snacks: [
                { id: "sn1", name: "Фри S 150гр", price: 130 },
                { id: "sn2", name: "Фри M 220гр", price: 150 },
                { id: "sn3", name: "Чили Чиз-Фрайс", price: 200 },
                { id: "sn4", name: "Нагреты", price: 150 }
            ]
        };
        let globalCart = []; 
        let orderCounter = 0;
        let completedOrders = [];

        // Жергиликтүү сактоо
        function loadData() {
            let savedMenu = localStorage.getItem('king_food_menu');
            if (savedMenu) globalMenu = JSON.parse(savedMenu);
            let savedCart = localStorage.getItem('king_food_cart');
            if (savedCart) globalCart = JSON.parse(savedCart);
            let savedStats = localStorage.getItem('king_food_orders');
            if (savedStats) { let data = JSON.parse(savedStats); orderCounter = data.orderCounter || 0; completedOrders = data.completedOrders || []; }
        }
        function saveMenu() { localStorage.setItem('king_food_menu', JSON.stringify(globalMenu)); }
        function saveCart() { localStorage.setItem('king_food_cart', JSON.stringify(globalCart)); }
        function saveStats() { localStorage.setItem('king_food_orders', JSON.stringify({ orderCounter, completedOrders })); }

        // Утилиталар
        function showToast(msg, containerId = 'main-app') {
            let toast = document.createElement('div');
            toast.className = 'toast-msg';
            toast.innerText = msg;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        }
        function updateCartDisplayFor(target) {
            const count = globalCart.reduce((s, i) => s + i.qty, 0);
            const total = globalCart.reduce((s, i) => s + (i.price * i.qty), 0);
            if (target === 'main') {
                document.getElementById('cartCounterMain').innerText = count;
                document.getElementById('cartCountBadgeMain').innerText = count;
                document.getElementById('cartTotalMain').innerHTML = `Жалпы сумма: ${total} сом`;
                const container = document.getElementById('cartItemsListMain');
                if (globalCart.length === 0) container.innerHTML = '<div style="text-align:center; color:gray;">🛒 Корзина бош</div>';
                else {
                    let html = '';
                    globalCart.forEach(item => { html += `<div class="cart-item" style="background:#1e1b17; margin-bottom:12px; padding:12px; border-radius:18px; display:flex; justify-content:space-between;"><div><strong>${escapeHtml(item.name)}</strong><br>${item.price} сом</div><div class="cart-qty" style="display:flex; gap:10px;"><button onclick="window.changeQty('${item.id}', -1)">-</button><span>${item.qty}</span><button onclick="window.changeQty('${item.id}', 1)">+</button><button onclick="window.removeItem('${item.id}')">✕</button></div></div>`; });
                    container.innerHTML = html;
                }
            }
        }
        function escapeHtml(str) { return str.replace(/[&<>]/g, function(m) { if(m==='&') return '&amp;'; if(m==='<') return '&lt;'; if(m==='>') return '&gt;'; return m;}); }
        function changeQty(id, delta) {
            let idx = globalCart.findIndex(i => i.id === id);
            if (idx !== -1) {
                let newQty = globalCart[idx].qty + delta;
                if (newQty <= 0) globalCart.splice(idx,1);
                else globalCart[idx].qty = newQty;
                updateCartDisplayFor('main');
                saveCart();
            }
        }
        function removeItem(id) { globalCart = globalCart.filter(i => i.id !== id); updateCartDisplayFor('main'); saveCart(); }
        function addToCart(item) {
            let existing = globalCart.find(i => i.id === item.id);
            if (existing) existing.qty++;
            else globalCart.push({ ...item, qty: 1 });
            updateCartDisplayFor('main');
            saveCart();
            showToast(`${item.name} корзинага кошулду`, 'main');
        }
        // Негизги менюну рендерлөө
        function renderMainMenu() {
            const categories = [
                { key: "shaurma", gridId: "shaurma-grid-main" }, { key: "burger", gridId: "burger-grid-main" },
                { key: "hotdog", gridId: "hotdog-grid-main" }, { key: "combo", gridId: "combo-grid-main" },
                { key: "drinks", gridId: "drinks-grid-main" }, { key: "snacks", gridId: "snacks-grid-main" }
            ];
            for (let cat of categories) {
                const container = document.getElementById(cat.gridId);
                if (container) {
                    container.innerHTML = '';
                    globalMenu[cat.key].forEach(item => {
                        const card = document.createElement('div'); card.className = 'menu-item';
                        card.innerHTML = `<div><div class="item-name">${escapeHtml(item.name)}</div><div class="item-price">${item.price} сом</div></div><button class="add-btn" data-id="${item.id}" data-name="${escapeHtml(item.name)}" data-price="${item.price}"><i class="fas fa-plus-circle"></i> Кошуу</button>`;
                        container.appendChild(card);
                    });
                    container.querySelectorAll('.add-btn').forEach(btn => {
                        btn.addEventListener('click', () => { addToCart({ id: btn.dataset.id, name: btn.dataset.name, price: parseInt(btn.dataset.price) }); });
                    });
                }
            }
        }
        // Заказ жөнөтүү (негизги бет)
        function sendOrderMain(platform) {
            if (globalCart.length === 0) { alert("Корзина бош!"); return; }
            const address = document.getElementById('deliveryAddressMain').value.trim() || "Адрес жок";
            let itemsText = "", total = 0;
            globalCart.forEach(i => { itemsText += `${i.name} x${i.qty} = ${i.price * i.qty} сом\n`; total += i.price * i.qty; });
            const msg = `🛒 *KING FOOD HALAL ЗАКАЗЫ* 🍔\n\n${itemsText}\n━━━━━━━━━━━━━━━━\n💰 *Жалпы сумма: ${total} сом*\n\n📍 *Доставка дареги:* ${address}\n\n`;
            const url = platform === 'whatsapp' ? `https://wa.me/996778031203?text=${encodeURIComponent(msg)}` : `https://t.me/share/url?url=${encodeURIComponent("Заказ")}&text=${encodeURIComponent(msg)}`;
            window.open(url, '_blank');
            orderCounter++; saveStats();
            globalCart = []; updateCartDisplayFor('main'); saveCart();
            showToast("Заказ жөнөтүлдү! Корзина тазаланды.", 'main');
        }
        // Админ панелин рендерлөө (Dashboard)
        function renderAdminDashboard() {
            const container = document.getElementById('admin-dashboard-area');
            if (!container) return;
            let html = `<div class="admin-wrapper"><div class="admin-header"><h1><i class="fas fa-cog"></i> Меню башкаруу</h1><button id="adminLogoutBtn" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Чыгуу</button></div>
            <div class="admin-stats"><i class="fas fa-chart-line"></i> Жалпы заказдар: ${orderCounter}</div>`;
            const categoriesAd = [
                { key: "shaurma", title: "ШАУРМА", icon: "utensils" }, { key: "burger", title: "БУРГЕР", icon: "burger" },
                { key: "hotdog", title: "ХОТ-ДОГ", icon: "hotdog" }, { key: "combo", title: "КОМБО", icon: "box" },
                { key: "drinks", title: "СУУСУНДУКТАР", icon: "glass-cheers" }, { key: "snacks", title: "ЖЕНИЛ ТАМАКТАР", icon: "french-fries" }
            ];
            for (let cat of categoriesAd) {
                html += `<div class="admin-category"><h3><i class="fas fa-${cat.icon}"></i> ${cat.title}</h3><div id="admin-items-${cat.key}"></div><div class="add-item-form"><input type="text" id="newName_${cat.key}" placeholder="Жаңы тамак аты"><input type="number" id="newPrice_${cat.key}" placeholder="Баасы"><button onclick="addAdminItem('${cat.key}')">Кошуу</button></div></div>`;
            }
            html += `</div>`;
            container.innerHTML = html;
            for (let cat of categoriesAd) {
                const itemsContainer = document.getElementById(`admin-items-${cat.key}`);
                if (itemsContainer) {
                    itemsContainer.innerHTML = '';
                    globalMenu[cat.key].forEach((item, idx) => {
                        const div = document.createElement('div'); div.className = 'admin-item';
                        div.innerHTML = `<input type="text" value="${escapeHtml(item.name)}" id="name_${cat.key}_${idx}" style="flex:2;"><input type="number" value="${item.price}" id="price_${cat.key}_${idx}" class="price-input"><button class="edit-btn" onclick="updateAdminItem('${cat.key}', ${idx})"><i class="fas fa-save"></i></button><button onclick="deleteAdminItem('${cat.key}', ${idx})"><i class="fas fa-trash"></i></button>`;
                        itemsContainer.appendChild(div);
                    });
                }
            }
            document.getElementById('adminLogoutBtn')?.addEventListener('click', () => { sessionStorage.removeItem('admin_logged'); showAdminLogin(); });
        }
        window.addAdminItem = (catKey) => {
            const nameInput = document.getElementById(`newName_${catKey}`);
            const priceInput = document.getElementById(`newPrice_${catKey}`);
            const newName = nameInput?.value.trim();
            const newPrice = parseInt(priceInput?.value);
            if (!newName || isNaN(newPrice)) { alert("Аты жана баасы туура эмес"); return; }
            const newId = `${catKey}_${Date.now()}_${Math.random()}`;
            globalMenu[catKey].push({ id: newId, name: newName, price: newPrice });
            saveMenu(); renderMainMenu(); renderAdminDashboard();
            showToast(`✅ "${newName}" кошулды`, 'admin');
            if(nameInput) nameInput.value = ''; if(priceInput) priceInput.value = '';
        };
        window.updateAdminItem = (catKey, idx) => {
            const nameInp = document.getElementById(`name_${catKey}_${idx}`);
            const priceInp = document.getElementById(`price_${catKey}_${idx}`);
            if (nameInp && priceInp) {
                globalMenu[catKey][idx].name = nameInp.value.trim();
                globalMenu[catKey][idx].price = parseInt(priceInp.value);
                saveMenu(); renderMainMenu(); renderAdminDashboard();
                showToast("Өзгөртүлдү", 'admin');
            }
        };
        window.deleteAdminItem = (catKey, idx) => {
            const name = globalMenu[catKey][idx].name;
            if (confirm(`"${name}" өчүрүлсүнбү?`)) {
                globalMenu[catKey].splice(idx,1);
                saveMenu(); renderMainMenu(); renderAdminDashboard();
                showToast(`"${name}" өчүрүлдү`, 'admin');
            }
        };
        // Админ кирүү формасы
        function showAdminLogin() {
            const loginArea = document.getElementById('admin-login-area');
            const dashboardArea = document.getElementById('admin-dashboard-area');
            if (loginArea && dashboardArea) {
                loginArea.style.display = 'block';
                dashboardArea.style.display = 'none';
                loginArea.innerHTML = `<div class="admin-login-container"><div class="login-card"><h2><i class="fas fa-lock"></i> Админге кирүү</h2><input type="text" id="adminUsername" placeholder="Логин (king)"><input type="password" id="adminPassword" placeholder="Пароль (halal2025)"><button id="doLoginBtn">Кирүү</button><div id="loginError" class="error-msg"></div></div></div>`;
                document.getElementById('doLoginBtn')?.addEventListener('click', () => {
                    const user = document.getElementById('adminUsername')?.value;
                    const pass = document.getElementById('adminPassword')?.value;
                    if (user === 'ARSTANBEK' && pass === 'ArsBek.2003') {
                        sessionStorage.setItem('admin_logged', 'true');
                        loginArea.style.display = 'none';
                        dashboardArea.style.display = 'block';
                        renderAdminDashboard();
                    } else { document.getElementById('loginError').innerText = 'Логин же пароль туура эмес!'; }
                });
            }
        }

        // ----------------------------- 2. МАРШРУТТАШТЫРУУ (Path Routing) ---------------------------------
        function route() {
            const path = window.location.pathname;
            const isAdminPath = path === '/Admin' || path === '/Admin/' || path === '/admin' || path === '/admin/';
            document.body.classList.remove('main-mode', 'admin-mode');
            if (isAdminPath) {
                document.body.classList.add('admin-mode');
                const logged = sessionStorage.getItem('admin_logged');
                if (logged === 'true') { 
                    document.getElementById('admin-login-area').style.display = 'none';
                    document.getElementById('admin-dashboard-area').style.display = 'block';
                    renderAdminDashboard();
                } else { showAdminLogin(); }
            } else {
                document.body.classList.add('main-mode');
                renderMainMenu();
                updateCartDisplayFor('main');
            }
        }

        window.changeQty = changeQty;
        window.removeItem = removeItem;
        window.addToCart = addToCart;
        window.sendOrderMain = sendOrderMain;
        loadData();
        // Негизги бет үчүн карзина окуяларын байланыштыруу
        setTimeout(() => {
            const cartIcon = document.getElementById('cartIconMain');
            const overlay = document.getElementById('cartOverlayMain');
            const closeBtn = document.getElementById('closeCartMain');
            const closeFooter = document.getElementById('closeCartFooterMain');
            if (cartIcon) cartIcon.onclick = () => { if(overlay) overlay.style.visibility = 'visible', overlay.style.opacity = 1; };
            if (closeBtn) closeBtn.onclick = () => { if(overlay) overlay.style.visibility = 'hidden', overlay.style.opacity = 0; };
            if (closeFooter) closeFooter.onclick = () => { if(overlay) overlay.style.visibility = 'hidden', overlay.style.opacity = 0; };
            if(overlay) overlay.onclick = (e) => { if(e.target === overlay) overlay.style.visibility = 'hidden', overlay.style.opacity = 0; };
            const whatsBtn = document.getElementById('whatsappOrderMain');
            const teleBtn = document.getElementById('telegramOrderMain');
            if(whatsBtn) whatsBtn.onclick = () => sendOrderMain('whatsapp');
            if(teleBtn) teleBtn.onclick = () => sendOrderMain('telegram');
        }, 100);
        window.addEventListener('popstate', route);
        route();

   
   
