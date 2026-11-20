
const products = [
    {
        id: 1,
        name: "Classic T-Shirt",
        price: 25,
        image: "images/tshirt.jfif",
        quantity: 1,
        category: "clothing"
    },
    {
        id: 2,
        name: "Modern Sneakers",
        price: 60,
        image: "images/sneekers.jfif",
        quantity: 1,
        category: "shoes"
    },
    {
        id: 3,
        name: "Stylish Backpack",
        price: 45,
        image: "images/backpack.jfif",
        quantity: 1,
        category: "bags"
    },
    {
        id: 4,
        name: "Long Coat",
        price: 100,
        image: "images/longcoat.jfif",
        quantity: 1,
        category: "clothing"
    }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

cart.forEach(function (product) {
    if (!product.quantity) {
        product.quantity = 1;
    }
});

const productList = document.getElementById("product-list");

console.log("Product List:", productList);

function displayProducts(items) {
    productList.innerHTML = "";

    document.getElementById("product-count").textContent =
        items.length + (items.length === 1 ? " product found" : " products found");

    if (items.length === 0) {
        productList.innerHTML = "<p>No products found!</p>";
        return;
    }


    items.forEach(function (product) {
        const productCard = document.createElement("div");

        productCard.className = "product-card";

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">
                Buy Now
            </button>
        `;

        productList.appendChild(productCard);
    });
}

displayProducts(products);



const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-products");
const categorySelect = document.getElementById("filter-category");

function filterAndSortProducts() {
    let result = [...products];

    const searchText = searchInput.value
        .toLowerCase()
        .replace(/[-\s]/g, "");

    result = result.filter(function (product) {
        const productName = product.name
            .toLowerCase()
            .replace(/[-\s]/g, "");

        const matchesSearch = productName.includes(searchText);

        const matchesCategory =
            categorySelect.value === "all" ||
            product.category === categorySelect.value;

        return matchesSearch && matchesCategory;
    });

    if (sortSelect.value === "low-high") {
        result.sort((a, b) => a.price - b.price);
    } else if (sortSelect.value === "high-low") {
        result.sort((a, b) => b.price - a.price);
    }

    displayProducts(result);
}

searchInput.addEventListener("input", filterAndSortProducts);
sortSelect.addEventListener("change", filterAndSortProducts);
categorySelect.addEventListener("change", filterAndSortProducts);

displayProducts(products);
function addToCart(productId) {

    const selectedProduct = products.find(function (product) {
        return product.id === productId;
    });

    const existingProduct = cart.find(function (product) {
        return product.id === productId;
    });

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            ...selectedProduct,
            quantity: 1
        });
    }

    updateCart();
}

function updateCart() {

    document.getElementById("cart-count").textContent =
        cart.reduce(function (total, product) {
            return total + product.quantity;
        }, 0);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}

function displayCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty!</p>";
        cartTotal.textContent = 0;
        return;
    }

    let total = 0;

    cart.forEach(function (product, index) {
        const item = document.createElement("div");

        item.className = "cart-item";

        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <div class="cart-info">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
            </div>

            <div class="cart-actions">
                <button onclick="decreaseQuantity(${index})">-</button>
                <span>${product.quantity}</span>
                <button onclick="increaseQuantity(${index})">+</button>
                <button onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;

        cartItems.appendChild(item);

        total += product.price * product.quantity;
    });

    cartTotal.textContent = total;
}
function removeFromCart(index) {
    cart.splice(index, 1);

    updateCart()
}

function increaseQuantity(index) {
    cart[index].quantity++;

    updateCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }

    updateCart();
}
updateCart();

const checkoutButton = document.getElementById("checkout-button");

checkoutButton.addEventListener("click", function () {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    document.querySelector("main").style.display = "none";

    document.getElementById("order-confirmation").style.display = "block";

    cart = [];
    updateCart();
});

function continueShopping() {
    document.querySelector("main").style.display = "block";

    document.getElementById("order-confirmation").style.display = "none";
}