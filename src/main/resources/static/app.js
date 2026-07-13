/* ========================================
   THEME SYSTEM
   ======================================== */
function initTheme() {
    const saved = localStorage.getItem('nexus-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
    const html = document.documentElement;
    html.classList.add('theme-transition');
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('nexus-theme', next);
    setTimeout(() => html.classList.remove('theme-transition'), 500);
}

initTheme();

/* ========================================
   TOAST NOTIFICATIONS
   ======================================== */
function showToast(message, type) {
    type = type || 'success';
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(function() {
        requestAnimationFrame(function() {
            toast.classList.add('show');
        });
    });
    setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() { toast.remove(); }, 300);
    }, 2800);
}

/* ========================================
   CATEGORY ICONS
   ======================================== */
function getCategoryIcon(name) {
    var n = (name || '').toLowerCase();
    var attrs = 'xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="category-icon"';
    function svg(inner) { return '<svg ' + attrs + '>' + inner + '</svg>'; }

    if (!name || n.includes('all'))
        return svg('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>');
    if (/electron|phone|tech|computer|laptop|gadget|device/.test(n))
        return svg('<rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>');
    if (/cloth|fashion|apparel|wear|shirt/.test(n))
        return svg('<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>');
    if (/book|read|liter/.test(n))
        return svg('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>');
    if (/home|house|furniture|kitchen|living|decor/.test(n))
        return svg('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>');
    if (/sport|fitness|outdoor|gym|exercise|active/.test(n))
        return svg('<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>');
    if (/beauty|cosmet|skin|care|health/.test(n))
        return svg('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>');
    if (/food|grocery|drink|beverage|snack/.test(n))
        return svg('<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>');
    if (/toy|game|kid|child|play/.test(n))
        return svg('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>');
    if (/auto|car|vehicle|motor|truck/.test(n))
        return svg('<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>');
    if (/music|audio|sound|headphone/.test(n))
        return svg('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>');
    if (/jewel|accessor|watch|ring/.test(n))
        return svg('<circle cx="12" cy="12" r="10"/><path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z"/>');
    return svg('<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>');
}

/* ========================================
   INITIALIZATION
   ======================================== */
document.addEventListener("DOMContentLoaded", function() {
    var path = window.location.pathname;

    if (path === "/" || path.includes("index.html")) {
        fetchCategories();
        fetchProducts();
        updateAuthUI();
        setupSearchAndSortListeners();
    } else if (path.includes("login.html")) {
        var loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                await tryLogin();
            });
        }
    } else if (path.includes("product-detail.html")) {
        var urlParams = new URLSearchParams(window.location.search);
        var productId = urlParams.get('id');
        if (productId) {
            loadProductDetail(productId);
        } else {
            window.location.href = 'index.html';
        }
        updateAuthUI();
    } else if (path.includes("admin.html")) {
        checkAdminAccess();
        updateAuthUI();
    } else if (path.includes("checkout.html")) {
        loadCartForCheckout();
        updateAuthUI();
        var checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', handleCheckoutSubmit);
        }
    } else if (path.includes("profile.html")) {
        loadProfile();
        updateAuthUI();
    }
});

/* ========================================
   SEARCH & SORT LISTENERS
   ======================================== */
function setupSearchAndSortListeners() {
    var searchInput = document.getElementById('search-input');
    var searchBtn = document.getElementById('search-btn');
    var sortSelect = document.getElementById('sort-select');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            var activeCategoryId = getActiveCategoryId();
            filterProductsByCategory(activeCategoryId);
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            var activeCategoryId = getActiveCategoryId();
            filterProductsByCategory(activeCategoryId);
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            var activeCategoryId = getActiveCategoryId();
            filterProductsByCategory(activeCategoryId);
        });
    }
}

function getActiveCategoryId() {
    var active = document.querySelector('.categories-list .active');
    return active ? (active.getAttribute('data-category-id') || '') : '';
}

/* ========================================
   MOBILE MENU
   ======================================== */
function toggleMobileMenu() {
    var navRight = document.getElementById('nav-right');
    if (!navRight) return;
    navRight.classList.toggle('collapsed');

    var toggleBtn = document.getElementById('mobile-menu-toggle');
    if (!toggleBtn) return;
    var icon = toggleBtn.querySelector('svg');
    if (!icon) return;

    if (navRight.classList.contains('collapsed')) {
        icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
    } else {
        icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
    }
}

document.addEventListener('click', function(event) {
    var navRight = document.getElementById('nav-right');
    var toggleBtn = document.getElementById('mobile-menu-toggle');

    if (navRight && toggleBtn &&
        !navRight.contains(event.target) &&
        !toggleBtn.contains(event.target) &&
        !navRight.classList.contains('collapsed')) {
        navRight.classList.add('collapsed');
        var icon = toggleBtn.querySelector('svg');
        if (icon) {
            icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
        }
    }
});

/* ========================================
   AUTH UI
   ======================================== */
