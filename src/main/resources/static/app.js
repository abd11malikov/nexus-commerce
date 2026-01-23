document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    if (path === "/" || path.includes("index.html")) {
        fetchCategories();
        fetchProducts();
        updateAuthUI();
    } else if (path.includes("login.html")) {
        document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await tryLogin();
        });
    } else if (path.includes("product-detail.html")) {
        // Extract product ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (productId) {
            loadProductDetail(productId);
        } else {
            // Redirect to homepage if no product ID is provided
            window.location.href = 'index.html';
        }
        updateAuthUI();
    }
});

async function updateAuthUI() {
    const token = localStorage.getItem("auth_token");
    const username = localStorage.getItem("auth_username");

    const authNav = document.getElementById("auth-nav");
    const adminBtn = document.getElementById("admin-panel-btn");

    if (authNav) {
        if (token && username) {
            // Check if user is admin
            try {
                const userResponse = await fetch('http://localhost:8080/api/users/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (userResponse.ok) {
                    const user = await userResponse.json();

                    // Show admin panel button if user is admin
                    if (adminBtn) {
                        if (user.role === 'ADMIN') {
                            adminBtn.style.display = 'block';
                        } else {
                            adminBtn.style.display = 'none';
                        }
                    }

                    authNav.innerHTML = `
                        <button onclick="goToProfile()" class="btn">Profile</button>
                        <button onclick="logout()" class="btn">Logout</button>
                    `;
                } else {
                    // If we can't get user info, assume regular user
                    if (adminBtn) {
                        adminBtn.style.display = 'none';
                    }
                    authNav.innerHTML = `
                        <button onclick="goToProfile()" class="btn">Profile</button>
                        <button onclick="logout()" class="btn">Logout</button>
                    `;
                }
            } catch (err) {
                console.error("Error fetching user info:", err);
                // If there's an error, assume regular user
                if (adminBtn) {
                    adminBtn.style.display = 'none';
                }
                authNav.innerHTML = `
                    <button onclick="goToProfile()" class="btn">Profile</button>
                    <button onclick="logout()" class="btn">Logout</button>
                `;
            }
        } else {
            // Hide admin panel button if not logged in
            if (adminBtn) {
                adminBtn.style.display = 'none';
            }
            authNav.innerHTML = `
                <a href="login.html" class="btn">Login</a>
            `;
        }
    }

    // Update cart count
    updateCartCount();
}

async function tryLogin() {
    const username = document.getElementById("username")?.value?.trim();
    const password = document.getElementById("password")?.value;

    if (!username || !password) {
        alert("Please enter username and password");
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error("Invalid username or password");
        }

        const token = await response.text();

        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_username", username);

        const userInfo = await getUserInfo();
        if (userInfo) {
            localStorage.setItem("auth_email", userInfo.email);
        }

        window.location.href = "index.html";

    } catch (err) {
        alert("Login failed: " + err.message);
    }
}

let allProducts = []; // Store all products globally to enable filtering

async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:8080/api/categories');

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const categories = await response.json();

        const categoriesList = document.getElementById("categories-list");
        if (!categoriesList) return;

        if (!Array.isArray(categories) || categories.length === 0) {
            categoriesList.innerHTML = "<p>No categories available</p>";
            return;
        }

        // Create a list of categories
        let categoryHtml = '<ul class="categories-list">';
        categoryHtml += '<li data-category-id="" class="active">All Products</li>'; // Default "All" option

        categories.forEach(category => {
            categoryHtml += `<li data-category-id="${category.id}">${category.name || category.username || 'Unknown Category'}</li>`;
        });

        categoryHtml += '</ul>';
        categoriesList.innerHTML = categoryHtml;

        // Add event listeners to category items after DOM is updated
        setTimeout(() => {
            document.querySelectorAll('.categories-list li').forEach(item => {
                item.addEventListener('click', function() {
                    // Remove active class from all items
                    document.querySelectorAll('.categories-list li').forEach(li => {
                        li.classList.remove('active');
                    });

                    // Add active class to clicked item
                    this.classList.add('active');

                    // Filter products by selected category
                    const categoryId = this.getAttribute('data-category-id');
                    filterProductsByCategory(categoryId);
                });
            });
        }, 0);

    } catch (err) {
        console.error("Failed to load categories:", err);
        document.getElementById("categories-list").innerHTML = `<p>Error loading categories: ${err.message}</p>`;
    }
}

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:8080/api/products');

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        allProducts = await response.json();

        // Display all products initially
        const container = document.getElementById("product-container");
        if (!container) return;

        container.innerHTML = "";

        allProducts.forEach(product => {
            const card = `
                <div class="card">
                    ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name || 'Product'}">` : ''}
                    <div class="card-content">
                        <h3>${product.name || "Unnamed"}</h3>
                        <p>${product.description || ""}</p>
                        <p><strong>$${product.price?.toFixed(2) || "?"}</strong></p>
                        <button onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });

    } catch (err) {
        console.error("Failed to load products:", err);
        document.getElementById("product-container").innerHTML = "<p>Error loading products</p>";
    }
}

