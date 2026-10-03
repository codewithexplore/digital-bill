/**
 * Tap Receipt - Complete Frontend Application Logic
 * Framework-free Vanilla JavaScript
 * Works seamlessly both with FastAPI Backend & in Standalone / GitHub Pages / Offline Mode!
 */

// ==========================================
// Constants & Configuration
// ==========================================
const STORAGE_KEY = 'tapreceipt_active_shop';
const API_STORAGE_KEY = 'tapreceipt_api_base';
const LOCAL_SHOPS_KEY = 'tapreceipt_local_shops';
const LOCAL_PRODUCTS_KEY = 'tapreceipt_local_products';
const LOCAL_RECEIPTS_KEY = 'tapreceipt_local_receipts';

const API_HOST = window.location.hostname || 'localhost';
const API_PORT = window.location.port;

function resolveApiBase() {
  const custom = localStorage.getItem(API_STORAGE_KEY);
  if (custom) return custom.replace(/\/+$/, '');

  // If on GitHub Pages and no custom backend set, use local mock store by default
  if (window.location.hostname.endsWith('github.io')) {
    return localStorage.getItem(API_STORAGE_KEY) || '';
  }

  if (window.location.protocol.startsWith('http') && window.location.origin && !window.location.port) {
    // Public tunnels/domains without explicit port
    return `${window.location.origin}/api`;
  } else if (API_PORT) {
    // Local server with explicit port (localhost:8000)
    return `${window.location.protocol}//${API_HOST}:${API_PORT}/api`;
  } else {
    // Fallback / file:// protocol
    return `http://${API_HOST}:8000/api`;
  }
}

let API_BASE = resolveApiBase();

