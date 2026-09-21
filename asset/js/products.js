// ── PRODUCT LOADER ───────────────────────────
let allProducts = [];
let activeCategory = 'foodstuffs';

// Demo catalog shown only when the Supabase products table is empty.
const placeholderProducts = [
  { id: 1001, name: "Premium Garri Ijebu", category: "foodstuffs", price: 6500, quantity: "5kg", description: "Crisp, finely processed garri for soaking or eba.", image_url: "", available: true, in_stock: true },
  { id: 1002, name: "Ofada Rice", category: "foodstuffs", price: 12500, quantity: "5kg", description: "Locally sourced aromatic rice with its signature rich flavour.", image_url: "", available: true, in_stock: true },
  { id: 1003, name: "Nigerian Brown Beans", category: "foodstuffs", price: 9000, quantity: "3kg", description: "Clean brown beans suitable for porridge, akara and moi moi.", image_url: "", available: true, in_stock: true },
  { id: 1004, name: "Egusi Seeds", category: "foodstuffs", price: 4800, quantity: "1kg", description: "Premium shelled melon seeds for delicious Nigerian soups.", image_url: "", available: true, in_stock: true },
  { id: 1005, name: "Ogbono Seeds", category: "foodstuffs", price: 4200, quantity: "500g", description: "Fresh ogbono seeds ready for grinding and cooking.", image_url: "", available: true, in_stock: true },
  { id: 1006, name: "Pure Palm Oil", category: "foodstuffs", price: 7000, quantity: "2 litres", description: "Rich red palm oil for authentic soups, stews and sauces.", image_url: "", available: true, in_stock: true },
  { id: 1007, name: "Fresh Yam Tubers", category: "foodstuffs", price: 8500, quantity: "3 pieces", description: "Firm quality yam for boiling, frying, roasting or pounding.", image_url: "", available: true, in_stock: true },
  { id: 1008, name: "Dried Stockfish", category: "foodstuffs", price: 15000, quantity: "1kg", description: "Flavourful dried stockfish pieces for traditional soups.", image_url: "", available: true, in_stock: true },
  { id: 1009, name: "Pure Groundnut Oil", category: "foodstuffs", price: 5500, quantity: "2 litres", description: "Light cooking oil made from quality Nigerian groundnuts.", image_url: "", available: true, in_stock: true },
  { id: 1010, name: "Fresh Pepper Basket", category: "foodstuffs", price: 6000, quantity: "2kg", description: "A vibrant selection of fresh peppers for everyday cooking.", image_url: "", available: true, in_stock: true },
  { id: 1011, name: "Emerald Ankara Maxi Dress", category: "cloths", price: 32000, quantity: "1 outfit", description: "Elegant floor-length Ankara dress for celebrations and outings.", image_url: "https://images.pexels.com/photos/34249461/pexels-photo-34249461.jpeg?auto=compress&cs=tinysrgb&w=900&h=700&fit=crop", available: true, in_stock: true },
  { id: 1012, name: "Classic Mens Agbada Set", category: "cloths", price: 55000, quantity: "3-piece set", description: "A refined traditional set designed for special occasions.", image_url: "https://images.pexels.com/photos/37340989/pexels-photo-37340989.jpeg?auto=compress&cs=tinysrgb&w=900&h=700&fit=crop", available: true, in_stock: true },
  { id: 1013, name: "Red Traditional Agbada", category: "cloths", price: 28000, quantity: "2-piece set", description: "Bold red Nigerian Agbada styled with traditional accessories.", image_url: "https://images.pexels.com/photos/33714509/pexels-photo-33714509.jpeg?auto=compress&cs=tinysrgb&w=900&h=700&fit=crop", available: true, in_stock: true },
  { id: 1014, name: "Brown Embroidered Agbada", category: "cloths", price: 40000, quantity: "1 set", description: "Classic brown embroidered Agbada for formal celebrations.", image_url: "https://images.pexels.com/photos/37283116/pexels-photo-37283116.jpeg?auto=compress&cs=tinysrgb&w=900&h=700&fit=crop", available: true, in_stock: true },
  { id: 1015, name: "Royal Blue Agbada", category: "cloths", price: 35000, quantity: "1 outfit", description: "Royal blue flowing Agbada paired with a traditional cap.", image_url: "https://images.pexels.com/photos/33634264/pexels-photo-33634264.jpeg?auto=compress&cs=tinysrgb&w=900&h=700&fit=crop", available: true, in_stock: true },
  { id: 1016, name: "Red Ankara Dress", category: "cloths", price: 18000, quantity: "1 shirt", description: "Vibrant fitted Ankara dress with a coordinated headscarf.", image_url: "https://images.pexels.com/photos/37616472/pexels-photo-37616472.jpeg?auto=compress&cs=tinysrgb&w=900&h=700&fit=crop", available: true, in_stock: true },
  { id: 1017, name: "Black Yoruba Agbada", category: "cloths", price: 45000, quantity: "1 set", description: "Elegant black Yoruba Agbada with detailed embroidery.", image_url: "https://images.pexels.com/photos/31762078/pexels-photo-31762078.jpeg?auto=compress&cs=tinysrgb&w=900&h=700&fit=crop", available: true, in_stock: true },
  { id: 1018, name: "Modern Cream Agbada", category: "cloths", price: 16000, quantity: "1 bag", description: "Modern cream Nigerian Agbada styled with a matching cap.", image_url: "https://images.pexels.com/photos/36445251/pexels-photo-36445251.jpeg?auto=compress&cs=tinysrgb&w=900&h=700&fit=crop", available: true, in_stock: true },
  { id: 1019, name: "Ondo Blue Traditional Set", category: "cloths", price: 30000, quantity: "1 outfit", description: "Patterned blue traditional outfit inspired by Ondo styling.", image_url: "https://images.pexels.com/photos/8526818/pexels-photo-8526818.jpeg?auto=compress&cs=tinysrgb&w=900&h=700&fit=crop", available: true, in_stock: true },
  { id: 1020, name: "White Ceremonial Agbada", category: "cloths", price: 22000, quantity: "2-piece set", description: "Clean white ceremonial Agbada for premium occasions.", image_url: "https://images.pexels.com/photos/30075301/pexels-photo-30075301.jpeg?auto=compress&cs=tinysrgb&w=900&h=700&fit=crop", available: true, in_stock: true },
  { id: 1021, name: "Ripe Plantain", category: "foodstuffs", price: 5500, quantity: "1 bunch", description: "Naturally sweet plantain for frying, roasting or porridge.", image_url: "", available: true, in_stock: true },
  { id: 1022, name: "Dried Crayfish", category: "foodstuffs", price: 5500, quantity: "500g", description: "Aromatic dried crayfish for Nigerian soups, stews and sauces.", image_url: "", available: true, in_stock: true },
  { id: 1023, name: "Urban Nigerian Kaftan", category: "cloths", price: 38000, quantity: "2-piece set", description: "Stylish Nigerian kaftan designed for modern everyday wear.", image_url: "https://images.pexels.com/photos/30201842/pexels-photo-30201842.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&fit=crop", available: true, in_stock: true },
  { id: 1024, name: "Green Ankara Maxi Dress", category: "cloths", price: 36000, quantity: "1 outfit", description: "Graceful Ankara maxi dress with bell sleeves and matching headwrap.", image_url: "https://images.pexels.com/photos/38003300/pexels-photo-38003300.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&fit=crop", available: true, in_stock: true }
];

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

    allProducts = data && data.length ? data : placeholderProducts;
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
          src="${p.image_url || ''}"
          alt="${p.name}"
          loading="lazy"
          style="${p.image_url ? '' : 'display:none'}"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
        >
        <div class="product-img-placeholder" style="${p.image_url ? 'display:none' : 'display:flex'}">
          <span aria-hidden="true">🌾</span>
          <small>Image coming soon</small>
        </div>
        <span class="product-badge">${p.category === 'foodstuffs' ? '🌾 Food' : '👗 Clothing'}</span>
        ${!inStock ? `<span class="stock-badge">Out of Stock</span>` : ''}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description || ''}</div>
        <div class="product-measure">${p.quantity || ''}</div>
        <div class="product-price">₦${Number(p.price).toLocaleString()}</div>
        ${inStock
          ? `<button class="add-to-cart" onclick='addToCart(${JSON.stringify({
              id: p.id,
              name: p.name,
              price: p.price,
              quantity: p.quantity || '',
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