async function filterProductsByCategory(categoryId) {
    const container = document.getElementById("product-container");
    if (!container) return;

    container.innerHTML = "<p>Loading products...</p>"; // Show loading message

    try {
        let apiUrl = '';
        if (categoryId) {
            // If a specific category is selected, fetch products for that category
            apiUrl = `http://localhost:8080/api/products/search?categoryId=${categoryId}`;
        } else {
            // If no category is selected (All Products), fetch all products
            apiUrl = 'http://localhost:8080/api/products';
        }

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const products = await response.json();
        console.log("Products loaded for category:", categoryId, products); // Debug log

        container.innerHTML = ""; // Clear loading message

        if (products.length === 0) {
            container.innerHTML = "<p>No products found in this category.</p>";
            return;
        }

        products.forEach(product => {
            // Determine if product is out of stock
            const isOutOfStock = product.stockQuantity <= 0;
            const cardClass = isOutOfStock ? 'card out-of-stock' : 'card';

            const card = `
                <div class="${cardClass}">
                    <img src="${product.imageUrl || ''}" alt="${product.name || 'Product'}" onclick="openProductModal(${product.id})" style="cursor: ${isOutOfStock ? 'not-allowed' : 'pointer'};">
                    <div class="card-content">
                        <h3 onclick="openProductModal(${product.id})" style="cursor: ${isOutOfStock ? 'not-allowed' : 'pointer'};">${product.name || "Unnamed"}</h3>
                        <p>${product.description || ""}</p>
                        <p><strong>$${product.price?.toFixed(2) || "?"}</strong></p>
                        ${isOutOfStock ?
                            '<p class="out-of-stock-label">Runned Out</p>' :
                            '<button onclick="openProductModal(' + product.id + ')">View Details</button>'
                        }
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });

    } catch (err) {
        console.error("Failed to load products by category:", err);
        container.innerHTML = `<p>Error loading products: ${err.message}</p>`;
    }
}

async function addToCart(productId) {
    // This function is deprecated. Use the product modal instead.
    // Opening the product modal to allow users to select quantity
    openProductModal(productId);
    // Update the cart count when the modal opens
    setTimeout(updateCartCount, 1000); // Delay to allow modal to load
}

async function getUserInfo() {
    const token = localStorage.getItem("auth_token");
    const username = localStorage.getItem("auth_username");

    if (!token || !username) {
        return null;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/users/${username}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            localStorage.setItem("auth_email", userData.email);
            return userData;
        } else {
            console.error("Failed to get user info:", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error getting user info:", error);
        return null;
    }
}

// Load product details for the product detail page
async function loadProductDetail(productId) {
    try {
        const response = await fetch(`http://localhost:8080/api/products/${productId}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const product = await response.json();
        console.log("Loaded product:", product);

        // Update the UI with product details
        document.getElementById('product-image').src = product.imageUrl || '/image/placeholder.png';
        document.getElementById('product-name').textContent = product.name || 'Unnamed Product';
        document.getElementById('product-price').textContent = `$${product.price?.toFixed(2) || '0.00'}`;
        document.getElementById('product-description').textContent = product.description || 'No description available';
        document.getElementById('product-stock').textContent = `In Stock: ${product.stockQuantity || 0}`;

        // Set the max value for quantity input based on stock
        const quantityInput = document.getElementById('quantity-input');
        const maxStock = product.stockQuantity || 0;
        quantityInput.max = maxStock;
        quantityInput.value = Math.min(1, maxStock); // Set to 1 or max if stock is 0

        // Show/hide warning based on stock
        updateStockWarning(maxStock);

        // Show the product content and hide loading/error messages
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

// Quantity control functions
function increaseQuantity() {
    const input = document.getElementById('quantity-input');
    const maxStock = parseInt(input.max);
    let currentValue = parseInt(input.value);

    if (currentValue < maxStock) {
        input.value = currentValue + 1;
        updateStockWarning(maxStock);
    }
}

function decreaseQuantity() {
    const input = document.getElementById('quantity-input');
    let currentValue = parseInt(input.value);

    if (currentValue > 1) {
        input.value = currentValue - 1;
        updateStockWarning(parseInt(input.max));
    }
}

function updateStockWarning(maxStock) {
    const quantityInput = document.getElementById('quantity-input');
    const warningDiv = document.getElementById('stock-warning');
    const currentQuantity = parseInt(quantityInput.value);

    if (currentQuantity > maxStock) {
        warningDiv.textContent = `Only ${maxStock} items in stock!`;
        warningDiv.style.display = 'block';
        quantityInput.style.borderColor = '#ef4444';
    } else {
        warningDiv.style.display = 'none';
        quantityInput.style.borderColor = '#d1d5db';
    }
}

// Open product modal
async function openProductModal(productId) {
    try {
        const response = await fetch(`http://localhost:8080/api/products/${productId}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const product = await response.json();
        console.log("Loaded product for modal:", product);

        // Check if product is out of stock
        const isOutOfStock = product.stockQuantity <= 0;

        // Update the modal with product details
        document.getElementById('modal-product-image').src = product.imageUrl || '/image/placeholder.png';
        document.getElementById('modal-product-name').textContent = product.name || 'Unnamed Product';
        document.getElementById('modal-product-price').textContent = `$${product.price?.toFixed(2) || '0.00'}`;
        document.getElementById('modal-product-description').textContent = product.description || 'No description available';

        // Update stock display
        const stockElement = document.getElementById('modal-product-stock');
        if (isOutOfStock) {
            stockElement.textContent = 'Out of Stock';
            stockElement.style.color = '#ef4444'; // Red color for out of stock
        } else {
            stockElement.textContent = `In Stock: ${product.stockQuantity}`;
            stockElement.style.color = '#10b981'; // Green color for in stock
        }

        // Store the product ID in a data attribute for later use
        document.getElementById('product-modal').setAttribute('data-product-id', product.id);

        // Set the max value for quantity input based on stock
        const quantityInput = document.getElementById('modal-quantity-input');
        const maxStock = product.stockQuantity || 0;
        quantityInput.max = maxStock;
        quantityInput.value = Math.min(1, maxStock); // Set to 1 or max if stock is 0

        // Show/hide warning based on stock
        updateModalStockWarning(maxStock);

        // Disable add to cart button if out of stock
        const addToCartBtn = document.getElementById('modal-add-to-cart-btn');
        if (isOutOfStock) {
            addToCartBtn.disabled = true;
            addToCartBtn.textContent = 'Out of Stock';
            addToCartBtn.onclick = null; // Remove the click handler
            // Add a temporary handler that shows an alert
            addToCartBtn.onclick = function() {
                alert('This product is currently out of stock.');
            };
        } else {
            addToCartBtn.disabled = false;
            addToCartBtn.textContent = 'Add to Cart';
            // Restore the original click handler
            addToCartBtn.onclick = function() {
                addModalToCart();
            };
        }

        // Show the modal
        document.getElementById('product-modal').style.display = 'flex';

    } catch (err) {
        console.error("Failed to load product for modal:", err);
        alert("Failed to load product details: " + err.message);
    }
}

// Close modal
function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// Quantity control functions for modal
function increaseModalQuantity() {
    const input = document.getElementById('modal-quantity-input');
    const maxStock = parseInt(input.max);
    let currentValue = parseInt(input.value);

    if (currentValue < maxStock) {
        input.value = currentValue + 1;
        updateModalStockWarning(maxStock);
    }
}

function decreaseModalQuantity() {
    const input = document.getElementById('modal-quantity-input');
    let currentValue = parseInt(input.value);

    if (currentValue > 1) {
        input.value = currentValue - 1;
        updateModalStockWarning(parseInt(input.max));
    }
}

function updateModalStockWarning(maxStock) {
    const quantityInput = document.getElementById('modal-quantity-input');
    const warningDiv = document.getElementById('modal-stock-warning');
    const currentQuantity = parseInt(quantityInput.value);

    if (currentQuantity > maxStock) {
        warningDiv.textContent = `Only ${maxStock} items in stock!`;
        warningDiv.style.display = 'block';
        quantityInput.style.borderColor = '#ef4444';
    } else {
        warningDiv.style.display = 'none';
        quantityInput.style.borderColor = '#d1d5db';
    }
}

// Add to cart from modal
async function addModalToCart() {
    // Get the product ID from the modal's data attribute
    const productId = document.getElementById('product-modal').getAttribute('data-product-id');
    const quantity = parseInt(document.getElementById('modal-quantity-input').value);

    // Validate quantity
    if (isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    const maxStock = parseInt(document.getElementById('modal-quantity-input').max);
    if (quantity > maxStock) {
        alert(`Cannot add more than ${maxStock} items to cart. Only ${maxStock} in stock.`);
        return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: parseInt(productId),
                quantity: quantity
            })
        });

        if (response.ok) {
            alert(`${quantity} item(s) added to cart successfully!`);
            closeModal(); // Close the modal after adding to cart
            // Update the cart count badge
            updateCartCount();
        } else {
            const errorText = await response.text();
            alert("Failed: " + errorText);
        }
    } catch (err) {
        console.error(err);
        alert("Network error");
    }
}

// Add to cart from product detail page (keeping for product-detail.html if needed)
async function addToCartFromDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const quantity = parseInt(document.getElementById('quantity-input').value);

    // Validate quantity
    if (isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    const maxStock = parseInt(document.getElementById('quantity-input').max);
    if (quantity > maxStock) {
        alert(`Cannot add more than ${maxStock} items to cart. Only ${maxStock} in stock.`);
        return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: parseInt(productId),
                quantity: quantity
            })
        });

        if (response.ok) {
            alert(`${quantity} item(s) added to cart successfully!`);
        } else {
            const errorText = await response.text();
            alert("Failed: " + errorText);
        }
    } catch (err) {
        console.error(err);
        alert("Network error");
    }
}

function goBackToShop() {
    window.location.href = 'index.html';
}

// Cart modal functions
async function openCartModal() {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login to view your cart");
        window.location.href = "login.html";
        return;
    }

    // Show the modal and loading message
    document.getElementById('cart-modal').style.display = 'flex';
    document.getElementById('cart-loading').style.display = 'block';
    document.getElementById('cart-items-list').innerHTML = '';
    document.getElementById('empty-cart-message').style.display = 'none';

    try {
        console.log("Fetching cart with token:", token); // Debug log

        const response = await fetch('http://localhost:8080/api/cart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log("Response status:", response.status); // Debug log
        console.log("Response statusText:", response.statusText); // Debug log

        if (!response.ok) {
            const errorText = await response.text(); // Get error response body
            console.log("Error response:", errorText); // Debug log
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        }

        const cart = await response.json();
        console.log("Cart data:", cart);

        displayCartItems(cart);

    } catch (err) {
        console.error("Failed to load cart:", err);
        document.getElementById('cart-loading').textContent = `Error loading cart: ${err.message}`;
    }
}

function closeCartModal() {
    document.getElementById('cart-modal').style.display = 'none';
}

function displayCartItems(cart) {
    const cartItemsContainer = document.getElementById('cart-items-list');
    const cartLoading = document.getElementById('cart-loading');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTotalElement = document.getElementById('cart-total-amount');
    const checkoutButton = document.getElementById('checkout-btn');

    // Hide loading indicator
    cartLoading.style.display = 'none';

    // Check if cart has items
    if (!cart.items || cart.items.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartTotalElement.textContent = '$0.00';
        // Disable checkout button when cart is empty
        checkoutButton.disabled = true;
        return;
    }

    // Show cart items
    emptyCartMessage.style.display = 'none';
    cartItemsContainer.innerHTML = '';

    let total = 0;

    cart.items.forEach(item => {
        const itemTotal = item.product.price * item.quantity;
        total += itemTotal;

        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${item.product.imageUrl || '/image/placeholder.png'}" alt="${item.product.name}"
                 class="cart-item-image" onerror="this.src='/image/placeholder.png';">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.product.name}</div>
                <div class="cart-item-price">$${item.product.price?.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button onclick="updateCartItemQuantity(${item.product.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartItemQuantity(${item.product.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-item-btn" onclick="removeCartItem(${item.product.id})">Remove</button>
                </div>
            </div>
            <div style="font-weight: bold;">$${itemTotal.toFixed(2)}</div>
        `;

        cartItemsContainer.appendChild(cartItemElement);
    });

    // Update total
    cartTotalElement.textContent = `$${total.toFixed(2)}`;

    // Enable checkout button when cart has items
    checkoutButton.disabled = false;
}

async function updateCartItemQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        // If quantity is 0 or less, remove the item
        await removeCartItem(productId);
        return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login to update your cart");
        window.location.href = "login.html";
        return;
    }

    try {
        // To update quantity, we need to remove the item and add it back with new quantity
        // First, get product details to validate stock
        const productResponse = await fetch(`http://localhost:8080/api/products/${productId}`);
        if (!productResponse.ok) {
            throw new Error(`Failed to get product details: ${productResponse.statusText}`);
        }
        const product = await productResponse.json();

        if (newQuantity > product.stockQuantity) {
            alert(`Cannot set quantity to ${newQuantity}. Only ${product.stockQuantity} in stock.`);
            // Refresh the cart modal to show current state
            setTimeout(openCartModal, 500);
            return;
        }

        // Remove the item first
        await removeCartItem(productId);

        // Then add it back with the new quantity
        const response = await fetch('http://localhost:8080/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: productId,
                quantity: newQuantity
            })
        });

        if (response.ok) {
            // Refresh the cart modal to show updated quantity
            setTimeout(openCartModal, 500);
            // Update the cart count badge
            updateCartCount();
        } else {
            const errorText = await response.text();
            alert("Failed to update quantity: " + errorText);
        }

    } catch (err) {
        console.error("Failed to update cart item quantity:", err);
        alert("Error updating cart item: " + err.message);
    }
}

