document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    if (path === "/" || path.includes("index.html")) {
        fetchProducts();
        updateAuthUI();
    } else if (path.includes("login.html")) {
        document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await tryLogin();
        });
    }
});

function updateAuthUI() {
    const token = localStorage.getItem("auth_token");
    const username = localStorage.getItem("auth_username");

    const authNav = document.getElementById("auth-nav");
    if (authNav) {
        if (token && username) {
            authNav.innerHTML = `
                <span>Welcome, ${username}!</span>
                <button onclick="logout()" class="btn">Logout</button>
            `;
        } else {
            authNav.innerHTML = `
                <a href="login.html" class="btn">Login</a>
            `;
        }
    }
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

        alert("Login successful!");
        window.location.href = "index.html";

    } catch (err) {
        alert("Login failed: " + err.message);
    }
}

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:8080/api/products');

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const products = await response.json();

        const container = document.getElementById("product-container");
        if (!container) return;

        container.innerHTML = "";

        products.forEach(product => {
            const card = `
                <div class="card">
                    <h3>${product.name || "Unnamed"}</h3>
                    <p>${product.description || ""}</p>
                    <p><strong>$${product.price?.toFixed(2) || "?"}</strong></p>
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            `;
            container.innerHTML += card;
        });

    } catch (err) {
        console.error("Failed to load products:", err);
        document.getElementById("product-container").innerHTML = "<p>Error loading products</p>";
    }
}

async function addToCart(productId) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                orderItems: [{
                    productId: productId,
                    quantity: 1
                }]
            })
        });

        if (response.ok) {
            alert("Added to cart successfully!");
        } else {
            const errorText = await response.text();
            alert("Failed: " + errorText);
        }

    } catch (err) {
        console.error(err);
        alert("Network error");
    }
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

function logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_username");
    localStorage.removeItem("auth_email");
    window.location.href = "index.html";
}