const USERNAME = "betbestt";
const REPO = "bm-trading-llp";

async function loadProducts() {
  const res = await fetch(`https://raw.githubusercontent.com/${USERNAME}/${REPO}/main/products.json`);
  const products = await res.json();

  const container = document.getElementById("product-list");
  container.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>Price: $${p.price}</p>
      <p style="color:${p.sold ? 'red' : 'green'}">${p.sold ? 'SOLD' : 'Available'}</p>
      <button onclick="orderNow('${p.name}')">Order</button>
    `;
    container.appendChild(div);
  });
}

function orderNow(name) {
  const message = encodeURIComponent(`Hello, I'm interested in buying ${name}. Is it still available?`);
  window.open(`https://wa.me/254704738354?text=${message}`);
}

loadProducts();