async function removeCartItem(productId) {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login to update your cart");
        window.location.href = "login.html";
        return;
    }

    if (!confirm("Are you sure you want to remove this item from your cart?")) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/cart/item/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            // Refresh the cart modal to show updated cart
            setTimeout(openCartModal, 500);
            // Update the cart count in the header
            updateCartCount();
        } else {
            const errorText = await response.text();
            alert("Failed to remove item: " + errorText);
        }
    } catch (err) {
        console.error("Failed to remove cart item:", err);
        alert("Error removing item from cart: " + err.message);
    }
}

async function updateCartCount() {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        document.getElementById('cart-count').textContent = '0';
        // Apply gray class when count is 0
        document.getElementById('cart-count').className = 'cart-count-badge zero';
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/cart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const cart = await response.json();
            const itemCount = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
            document.getElementById('cart-count').textContent = itemCount;

            // Apply appropriate class based on count
            if (itemCount === 0) {
                document.getElementById('cart-count').className = 'cart-count-badge zero';
            } else {
                document.getElementById('cart-count').className = 'cart-count-badge';
            }
        } else {
            document.getElementById('cart-count').textContent = '0';
            document.getElementById('cart-count').className = 'cart-count-badge zero';
        }
    } catch (err) {
        console.error("Failed to update cart count:", err);
        document.getElementById('cart-count').textContent = '0';
        document.getElementById('cart-count').className = 'cart-count-badge zero';
    }
}