async function updateAuthUI() {
    var token = localStorage.getItem("auth_token");
    var username = localStorage.getItem("auth_username");
    var authNav = document.getElementById("auth-nav");
    var adminBtn = document.getElementById("admin-panel-btn");

    if (authNav) {
        if (token && username) {
            try {
                var userResponse = await fetch('/api/users/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });

                if (userResponse.ok) {
                    var user = await userResponse.json();
                    if (adminBtn) {
                        adminBtn.style.display = user.role === 'ADMIN' ? 'block' : 'none';
                    }
                } else {
                    if (adminBtn) adminBtn.style.display = 'none';
                }
            } catch (err) {
                console.error("Error fetching user info:", err);
                if (adminBtn) adminBtn.style.display = 'none';
            }

            authNav.innerHTML =
                '<button onclick="goToProfile()" class="btn btn-with-icon">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                        '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>' +
                        '<circle cx="12" cy="7" r="4"></circle>' +
                    '</svg>' +
                    'Profile' +
                '</button>' +
                '<button onclick="logout()" class="btn btn-with-icon" aria-label="Logout">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                        '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>' +
                        '<polyline points="16 17 21 12 16 7"></polyline>' +
                        '<line x1="21" y1="12" x2="9" y2="12"></line>' +
                    '</svg>' +
                '</button>';
        } else {
            if (adminBtn) adminBtn.style.display = 'none';
            authNav.innerHTML = '<a href="login.html" class="btn">Login</a>';
        }
    }

    updateCartCount();
}

/* ========================================
   LOGIN
   ======================================== */
async function tryLogin() {
    var username = document.getElementById("username")?.value?.trim();
    var password = document.getElementById("password")?.value;

    if (!username || !password) {
        alert("Please enter username and password");
        return;
    }

    try {
        var response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password })
        });

        if (!response.ok) throw new Error("Invalid username or password");

        var token = await response.text();
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_username", username);

        var userInfo = await getUserInfo();
        if (userInfo) localStorage.setItem("auth_email", userInfo.email);

        window.location.href = "index.html";
    } catch (err) {
        alert("Login failed: " + err.message);
    }
}

/* ========================================
   PRODUCTS & CATEGORIES
   ======================================== */
var allProducts = [];

async function fetchCategories() {
    try {
        var response = await fetch('/api/categories');
        if (!response.ok) throw new Error('HTTP ' + response.status + ': ' + response.statusText);

        var categories = await response.json();
        var categoriesList = document.getElementById("categories-list");
        if (!categoriesList) return;

        if (!Array.isArray(categories) || categories.length === 0) {
            categoriesList.innerHTML = "<p>No categories available</p>";
            return;
        }

        var html = '<ul class="categories-list">';
        html += '<li data-category-id="" class="active">' + getCategoryIcon('All') + '<span>All Products</span></li>';

        categories.forEach(function(category) {
            var name = category.name || category.username || 'Unknown';
            html += '<li data-category-id="' + category.id + '">' + getCategoryIcon(name) + '<span>' + name + '</span></li>';
        });

        html += '</ul>';
        categoriesList.innerHTML = html;

        setTimeout(function() {
            document.querySelectorAll('.categories-list li').forEach(function(item) {
                item.addEventListener('click', function() {
                    document.querySelectorAll('.categories-list li').forEach(function(li) {
                        li.classList.remove('active');
                    });
                    this.classList.add('active');
                    filterProductsByCategory(this.getAttribute('data-category-id'));
                });
            });
        }, 0);

    } catch (err) {
        console.error("Failed to load categories:", err);
        document.getElementById("categories-list").innerHTML = '<p>Error loading categories: ' + err.message + '</p>';
    }
}

async function fetchProducts() {
    try {
        var response = await fetch('/api/products');
        if (!response.ok) throw new Error('HTTP ' + response.status + ': ' + response.statusText);
        allProducts = await response.json();
        filterProductsByCategory('');
    } catch (err) {
        console.error("Failed to load products:", err);
        document.getElementById("product-container").innerHTML = "<p>Error loading products</p>";
    }
}

function filterProductsByCategory(categoryId) {
    var container = document.getElementById("product-container");
    if (!container) return;

    var filteredList;

    if (categoryId) {
        filteredList = allProducts.filter(function(product) {
            return (product.category && product.category.id == categoryId) ||
                   (product.categoryId && product.categoryId == categoryId);
        });
    } else {
        filteredList = allProducts;
    }

    var searchTerm = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
    if (searchTerm) {
        filteredList = filteredList.filter(function(product) {
            return product.name.toLowerCase().includes(searchTerm) ||
                   product.description.toLowerCase().includes(searchTerm);
        });
    }

    var sortValue = document.getElementById('sort-select')?.value || '';
    filteredList = applySorting(filteredList, sortValue);

    container.innerHTML = "";

    if (filteredList.length === 0) {
        container.innerHTML = '<div class="loading-container"><p style="color:var(--text-tertiary)">No products found.</p></div>';
        return;
    }

    filteredList.forEach(function(product) {
        var isOutOfStock = product.stockQuantity <= 0;
        var categoryName = product.category ? product.category.name : '';

        var card = '<div class="card' + (isOutOfStock ? ' out-of-stock' : '') + '">' +
            '<div class="card-image-wrapper" onclick="openProductModal(' + product.id + ')" style="cursor:' + (isOutOfStock ? 'not-allowed' : 'pointer') + '">' +
                '<img src="' + (product.imageUrl || '') + '" alt="' + (product.name || 'Product') + '" onerror="this.src=\'/image/placeholder.png\'">' +
                (isOutOfStock ?
                    '<span class="out-of-stock-badge">Out of Stock</span>' :
                    '<div class="card-image-overlay">' +
                        '<button class="quick-add-btn" onclick="event.stopPropagation(); quickAddToCart(' + product.id + ')" aria-label="Quick add to cart">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
                            ' Add to Cart' +
                        '</button>' +
                    '</div>'
                ) +
            '</div>' +
            '<div class="card-content">' +
                (categoryName ? '<span class="card-category">' + categoryName + '</span>' : '') +
                '<h3 onclick="openProductModal(' + product.id + ')" style="cursor:' + (isOutOfStock ? 'not-allowed' : 'pointer') + '">' + (product.name || "Unnamed") + '</h3>' +
                '<p class="card-description">' + (product.description || "") + '</p>' +
                '<div class="card-footer">' +
                    '<span class="card-price">$' + (product.price?.toFixed(2) || "?") + '</span>' +
                    (isOutOfStock ? '' :
                        '<button class="view-details-btn" onclick="openProductModal(' + product.id + ')">View Details</button>'
                    ) +
                '</div>' +
            '</div>' +
        '</div>';

        container.innerHTML += card;
    });
}

