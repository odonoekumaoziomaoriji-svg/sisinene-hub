// ── ADMIN PANEL ──────────────────────────────
let editingId = null;
const STORAGE_BUCKET = 'product-images';

// ── AUTH ─────────────────────────────────────
async function adminLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-password').value;
  const errEl    = document.getElementById('login-error');
  errEl.textContent = 'Signing in…';

  const { data, error } = await db.auth.signInWithPassword({ email, password });

  console.log('LOGIN DATA:', data);
  console.log('LOGIN ERROR:', error);

  if (error) {
    errEl.textContent = error.message;
    return;
  }

  if (!data.session) {
    errEl.textContent = 'No session returned — check Supabase URL configuration.';
    return;
  }

  console.log('ACCESS TOKEN:', data.session.access_token);
  errEl.textContent = '';
  showDashboard();
}

async function adminLogout() {
  await db.auth.signOut();
  showLogin();
}

function showLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('dashboard').style.display    = 'none';
}

function showDashboard() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('dashboard').style.display    = 'block';
  loadAdminProducts();
}

// ── IMAGE UPLOAD ──────────────────────────────
function triggerImagePick() {
  document.getElementById('image-file-input').click();
}

async function handleImageSelected(input) {
  const file = input.files[0];
  if (!file) return;

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.type)) {
    showUploadError('Please select a JPG, PNG, or WEBP image.');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showUploadError('Image must be under 5MB.');
    return;
  }

  setUploadState('uploading');

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
  const path     = `products/${Date.now()}_${safeName}`;

  const { error: upErr } = await db.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (upErr) {
    setUploadState('error');
    showUploadError('Upload failed: ' + upErr.message);
    return;
  }

  const { data } = db.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  const publicUrl = data.publicUrl;

  document.getElementById('prod-image').value = publicUrl;
  setUploadState('done', publicUrl);
}

function setUploadState(state, url = '') {
  const zone    = document.getElementById('upload-zone');
  const preview = document.getElementById('image-preview');
  const errEl   = document.getElementById('upload-error');
  errEl.textContent = '';

  if (state === 'idle') {
    zone.className    = 'upload-zone';
    zone.innerHTML    = uploadZoneHTML();
    preview.innerHTML = '';
  } else if (state === 'uploading') {
    zone.className = 'upload-zone uploading';
    zone.innerHTML = `<div class="upload-spinner"></div><p>Uploading…</p>`;
  } else if (state === 'done') {
    zone.className = 'upload-zone done';
    zone.innerHTML = `<span class="upload-tick">✓</span><p>Image uploaded</p><button type="button" class="change-img-btn" onclick="resetUpload()">Change image</button>`;
    preview.innerHTML = `<img src="${url}" alt="Preview" class="img-preview-thumb">`;
  } else if (state === 'error') {
    zone.className = 'upload-zone upload-error-state';
    zone.innerHTML = uploadZoneHTML();
  }
}

function uploadZoneHTML() {
  return `
    <input type="file" id="image-file-input" accept="image/*" style="display:none"
           onchange="handleImageSelected(this)">
    <div class="upload-icon">🖼️</div>
    <p class="upload-label">Click to choose an image from your computer</p>
    <p class="upload-hint">JPG · PNG · WEBP &nbsp;·&nbsp; max 5MB</p>
    <button type="button" class="upload-pick-btn" onclick="triggerImagePick()">Choose Image</button>
  `;
}

function resetUpload() {
  document.getElementById('prod-image').value = '';
  setUploadState('idle');
}

function showUploadError(msg) {
  document.getElementById('upload-error').textContent = msg;
}