// ==========================================
// Client-Side Mock Database Engine (TapStore)
// Ensures 100% offline & GitHub Pages capability
// ==========================================
const TapStore = {
  getInitialShop() {
    return {
      id: 1,
      username: 'demo',
      password: 'demo123',
      shop_name: 'QuickMart Superstore',
      address: 'Shop #14, Galleria Market, Bengaluru - 560001',
      phone: '9876543210',
      upi_id: 'quickmart@upi',
      gst_number: '29ABCDE1234F1Z5',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString()
    };
  },

  getInitialProducts() {
    return [
      { id: 1, name: 'Full Cream Milk (500ml)', price: 32.0, category: 'Dairy', stock: 60, shopkeeper_id: 1 },
      { id: 2, name: 'Artisan Brown Bread (400g)', price: 45.0, category: 'Bakery', stock: 40, shopkeeper_id: 1 },
      { id: 3, name: 'Salted Butter (100g)', price: 58.0, category: 'Dairy', stock: 35, shopkeeper_id: 1 },
      { id: 4, name: 'Sparkling Soda / Cola (750ml)', price: 40.0, category: 'Beverages', stock: 75, shopkeeper_id: 1 },
      { id: 5, name: 'Spicy Masala Potato Chips (85g)', price: 20.0, category: 'Snacks', stock: 100, shopkeeper_id: 1 },
      { id: 6, name: 'Organic Green Tea (25 bags)', price: 180.0, category: 'Beverages', stock: 30, shopkeeper_id: 1 },
      { id: 7, name: 'Moisturizing Bath Soap (125g)', price: 42.0, category: 'Personal Care', stock: 80, shopkeeper_id: 1 },
      { id: 8, name: 'Roasted Almonds (200g)', price: 240.0, category: 'Snacks', stock: 25, shopkeeper_id: 1 },
      { id: 9, name: 'Basmati Royal Rice (1kg)', price: 110.0, category: 'Groceries', stock: 50, shopkeeper_id: 1 },
      { id: 10, name: 'Premium Dark Chocolate (100g)', price: 95.0, category: 'Snacks', stock: 45, shopkeeper_id: 1 }
    ];
  },

  getInitialReceipts() {
    const now = Date.now();
    return [
      {
        id: 101,
        receipt_number: 'TR-2026-X8A2',
        customer_phone: '9876543210',
        customer_name: 'Rajesh Kumar',
        payment_mode: 'UPI',
        subtotal: 135.0,
        tax_rate: 5.0,
        tax_amount: 6.75,
        discount: 10.0,
        total_amount: 131.75,
        created_at: new Date(now - 3600000 * 2).toISOString(),
        shopkeeper_id: 1,
        items: [
          { id: 1, receipt_id: 101, product_id: 1, item_name: 'Full Cream Milk (500ml)', quantity: 2, price: 32.0, total: 64.0 },
          { id: 2, receipt_id: 101, product_id: 2, item_name: 'Artisan Brown Bread (400g)', quantity: 1, price: 45.0, total: 45.0 },
          { id: 3, receipt_id: 101, product_id: 5, item_name: 'Spicy Masala Potato Chips (85g)', quantity: 1, price: 26.0, total: 26.0 }
        ]
      },
      {
        id: 102,
        receipt_number: 'TR-2026-K9P4',
        customer_phone: '9845012345',
        customer_name: 'Priya Sharma',
        payment_mode: 'Cash',
        subtotal: 280.0,
        tax_rate: 0.0,
        tax_amount: 0.0,
        discount: 0.0,
        total_amount: 280.0,
        created_at: new Date(now - 3600000 * 6).toISOString(),
        shopkeeper_id: 1,
        items: [
          { id: 4, receipt_id: 102, product_id: 8, item_name: 'Roasted Almonds (200g)', quantity: 1, price: 240.0, total: 240.0 },
          { id: 5, receipt_id: 102, product_id: 4, item_name: 'Sparkling Soda / Cola (750ml)', quantity: 1, price: 40.0, total: 40.0 }
        ]
      },
      {
        id: 103,
        receipt_number: 'TR-2026-B3M7',
        customer_phone: '9731298765',
        customer_name: 'Anil Desai',
        payment_mode: 'Card',
        subtotal: 205.0,
        tax_rate: 5.0,
        tax_amount: 10.25,
        discount: 5.0,
        total_amount: 210.25,
        created_at: new Date(now - 86400000).toISOString(),
        shopkeeper_id: 1,
        items: [
          { id: 6, receipt_id: 103, product_id: 9, item_name: 'Basmati Royal Rice (1kg)', quantity: 1, price: 110.0, total: 110.0 },
          { id: 7, receipt_id: 103, product_id: 10, item_name: 'Premium Dark Chocolate (100g)', quantity: 1, price: 95.0, total: 95.0 }
        ]
      }
    ];
  },

  init() {
    if (!localStorage.getItem(LOCAL_SHOPS_KEY)) {
      localStorage.setItem(LOCAL_SHOPS_KEY, JSON.stringify([this.getInitialShop()]));
    }
    if (!localStorage.getItem(LOCAL_PRODUCTS_KEY)) {
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(this.getInitialProducts()));
    }
    if (!localStorage.getItem(LOCAL_RECEIPTS_KEY)) {
      localStorage.setItem(LOCAL_RECEIPTS_KEY, JSON.stringify(this.getInitialReceipts()));
    }
  },

  // Auth Operations
  login(username, password) {
    this.init();
    const shops = JSON.parse(localStorage.getItem(LOCAL_SHOPS_KEY) || '[]');
    const cleanUser = (username || '').trim().toLowerCase();
    const shop = shops.find(s => s.username.toLowerCase() === cleanUser && s.password === password);
    if (!shop) {
      throw new Error('Invalid username or password.');
    }
    return { ...shop };
  },

  register(data) {
    this.init();
    const shops = JSON.parse(localStorage.getItem(LOCAL_SHOPS_KEY) || '[]');
    const cleanUser = (data.username || '').trim().toLowerCase();
    if (shops.some(s => s.username.toLowerCase() === cleanUser)) {
      throw new Error('Username is already registered. Please choose another.');
    }
    const newShop = {
      id: Date.now(),
      username: cleanUser,
      password: data.password,
      shop_name: (data.shop_name || 'My Store').trim(),
      address: (data.address || '').trim(),
      phone: (data.phone || '').trim(),
      upi_id: (data.upi_id || '').trim(),
      gst_number: (data.gst_number || '').trim(),
      created_at: new Date().toISOString()
    };
    shops.push(newShop);
    localStorage.setItem(LOCAL_SHOPS_KEY, JSON.stringify(shops));
    return newShop;
  },

  // Products Operations
  getProducts() {
    this.init();
    return JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY) || '[]');
  },

  createProduct(data) {
    this.init();
    const products = this.getProducts();
    const newProd = {
      id: Date.now(),
      name: (data.name || 'New Product').trim(),
      price: Math.max(0, parseFloat(data.price) || 0),
      category: (data.category || 'General').trim(),
      stock: Math.max(0, parseInt(data.stock, 10) || 0),
      shopkeeper_id: data.shopkeeper_id || 1,
      created_at: new Date().toISOString()
    };
    products.unshift(newProd);
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
    return newProd;
  },

  updateProduct(id, data) {
    this.init();
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === Number(id));
    if (idx === -1) throw new Error('Product not found.');
    products[idx] = {
      ...products[idx],
      name: data.name !== undefined ? data.name.trim() : products[idx].name,
      price: data.price !== undefined ? Math.max(0, parseFloat(data.price) || 0) : products[idx].price,
      category: data.category !== undefined ? data.category.trim() : products[idx].category,
      stock: data.stock !== undefined ? Math.max(0, parseInt(data.stock, 10) || 0) : products[idx].stock
    };
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
    return products[idx];
  },

  deleteProduct(id) {
    this.init();
    let products = this.getProducts();
    products = products.filter(p => p.id !== Number(id));
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
    return { success: true };
  },

  // Receipts Operations
  getReceipts(limit = null) {
    this.init();
    let receipts = JSON.parse(localStorage.getItem(LOCAL_RECEIPTS_KEY) || '[]');
    receipts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (limit && Number(limit) > 0) {
      receipts = receipts.slice(0, Number(limit));
    }
    return receipts;
  },

  getReceiptById(idOrNum) {
    this.init();
    const receipts = this.getReceipts();
    const str = String(idOrNum).toLowerCase();
    const found = receipts.find(r => String(r.id) === str || String(r.receipt_number).toLowerCase() === str);
    if (!found) throw new Error('Receipt not found');
    const shops = JSON.parse(localStorage.getItem(LOCAL_SHOPS_KEY) || '[]');
    const shop = shops.find(s => s.id === found.shopkeeper_id) || shops[0] || this.getInitialShop();
    return { ...found, shopkeeper: shop };
  },

  createReceipt(data) {
    this.init();
    const receipts = this.getReceipts();
    const id = Date.now();
    const year = new Date().getFullYear();
    const randSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const receipt_number = `TR-${year}-${randSuffix}`;

    const items = (data.items || []).map((i, idx) => ({
      id: id + idx + 1,
      receipt_id: id,
      product_id: i.product_id || null,
      item_name: i.item_name || 'Item',
      quantity: Math.max(1, parseInt(i.quantity, 10) || 1),
      price: Math.max(0, parseFloat(i.price) || 0),
      total: Math.max(0, (parseInt(i.quantity, 10) || 1) * (parseFloat(i.price) || 0))
    }));

    const subtotal = items.reduce((acc, curr) => acc + curr.total, 0);
    const tax_rate = Math.max(0, parseFloat(data.tax_rate) || 0);
    const tax_amount = (subtotal * tax_rate) / 100;
    const discount = Math.max(0, parseFloat(data.discount) || 0);
    const total_amount = Math.max(0, subtotal + tax_amount - discount);

    const newReceipt = {
      id,
      receipt_number,
      customer_phone: data.customer_phone || '',
      customer_name: data.customer_name || 'Walk-in Customer',
      payment_mode: data.payment_mode || 'Cash',
      tax_rate,
      tax_amount: Number(tax_amount.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      subtotal: Number(subtotal.toFixed(2)),
      total_amount: Number(total_amount.toFixed(2)),
      notes: data.notes || '',
      created_at: new Date().toISOString(),
      shopkeeper_id: data.shopkeeper_id || 1,
      items
    };

    receipts.unshift(newReceipt);
    localStorage.setItem(LOCAL_RECEIPTS_KEY, JSON.stringify(receipts));

    // Deduct stock for catalog products if found
    try {
      const products = this.getProducts();
      items.forEach(it => {
        if (it.product_id) {
          const p = products.find(prod => prod.id === it.product_id);
          if (p) {
            p.stock = Math.max(0, p.stock - it.quantity);
          }
        }
      });
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn('Stock update notice:', e);
    }

    return newReceipt;
  },

  deleteReceipt(id) {
    this.init();
    let receipts = this.getReceipts();
    receipts = receipts.filter(r => r.id !== Number(id));
    localStorage.setItem(LOCAL_RECEIPTS_KEY, JSON.stringify(receipts));
    return { success: true };
  },

  // Reports Summary
  getReportSummary() {
    this.init();
    const receipts = this.getReceipts();
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const monthStr = now.toISOString().substring(0, 7);

    let today_sales = 0;
    let today_receipts = 0;
    let monthly_sales = 0;
    let monthly_receipts = 0;
    let total_sales = 0;
    const payment_breakdown = { Cash: 0, UPI: 0, Card: 0 };
    const itemMap = {};

    receipts.forEach(r => {
      const amt = Number(r.total_amount) || 0;
      total_sales += amt;

      const rDate = (r.created_at || '').split('T')[0];
      if (rDate === todayStr) {
        today_sales += amt;
        today_receipts += 1;
      }
      if (r.created_at && r.created_at.startsWith(monthStr)) {
        monthly_sales += amt;
        monthly_receipts += 1;
      }

      const mode = r.payment_mode || 'Cash';
      payment_breakdown[mode] = (payment_breakdown[mode] || 0) + amt;

      if (r.items && Array.isArray(r.items)) {
        r.items.forEach(it => {
          const key = it.item_name || 'Item';
          if (!itemMap[key]) {
            itemMap[key] = { item_name: key, total_quantity: 0, total_revenue: 0 };
          }
          itemMap[key].total_quantity += Number(it.quantity) || 1;
          itemMap[key].total_revenue += Number(it.total) || 0;
        });
      }
    });

    const top_selling_items = Object.values(itemMap)
      .sort((a, b) => b.total_quantity - a.total_quantity)
      .slice(0, 5);

    // 7-day trend
    const recent_trends = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayRecs = receipts.filter(r => (r.created_at || '').startsWith(dStr));
      const dayTotal = dayRecs.reduce((acc, r) => acc + (Number(r.total_amount) || 0), 0);
      recent_trends.push({
        date: label,
        total_amount: Number(dayTotal.toFixed(2)),
        receipts_count: dayRecs.length
      });
    }

    const total_receipts = receipts.length;
    const average_order_value = total_receipts > 0 ? Number((total_sales / total_receipts).toFixed(2)) : 0;

    return {
      today_sales: Number(today_sales.toFixed(2)),
      today_receipts,
      monthly_sales: Number(monthly_sales.toFixed(2)),
      monthly_receipts,
      total_sales: Number(total_sales.toFixed(2)),
      total_receipts,
      average_order_value,
      top_selling_items,
      payment_breakdown,
      recent_trends
    };
  }
};

// Initialize local store immediately
TapStore.init();
if (typeof window !== 'undefined') {
  window.TapStore = TapStore;
}