function goToProfile() {
    window.location.href = 'profile.html';
}

function proceedToCheckout() {
    // Navigate to the checkout page
    window.location.href = 'checkout.html';
}

// Admin Panel Functions
async function checkAdminAccess() {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login to access admin panel");
        window.location.href = "login.html";
        return;
    }

    // Verify user is admin
    try {
        const userResponse = await fetch('http://localhost:8080/api/users/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!userResponse.ok) {
            throw new Error(`HTTP ${userResponse.status}: ${userResponse.statusText}`);
        }

        const user = await userResponse.json();

        if (user.role !== 'ADMIN') {
            alert("Access denied. Admin privileges required.");
            // Redirect to home page if not admin
            window.location.href = "index.html";
            return;
        }

        // Admin access granted, page can load normally
        console.log("Admin access verified");

    } catch (err) {
        console.error("Failed to verify admin status:", err);
        alert("Error verifying admin status: " + err.message);
        window.location.href = "index.html";
    }
}

function showAddProductForm() {
    const formHTML = `
        <div class="admin-form active">
            <h3>Add New Product</h3>
            <div class="form-row">
                <div class="form-group form-group-half">
                    <label for="productName">Product Name</label>
                    <input type="text" id="productName" placeholder="Enter product name">
                </div>
                <div class="form-group form-group-half">
                    <label for="productPrice">Price ($)</label>
                    <input type="number" id="productPrice" placeholder="Enter price" step="0.01">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group form-group-half">
                    <label for="productStock">Stock Quantity</label>
                    <input type="number" id="productStock" placeholder="Enter stock quantity">
                </div>
                <div class="form-group form-group-half">
                    <label for="productImageUrl">Image URL</label>
                    <input type="text" id="productImageUrl" placeholder="Enter image URL">
                </div>
            </div>
            <div class="form-group">
                <label for="productDescription">Description</label>
                <textarea id="productDescription" placeholder="Enter product description"></textarea>
            </div>
            <div class="form-group">
                <label for="productCategory">Category</label>
                <select id="productCategory">
                    <option value="">Select a category</option>
                </select>
            </div>
            <div class="admin-form-buttons">
                <button class="btn btn-primary" onclick="addProduct()">Add Product</button>
                <button class="btn btn-secondary" onclick="hideCurrentForm()">Cancel</button>
            </div>
        </div>
    `;

    document.getElementById('admin-form-container').innerHTML = formHTML;

    // Load categories
    loadCategoriesForForm('productCategory');
}