function applySorting(products, sortValue) {
    switch(sortValue) {
        case 'name-asc':
            return [].concat(products).sort(function(a, b) { return a.name.localeCompare(b.name); });
        case 'name-desc':
            return [].concat(products).sort(function(a, b) { return b.name.localeCompare(a.name); });
        case 'price-asc':
            return [].concat(products).sort(function(a, b) { return (a.price || 0) - (b.price || 0); });
        case 'price-desc':
            return [].concat(products).sort(function(a, b) { return (b.price || 0) - (a.price || 0); });
        case 'date-desc':
            return [].concat(products).sort(function(a, b) { return new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id); });
        case 'date-asc':
            return [].concat(products).sort(function(a, b) { return new Date(a.createdAt || a.id) - new Date(b.createdAt || b.id); });
        default:
            return products;
    }
}

/* ========================================
   QUICK ADD TO CART
   ======================================== */
async function quickAddToCart(productId) {
    var token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {
        var response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                productId: parseInt(productId),
                quantity: 1
            })
        });

        if (response.ok) {
            showToast("Added to cart!");
            updateCartCount();
        } else {
            var errorText = await response.text();
            showToast("Failed: " + errorText, "error");
        }
    } catch (err) {
        console.error(err);
        showToast("Network error", "error");
    }
}

async function addToCart(productId) {
    openProductModal(productId);
    setTimeout(updateCartCount, 1000);
}

/* ========================================
   USER INFO
   ======================================== */
async function getUserInfo() {
    var token = localStorage.getItem("auth_token");
    var username = localStorage.getItem("auth_username");
    if (!token || !username) return null;

    try {
        var response = await fetch('/api/users/' + username, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (response.ok) {
            var userData = await response.json();
            localStorage.setItem("auth_email", userData.email);
            return userData;
        }
        return null;
    } catch (error) {
        console.error("Error getting user info:", error);
        return null;
    }
}

/* ========================================
   PRODUCT DETAIL PAGE
   ======================================== */
async function loadProductDetail(productId) {
    try {
        var response = await fetch('/api/products/' + productId);
        if (!response.ok) throw new Error('HTTP ' + response.status + ': ' + response.statusText);

        var product = await response.json();

        document.getElementById('product-image').src = product.imageUrl || '/image/placeholder.png';
        document.getElementById('product-name').textContent = product.name || 'Unnamed Product';
        document.getElementById('product-price').textContent = '$' + (product.price?.toFixed(2) || '0.00');
        document.getElementById('product-description').textContent = product.description || 'No description available';
        document.getElementById('product-stock').textContent = 'In Stock: ' + (product.stockQuantity || 0);

        var quantityInput = document.getElementById('quantity-input');
        var maxStock = product.stockQuantity || 0;
        quantityInput.max = maxStock;
        quantityInput.value = Math.min(1, maxStock);
        updateStockWarning(maxStock);

        document.getElementById('loading').style.display = 'none';
        document.getElementById('product-error').style.display = 'none';
        document.getElementById('product-content').style.display = 'block';
    } catch (err) {
        console.error("Failed to load product detail:", err);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('product-content').style.display = 'none';
        document.getElementById('product-error').style.display = 'block';
    }
}

function increaseQuantity() {
    var input = document.getElementById('quantity-input');
    var maxStock = parseInt(input.max);
    if (parseInt(input.value) < maxStock) {
        input.value = parseInt(input.value) + 1;
        updateStockWarning(maxStock);
    }
}

function decreaseQuantity() {
    var input = document.getElementById('quantity-input');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        updateStockWarning(parseInt(input.max));
    }
}

function updateStockWarning(maxStock) {
    var quantityInput = document.getElementById('quantity-input');
    var warningDiv = document.getElementById('stock-warning');
    if (!quantityInput || !warningDiv) return;
    var currentQuantity = parseInt(quantityInput.value);

    if (currentQuantity > maxStock) {
        warningDiv.textContent = 'Only ' + maxStock + ' items in stock!';
        warningDiv.style.display = 'block';
        quantityInput.style.borderColor = 'var(--danger)';
    } else {
        warningDiv.style.display = 'none';
        quantityInput.style.borderColor = 'var(--border)';
    }
}

/* ========================================
   PRODUCT MODAL
   ======================================== */
async function openProductModal(productId) {
    try {
        var response = await fetch('/api/products/' + productId);
        if (!response.ok) throw new Error('HTTP ' + response.status + ': ' + response.statusText);

        var product = await response.json();
        var isOutOfStock = product.stockQuantity <= 0;

        document.getElementById('modal-product-image').src = product.imageUrl || '/image/placeholder.png';
        document.getElementById('modal-product-name').textContent = product.name || 'Unnamed Product';
        document.getElementById('modal-product-price').textContent = '$' + (product.price?.toFixed(2) || '0.00');
        document.getElementById('modal-product-description').textContent = product.description || 'No description available';

        var stockElement = document.getElementById('modal-product-stock');
        if (isOutOfStock) {
            stockElement.textContent = 'Out of Stock';
            stockElement.style.color = 'var(--danger)';
        } else {
            stockElement.textContent = 'In Stock: ' + product.stockQuantity;
            stockElement.style.color = 'var(--success)';
        }

        document.getElementById('product-modal').setAttribute('data-product-id', product.id);

        var quantityInput = document.getElementById('modal-quantity-input');
        var maxStock = product.stockQuantity || 0;
        quantityInput.max = maxStock;
        quantityInput.value = Math.min(1, maxStock);
        updateModalStockWarning(maxStock);

        var addToCartBtn = document.getElementById('modal-add-to-cart-btn');
        if (isOutOfStock) {
            addToCartBtn.disabled = true;
            addToCartBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> Out of Stock';
            addToCartBtn.onclick = function() { alert('This product is currently out of stock.'); };
        } else {
            addToCartBtn.disabled = false;
            addToCartBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Add to Cart';
            addToCartBtn.onclick = function() { addModalToCart(); };
        }

        document.getElementById('product-modal').style.display = 'flex';
    } catch (err) {
        console.error("Failed to load product for modal:", err);
        alert("Failed to load product details: " + err.message);
    }
}