// ==========================================
// Robust Hybrid API Caller
// Communicates with FastAPI backend when live,
// smoothly falls back to TapStore for GitHub Pages / offline.
// ==========================================
async function apiCall(endpoint, options = {}) {
  // If no backend configured or GitHub Pages default, use TapStore directly for instant response
  const isGithubPages = window.location.hostname.endsWith('github.io');
  const hasCustomApi = Boolean(localStorage.getItem(API_STORAGE_KEY));

  if (!API_BASE || (isGithubPages && !hasCustomApi)) {
    return handleLocalStoreRequest(endpoint, options);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }

    // If server returned structured HTTP error
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const err = await res.json();
      throw new Error(err.detail || `Server error: ${res.status}`);
    } else {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
  } catch (err) {
    console.warn(`[Tap Receipt] Backend request to ${endpoint} failed, using local store fallback:`, err.message);
    return handleLocalStoreRequest(endpoint, options);
  }
}

function handleLocalStoreRequest(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};

  // 1. Auth Login
  if (endpoint.startsWith('/auth/login') && method === 'POST') {
    return TapStore.login(body.username, body.password);
  }

  // 2. Auth Register
  if ((endpoint.startsWith('/auth/register') || endpoint.startsWith('/auth/signup')) && method === 'POST') {
    return TapStore.register(body);
  }

  // 3. Products
  if (endpoint.startsWith('/products/')) {
    const subPath = endpoint.replace('/products/', '').split('?')[0];
    if (method === 'GET') {
      if (!subPath) return TapStore.getProducts();
      const p = TapStore.getProducts().find(item => item.id === Number(subPath));
      if (!p) throw new Error('Product not found');
      return p;
    } else if (method === 'POST') {
      return TapStore.createProduct(body);
    } else if (method === 'PUT') {
      return TapStore.updateProduct(subPath, body);
    } else if (method === 'DELETE') {
      return TapStore.deleteProduct(subPath);
    }
  }

  // 4. Receipts
  if (endpoint.startsWith('/receipts/')) {
    const subPath = endpoint.replace('/receipts/', '').split('?')[0];
    if (method === 'GET') {
      if (!subPath) {
        const urlParams = new URLSearchParams(endpoint.split('?')[1] || '');
        const limit = urlParams.get('limit');
        return TapStore.getReceipts(limit);
      }
      return TapStore.getReceiptById(subPath);
    } else if (method === 'POST') {
      return TapStore.createReceipt(body);
    } else if (method === 'DELETE') {
      return TapStore.deleteReceipt(subPath);
    }
  }

  // 5. Reports Summary
  if (endpoint.startsWith('/reports/summary')) {
    return TapStore.getReportSummary();
  }

  // 6. Generic Fallback
  return { status: 'ok', fallback: true };
}

// ==========================================
// Authentication & Session Helpers
// ==========================================
function getCurrentShop() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse shop session', e);
    }
  }
  return null;
}

function setCurrentShop(shop) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(shop));
  updateNavShopInfo();
}

function logout() {
  localStorage.removeItem(STORAGE_KEY);
  showToast('Logged out successfully', 'info');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 400);
}

function requireAuth() {
  let shop = getCurrentShop();
  if (!shop) {
    // If running in demo mode or local store, automatically set default demo shop if not set
    const shops = JSON.parse(localStorage.getItem(LOCAL_SHOPS_KEY) || '[]');
    if (shops.length > 0) {
      shop = shops[0];
      setCurrentShop(shop);
    } else {
      window.location.href = 'login.html';
      return null;
    }
  }
  return shop;
}

function updateNavShopInfo() {
  const shop = getCurrentShop();
  const shopNameEl = document.getElementById('nav-shop-name');
  if (shopNameEl) {
    if (shop && shop.shop_name) {
      shopNameEl.textContent = shop.shop_name;
    } else {
      shopNameEl.textContent = 'Tap Receipt Store';
    }
  }
}

// ==========================================
// URL, Messaging & QR Code Helpers
// ==========================================
function getReceiptViewUrl(receiptId) {
  try {
    return new URL(`receipt.html?view=${receiptId}`, window.location.href).href;
  } catch (e) {
    return `${window.location.origin}/receipt.html?view=${receiptId}`;
  }
}

function getWhatsAppUrl(phone, text) {
  let clean = (phone || '').toString().replace(/\D/g, '');
  if (clean.length === 10) {
    clean = '91' + clean;
  }
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}

function renderQRCode(container, url, size = 140) {
  if (!container) return;
  container.innerHTML = '';
  if (typeof QRCode !== 'undefined') {
    try {
      new QRCode(container, {
        text: url,
        width: size,
        height: size,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
      return;
    } catch (e) {
      console.warn('QRCode library error, using fallback:', e);
    }
  }

  // High-reliability QR Server API fallback
  const img = document.createElement('img');
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
  img.alt = 'Receipt QR Code';
  img.style.width = `${size}px`;
  img.style.height = `${size}px`;
  img.style.display = 'block';
  img.style.margin = '0 auto';
  img.onerror = () => {
    container.innerHTML = `<div style="padding: 10px; font-size: 0.8rem; text-align: center;"><a href="${url}" target="_blank" style="color: var(--primary); text-decoration: underline;">Open Digital Receipt</a></div>`;
  };
  container.appendChild(img);
}

// ==========================================
// Toast Notification Utility
// ==========================================
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// ==========================================
// Status Pill (Replaces intrusive warning banner)
// ==========================================
function initStatusIndicator() {
  if (document.getElementById('tap-status-pill')) return;

  const pill = document.createElement('div');
  pill.id = 'tap-status-pill';
  pill.style.cssText = `
    position: fixed;
    bottom: 12px;
    right: 12px;
    z-index: 9999;
    background: rgba(15, 23, 42, 0.9);
    border: 1px solid rgba(16, 185, 129, 0.4);
    color: #a7f3d0;
    border-radius: 9999px;
    padding: 6px 14px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    gap: 6px;
    backdrop-filter: blur(8px);
    transition: transform 0.2s, background 0.2s;
  `;

  const isLive = Boolean(API_BASE && !window.location.hostname.endsWith('github.io'));
  pill.innerHTML = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981;box-shadow:0 0 8px #10b981;"></span> <span>${isLive ? 'API Server' : 'Standalone / Cloud'}</span>`;
  pill.title = `Tap Receipt is running ready! Click to configure backend URL if needed.`;

  pill.onclick = () => {
    const input = prompt(
      'Tap Receipt Backend API URL (leave empty for standalone/browser mode):',
      localStorage.getItem(API_STORAGE_KEY) || (API_BASE || '')
    );
    if (input !== null) {
      const clean = input.trim().replace(/\/+$/, '');
      if (clean) {
        localStorage.setItem(API_STORAGE_KEY, clean);
        showToast('Backend API set: ' + clean, 'success');
      } else {
        localStorage.removeItem(API_STORAGE_KEY);
        showToast('Using Standalone Browser Store', 'info');
      }
      setTimeout(() => window.location.reload(), 500);
    }
  };

  document.body.appendChild(pill);
}

// ==========================================
// Global Page Initializer
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  updateNavShopInfo();
  initStatusIndicator();

  // Attach logout handler if button exists
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }

  // Detect current page
  const page = document.body.dataset.page;
  switch (page) {
    case 'login':
      initLoginPage();
      break;
    case 'dashboard':
      initDashboardPage();
      break;
    case 'products':
      initProductsPage();
      break;
    case 'reports':
      initReportsPage();
      break;
    case 'receipt':
      initReceiptPage();
      break;
    case 'history':
      initHistoryPage();
      break;
  }
});

