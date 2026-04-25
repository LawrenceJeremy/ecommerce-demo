let allProducts = [];

window.addEventListener("DOMContentLoaded", loadProducts);

// GET - load products
async function loadProducts() {
  try {
    const res = await fetch("http://localhost:3000/products");
    const data = await res.json();

    allProducts = data; // ✅ for search feature

    const table = document.getElementById("productTable");
    table.innerHTML = "";

    data.forEach((p) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${p.id}</td>
        <td>${p.product_name}</td>
        <td>₱${p.price}</td>
        <td>
          <button style="background-color: #4CAF50; color: white; border: none; padding: 8px 16px; font-size: 16px; margin: 4px 2px; cursor: pointer;" 
            onclick="editProduct(${p.id}, '${p.product_name}', ${p.price})">
            ✏️ Edit
          </button>

          <button style="background-color: #f44336; color: white; border: none; padding: 8px 16px; font-size: 16px; margin: 4px 2px; cursor: pointer;" 
            onclick="deleteProduct(${p.id})">
            🗑 Delete
          </button>
        </td>
      `;

      table.appendChild(row);
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

// POST - add product
async function addProduct() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;

  if (!name || !price) return alert("Please fill all fields");

  await fetch("http://localhost:3000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_name: name,
      price: Number(price),
    }),
  });

  document.getElementById("name").value = "";
  document.getElementById("price").value = "";

  loadProducts();
}

// UPDATE - edit product
async function editProduct(id, currentName, currentPrice) {
  const newName = prompt("Enter new product name:", currentName);
  const newPrice = prompt("Enter new price:", currentPrice);

  if (!newName || !newPrice) return;

  await fetch(`http://localhost:3000/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_name: newName,
      price: Number(newPrice),
    }),
  });

  loadProducts();
}

// DELETE - remove product
async function deleteProduct(id) {
  const confirmDelete = confirm("Are you sure you want to delete this product?");
  if (!confirmDelete) return;

  await fetch(`http://localhost:3000/products/${id}`, {
    method: "DELETE",
  });

  loadProducts();
}

// 🔍 SEARCH / FILTER (FRONTEND ONLY)
function filterProducts() {
  const keyword = document
    .getElementById("searchInput")
    .value
    .toLowerCase();

  const filtered = allProducts.filter((p) =>
    p.product_name.toLowerCase().includes(keyword)
  );

  const table = document.getElementById("productTable");
  table.innerHTML = "";

  filtered.forEach((p) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${p.id}</td>
      <td>${p.product_name}</td>
      <td>₱${p.price}</td>
      <td>
        <button style="background-color: #4CAF50; color: white; border: none; padding: 8px 16px; font-size: 16px; margin: 4px 2px; cursor: pointer;" 
          onclick="editProduct(${p.id}, '${p.product_name}', ${p.price})">
          ✏️ Edit
        </button>

        <button style="background-color: #f44336; color: white; border: none; padding: 8px 16px; font-size: 16px; margin: 4px 2px; cursor: pointer;" 
          onclick="deleteProduct(${p.id})">
          🗑 Delete
        </button>
      </td>
    `;

    table.appendChild(row);
  });
}