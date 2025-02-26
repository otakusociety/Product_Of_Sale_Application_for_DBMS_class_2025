const apiUrl = "http://localhost:5000/api/products";

// Fetch and render all products
async function fetchProducts() {
  try {
    const response = await fetch(apiUrl);
    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Utility function to create a product card element without inline handlers
function createProductCard(product) {
  const card = document.createElement("div");
  card.classList.add("product-card");

  const title = document.createElement("h3");
  title.textContent = product.name;
  card.appendChild(title);

  const priceP = document.createElement("p");
  priceP.textContent = `Price: $${product.price.toFixed(2)}`;
  card.appendChild(priceP);

  const stockP = document.createElement("p");
  stockP.textContent = `Stock: ${product.stock}`;
  card.appendChild(stockP);

  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("actions");

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => {
    openUpdateModal(product._id, product.name, product.price, product.stock);
  });
  actionsDiv.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-btn");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    deleteProduct(product._id);
  });
  actionsDiv.appendChild(deleteButton);

  card.appendChild(actionsDiv);
  return card;
}

// Render product cards in the "View Products" section
function renderProducts(products) {
  const container = document.getElementById("products-container");
  container.innerHTML = "";
  if (products.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }
  products.forEach(product => {
    const card = createProductCard(product);
    container.appendChild(card);
  });
}

// Add new product
document.getElementById("add-product-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const name = document.getElementById("add-name").value;
  const price = parseFloat(document.getElementById("add-price").value);
  const stock = parseInt(document.getElementById("add-stock").value, 10);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, stock })
    });
    if (!response.ok) {
      throw new Error("Failed to add product");
    }
    document.getElementById("add-product-form").reset();
    fetchProducts();
  } catch (error) {
    console.error("Error adding product:", error);
  }
});

// Delete a product
async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
    fetchProducts();
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}

// Open update modal with product data
function openUpdateModal(id, name, price, stock) {
  document.getElementById("update-id").value = id;
  document.getElementById("update-name").value = name;
  document.getElementById("update-price").value = price;
  document.getElementById("update-stock").value = stock;
  document.getElementById("update-modal").style.display = "flex";
}

// Close update modal
function closeUpdateModal() {
  document.getElementById("update-modal").style.display = "none";
}

// Update product
document.getElementById("update-product-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const id = document.getElementById("update-id").value;
  const name = document.getElementById("update-name").value;
  const price = parseFloat(document.getElementById("update-price").value);
  const stock = parseInt(document.getElementById("update-stock").value, 10);

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, stock })
    });
    if (!response.ok) {
      throw new Error("Failed to update product");
    }
    closeUpdateModal();
    fetchProducts();
  } catch (error) {
    console.error("Error updating product:", error);
  }
});

// Search product by name
document.getElementById("search-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const name = document.getElementById("search-name").value;
  try {
    const response = await fetch(`${apiUrl}/search?name=${encodeURIComponent(name)}`);
    const results = await response.json();
    displaySearchResults(results);
  } catch (error) {
    console.error("Error searching product:", error);
  }
});

function displaySearchResults(products) {
  const container = document.getElementById("search-results");
  container.innerHTML = "";
  if (products.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }
  products.forEach(product => {
    const card = createProductCard(product);
    container.appendChild(card);
  });
}

// Filter products by price
document.getElementById("filter-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const minPrice = document.getElementById("min-price").value || 0;
  const maxPrice = document.getElementById("max-price").value || Number.MAX_VALUE;
  try {
    const response = await fetch(`${apiUrl}/filter?minPrice=${minPrice}&maxPrice=${maxPrice}`);
    const results = await response.json();
    displayFilterResults(results);
  } catch (error) {
    console.error("Error filtering products:", error);
  }
});

function displayFilterResults(products) {
  const container = document.getElementById("filter-results");
  container.innerHTML = "";
  if (products.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }
  products.forEach(product => {
    const card = createProductCard(product);
    container.appendChild(card);
  });
}

// Section toggle functionality
function showSection(section) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(sec => {
    sec.style.display = 'none';
  });
  if (section === 'view') {
    document.getElementById("view-section").style.display = 'block';
    fetchProducts();
  } else if (section === 'add') {
    document.getElementById("add-section").style.display = 'block';
  } else if (section === 'search') {
    document.getElementById("search-section").style.display = 'block';
  } else if (section === 'filter') {
    document.getElementById("filter-section").style.display = 'block';
  }
}

// Attach event listeners to navigation buttons
document.getElementById("view-btn").addEventListener("click", () => showSection('view'));
document.getElementById("add-btn").addEventListener("click", () => showSection('add'));
document.getElementById("search-btn").addEventListener("click", () => showSection('search'));
document.getElementById("filter-btn").addEventListener("click", () => showSection('filter'));

// Attach event listener to modal close button
document.getElementById("close-update-modal").addEventListener("click", closeUpdateModal);

// On page load, show the "View Products" section
document.addEventListener("DOMContentLoaded", () => {
  showSection('view');
});