function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

function increaseModalQuantity() {
    var input = document.getElementById('modal-quantity-input');
    var maxStock = parseInt(input.max);
    if (parseInt(input.value) < maxStock) {
        input.value = parseInt(input.value) + 1;
        updateModalStockWarning(maxStock);
    }
}

function decreaseModalQuantity() {
    var input = document.getElementById('modal-quantity-input');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        updateModalStockWarning(parseInt(input.max));
    }
}

function updateModalStockWarning(maxStock) {
    var quantityInput = document.getElementById('modal-quantity-input');
    var warningDiv = document.getElementById('modal-stock-warning');
    if (!quantityInput || !warningDiv) return;
    var currentQuantity = parseInt(quantityInput.value);

    if (currentQuantity > maxStock) {
        warningDiv.textContent = 'Only ' + maxStock + ' items in stock!';
        warningDiv.style.display = 'block';
        quantityInput.style.borderColor = 'var(--danger)';
    } else {
        warningDiv.style.display = 'none';
        quantityInput.style.borderColor = 'var(--border)';
    }
}

/* ========================================
   ADD TO CART (from modal)
   ======================================== */
async function addModalToCart() {
    var productId = document.getElementById('product-modal').getAttribute('data-product-id');
    var quantity = parseInt(document.getElementById('modal-quantity-input').value);

    if (isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    var maxStock = parseInt(document.getElementById('modal-quantity-input').max);
    if (quantity > maxStock) {
        alert('Cannot add more than ' + maxStock + ' items to cart. Only ' + maxStock + ' in stock.');
        return;
    }

    var token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {
        var response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                productId: parseInt(productId),
                quantity: quantity
            })
        });

        if (response.ok) {
            showToast(quantity + ' item(s) added to cart!');
            closeModal();
            updateCartCount();
        } else {
            var errorText = await response.text();
            showToast("Failed: " + errorText, "error");
        }
    } catch (err) {
        console.error(err);
        showToast("Network error", "error");
    }
}

async function addToCartFromDetail() {
    var urlParams = new URLSearchParams(window.location.search);
    var productId = urlParams.get('id');
    var quantity = parseInt(document.getElementById('quantity-input').value);

    if (isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    var maxStock = parseInt(document.getElementById('quantity-input').max);
    if (quantity > maxStock) {
        alert('Cannot add more than ' + maxStock + ' items to cart. Only ' + maxStock + ' in stock.');
        return;
    }

    var token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {
        var response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                productId: parseInt(productId),
                quantity: quantity
            })
        });

        if (response.ok) {
            showToast(quantity + ' item(s) added to cart!');
        } else {
            var errorText = await response.text();
            alert("Failed: " + errorText);
        }
    } catch (err) {
        console.error(err);
        alert("Network error");
    }
}

/* ========================================
   CART MODAL
   ======================================== */
async function openCartModal() {
    var token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login to view your cart");
        window.location.href = "login.html";
        return;
    }

    document.getElementById('cart-modal').style.display = 'flex';
    document.getElementById('cart-loading').style.display = 'block';
    document.getElementById('cart-items-list').innerHTML = '';
    document.getElementById('empty-cart-message').style.display = 'none';

    try {
        var response = await fetch('/api/cart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (!response.ok) {
            var errorText = await response.text();
            throw new Error('HTTP ' + response.status + ': ' + response.statusText + ' - ' + errorText);
        }

        var cart = await response.json();
        displayCartItems(cart);
    } catch (err) {
        console.error("Failed to load cart:", err);
        document.getElementById('cart-loading').textContent = 'Error loading cart: ' + err.message;
    }
}

function closeCartModal() {
    document.getElementById('cart-modal').style.display = 'none';
}

