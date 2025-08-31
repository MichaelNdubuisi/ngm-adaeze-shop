// Fetch and display products
async function loadProducts() {
  const res = await fetch('http://localhost:4000/api/products');
  const products = await res.json();
  const list = document.getElementById('product-list');
  list.innerHTML = '';
  products.forEach(product => {
    const div = document.createElement('div');
    div.className = 'bg-white rounded shadow p-4 flex flex-col';
    div.innerHTML = `
      <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${product.name}" class="h-40 object-cover mb-4 rounded">
      <h2 class="text-lg font-semibold mb-2">${product.name}</h2>
      <p class="text-gray-600 mb-2">${product.description || ''}</p>
      <div class="mt-auto flex justify-between items-center">
        <span class="font-bold text-lg text-blue-700">$${product.price.toFixed(2)}</span>
        <button class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function addToCart(productId) {
  // Simple cart logic (can be improved)
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push(productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Added to cart!');
}

window.onload = loadProducts;