// ==========================================
// 1. Authentication Page (login.html)
// ==========================================
function initLoginPage() {
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const btnDemoLogin = document.getElementById('btn-demo-login');

  // Tab switching between Shopkeeper Login and Register New Shop
  if (tabLogin && tabRegister) {
    tabLogin.addEventListener('click', (e) => {
      e.preventDefault();
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      if (formLogin) formLogin.style.display = 'block';
      if (formRegister) formRegister.style.display = 'none';
    });

    tabRegister.addEventListener('click', (e) => {
      e.preventDefault();
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      if (formLogin) formLogin.style.display = 'none';
      if (formRegister) formRegister.style.display = 'block';
    });
  }

  // Demo auto-login button
  if (btnDemoLogin) {
    btnDemoLogin.addEventListener('click', async (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('login-username');
      const passwordInput = document.getElementById('login-password');
      if (usernameInput) usernameInput.value = 'demo';
      if (passwordInput) passwordInput.value = 'demo123';

      try {
        const shop = await apiCall('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'demo', password: 'demo123' })
        });
        setCurrentShop(shop);
        showToast(`Welcome back, ${shop.shop_name}!`, 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 500);
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Handle Login submission
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = (document.getElementById('login-username')?.value || '').trim();
      const password = document.getElementById('login-password')?.value || '';

      if (!username || !password) {
        showToast('Please enter both username and password', 'error');
        return;
      }

      try {
        const shop = await apiCall('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        setCurrentShop(shop);
        showToast(`Welcome back, ${shop.shop_name}!`, 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 500);
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Handle Register submission ("Add Shop" flow)
  if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();
      const shop_name = (document.getElementById('reg-shop-name')?.value || '').trim();
      const username = (document.getElementById('reg-username')?.value || '').trim();
      const password = document.getElementById('reg-password')?.value || '';
      const phone = (document.getElementById('reg-phone')?.value || '').trim();
      const address = (document.getElementById('reg-address')?.value || '').trim();
      const upi_id = (document.getElementById('reg-upi')?.value || '').trim();
      const gst_number = (document.getElementById('reg-gst')?.value || '').trim();

      if (!shop_name || !username || !password) {
        showToast('Please fill in required fields (*)', 'error');
        return;
      }

      try {
        const shop = await apiCall('/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            password,
            shop_name,
            phone,
            address,
            upi_id,
            gst_number
          })
        });

        setCurrentShop(shop);
        showToast(`Shop "${shop.shop_name}" registered successfully!`, 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 500);
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }
}

// ==========================================
// 2. Dashboard Page (dashboard.html)
// ==========================================
async function initDashboardPage() {
  const shop = requireAuth();
  if (!shop) return;

  const shopHeaderName = document.getElementById('dash-shop-name');
  if (shopHeaderName) {
    shopHeaderName.textContent = shop.shop_name;
  }

  try {
    // 1. Fetch summary reports
    const reportData = await apiCall('/reports/summary');
    if (reportData) {
      const elTodaySales = document.getElementById('stat-today-sales');
      if (elTodaySales) elTodaySales.textContent = `₹${Number(reportData.today_sales || 0).toLocaleString('en-IN')}`;

      const elTodayReceipts = document.getElementById('stat-today-receipts');
      if (elTodayReceipts) elTodayReceipts.textContent = reportData.today_receipts || 0;

      const elMonthSales = document.getElementById('stat-month-sales');
      if (elMonthSales) elMonthSales.textContent = `₹${Number(reportData.monthly_sales || 0).toLocaleString('en-IN')}`;

      const elAvgBill = document.getElementById('stat-avg-bill');
      if (elAvgBill) elAvgBill.textContent = `₹${Number(reportData.average_order_value || 0).toLocaleString('en-IN')}`;
    }

    // 2. Fetch product count
    const products = await apiCall('/products/');
    if (Array.isArray(products)) {
      const countEl = document.getElementById('stat-product-count');
      if (countEl) countEl.textContent = products.length;
    }

    // 3. Fetch recent 5 receipts
    const receipts = await apiCall('/receipts/?limit=5');
    if (Array.isArray(receipts)) {
      renderDashboardRecentReceipts(receipts);
    }
  } catch (err) {
    console.error('Error loading dashboard stats:', err);
  }
}

function renderDashboardRecentReceipts(receipts) {
  const tbody = document.getElementById('recent-receipts-tbody');
  if (!tbody) return;

  if (!receipts || receipts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-dim); padding: 1.5rem;">No receipts generated yet. Click "New Billing" to get started!</td></tr>`;
    return;
  }

  tbody.innerHTML = receipts.map(r => `
    <tr>
      <td><strong>${r.receipt_number}</strong></td>
      <td>${new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
      <td>${r.customer_phone}</td>
      <td><span class="badge ${r.payment_mode === 'UPI' ? 'badge-info' : r.payment_mode === 'Card' ? 'badge-purple' : 'badge-success'}">${r.payment_mode}</span></td>
      <td><strong>₹${Number(r.total_amount || 0).toFixed(2)}</strong></td>
    </tr>
  `).join('');
}

// ==========================================
// 3. Products Management (products.html)
// ==========================================
let allProducts = [];

async function initProductsPage() {
  requireAuth();
  await loadProducts();

  // Search input filter
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const filtered = allProducts.filter(p => 
        (p.name || '').toLowerCase().includes(term) || (p.category || '').toLowerCase().includes(term)
      );
      renderProductsTable(filtered);
    });
  }

  // Category filter buttons
  const catButtons = document.querySelectorAll('.category-filter-btn');
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      if (!cat || cat === 'all') {
        renderProductsTable(allProducts);
      } else {
        const filtered = allProducts.filter(p => (p.category || '').toLowerCase() === cat.toLowerCase());
        renderProductsTable(filtered);
      }
    });
  });

  // Modal open/close handlers
  const btnAdd = document.getElementById('btn-open-add-product');
  const modal = document.getElementById('product-modal');
  const btnClose = document.getElementById('modal-product-close');
  const form = document.getElementById('product-form');

  if (btnAdd && modal) {
    btnAdd.addEventListener('click', () => {
      const titleEl = document.getElementById('modal-product-title');
      if (titleEl) titleEl.textContent = 'Add New Product';
      const idEl = document.getElementById('product-id');
      if (idEl) idEl.value = '';
      if (form) form.reset();
      modal.classList.add('active');
      setTimeout(() => {
        const nameInput = document.getElementById('product-name');
        if (nameInput) nameInput.focus();
      }, 50);
    });
  }

  if (btnClose && modal) {
    btnClose.addEventListener('click', () => modal.classList.remove('active'));
  }

  // Save / Update Product
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('product-id')?.value;
      const name = (document.getElementById('product-name')?.value || '').trim();
      const price = parseFloat(document.getElementById('product-price')?.value || 0);
      const category = (document.getElementById('product-category')?.value || '').trim() || 'General';
      const stock = parseInt(document.getElementById('product-stock')?.value || 0, 10);

      if (!name) {
        showToast('Please enter product name', 'error');
        return;
      }

      const shop = getCurrentShop();
      const payload = {
        name,
        price,
        category,
        stock,
        shopkeeper_id: shop ? shop.id : 1
      };

      try {
        if (id) {
          await apiCall(`/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          showToast('Product updated successfully', 'success');
        } else {
          await apiCall('/products/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          showToast('Product added successfully', 'success');
        }

        if (modal) modal.classList.remove('active');
        await loadProducts();
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }
}

async function loadProducts() {
  try {
    const products = await apiCall('/products/');
    allProducts = Array.isArray(products) ? products : [];
    renderProductsTable(allProducts);
  } catch (err) {
    console.error('Error fetching products:', err);
    showToast('Failed to load products', 'error');
  }
}

function renderProductsTable(products) {
  const tbody = document.getElementById('products-tbody');
  if (!tbody) return;

  if (!products || products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-dim); padding: 2rem;">No products found. Click "Add New Product" to add one.</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map((p, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><strong>${p.name}</strong></td>
      <td><span class="badge badge-info">${p.category}</span></td>
      <td><strong>₹${Number(p.price || 0).toFixed(2)}</strong></td>
      <td>
        <span class="badge ${p.stock < 10 ? 'badge-danger' : 'badge-success'}">
          ${p.stock} units ${p.stock < 10 ? '(Low)' : ''}
        </span>
      </td>
      <td>
        <button type="button" class="btn btn-secondary btn-sm" onclick="editProduct(${p.id})">✏️ Edit</button>
        <button type="button" class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">🗑️</button>
      </td>
    </tr>
  `).join('');
}

window.editProduct = function(id) {
  const product = allProducts.find(p => p.id === Number(id));
  if (!product) return;

  document.getElementById('modal-product-title').textContent = 'Edit Product';
  document.getElementById('product-id').value = product.id;
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-category').value = product.category;
  document.getElementById('product-stock').value = product.stock;

  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.add('active');
};

window.deleteProduct = async function(id) {
  const product = allProducts.find(p => p.id === Number(id));
  const name = product ? product.name : 'this item';
  if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

  try {
    await apiCall(`/products/${id}`, { method: 'DELETE' });
    showToast(`Deleted "${name}"`, 'success');
    await loadProducts();
  } catch (err) {
    showToast(err.message, 'error');
  }
};

// ==========================================
// 4. Sales Report Module (reports.html)
// ==========================================
async function initReportsPage() {
  requireAuth();

  try {
    const data = await apiCall('/reports/summary');
    if (!data) return;

    // Summary Metric Cards
    const elTotSales = document.getElementById('report-total-sales');
    if (elTotSales) elTotSales.textContent = `₹${Number(data.total_sales || 0).toLocaleString('en-IN')}`;

    const elTotRec = document.getElementById('report-total-receipts');
    if (elTotRec) elTotRec.textContent = data.total_receipts || 0;

    const elTodaySales = document.getElementById('report-today-sales');
    if (elTodaySales) elTodaySales.textContent = `₹${Number(data.today_sales || 0).toLocaleString('en-IN')}`;

    const elMonthSales = document.getElementById('report-month-sales');
    if (elMonthSales) elMonthSales.textContent = `₹${Number(data.monthly_sales || 0).toLocaleString('en-IN')}`;

    const elAvgOrder = document.getElementById('report-avg-order');
    if (elAvgOrder) elAvgOrder.textContent = `₹${Number(data.average_order_value || 0).toFixed(2)}`;

    // Payment Mode Breakdown
    const paymentContainer = document.getElementById('payment-breakdown-bars');
    if (paymentContainer && data.payment_breakdown) {
      const total = data.total_sales || 1;
      const modes = Object.entries(data.payment_breakdown);
      paymentContainer.innerHTML = modes.map(([mode, amt]) => {
        const pct = Math.min(100, Math.round((amt / total) * 100)) || 0;
        return `
          <div style="margin-bottom: 0.85rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
              <span><strong>${mode}</strong></span>
              <span>₹${Number(amt || 0).toLocaleString('en-IN')} (${pct}%)</span>
            </div>
            <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden;">
              <div style="width: ${pct}%; height: 100%; background: ${mode === 'UPI' ? 'var(--cyan)' : mode === 'Card' ? 'var(--accent)' : 'var(--primary)'}; border-radius: 4px;"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // 7-Day Trend Visual Chart
    const trendContainer = document.getElementById('trend-bars-container');
    if (trendContainer && data.recent_trends && Array.isArray(data.recent_trends)) {
      const maxAmt = Math.max(...data.recent_trends.map(t => t.total_amount), 100);
      trendContainer.innerHTML = data.recent_trends.map(t => {
        const heightPct = Math.max(12, Math.round((t.total_amount / maxAmt) * 100));
        return `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.4rem; flex: 1;">
            <span style="font-size: 0.72rem; color: var(--text-muted);">₹${t.total_amount}</span>
            <div style="width: 28px; height: 120px; display: flex; align-items: flex-end; background: rgba(255,255,255,0.04); border-radius: 6px; padding: 2px;">
              <div style="width: 100%; height: ${heightPct}%; background: linear-gradient(180deg, #10b981, #06b6d4); border-radius: 4px;" title="${t.date}: ₹${t.total_amount} (${t.receipts_count} bills)"></div>
            </div>
            <span style="font-size: 0.75rem; color: var(--text-dim);">${t.date}</span>
          </div>
        `;
      }).join('');
    }

    // Top Selling Items Table
    const topTbody = document.getElementById('top-items-tbody');
    if (topTbody && data.top_selling_items) {
      if (data.top_selling_items.length === 0) {
        topTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-dim); padding: 1.5rem;">No sales data recorded yet.</td></tr>`;
      } else {
        topTbody.innerHTML = data.top_selling_items.map((item, idx) => `
          <tr>
            <td><strong>#${idx + 1}</strong></td>
            <td><strong>${item.item_name}</strong></td>
            <td><span class="badge badge-purple">${item.total_quantity} sold</span></td>
            <td><strong>₹${Number(item.total_revenue || 0).toFixed(2)}</strong></td>
          </tr>
        `).join('');
      }
    }
  } catch (err) {
    console.error('Error fetching report:', err);
    showToast(err.message, 'error');
  }
}

// ==========================================
// 5. Billing & Receipt Generation (receipt.html)
// ==========================================
let currentBillItems = [];
let catalogProducts = [];
let selectedPaymentMode = 'Cash';

async function initReceiptPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const viewId = urlParams.get('view');

  // Customer Digital Receipt Mode (?view=123 or ?view=TR-2026-XXXX)
  if (viewId) {
    await renderCustomerDigitalReceipt(viewId);
    return;
  }

  // POS Terminal Mode (Requires Auth)
  const shop = requireAuth();
  if (!shop) return;

  // Load catalog into quick selector and quick tap chips
  await loadCatalogForBilling();

  // Handle Quick Add from dropdown
  const btnQuickAdd = document.getElementById('btn-quick-add');
  const productSelect = document.getElementById('quick-product-select');
  if (btnQuickAdd && productSelect) {
    btnQuickAdd.addEventListener('click', (e) => {
      e.preventDefault();
      let prodId = parseInt(productSelect.value, 10);
      
      // If none selected, default to first available catalog item
      if (!prodId && catalogProducts.length > 0) {
        prodId = catalogProducts[0].id;
        productSelect.value = prodId;
      }

      const product = catalogProducts.find(p => p.id === prodId);
      if (!product) {
        showToast('Please select an item from the catalog', 'info');
        return;
      }

      addItemToBill({
        product_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: 1
      });
      showToast(`Added "${product.name}" to bill`, 'success');
    });
  }

  // Handle Custom Item Row Addition
  const btnAddCustom = document.getElementById('btn-add-custom-row');
  if (btnAddCustom) {
    btnAddCustom.addEventListener('click', (e) => {
      e.preventDefault();
      addItemToBill({
        product_id: null,
        item_name: 'Custom Item',
        price: 10.0,
        quantity: 1
      });
      showToast('Added custom item row', 'info');
    });
  }

  // Payment Mode selection buttons
  const payButtons = document.querySelectorAll('.payment-btn');
  payButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      payButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPaymentMode = btn.dataset.mode || 'Cash';
    });
  });

  // Tax and Discount change listeners
  const taxSelect = document.getElementById('bill-tax-rate');
  const discountInput = document.getElementById('bill-discount');
  if (taxSelect) taxSelect.addEventListener('change', calculateTotals);
  if (discountInput) discountInput.addEventListener('input', calculateTotals);

  // Reset Bill Button
  const btnReset = document.getElementById('btn-reset-bill');
  if (btnReset) {
    btnReset.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Clear current bill items?')) {
        currentBillItems = [];
        const phoneEl = document.getElementById('customer-phone');
        if (phoneEl) phoneEl.value = '';
        const nameEl = document.getElementById('customer-name');
        if (nameEl) nameEl.value = '';
        renderBillItemsTable();
        calculateTotals();
        showToast('Bill cleared', 'info');
      }
    });
  }

  // Proceed / Generate Receipt
  const btnProceed = document.getElementById('btn-proceed-bill');
  if (btnProceed) {
    btnProceed.addEventListener('click', (e) => {
      e.preventDefault();
      handleProceedReceipt();
    });
  }

  // Modal Close
  const modalClose = document.getElementById('receipt-modal-close');
  const modal = document.getElementById('receipt-success-modal');
  if (modalClose && modal) {
    modalClose.addEventListener('click', () => modal.classList.remove('active'));
  }

  // Seed with 1 initial sample row if bill is empty
  if (currentBillItems.length === 0) {
    if (catalogProducts.length > 0) {
      addItemToBill({
        product_id: catalogProducts[0].id,
        item_name: catalogProducts[0].name,
        price: catalogProducts[0].price,
        quantity: 1
      });
    } else {
      addItemToBill({
        product_id: null,
        item_name: 'Full Cream Milk (500ml)',
        price: 32.0,
        quantity: 1
      });
    }
  }
}