function displayCartItems(cart) {
    var cartItemsContainer = document.getElementById('cart-items-list');
    var cartLoading = document.getElementById('cart-loading');
    var emptyCartMessage = document.getElementById('empty-cart-message');
    var cartTotalElement = document.getElementById('cart-total-amount');
    var checkoutButton = document.getElementById('checkout-btn');

    cartLoading.style.display = 'none';

    if (!cart.items || cart.items.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartTotalElement.textContent = '$0.00';
        checkoutButton.disabled = true;
        return;
    }

    emptyCartMessage.style.display = 'none';
    cartItemsContainer.innerHTML = '';
    var total = 0;

    cart.items.forEach(function(item) {
        var itemTotal = item.product.price * item.quantity;
        total += itemTotal;

        var cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML =
            '<img src="' + (item.product.imageUrl || '/image/placeholder.png') + '" alt="' + item.product.name + '" class="cart-item-image" onerror="this.src=\'/image/placeholder.png\'">' +
            '<div class="cart-item-details">' +
                '<div class="cart-item-name">' + item.product.name + '</div>' +
                '<div class="cart-item-price">$' + (item.product.price?.toFixed(2) || '0.00') + '</div>' +
                '<div class="cart-item-quantity">' +
                    '<button onclick="updateCartItemQuantity(' + item.product.id + ', ' + (item.quantity - 1) + ')">-</button>' +
                    '<span>' + item.quantity + '</span>' +
                    '<button onclick="updateCartItemQuantity(' + item.product.id + ', ' + (item.quantity + 1) + ')">+</button>' +
                '</div>' +
                '<div class="cart-item-actions">' +
                    '<button class="remove-item-btn" onclick="removeCartItem(' + item.product.id + ')">Remove</button>' +
                '</div>' +
            '</div>' +
            '<div style="font-weight: 700; color: var(--text-primary); white-space: nowrap;">$' + itemTotal.toFixed(2) + '</div>';

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotalElement.textContent = '$' + total.toFixed(2);
    checkoutButton.disabled = false;
}

async function updateCartItemQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        await removeCartItem(productId);
        return;
    }

    var token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login to update your cart");
        window.location.href = "login.html";
        return;
    }

    try {
        var productResponse = await fetch('/api/products/' + productId);
        if (!productResponse.ok) throw new Error('Failed to get product details');

        var product = await productResponse.json();
        if (newQuantity > product.stockQuantity) {
            alert('Cannot set quantity to ' + newQuantity + '. Only ' + product.stockQuantity + ' in stock.');
            setTimeout(openCartModal, 500);
            return;
        }

        await removeCartItem(productId);

        var response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                productId: productId,
                quantity: newQuantity
            })
        });

        if (response.ok) {
            setTimeout(openCartModal, 500);
            updateCartCount();
        } else {
            var errorText = await response.text();
            alert("Failed to update quantity: " + errorText);
        }
    } catch (err) {
        console.error("Failed to update cart item quantity:", err);
        alert("Error updating cart item: " + err.message);
    }
}

async function removeCartItem(productId) {
    var token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login to update your cart");
        window.location.href = "login.html";
        return;
    }

    if (!confirm("Are you sure you want to remove this item from your cart?")) return;

    try {
        var response = await fetch('/api/cart/item/' + productId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.ok) {
            setTimeout(openCartModal, 500);
            updateCartCount();
        } else {
            var errorText = await response.text();
            alert("Failed to remove item: " + errorText);
        }
    } catch (err) {
        console.error("Failed to remove cart item:", err);
        alert("Error removing item from cart: " + err.message);
    }
}

async function updateCartCount() {
    var token = localStorage.getItem("auth_token");
    var badge = document.getElementById('cart-count');
    if (!badge) return;

    if (!token) {
        badge.textContent = '0';
        badge.className = 'cart-count-badge zero';
        return;
    }

    try {
        var response = await fetch('/api/cart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.ok) {
            var cart = await response.json();
            var itemCount = cart.items ? cart.items.reduce(function(sum, item) { return sum + item.quantity; }, 0) : 0;
            var prevCount = parseInt(badge.textContent) || 0;
            badge.textContent = itemCount;
            badge.className = itemCount === 0 ? 'cart-count-badge zero' : 'cart-count-badge';

            if (itemCount > prevCount) {
                badge.classList.add('pulse');
                setTimeout(function() { badge.classList.remove('pulse'); }, 400);
            }
        } else {
            badge.textContent = '0';
            badge.className = 'cart-count-badge zero';
        }
    } catch (err) {
        console.error("Failed to update cart count:", err);
        badge.textContent = '0';
        badge.className = 'cart-count-badge zero';
    }
}

/* ========================================
   NAVIGATION HELPERS
   ======================================== */
function goToProfile() { window.location.href = 'profile.html'; }
function goBackToShop() { window.location.href = 'index.html'; }
function proceedToCheckout() { window.location.href = 'checkout.html'; }

function logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_username");
    localStorage.removeItem("auth_email");
    updateAuthUI();
    location.reload();
}

/* ========================================
   ADMIN PANEL
   ======================================== */
async function checkAdminAccess() {
    var token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login to access admin panel");
        window.location.href = "login.html";
        return;
    }

    try {
        var userResponse = await fetch('/api/users/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (!userResponse.ok) throw new Error('HTTP ' + userResponse.status);
        var user = await userResponse.json();

        if (user.role !== 'ADMIN') {
            alert("Access denied. Admin privileges required.");
            window.location.href = "index.html";
        }
    } catch (err) {
        console.error("Failed to verify admin status:", err);
        alert("Error verifying admin status: " + err.message);
        window.location.href = "index.html";
    }
}

function showAddProductForm() {
    var formHTML =
        '<div class="admin-form active">' +
            '<h3>Add New Product</h3>' +
            '<div class="form-row">' +
                '<div class="form-group form-group-half"><label for="productName">Product Name</label><input type="text" id="productName" placeholder="Enter product name"></div>' +
                '<div class="form-group form-group-half"><label for="productPrice">Price ($)</label><input type="number" id="productPrice" placeholder="Enter price" step="0.01"></div>' +
            '</div>' +
            '<div class="form-row">' +
                '<div class="form-group form-group-half"><label for="productStock">Stock Quantity</label><input type="number" id="productStock" placeholder="Enter stock quantity"></div>' +
                '<div class="form-group form-group-half"><label for="productImageUrl">Image URL</label><input type="text" id="productImageUrl" placeholder="Enter image URL"></div>' +
            '</div>' +
            '<div class="form-group"><label for="productDescription">Description</label><textarea id="productDescription" placeholder="Enter product description"></textarea></div>' +
            '<div class="form-group"><label for="productCategory">Category</label><select id="productCategory"><option value="">Select a category</option></select></div>' +
            '<div class="admin-form-buttons">' +
                '<button class="btn btn-primary" onclick="addProduct()">Add Product</button>' +
                '<button class="btn btn-secondary" onclick="hideCurrentForm()">Cancel</button>' +
            '</div>' +
        '</div>';
    document.getElementById('admin-form-container').innerHTML = formHTML;
    loadCategoriesForForm('productCategory');
}

