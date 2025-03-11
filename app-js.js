// Constants and variables
const SHEET_ID = '1BUcUrj7Cu5SQ46dJ65wWLaai8ooLyLGnv_qs1TyoIfU';
const BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?`;
const SHEET_NAME = 'productos'; // Update this to match your actual sheet name
const QUERY = encodeURIComponent('SELECT *');
const FULL_URL = `${BASE_URL}&sheet=${SHEET_NAME}&tq=${QUERY}`;

let products = [];
let categories = [];
let cart = [];
let currentProduct = null;

// DOM Elements
const loadingElement = document.getElementById('loading');
const productsContainer = document.getElementById('products');
const categoriesContainer = document.getElementById('categories');
const productModal = document.getElementById('product-modal');
const cartModal = document.getElementById('cart-modal');
const modalBody = document.getElementById('modal-body');
const addToCartBtn = document.getElementById('add-to-cart-btn');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Close buttons for modals
document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', () => {
        productModal.style.display = 'none';
        cartModal.style.display = 'none';
    });
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === productModal) {
        productModal.style.display = 'none';
    }
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Fetch products from Google Sheets
async function fetchProducts() {
    try {
        const response = await fetch(FULL_URL);
        const text = await response.text();
        const data = JSON.parse(text.substring(47).slice(0, -2));
        
        // Process the data
        if (data.table && data.table.rows) {
            const headers = data.table.cols.map(col => col.label);
            
            // Process each row into a product object
            products = data.table.rows.map(row => {
                const product = {};
                headers.forEach((header, index) => {
                    if (row.c[index] && row.c[index].v !== null) {
                        product[header.toLowerCase()] = row.c[index].v;
                    } else {
                        product[header.toLowerCase()] = '';
                    }
                });
                return product;
            });
            
            // Extract unique categories
            categories = [...new Set(products.map(product => product.categoria))];
            
            // Render the UI
            renderCategories();
            renderProducts();
        }
    } catch (error) {
        console.error('Error fetching or processing data:', error);
        loadingElement.innerHTML = `
            <p>Error loading products. Please try again later.</p>
            <button onclick="fetchProducts()">Retry</button>
        `;
    } finally {
        loadingElement.style.display = 'none';
    }
}

// Render category buttons
function renderCategories() {
    let html = '<button class="category-btn active" data-category="all">All</button>';
    
    categories.forEach(category => {
        if (category) {
            html += `<button class="category-btn" data-category="${category}">${category}</button>`;
        }
    });
    
    categoriesContainer.innerHTML = html;
    
    // Add event listeners to category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-category');
            filterProductsByCategory(category);
        });
    });
}

// Filter products by category
function filterProductsByCategory(category) {
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.categoria === category);
        renderProducts(filteredProducts);
    }
}

// Render products grid
function renderProducts(productsList = products) {
    let html = '';
    
    productsList.forEach(product => {
        // Create placeholder image URL if no image is provided
        const imageUrl = product.imagen || 'https://via.placeholder.com/300x200?text=No+Image';
        
        html += `
            <div class="product-card" data-id="${product.id}">
                <img src="${imageUrl}" alt="${product.producto}" class="product-image">
                <div class="product-info">
                    <div class="product-name">${product.producto}</div>
                    <div class="product-category">${product.categoria}</div>
                    <div class="product-price">$${formatPrice(product.precio)}</div>
                </div>
            </div>
        `;
    });
    
    productsContainer.innerHTML = html;
    
    // Add event listeners to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.getAttribute('data-id');
            openProductModal(productId);
        });
    });
}

// Format price
function formatPrice(price) {
    if (!price) return '0';
    return new Intl.NumberFormat().format(price);
}

// Open product modal
function openProductModal(productId) {
    const product = products.find(p => p.id == productId);
    
    if (product) {
        currentProduct = product;
        
        // Create placeholder image URL if no image is provided
        const imageUrl = product.imagen || 'https://via.placeholder.com/600x400?text=No+Image';
        
        modalBody.innerHTML = `
            <div class="modal-product">
                <img src="${imageUrl}" alt="${product.producto}" class="modal-product-image">
                <div class="modal-product-info">
                    <h2>${product.producto}</h2>
                    <p><strong>Category:</strong> ${product.categoria}</p>
                    <p><strong>Price:</strong> $${formatPrice(product.precio)}</p>
                    <p><strong>Description:</strong> ${product.descripcion || 'No description available.'}</p>
                </div>
            </div>
        `;
        
        productModal.style.display = 'block';
    }
}

// Add to cart
addToCartBtn.addEventListener('click', () => {
    if (currentProduct) {
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id == currentProduct.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...currentProduct,
                quantity: 1
            });
        }
        
        updateCartCount();
        
        // Close product modal and show cart modal
        productModal.style.display = 'none';
        renderCart();
        cartModal.style.display = 'block';
    }
});

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Render cart
function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.textContent = '$0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.precio * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.producto} x ${item.quantity}</div>
                    <div class="cart-item-price">$${formatPrice(itemTotal)}</div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = `$${formatPrice(total)}`;
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.stopPropagation();
            const productId = btn.getAttribute('data-id');
            removeFromCart(productId);
        });
    });
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    updateCartCount();
    renderCart();
}

// Open cart modal
cartBtn.addEventListener('click', () => {
    renderCart();
    cartModal.style.display = 'block';
});

// Checkout
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }
    
    // Here you would normally send the order to a server,
    // but for this simple version we'll just show a confirmation
    alert('Order placed successfully! Thank you for your purchase.');
    cart = [];
    updateCartCount();
    cartModal.style.display = 'none';
});

// Initialize the app
window.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});