function showUpdateProductForm() {
    // Load products and show selection dropdown
    const formHTML = `
        <div class="admin-form active">
            <h3>Update Product</h3>
            <div class="form-group">
                <label for="selectProductToUpdate">Select Product</label>
                <select id="selectProductToUpdate" onchange="loadProductDetailsForUpdate()">
                    <option value="">Loading products...</option>
                </select>
            </div>
            <div id="updateProductFormFields" style="display: none;">
                <div class="form-row">
                    <div class="form-group form-group-half">
                        <label for="updateProductName">Product Name</label>
                        <input type="text" id="updateProductName" placeholder="Enter product name">
                    </div>
                    <div class="form-group form-group-half">
                        <label for="updateProductPrice">Price ($)</label>
                        <input type="number" id="updateProductPrice" placeholder="Enter price" step="0.01">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group form-group-half">
                        <label for="updateProductStock">Stock Quantity</label>
                        <input type="number" id="updateProductStock" placeholder="Enter stock quantity">
                    </div>
                    <div class="form-group form-group-half">
                        <label for="updateProductImageUrl">Image URL</label>
                        <input type="text" id="updateProductImageUrl" placeholder="Enter image URL">
                    </div>
                </div>
                <div class="form-group">
                    <label for="updateProductDescription">Description</label>
                    <textarea id="updateProductDescription" placeholder="Enter product description"></textarea>
                </div>
                <div class="form-group">
                    <label for="updateProductCategory">Category</label>
                    <select id="updateProductCategory">
                        <option value="">Select a category</option>
                    </select>
                </div>
                <div class="admin-form-buttons">
                    <button class="btn btn-primary" onclick="updateProduct()">Update Product</button>
                    <button class="btn btn-secondary" onclick="hideCurrentForm()">Cancel</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('admin-form-container').innerHTML = formHTML;

    // Load products for selection
    loadProductsForSelection('selectProductToUpdate');
    // Load categories for update form
    loadCategoriesForForm('updateProductCategory');
}

function showManageOrdersForm() {
    const formHTML = `
        <div class="admin-form active">
            <h3>Manage Orders</h3>
            <div class="form-group">
                <label for="selectOrderToManage">Select Order</label>
                <select id="selectOrderToManage" onchange="loadOrderDetailsForUpdate()">
                    <option value="">Loading orders...</option>
                </select>
            </div>
            <div id="manageOrderFormFields" style="display: none;">
                <div class="form-group">
                    <label for="orderStatus">Current Status: <span id="currentOrderStatus"></span></label>
                </div>
                <div class="form-group">
                    <label for="newOrderStatus">New Status</label>
                    <select id="newOrderStatus">
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELED">CANCELED</option>
                    </select>
                </div>
                <div class="admin-form-buttons">
                    <button class="btn btn-primary" onclick="updateOrderStatus()">Update Status</button>
                    <button class="btn btn-secondary" onclick="hideCurrentForm()">Cancel</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('admin-form-container').innerHTML = formHTML;

    // Load orders for selection
    loadOrdersForSelection('selectOrderToManage');
}