// ── PRODUCT TABLE ─────────────────────────────
async function loadAdminProducts() {
  const tbody = document.getElementById('product-tbody');
  tbody.innerHTML = `<tr><td colspan="6" class="loading-row">Loading…</td></tr>`;

  const { data: { session } } = await db.auth.getSession();
  console.log('SESSION ON LOAD:', session);

  const { data, error } = await db
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('LOAD ERROR:', error);
    tbody.innerHTML = `<tr><td colspan="6" class="error-row">Error: ${error.message}</td></tr>`;
    return;
  }

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="loading-row">No products yet — click <strong>+ Add Product</strong> to get started!</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(p => `
    <tr>
      <td class="name-cell">
        ${p.image_url
          ? `<img class="thumb" src="${p.image_url}" onerror="this.style.display='none'" alt="">`
          : `<div class="thumb-placeholder">📦</div>`}
        <span>${p.name}</span>
      </td>
      <td>${p.category === 'foodstuffs' ? '🌾 Foodstuffs' : '👗 Clothing'}</td>
      <td>₦${Number(p.price).toLocaleString()}</td>
      <td><span class="status-pill ${p.available ? 'pill-on' : 'pill-off'}">${p.available ? 'Live' : 'Hidden'}</span></td>
      <td><span class="status-pill ${p.in_stock !== false ? 'pill-on' : 'pill-stock'}">${p.in_stock !== false ? 'In Stock' : 'Out of Stock'}</span></td>
      <td class="action-cell">
        <button class="btn-edit" onclick="openEditModal(${p.id})">Edit</button>
        <button class="btn-del"  onclick="deleteProduct(${p.id}, '${p.name.replace(/'/g, "\\'")}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

// ── MODAL ─────────────────────────────────────
function openAddModal() {
  editingId = null;
  document.getElementById('modal-title').textContent = 'Add Product';
  document.getElementById('product-form').reset();
  document.getElementById('prod-available').checked = true;
  document.getElementById('prod-in-stock').checked  = true;
  document.getElementById('prod-image').value = '';
  setUploadState('idle');
  document.getElementById('modal-overlay').style.display = 'flex';
}

async function openEditModal(id) {
  editingId = id;
  document.getElementById('modal-title').textContent = 'Edit Product';

  const { data, error } = await db.from('products').select('*').eq('id', id).single();
  if (error) { alert('Could not load product.'); return; }

  document.getElementById('prod-name').value        = data.name;
  document.getElementById('prod-category').value    = data.category;
  document.getElementById('prod-price').value       = data.price;
  document.getElementById('prod-desc').value        = data.description || '';
  document.getElementById('prod-available').checked = data.available;
  document.getElementById('prod-in-stock').checked  = data.in_stock !== false;
  document.getElementById('prod-image').value       = data.image_url || '';

  if (data.image_url) {
    setUploadState('done', data.image_url);
  } else {
    setUploadState('idle');
  }

  document.getElementById('modal-overlay').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal-overlay').style.display = 'none';
  editingId = null;
}

// ── SAVE ──────────────────────────────────────
async function saveProduct(e) {
  e.preventDefault();
  const saveBtn = document.getElementById('save-btn');
  saveBtn.disabled    = true;
  saveBtn.textContent = 'Saving…';

  const { data: { session } } = await db.auth.getSession();
  console.log('SESSION ON SAVE:', session);

  const payload = {
    name:        document.getElementById('prod-name').value.trim(),
    category:    document.getElementById('prod-category').value,
    price:       parseFloat(document.getElementById('prod-price').value),
    description: document.getElementById('prod-desc').value.trim(),
    image_url:   document.getElementById('prod-image').value.trim() || null,
    available:   document.getElementById('prod-available').checked,
    in_stock:    document.getElementById('prod-in-stock').checked,
  };

  console.log('SAVING PAYLOAD:', payload);

  let error;
  if (editingId) {
    ({ error } = await db.from('products').update(payload).eq('id', editingId));
  } else {
    ({ error } = await db.from('products').insert([payload]));
  }

  saveBtn.disabled    = false;
  saveBtn.textContent = 'Save Product';

  if (error) {
    console.error('SAVE ERROR:', error);
    alert('Error: ' + error.message);
    return;
  }

  closeModal();
  loadAdminProducts();
  showAdminToast(editingId ? 'Product updated! ✓' : 'Product added! ✓');
}

// ── DELETE ────────────────────────────────────
async function deleteProduct(id, name) {
  if (!confirm(`Delete "${name}"?\n\nThis cannot be undone.`)) return;
  const { error } = await db.from('products').delete().eq('id', id);
  if (error) { alert('Error: ' + error.message); return; }
  loadAdminProducts();
  showAdminToast('Product deleted.');
}

// ── TOAST ─────────────────────────────────────
function showAdminToast(msg) {
  const t = document.getElementById('admin-toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Always sign out on page load so password is required every time
  await db.auth.signOut();
  showLogin();

  document.getElementById('login-form').addEventListener('submit', adminLogin);
  document.getElementById('product-form').addEventListener('submit', saveProduct);
});