async function loadCatalogForBilling() {
  try {
    const products = await apiCall('/products/');
    catalogProducts = Array.isArray(products) ? products : [];
    
    // Populate select dropdown
    const select = document.getElementById('quick-product-select');
    if (select) {
      if (catalogProducts.length > 0) {
        select.innerHTML = '<option value="">-- Choose Item to Add --</option>' +
          catalogProducts.map(p => `
            <option value="${p.id}">${p.name} - ₹${Number(p.price || 0).toFixed(2)} (${p.category})</option>
          `).join('');
      } else {
        select.innerHTML = '<option value="">No catalog products available</option>';
      }
    }

    // Render quick tap chips
    renderQuickTapChips(catalogProducts);

  } catch (err) {
    console.error('Error loading products for billing:', err);
  }
}

function renderQuickTapChips(products) {
  const container = document.getElementById('quick-tap-chips');
  if (!container) return;

  if (!products || products.length === 0) {
    container.innerHTML = '<span style="font-size:0.75rem;color:var(--text-dim);">No quick items</span>';
    return;
  }

  // Take top 6 items for quick tap
  const quickItems = products.slice(0, 6);
  container.innerHTML = quickItems.map(p => `
    <button type="button" class="tap-chip-btn" onclick="quickTapAddItem(${p.id})">
      <span>➕</span> ${p.name.split('(')[0].trim()} • ₹${Number(p.price || 0).toFixed(0)}
    </button>
  `).join('');
}