function hideCurrentForm() {
    document.getElementById('admin-form-container').innerHTML = '';
}

async function loadCategoriesForForm(selectId) {
    try {
        const response = await fetch('http://localhost:8080/api/categories');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const categories = await response.json();
        const selectElement = document.getElementById(selectId);

        selectElement.innerHTML = '<option value="">Select a category</option>';

        categories.forEach(category => {
            const option = document.createElement('option');
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
        const response = await fetch('http://localhost:8080/api/products');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const products = await response.json();
        const selectElement = document.getElementById(selectId);

        selectElement.innerHTML = '<option value="">Select a product</option>';

        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} - $${product.price?.toFixed(2)}`;
            selectElement.appendChild(option);
        });
    } catch (err) {
        console.error("Failed to load products:", err);
        document.getElementById(selectId).innerHTML = '<option value="">Error loading products</option>';
    }
}

async function loadOrderDetailsForUpdate() {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login to access order details");
        return;
    }

    const orderId = document.getElementById('selectOrderToManage').value;
    if (!orderId) {
        document.getElementById('manageOrderFormFields').style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const order = await response.json();

        document.getElementById('currentOrderStatus').textContent = order.status;
        document.getElementById('manageOrderFormFields').style.display = 'block';
    } catch (err) {
        console.error("Failed to load order details:", err);
        alert("Error loading order details: " + err.message);
    }
}

async function loadOrdersForSelection(selectId) {
    try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch('http://localhost:8080/api/orders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const orders = await response.json();
        const selectElement = document.getElementById(selectId);

        selectElement.innerHTML = '<option value="">Select an order</option>';

        orders.forEach(order => {
            const option = document.createElement('option');
            option.value = order.id;
            option.textContent = `Order #${order.id} - ${order.status} - $${order.totalAmount || '0.00'}`;
            selectElement.appendChild(option);
        });
    } catch (err) {
        console.error("Failed to load orders:", err);
        document.getElementById(selectId).innerHTML = '<option value="">Error loading orders</option>';
    }
}

async function loadProductDetailsForUpdate() {
    const productId = document.getElementById('selectProductToUpdate').value;
    if (!productId) {
        document.getElementById('updateProductFormFields').style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const product = await response.json();

        document.getElementById('updateProductName').value = product.name || '';
        document.getElementById('updateProductPrice').value = product.price || '';
        document.getElementById('updateProductStock').value = product.stockQuantity || '';
        document.getElementById('updateProductImageUrl').value = product.imageUrl || '';
        document.getElementById('updateProductDescription').value = product.description || '';

        // Set the category
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
    const token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login to add products");
        return;
    }

    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const stockQuantity = parseInt(document.getElementById('productStock').value);
    const imageUrl = document.getElementById('productImageUrl').value;
    const description = document.getElementById('productDescription').value;
    const categoryId = document.getElementById('productCategory').value;

    if (!name || !price || !stockQuantity || !categoryId) {
        alert("Please fill in all required fields");
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name,
                description: description,
                stockQuantity: stockQuantity,
                imageUrl: imageUrl,
                price: price,
                categoryId: parseInt(categoryId)
            })
        });

        if (response.ok) {
            alert("Product added successfully!");
            hideCurrentForm();
            // Optionally reload products on the main page
            if (window.location.pathname.includes('index.html')) {
                fetchProducts(); // Assuming this function exists
            }
        } else {
            const errorText = await response.text();
            alert("Failed to add product: " + errorText);
        }
    } catch (err) {
        console.error("Error adding product:", err);
        alert("Error adding product: " + err.message);
    }
}