function showUpdateProductForm() {
    var formHTML =
        '<div class="admin-form active">' +
            '<h3>Update Product</h3>' +
            '<div class="form-group"><label for="selectProductToUpdate">Select Product</label><select id="selectProductToUpdate" onchange="loadProductDetailsForUpdate()"><option value="">Loading products...</option></select></div>' +
            '<div id="updateProductFormFields" style="display: none;">' +
                '<div class="form-row">' +
                    '<div class="form-group form-group-half"><label for="updateProductName">Product Name</label><input type="text" id="updateProductName" placeholder="Enter product name"></div>' +
                    '<div class="form-group form-group-half"><label for="updateProductPrice">Price ($)</label><input type="number" id="updateProductPrice" placeholder="Enter price" step="0.01"></div>' +
                '</div>' +
                '<div class="form-row">' +
                    '<div class="form-group form-group-half"><label for="updateProductStock">Stock Quantity</label><input type="number" id="updateProductStock" placeholder="Enter stock quantity"></div>' +
                    '<div class="form-group form-group-half"><label for="updateProductImageUrl">Image URL</label><input type="text" id="updateProductImageUrl" placeholder="Enter image URL"></div>' +
                '</div>' +
                '<div class="form-group"><label for="updateProductDescription">Description</label><textarea id="updateProductDescription" placeholder="Enter product description"></textarea></div>' +
                '<div class="form-group"><label for="updateProductCategory">Category</label><select id="updateProductCategory"><option value="">Select a category</option></select></div>' +
                '<div class="admin-form-buttons">' +
                    '<button class="btn btn-primary" onclick="updateProduct()">Update Product</button>' +
                    '<button class="btn btn-secondary" onclick="hideCurrentForm()">Cancel</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    document.getElementById('admin-form-container').innerHTML = formHTML;
    loadProductsForSelection('selectProductToUpdate');
    loadCategoriesForForm('updateProductCategory');
}

function showManageOrdersForm() {
    var formHTML =
        '<div class="admin-form active">' +
            '<h3>Manage Orders</h3>' +
            '<div class="form-group"><label for="selectOrderToManage">Select Order</label><select id="selectOrderToManage" onchange="loadOrderDetailsForUpdate()"><option value="">Loading orders...</option></select></div>' +
            '<div id="manageOrderFormFields" style="display: none;">' +
                '<div class="form-group"><label>Current Status: <span id="currentOrderStatus"></span></label></div>' +
                '<div class="form-group"><label for="newOrderStatus">New Status</label>' +
                    '<select id="newOrderStatus"><option value="PENDING">PENDING</option><option value="PAID">PAID</option><option value="SHIPPED">SHIPPED</option><option value="DELIVERED">DELIVERED</option><option value="CANCELED">CANCELED</option></select>' +
                '</div>' +
                '<div class="admin-form-buttons">' +
                    '<button class="btn btn-primary" onclick="updateOrderStatus()">Update Status</button>' +
                    '<button class="btn btn-secondary" onclick="hideCurrentForm()">Cancel</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    document.getElementById('admin-form-container').innerHTML = formHTML;
    loadOrdersForSelection('selectOrderToManage');
}

function hideCurrentForm() {
    document.getElementById('admin-form-container').innerHTML = '';
}

async function loadCategoriesForForm(selectId) {
    try {
        var response = await fetch('/api/categories');
        if (!response.ok) throw new Error('HTTP ' + response.status);
        var categories = await response.json();
        var selectElement = document.getElementById(selectId);
        selectElement.innerHTML = '<option value="">Select a category</option>';
        categories.forEach(function(category) {
            var option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            selectElement.appendChild(option);
        });
    } catch (err) {
        console.error("Failed to load categories:", err);
        document.getElementById(selectId).innerHTML = '<option value="">Error loading categories</option>';
    }
}

async function loadProductsForSelection(selectId) {
    try {
        var response = await fetch('/api/products');
        if (!response.ok) throw new Error('HTTP ' + response.status);
        var products = await response.json();
        var selectElement = document.getElementById(selectId);
        selectElement.innerHTML = '<option value="">Select a product</option>';
        products.forEach(function(product) {
            var option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.name + ' - $' + (product.price?.toFixed(2) || '0.00');
            selectElement.appendChild(option);
        });
    } catch (err) {
        console.error("Failed to load products:", err);
        document.getElementById(selectId).innerHTML = '<option value="">Error loading products</option>';
    }
}

