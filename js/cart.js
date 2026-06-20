// ── CART STATE ──────────────────────────────
let cart = JSON.parse(localStorage.getItem('sisinene_cart') || '[]');

function saveCart() {
  localStorage.setItem('sisinene_cart', JSON.stringify(cart));
  renderCart();
  updateBadge();
}

function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  showToast(`${product.name} added to cart 🛒`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else saveCart();
}

function getTotal() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function updateBadge() {
  const badge = document.getElementById('cart-badge');
  const total = cart.reduce((s, i) => s + i.qty, 0);
  if (badge) {
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
  }
}

// ── RENDER CART DRAWER ───────────────────────
function renderCart() {
  const container = document.getElementById('cart-items');
  const totalEl   = document.getElementById('cart-total');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <p>🛒</p>
        <p>Your cart is empty.</p>
        <p>Add some items to get started!</p>
      </div>`;
    if (totalEl) totalEl.textContent = '₦0';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image_url || 'images/placeholder.png'}" alt="${item.name}" onerror="this.src='images/placeholder.png'">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₦${(item.price * item.qty).toLocaleString()}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, +1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${item.id})" title="Remove">✕</button>
    </div>
  `).join('');

  if (totalEl) totalEl.textContent = `₦${getTotal().toLocaleString()}`;
}

// ── WHATSAPP CHECKOUT ────────────────────────
function checkoutWhatsApp() {
  if (cart.length === 0) {
    showToast('Your cart is empty!');
    return;
  }

  const lines = cart.map(i =>
    `• ${i.name} x${i.qty} — ₦${(i.price * i.qty).toLocaleString()}`
  ).join('\n');

  const total = getTotal();
  const message =
    `Hello Sisinene Hub! 👋\n\nI'd like to order:\n\n${lines}\n\n*Total: ₦${total.toLocaleString()}*\n\nDelivery details:\n📍 Address: \n📞 Phone: \n👤 Name: \n\nPlease confirm availability and pricing. Thank you!`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// ── DRAWER TOGGLE ────────────────────────────
function openCart() {
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-drawer').classList.add('open');
  renderCart();
}

function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-drawer').classList.remove('open');
}

// ── TOAST ────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Init badge on load
document.addEventListener('DOMContentLoaded', updateBadge);