async function updateProduct() {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login to update products");
        return;
    }

    const productId = document.getElementById('selectProductToUpdate').value;
    const name = document.getElementById('updateProductName').value;
    const price = parseFloat(document.getElementById('updateProductPrice').value);
    const stockQuantity = parseInt(document.getElementById('updateProductStock').value);
    const imageUrl = document.getElementById('updateProductImageUrl').value;
    const description = document.getElementById('updateProductDescription').value;
    const categoryId = document.getElementById('updateProductCategory').value;

    if (!productId || !name || !price || !stockQuantity || !categoryId) {
        alert("Please fill in all required fields");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name,
                description: description,
                stockQuantity: stockQuantity,
                imageUrl: imageUrl,
                price: price,
                categoryId: parseInt(categoryId)
            })
        });

        if (response.ok) {
            alert("Product updated successfully!");
            hideCurrentForm();
            // Optionally reload products on the main page
            if (window.location.pathname.includes('index.html')) {
                fetchProducts(); // Assuming this function exists
            }
        } else {
            const errorText = await response.text();
            alert("Failed to update product: " + errorText);
        }
    } catch (err) {
        console.error("Error updating product:", err);
        alert("Error updating product: " + err.message);
    }
}

async function updateOrderStatus() {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login to update orders");
        return;
    }

    const orderId = document.getElementById('selectOrderToManage').value;
    const newStatus = document.getElementById('newOrderStatus').value;

    if (!orderId || !newStatus) {
        alert("Please select an order and new status");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                status: newStatus,
                // Include other required fields to satisfy the OrderRequestDTO
                userId: 0, // This will be ignored in the service method
                orderItems: [], // This will be ignored in the service method
                shippingAddress: "", // This will be ignored in the service method
                paymentInfo: {} // This will be ignored in the service method
            })
        });

        if (response.ok) {
            alert("Order status updated successfully!");
            hideCurrentForm();
        } else {
            const errorText = await response.text();
            alert("Failed to update order status: " + errorText);
        }
    } catch (err) {
        console.error("Error updating order status:", err);
        alert("Error updating order status: " + err.message);
    }
}

// Function to load cart items and user info on the checkout page
async function loadCartForCheckout() {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login to proceed with checkout");
        window.location.href = "login.html";
        return;
    }

    try {
        // Load cart items
        const cartResponse = await fetch('http://localhost:8080/api/cart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!cartResponse.ok) {
            throw new Error(`HTTP ${cartResponse.status}: ${cartResponse.statusText}`);
        }

        const cart = await cartResponse.json();
        console.log("Cart data for checkout:", cart);

        displayCartItemsForCheckout(cart);

        // Load user information
        const userResponse = await fetch('http://localhost:8080/api/users/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!userResponse.ok) {
            // If the /me endpoint doesn't exist, try to get user info from the cart response
            // or use the username from localStorage
            const username = localStorage.getItem("auth_username");
            document.getElementById('review-name').textContent = username || 'Loading...';
            document.getElementById('review-email').textContent = localStorage.getItem("auth_email") || 'Loading...';
            document.getElementById('review-phone').textContent = 'Loading...';
        } else {
            const user = await userResponse.json();
            document.getElementById('review-name').textContent = `${user.firstName} ${user.lastName}`;
            document.getElementById('review-email').textContent = user.email;
            document.getElementById('review-phone').textContent = user.phone;
        }

    } catch (err) {
        console.error("Failed to load cart or user info for checkout:", err);
        document.getElementById('order-items').innerHTML = `<p>Error loading cart: ${err.message}</p>`;
    }
}