async function loadOrderDetailsForUpdate() {
    var token = localStorage.getItem("auth_token");
    if (!token) { alert("Please login"); return; }

    var orderId = document.getElementById('selectOrderToManage').value;
    if (!orderId) {
        document.getElementById('manageOrderFormFields').style.display = 'none';
        return;
    }

    try {
        var response = await fetch('/api/orders/' + orderId, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        var order = await response.json();
        document.getElementById('currentOrderStatus').textContent = order.status;
        document.getElementById('manageOrderFormFields').style.display = 'block';
    } catch (err) {
        console.error("Failed to load order details:", err);
        alert("Error loading order details: " + err.message);
    }
}

async function loadOrdersForSelection(selectId) {
    try {
        var token = localStorage.getItem("auth_token");
        var response = await fetch('/api/orders', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        var orders = await response.json();
        var selectElement = document.getElementById(selectId);
        selectElement.innerHTML = '<option value="">Select an order</option>';
        orders.forEach(function(order) {
            var option = document.createElement('option');
            option.value = order.id;
            option.textContent = 'Order #' + order.id + ' - ' + order.status + ' - $' + (order.totalAmount || '0.00');
            selectElement.appendChild(option);
        });
    } catch (err) {
        console.error("Failed to load orders:", err);
        document.getElementById(selectId).innerHTML = '<option value="">Error loading orders</option>';
    }
}

async function loadProductDetailsForUpdate() {
    var productId = document.getElementById('selectProductToUpdate').value;
    if (!productId) {
        document.getElementById('updateProductFormFields').style.display = 'none';
        return;
    }

    try {
        var response = await fetch('/api/products/' + productId, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        var product = await response.json();

        document.getElementById('updateProductName').value = product.name || '';
        document.getElementById('updateProductPrice').value = product.price || '';
        document.getElementById('updateProductStock').value = product.stockQuantity || '';
        document.getElementById('updateProductImageUrl').value = product.imageUrl || '';
        document.getElementById('updateProductDescription').value = product.description || '';
        if (product.category) {
            document.getElementById('updateProductCategory').value = product.category.id || '';
        }
        document.getElementById('updateProductFormFields').style.display = 'block';
    } catch (err) {
        console.error("Failed to load product details:", err);
        alert("Error loading product details: " + err.message);
    }
}

async function addProduct() {
    var token = localStorage.getItem("auth_token");
    if (!token) { alert("Please login to add products"); return; }

    var name = document.getElementById('productName').value;
    var price = parseFloat(document.getElementById('productPrice').value);
    var stockQuantity = parseInt(document.getElementById('productStock').value);
    var imageUrl = document.getElementById('productImageUrl').value;
    var description = document.getElementById('productDescription').value;
    var categoryId = document.getElementById('productCategory').value;

    if (!name || !price || !stockQuantity || !categoryId) {
        alert("Please fill in all required fields");
        return;
    }

    try {
        var response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ name: name, description: description, stockQuantity: stockQuantity, imageUrl: imageUrl, price: price, categoryId: parseInt(categoryId) })
        });
        if (response.ok) {
            alert("Product added successfully!");
            hideCurrentForm();
            if (window.location.pathname.includes('index.html')) fetchProducts();
        } else {
            alert("Failed to add product: " + await response.text());
        }
    } catch (err) {
        alert("Error adding product: " + err.message);
    }
}

async function updateProduct() {
    var token = localStorage.getItem("auth_token");
    if (!token) { alert("Please login to update products"); return; }

    var productId = document.getElementById('selectProductToUpdate').value;
    var name = document.getElementById('updateProductName').value;
    var price = parseFloat(document.getElementById('updateProductPrice').value);
    var stockQuantity = parseInt(document.getElementById('updateProductStock').value);
    var imageUrl = document.getElementById('updateProductImageUrl').value;
    var description = document.getElementById('updateProductDescription').value;
    var categoryId = document.getElementById('updateProductCategory').value;

    if (!productId || !name || !price || !stockQuantity || !categoryId) {
        alert("Please fill in all required fields");
        return;
    }

    try {
        var response = await fetch('/api/products/' + productId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ name: name, description: description, stockQuantity: stockQuantity, imageUrl: imageUrl, price: price, categoryId: parseInt(categoryId) })
        });
        if (response.ok) {
            alert("Product updated successfully!");
            hideCurrentForm();
            if (window.location.pathname.includes('index.html')) fetchProducts();
        } else {
            alert("Failed to update product: " + await response.text());
        }
    } catch (err) {
        alert("Error updating product: " + err.message);
    }
}

async function updateOrderStatus() {
    var token = localStorage.getItem("auth_token");
    if (!token) { alert("Please login to update orders"); return; }

    var orderId = document.getElementById('selectOrderToManage').value;
    var newStatus = document.getElementById('newOrderStatus').value;

    if (!orderId || !newStatus) {
        alert("Please select an order and new status");
        return;
    }

    try {
        var response = await fetch('/api/orders/' + orderId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ status: newStatus, userId: 0, orderItems: [], shippingAddress: "", paymentInfo: {} })
        });
        if (response.ok) {
            alert("Order status updated successfully!");
            hideCurrentForm();
        } else {
            alert("Failed to update order status: " + await response.text());
        }
    } catch (err) {
        alert("Error updating order status: " + err.message);
    }
}

/* ========================================
   CHECKOUT PAGE
   ======================================== */
async function loadCartForCheckout() {
    var token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login to proceed with checkout");
        window.location.href = "login.html";
        return;
    }

    try {
        var cartResponse = await fetch('/api/cart', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        });
        if (!cartResponse.ok) throw new Error('HTTP ' + cartResponse.status);
        var cart = await cartResponse.json();
        displayCartItemsForCheckout(cart);

        var userResponse = await fetch('/api/users/me', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        });

        if (!userResponse.ok) {
            document.getElementById('review-name').textContent = localStorage.getItem("auth_username") || 'Loading...';
            document.getElementById('review-email').textContent = localStorage.getItem("auth_email") || 'Loading...';
            document.getElementById('review-phone').textContent = 'Loading...';
        } else {
            var user = await userResponse.json();
            document.getElementById('review-name').textContent = (user.firstName + ' ' + user.lastName).trim();
            document.getElementById('review-email').textContent = user.email;
            document.getElementById('review-phone').textContent = user.phone;
        }
    } catch (err) {
        console.error("Failed to load cart for checkout:", err);
        document.getElementById('order-items').innerHTML = '<p>Error loading cart: ' + err.message + '</p>';
    }
}

