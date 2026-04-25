window.addEventListener("DOMContentLoaded", loadProducts);

async function loadProducts() {
  try {
    const res = await fetch("http://localhost:3000/products");
    const data = await res.json();
    const table = document.getElementById("productTable");
    table.innerHTML = "";

    data.forEach(p => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${p.id}</td>
        <td>${p.product_name}</td>
        <td>₱${p.price}</td>
      `;

      table.appendChild(row);
    });

  } catch (err) {
    console.error("Error:", err);
  }
}


async function addProduct() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;

  if (!name || !price) return;

  await fetch("http://localhost:3000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      product_name: name,
      price: Number(price)
    })
  });

  document.getElementById("name").value = "";
  document.getElementById("price").value = "";

  loadProducts();
}