// Display cart items in the checkout page
function displayCartItemsForCheckout(cart) {
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal-amount');
    const totalElement = document.getElementById('total-amount');

    if (!cart.items || cart.items.length === 0) {
        orderItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        subtotalElement.textContent = '$0.00';
        totalElement.textContent = '$0.00';
        return;
    }

    let subtotal = 0;
    let itemsHtml = '';

    cart.items.forEach(item => {
        const itemTotal = item.product.price * item.quantity;
        subtotal += itemTotal;

        itemsHtml += `
            <div class="order-item">
                <div class="order-item-name">${item.product.name}</div>
                <div class="order-item-quantity">x${item.quantity}</div>
                <div class="order-item-price">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });

    orderItemsContainer.innerHTML = itemsHtml;

    // Calculate totals
    const shipping = 5.99; // Fixed shipping cost
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;

    // Update display
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping-amount').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('tax-amount').textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Handle checkout form submission
async function handleCheckoutSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login to proceed with checkout");
        window.location.href = "login.html";
        return;
    }

    // Get form values (shipping and payment information)
    const shippingAddress = document.getElementById('shippingAddress').value;
    const city = document.getElementById('city').value;
    const zipCode = document.getElementById('zipCode').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const cardName = document.getElementById('cardName').value;

    try {
        // Get user information
        const userResponse = await fetch('http://localhost:8080/api/cart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!userResponse.ok) {
            throw new Error(`HTTP ${userResponse.status}: ${userResponse.statusText}`);
        }

        const cart = await userResponse.json();
        const userId = cart.userId;

        // Place the order using the existing order API
        // Note: userId is not needed in the body as the backend extracts it from the authentication context
        const response = await fetch('http://localhost:8080/api/orders/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                shippingAddress: `${shippingAddress}, ${city}, ${zipCode}`,
                paymentInfo: {
                    cardNumber: cardNumber,
                    expiryDate: expiryDate,
                    cvv: cvv,
                    cardName: cardName
                },
                orderItems: cart.items.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity
                }))
            })
        });

        if (response.ok) {
            alert("Order placed successfully!");
            // Clear the cart after successful order
            await fetch('http://localhost:8080/api/cart/clear', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Update cart count
            updateCartCount();
            // Redirect to order confirmation or home page
            window.location.href = 'index.html';
        } else {
            const errorText = await response.text();
            alert("Failed to place order: " + errorText);
        }
    } catch (err) {
        console.error("Checkout error:", err);
        alert("Error processing checkout: " + err.message);
    }
}

// Load user profile information
async function loadProfile() {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Please login to view your profile");
        window.location.href = "login.html";
        return;
    }

    try {
        // Load user information
        const userResponse = await fetch('http://localhost:8080/api/users/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!userResponse.ok) {
            throw new Error(`HTTP ${userResponse.status}: ${userResponse.statusText}`);
        }

        const user = await userResponse.json();
        displayUserInfo(user);

        // Load user's order history
        const ordersResponse = await fetch('http://localhost:8080/api/orders/user?email=' + user.email, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!ordersResponse.ok) {
            throw new Error(`HTTP ${ordersResponse.status}: ${ordersResponse.statusText}`);
        }

        const orders = await ordersResponse.json();
        displayOrderHistory(orders);

    } catch (err) {
        console.error("Failed to load profile:", err);
        document.getElementById('user-info').innerHTML = `<p>Error loading profile: ${err.message}</p>`;
        document.getElementById('orders-list').innerHTML = `<p>Error loading orders: ${err.message}</p>`;
    }
}

// Display user information
function displayUserInfo(user) {
    const userInfoElement = document.getElementById('user-info');

    const userInfoHTML = `
        <div class="user-info-grid">
            <div class="user-info-item">
                <span class="user-info-label">First Name</span>
                <span class="user-info-value">${user.firstName || 'N/A'}</span>
            </div>
            <div class="user-info-item">
                <span class="user-info-label">Last Name</span>
                <span class="user-info-value">${user.lastName || 'N/A'}</span>
            </div>
            <div class="user-info-item">
                <span class="user-info-label">Username</span>
                <span class="user-info-value">${user.username || 'N/A'}</span>
            </div>
            <div class="user-info-item">
                <span class="user-info-label">Email</span>
                <span class="user-info-value">${user.email || 'N/A'}</span>
            </div>
            <div class="user-info-item">
                <span class="user-info-label">Phone</span>
                <span class="user-info-value">${user.phone || 'N/A'}</span>
            </div>
            <div class="user-info-item">
                <span class="user-info-label">Role</span>
                <span class="user-info-value">${user.role || 'N/A'}</span>
            </div>
        </div>
    `;

    userInfoElement.innerHTML = userInfoHTML;
}

// Display order history
function displayOrderHistory(orders) {
    const ordersListElement = document.getElementById('orders-list');

    if (!orders || orders.length === 0) {
        ordersListElement.innerHTML = '<p class="no-orders">No orders found</p>';
        return;
    }

    let ordersHTML = `
        <table class="orders-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total Amount</th>
                    <th>Items Count</th>
                </tr>
            </thead>
            <tbody>
    `;

    orders.forEach(order => {
        const orderDate = new Date(order.createdAt).toLocaleDateString();
        const statusClass = `status-${order.status.toLowerCase()}`;

        ordersHTML += `
            <tr>
                <td>#${order.id}</td>
                <td>${orderDate}</td>
                <td><span class="order-status ${statusClass}">${order.status}</span></td>
                <td>$${order.totalAmount || '0.00'}</td>
                <td>${order.orderItems ? order.orderItems.length : 0}</td>
            </tr>
        `;
    });

    ordersHTML += `
            </tbody>
        </table>
    `;

    ordersListElement.innerHTML = ordersHTML;
}

// Initialize checkout page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    if (path.includes("checkout.html")) {
        // Load cart items for checkout
        loadCartForCheckout();
        updateAuthUI();

        // Add event listener to the form
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', handleCheckoutSubmit);
        }
    } else if (path.includes("profile.html")) {
        // Load user profile
        loadProfile();
        updateAuthUI();
    } else if (path.includes("index.html")) {
        fetchCategories();
        fetchProducts();
        updateAuthUI();
    } else if (path.includes("login.html")) {
        document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await tryLogin();
        });
    } else if (path.includes("product-detail.html")) {
        // Extract product ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (productId) {
            loadProductDetail(productId);
        } else {
            // Redirect to homepage if no product ID is provided
            window.location.href = 'index.html';
        }
        updateAuthUI();
    } else if (path.includes("admin.html")) {
        // Check if user is admin and load admin functionality
        checkAdminAccess();
        updateAuthUI();
    }
});

function logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_username");
    localStorage.removeItem("auth_email");
    updateAuthUI();
    // Reload the page to refresh products
    location.reload();
}