function displayCartItemsForCheckout(cart) {
    var orderItemsContainer = document.getElementById('order-items');
    var subtotalElement = document.getElementById('subtotal-amount');
    var totalElement = document.getElementById('total-amount');

    if (!cart.items || cart.items.length === 0) {
        orderItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        subtotalElement.textContent = '$0.00';
        totalElement.textContent = '$0.00';
        return;
    }

    var subtotal = 0;
    var itemsHtml = '';

    cart.items.forEach(function(item) {
        var itemTotal = item.product.price * item.quantity;
        subtotal += itemTotal;
        itemsHtml += '<div class="order-item"><div class="order-item-name">' + item.product.name + '</div><div class="order-item-quantity">x' + item.quantity + '</div><div class="order-item-price">$' + itemTotal.toFixed(2) + '</div></div>';
    });

    orderItemsContainer.innerHTML = itemsHtml;

    var shipping = 5.99;
    var tax = subtotal * 0.08;
    var total = subtotal + shipping + tax;

    subtotalElement.textContent = '$' + subtotal.toFixed(2);
    document.getElementById('shipping-amount').textContent = '$' + shipping.toFixed(2);
    document.getElementById('tax-amount').textContent = '$' + tax.toFixed(2);
    totalElement.textContent = '$' + total.toFixed(2);
}

async function handleCheckoutSubmit(event) {
    event.preventDefault();

    var token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login to proceed with checkout");
        window.location.href = "login.html";
        return;
    }

    var shippingAddress = document.getElementById('shippingAddress').value;
    var city = document.getElementById('city').value;
    var zipCode = document.getElementById('zipCode').value;
    var cardNumber = document.getElementById('cardNumber').value;
    var expiryDate = document.getElementById('expiryDate').value;
    var cvv = document.getElementById('cvv').value;
    var cardName = document.getElementById('cardName').value;

    try {
        var userResponse = await fetch('/api/cart', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        });
        if (!userResponse.ok) throw new Error('HTTP ' + userResponse.status);
        var cart = await userResponse.json();

        var response = await fetch('/api/orders/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({
                shippingAddress: shippingAddress + ', ' + city + ', ' + zipCode,
                paymentInfo: { cardNumber: cardNumber, expiryDate: expiryDate, cvv: cvv, cardName: cardName },
                orderItems: cart.items.map(function(item) { return { productId: item.product.id, quantity: item.quantity }; })
            })
        });

        if (response.ok) {
            alert("Order placed successfully!");
            await fetch('/api/cart/clear', { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
            updateCartCount();
            window.location.href = 'index.html';
        } else {
            alert("Failed to place order: " + await response.text());
        }
    } catch (err) {
        alert("Error processing checkout: " + err.message);
    }
}

/* ========================================
   PROFILE PAGE
   ======================================== */
async function loadProfile() {
    var token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login to view your profile");
        window.location.href = "login.html";
        return;
    }

    try {
        var userResponse = await fetch('/api/users/me', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        });
        if (!userResponse.ok) throw new Error('HTTP ' + userResponse.status);
        var user = await userResponse.json();
        displayUserInfo(user);

        var ordersResponse = await fetch('/api/orders/user?email=' + user.email, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        });
        if (!ordersResponse.ok) throw new Error('HTTP ' + ordersResponse.status);
        var orders = await ordersResponse.json();
        displayOrderHistory(orders);
    } catch (err) {
        console.error("Failed to load profile:", err);
        var userInfoEl = document.getElementById('user-info');
        var ordersListEl = document.getElementById('orders-list');
        if (userInfoEl) userInfoEl.innerHTML = '<p>Error loading profile: ' + err.message + '</p>';
        if (ordersListEl) ordersListEl.innerHTML = '<p>Error loading orders: ' + err.message + '</p>';
    }
}

function displayUserInfo(user) {
    var userInfoElement = document.getElementById('user-info');
    if (!userInfoElement) return;

    userInfoElement.innerHTML =
        '<div class="user-info-grid">' +
            '<div class="user-info-item"><span class="user-info-label">First Name</span><span class="user-info-value">' + (user.firstName || 'N/A') + '</span></div>' +
            '<div class="user-info-item"><span class="user-info-label">Last Name</span><span class="user-info-value">' + (user.lastName || 'N/A') + '</span></div>' +
            '<div class="user-info-item"><span class="user-info-label">Username</span><span class="user-info-value">' + (user.username || 'N/A') + '</span></div>' +
            '<div class="user-info-item"><span class="user-info-label">Email</span><span class="user-info-value">' + (user.email || 'N/A') + '</span></div>' +
            '<div class="user-info-item"><span class="user-info-label">Phone</span><span class="user-info-value">' + (user.phone || 'N/A') + '</span></div>' +
            '<div class="user-info-item"><span class="user-info-label">Role</span><span class="user-info-value">' + (user.role || 'N/A') + '</span></div>' +
        '</div>';
}

function displayOrderHistory(orders) {
    var ordersListElement = document.getElementById('orders-list');
    if (!ordersListElement) return;

    if (!orders || orders.length === 0) {
        ordersListElement.innerHTML = '<p class="no-orders">No orders found</p>';
        return;
    }

    var html = '<table class="orders-table"><thead><tr><th>Order ID</th><th>Date</th><th>Status</th><th>Total</th><th>Items</th></tr></thead><tbody>';
    orders.forEach(function(order) {
        var orderDate = new Date(order.createdAt).toLocaleDateString();
        var statusClass = 'status-' + order.status.toLowerCase();
        html += '<tr><td>#' + order.id + '</td><td>' + orderDate + '</td><td><span class="order-status ' + statusClass + '">' + order.status + '</span></td><td>$' + (order.totalAmount || '0.00') + '</td><td>' + (order.orderItems ? order.orderItems.length : 0) + '</td></tr>';
    });
    html += '</tbody></table>';
    ordersListElement.innerHTML = html;
}