window.quickTapAddItem = function(productId) {
  const product = catalogProducts.find(p => p.id === Number(productId));
  if (!product) return;

  addItemToBill({
    product_id: product.id,
    item_name: product.name,
    price: product.price,
    quantity: 1
  });

  showToast(`Tapped: Added "${product.name}"`, 'success');
};

function addItemToBill(item) {
  const cleanName = (item.item_name || 'Item').trim();
  const existing = currentBillItems.find(i => 
    (item.product_id && i.product_id === item.product_id) || 
    (i.item_name || '').toLowerCase() === cleanName.toLowerCase()
  );

  if (existing) {
    existing.quantity += Number(item.quantity) || 1;
  } else {
    currentBillItems.push({
      product_id: item.product_id || null,
      item_name: cleanName,
      price: Math.max(0, parseFloat(item.price) || 0),
      quantity: Math.max(1, parseInt(item.quantity, 10) || 1)
    });
  }

  renderBillItemsTable();
  calculateTotals();
}

function renderBillItemsTable() {
  const tbody = document.getElementById('billing-items-tbody');
  if (!tbody) return;

  if (currentBillItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-dim); padding: 1.5rem;">No items in bill yet. Tap an item above or click "+ Custom Item".</td></tr>`;
    return;
  }

  tbody.innerHTML = currentBillItems.map((item, idx) => {
    const lineTotal = (Number(item.quantity || 1) * Number(item.price || 0)).toFixed(2);
    return `
      <tr>
        <td>
          <input 
            type="text" 
            class="form-input form-input-sm" 
            value="${item.item_name}" 
            oninput="updateBillItemName(${idx}, this.value)"
            style="padding: 0.35rem 0.6rem; font-size: 0.85rem;"
          />
        </td>
        <td>
          <div class="qty-control">
            <button type="button" class="qty-btn" onclick="changeQty(${idx}, -1)">-</button>
            <input 
              type="number" 
              class="qty-input" 
              value="${item.quantity}" 
              min="1" 
              oninput="setQty(${idx}, this.value)"
            />
            <button type="button" class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
          </div>
        </td>
        <td>
          <input 
            type="number" 
            class="form-input form-input-sm" 
            value="${item.price}" 
            step="0.5" 
            min="0"
            oninput="updateBillItemPrice(${idx}, this.value)"
            style="width: 90px; padding: 0.35rem 0.6rem; font-size: 0.85rem;"
          />
        </td>
        <td style="text-align: right; font-family: var(--font-mono); font-weight: 600;">
          ₹${lineTotal}
        </td>
        <td style="text-align: center;">
          <button type="button" class="btn btn-danger btn-sm" onclick="removeBillItem(${idx})" style="padding: 0.2rem 0.5rem;" title="Remove row">✕</button>
        </td>
      </tr>
    `;
  }).join('');
}

window.changeQty = function(idx, delta) {
  if (currentBillItems[idx]) {
    currentBillItems[idx].quantity = Math.max(1, (Number(currentBillItems[idx].quantity) || 1) + delta);
    renderBillItemsTable();
    calculateTotals();
  }
};

window.setQty = function(idx, val) {
  if (currentBillItems[idx]) {
    currentBillItems[idx].quantity = Math.max(1, parseInt(val, 10) || 1);
    renderBillItemsTable();
    calculateTotals();
  }
};

window.updateBillItemName = function(idx, val) {
  if (currentBillItems[idx]) {
    currentBillItems[idx].item_name = (val || '').trim() || 'Item';
  }
};

window.updateBillItemPrice = function(idx, val) {
  if (currentBillItems[idx]) {
    currentBillItems[idx].price = Math.max(0, parseFloat(val) || 0);
    calculateTotals();
  }
};

window.removeBillItem = function(idx) {
  currentBillItems.splice(idx, 1);
  renderBillItemsTable();
  calculateTotals();
};

