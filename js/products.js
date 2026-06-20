// ── PRODUCT LOADER ───────────────────────────
let allProducts = [];
let activeCategory = 'foodstuffs';

async function loadProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  grid.innerHTML = `<div class="loading-state">
    <div class="spinner"></div>
    <p>Loading products…</p>
  </div>`;

  try {
    const { data, error } = await db
      .from('products')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    allProducts = data || [];
    renderProducts();
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<div class="error-state">
      <p>⚠️ Could not load products right now.</p>
      <p>Please refresh the page or try again later.</p>
    </div>`;
  }
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const filtered = activeCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state">
      <p>No products in this category yet.</p>
      <p>Check back soon!</p>
    </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const inStock = p.in_stock === true || p.in_stock === null;
    return `
    <div class="product-card ${inStock ? '' : 'out-of-stock'}">
      <div class="product-img-wrap">
        <img
          src="${p.image_url || 'images/placeholder.png'}"
          alt="${p.name}"
          loading="lazy"
          onerror="this.src='images/placeholder.png'"
        >
        <span class="product-badge">${p.category === 'foodstuffs' ? '🌾 Food' : '👗 Clothing'}</span>
        ${!inStock ? `<span class="stock-badge">Out of Stock</span>` : ''}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description || ''}</div>
        <div class="product-price">₦${Number(p.price).toLocaleString()}</div>
        ${inStock
          ? `<button class="add-to-cart" onclick='addToCart(${JSON.stringify({
              id: p.id,
              name: p.name,
              price: p.price,
              image_url: p.image_url || ''
            })})'>Add to Cart</button>`
          : `<button class="add-to-cart out-of-stock-btn" disabled>Out of Stock</button>`
        }
      </div>
    </div>
  `;
  }).join('');
}

function filterCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });
  renderProducts();
}

document.addEventListener('DOMContentLoaded', loadProducts);