function calculateTotals() {
  const subtotal = currentBillItems.reduce((acc, i) => acc + (Number(i.quantity || 1) * Number(i.price || 0)), 0);
  const taxRate = parseFloat(document.getElementById('bill-tax-rate')?.value || 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const discount = Math.max(0, parseFloat(document.getElementById('bill-discount')?.value || 0));
  const grandTotal = Math.max(0, subtotal + taxAmount - discount);

  const subEl = document.getElementById('summary-subtotal');
  if (subEl) subEl.textContent = `₹${subtotal.toFixed(2)}`;

  const taxEl = document.getElementById('summary-tax');
  if (taxEl) taxEl.textContent = `₹${taxAmount.toFixed(2)}`;

  const discEl = document.getElementById('summary-discount');
  if (discEl) discEl.textContent = `-₹${discount.toFixed(2)}`;

  const totEl = document.getElementById('summary-grand-total');
  if (totEl) totEl.textContent = `₹${grandTotal.toFixed(2)}`;

  return { subtotal, taxRate, taxAmount, discount, grandTotal };
}

async function handleProceedReceipt() {
  const phone = (document.getElementById('customer-phone')?.value || '').trim();
  const name = (document.getElementById('customer-name')?.value || '').trim() || 'Walk-in Customer';

  if (phone && phone.length > 0 && phone.length < 10) {
    showToast('Please enter a valid 10-digit customer mobile number', 'error');
    const phoneInput = document.getElementById('customer-phone');
    if (phoneInput) phoneInput.focus();
    return;
  }

  if (currentBillItems.length === 0) {
    showToast('Please add at least one item to the bill', 'error');
    return;
  }

  const { taxRate, discount } = calculateTotals();
  const shop = getCurrentShop();

  const payload = {
    customer_phone: phone || 'Not Provided',
    customer_name: name,
    payment_mode: selectedPaymentMode,
    tax_rate: taxRate,
    discount: discount,
    shopkeeper_id: shop ? shop.id : 1,
    items: currentBillItems.map(i => ({
      item_name: i.item_name,
      quantity: i.quantity,
      price: i.price,
      product_id: i.product_id || null
    }))
  };

  try {
    const receipt = await apiCall('/receipts/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    showToast(`Receipt ${receipt.receipt_number} generated!`, 'success');

    // Show Success Modal with QR Code and WhatsApp action
    renderReceiptSuccessModal(receipt, shop);

    // Reset bill state
    currentBillItems = [];
    const pEl = document.getElementById('customer-phone');
    if (pEl) pEl.value = '';
    const nEl = document.getElementById('customer-name');
    if (nEl) nEl.value = '';
    renderBillItemsTable();
    calculateTotals();

  } catch (err) {
    showToast(err.message, 'error');
  }
}

function renderReceiptSuccessModal(receipt, shop) {
  const modal = document.getElementById('receipt-success-modal');
  if (!modal) return;

  const viewUrl = getReceiptViewUrl(receipt.id || receipt.receipt_number);
  const shopName = shop ? shop.shop_name : 'QuickMart Superstore';
  const custName = (receipt.customer_name && receipt.customer_name !== 'Walk-in Customer') ? `\n*Customer:* ${receipt.customer_name}` : '';
  const itemSummary = (receipt.items || []).map(i => `• ${i.item_name} x ${i.quantity}`).join('\n');
  const waText = 
`🧾 *${shopName}*${custName}
--------------------------------
${itemSummary}
--------------------------------
*Total Amount:* ₹${Number(receipt.total_amount || 0).toFixed(2)}`;

  // Populate modal details
  const numEl = document.getElementById('modal-receipt-num');
  if (numEl) numEl.textContent = receipt.receipt_number;

  const gtEl = document.getElementById('modal-grand-total');
  if (gtEl) gtEl.textContent = `₹${Number(receipt.total_amount || 0).toFixed(2)}`;

  // Set WhatsApp dynamic input and button
  const waInput = document.getElementById('modal-wa-input');
  if (waInput) {
    waInput.value = (receipt.customer_phone !== 'Not Provided') ? receipt.customer_phone : '';
  }

  const btnWaDynamic = document.getElementById('btn-send-whatsapp-dynamic');
  if (btnWaDynamic) {
    btnWaDynamic.onclick = () => {
      const waNum = (waInput ? waInput.value : '').trim();
      if (!waNum || waNum.length < 10) {
        showToast('Please enter a valid 10-digit WhatsApp number.', 'error');
        return;
      }
      const waUrl = getWhatsAppUrl(waNum, waText);
      window.open(waUrl, '_blank');
    };
  }

  // Set Digital Link
  const linkDigital = document.getElementById('link-view-digital');
  if (linkDigital) linkDigital.href = viewUrl;

  // Generate QR Code
  const qrContainer = document.getElementById('qrcode-container');
  if (qrContainer) {
    renderQRCode(qrContainer, viewUrl, 140);
  }

  // Render thermal slip preview inside modal
  const slipContainer = document.getElementById('modal-thermal-slip-preview');
  if (slipContainer) {
    slipContainer.innerHTML = generateThermalSlipHtml(receipt, shop, viewUrl);
  }

  modal.classList.add('active');
}

function generateThermalSlipHtml(receipt, shop, viewUrl) {
  const shopName = shop ? shop.shop_name : 'QuickMart Superstore';
  const shopAddress = shop ? shop.address : 'Galleria Market, Bengaluru';
  const shopPhone = shop ? shop.phone : '9876543210';
  const shopGst = shop ? shop.gst_number : '';
  const dateStr = new Date(receipt.created_at).toLocaleString();

  return `
    <div class="receipt-paper">
      <div class="shop-header">
        <div class="shop-name">${shopName}</div>
        <div class="shop-info">${shopAddress}</div>
        <div class="shop-info">Tel: ${shopPhone} ${shopGst ? '| GST: ' + shopGst : ''}</div>
      </div>

      <div class="divider-dashed"></div>

      <div class="meta-grid">
        <span>Receipt: <strong>${receipt.receipt_number}</strong></span>
        <span>${dateStr}</span>
      </div>
      <div class="meta-grid">
        <span>Cust: <strong>${receipt.customer_phone}</strong></span>
        <span>Mode: <strong>${receipt.payment_mode}</strong></span>
      </div>

      <div class="divider-dashed"></div>

      <table class="paper-table">
        <thead>
          <tr>
            <th style="width: 50%;">Item</th>
            <th style="width: 15%; text-align: center;">Qty</th>
            <th style="width: 15%; text-align: right;">Rate</th>
            <th style="width: 20%; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${(receipt.items || []).map(i => `
            <tr>
              <td>${i.item_name}</td>
              <td style="text-align: center;">${i.quantity}</td>
              <td style="text-align: right;">${Number(i.price || 0).toFixed(2)}</td>
              <td style="text-align: right;">${Number(i.total || (i.quantity * i.price)).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="divider-dashed"></div>

      <div class="calc-row">
        <span>Subtotal</span>
        <span>₹${Number(receipt.subtotal || 0).toFixed(2)}</span>
      </div>
      ${receipt.tax_amount > 0 ? `
        <div class="calc-row">
          <span>GST / Tax (${receipt.tax_rate}%)</span>
          <span>₹${Number(receipt.tax_amount || 0).toFixed(2)}</span>
        </div>
      ` : ''}
      ${receipt.discount > 0 ? `
        <div class="calc-row">
          <span>Discount</span>
          <span>-₹${Number(receipt.discount || 0).toFixed(2)}</span>
        </div>
      ` : ''}

      <div class="divider-double"></div>

      <div class="grand-total-row">
        <span>GRAND TOTAL</span>
        <span>₹${Number(receipt.total_amount || 0).toFixed(2)}</span>
      </div>

      <div class="divider-dashed"></div>

      <div class="qr-container">
        <div id="thermal-slip-qr"></div>
        <div class="qr-caption">Scan to Verify Digital Bill</div>
      </div>

      <div class="thankyou-msg">
        *** THANK YOU FOR YOUR VISIT ***<br>
        Save Paper, Save Planet 🌱
      </div>
    </div>
  `;
}

// Customer Digital Receipt View (?view=123)
async function renderCustomerDigitalReceipt(receiptId) {
  try {
    const receipt = await apiCall(`/receipts/${receiptId}`);
    if (!receipt) throw new Error('Receipt not found');

    const terminalEl = document.getElementById('pos-terminal-container');
    const customerEl = document.getElementById('customer-view-container');
    if (terminalEl) terminalEl.style.display = 'none';
    if (customerEl) {
      customerEl.style.display = 'block';
      const viewUrl = window.location.href;
      
      const shopName = receipt.shopkeeper ? receipt.shopkeeper.shop_name : 'QuickMart Superstore';
      const custName = (receipt.customer_name && receipt.customer_name !== 'Walk-in Customer') ? `\n*Customer:* ${receipt.customer_name}` : '';
      const itemSummary = (receipt.items || []).map(i => `• ${i.item_name} x ${i.quantity}`).join('\n');
      const waText = 
`🧾 *${shopName}*${custName}
--------------------------------
${itemSummary}
--------------------------------
*Total Amount:* ₹${Number(receipt.total_amount || 0).toFixed(2)}`;

      customerEl.innerHTML = `
        <div style="max-width: 440px; margin: 2rem auto;">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <span class="badge badge-success" style="font-size: 0.9rem; padding: 0.4rem 1rem;">
              Verified Digital Receipt ✅
            </span>
          </div>

          ${generateThermalSlipHtml(receipt, receipt.shopkeeper, viewUrl)}

          <!-- NEW: Customer WhatsApp Input -->
          <div style="background: rgba(0,0,0,0.2); padding: 1.25rem; border-radius: 8px; margin-top: 1.5rem; text-align: center;" class="no-print">
            <h4 style="margin-bottom: 0.5rem; color: #fff;">Send Receipt to WhatsApp</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">Enter your WhatsApp number to receive a copy of this bill.</p>
            <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
              <input type="tel" id="customer-view-wa-input" class="form-input" placeholder="Your WhatsApp No." style="max-width: 220px; flex: 1;" maxlength="10">
              <button type="button" id="customer-view-btn-wa" class="btn btn-whatsapp">
                <span>📲</span> Send
              </button>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem;" class="no-print">
            <button type="button" class="btn btn-primary" onclick="window.print()">
              <span>🖨️</span> Print / Save PDF
            </button>
            <a href="receipt.html" class="btn btn-secondary">
              <span>🧾</span> New Bill
            </a>
          </div>
        </div>
      `;

      // Render QR code inside thermal slip
      setTimeout(() => {
        const qrEl = document.getElementById('thermal-slip-qr');
        if (qrEl) {
          renderQRCode(qrEl, viewUrl, 100);
        }

        // Attach WhatsApp event handler
        const waBtn = document.getElementById('customer-view-btn-wa');
        const waInput = document.getElementById('customer-view-wa-input');
        if (waBtn && waInput) {
          // Pre-fill if number was provided during checkout
          if (receipt.customer_phone && receipt.customer_phone !== 'Not Provided') {
            waInput.value = receipt.customer_phone;
          }
          waBtn.onclick = () => {
             const waNum = waInput.value.trim();
             if (!waNum || waNum.length < 10) {
               showToast('Please enter a valid 10-digit WhatsApp number.', 'error');
               return;
             }
             const targetUrl = getWhatsAppUrl(waNum, waText);
             window.open(targetUrl, '_blank');
          };
        }
      }, 100);
    }
  } catch (err) {
    showToast('Failed to load digital receipt: ' + err.message, 'error');
  }
}

// ==========================================
// 6. Receipt History (history.html)
// ==========================================
let allReceipts = [];

async function initHistoryPage() {
  requireAuth();
  await loadReceiptHistory();

  // Search input filter
  const searchInput = document.getElementById('history-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const filtered = allReceipts.filter(r => 
        (r.customer_phone || '').includes(term) || 
        (r.receipt_number || '').toLowerCase().includes(term) ||
        (r.customer_name || '').toLowerCase().includes(term)
      );
      renderHistoryTable(filtered);
    });
  }

  // Payment mode filter
  const payFilter = document.getElementById('history-filter-mode');
  if (payFilter) {
    payFilter.addEventListener('change', (e) => {
      const mode = e.target.value;
      if (!mode || mode === 'ALL') {
        renderHistoryTable(allReceipts);
      } else {
        const filtered = allReceipts.filter(r => r.payment_mode === mode);
        renderHistoryTable(filtered);
      }
    });
  }

  // Modal close handlers
  const modalClose = document.getElementById('history-modal-close');
  const modal = document.getElementById('history-modal');
  if (modalClose && modal) {
    modalClose.addEventListener('click', () => modal.classList.remove('active'));
  }
}

async function loadReceiptHistory() {
  try {
    const receipts = await apiCall('/receipts/');
    allReceipts = Array.isArray(receipts) ? receipts : [];
    renderHistoryTable(allReceipts);
  } catch (err) {
    console.error('Error fetching receipts history:', err);
    showToast('Failed to load receipt history', 'error');
  }
}

function renderHistoryTable(receipts) {
  const tbody = document.getElementById('history-tbody');
  if (!tbody) return;

  if (!receipts || receipts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 2rem;">No receipts match the filter criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = receipts.map(r => {
    const dateStr = new Date(r.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
      <tr>
        <td><strong>${r.receipt_number}</strong></td>
        <td>
          <div>${dateStr}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">${timeStr}</div>
        </td>
        <td>
          <div><strong>${r.customer_phone}</strong></div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${r.customer_name || 'Walk-in'}</div>
        </td>
        <td><span class="badge badge-purple">${r.items ? r.items.length : 0} items</span></td>
        <td>
          <span class="badge ${r.payment_mode === 'UPI' ? 'badge-info' : r.payment_mode === 'Card' ? 'badge-purple' : 'badge-success'}">
            ${r.payment_mode}
          </span>
        </td>
        <td><strong style="color: var(--primary);">₹${Number(r.total_amount || 0).toFixed(2)}</strong></td>
        <td>
          <button type="button" class="btn btn-secondary btn-sm" onclick="viewHistoryReceipt(${r.id})">👁️ View</button>
          <button type="button" class="btn btn-whatsapp btn-sm" onclick="resendWhatsApp(${r.id})">📲 WhatsApp</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="deleteHistoryReceipt(${r.id})">🗑️</button>
        </td>
      </tr>
    `;
  }).join('');
}

window.viewHistoryReceipt = async function(receiptId) {
  const receipt = allReceipts.find(r => r.id === Number(receiptId));
  if (!receipt) return;

  const modal = document.getElementById('history-modal');
  const preview = document.getElementById('history-modal-preview');
  if (modal && preview) {
    const shop = getCurrentShop();
    const viewUrl = getReceiptViewUrl(receipt.id || receipt.receipt_number);
    preview.innerHTML = generateThermalSlipHtml(receipt, shop, viewUrl);

    setTimeout(() => {
      const qrEl = document.getElementById('thermal-slip-qr');
      if (qrEl) {
        renderQRCode(qrEl, viewUrl, 90);
      }
    }, 100);

    modal.classList.add('active');
  }
};

window.resendWhatsApp = function(receiptId) {
  const receipt = allReceipts.find(r => r.id === Number(receiptId));
  if (!receipt) return;

  const shop = getCurrentShop();
  const shopName = shop ? shop.shop_name : 'Tap Receipt Store';
  const viewUrl = getReceiptViewUrl(receipt.id || receipt.receipt_number);
  const custName = (receipt.customer_name && receipt.customer_name !== 'Walk-in Customer') ? `\n*Customer:* ${receipt.customer_name}` : '';
  const itemSummary = (receipt.items || []).map(i => `• ${i.item_name} x ${i.quantity}`).join('\n');

  const waText = 
`🧾 *${shopName}*${custName}
--------------------------------
${itemSummary}
--------------------------------
*Total Amount:* ₹${Number(receipt.total_amount || 0).toFixed(2)}`;

  const waUrl = getWhatsAppUrl(receipt.customer_phone, waText);
  window.open(waUrl, '_blank');
};

window.deleteHistoryReceipt = async function(receiptId) {
  const receipt = allReceipts.find(r => r.id === Number(receiptId));
  const num = receipt ? receipt.receipt_number : '';
  if (!confirm(`Are you sure you want to delete receipt ${num}? This cannot be undone.`)) return;

  try {
    await apiCall(`/receipts/${receiptId}`, { method: 'DELETE' });
    showToast(`Receipt ${num} deleted`, 'success');
    await loadReceiptHistory();
  } catch (err) {
    showToast(err.message, 'error');
  }
};
