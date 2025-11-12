// Mobile menu toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
menuBtn?.addEventListener('click', () => navLinks.classList.toggle('show'));

// Toast helper
const toast = document.getElementById('toast');
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 1500);
}

// CART state
let cart = [];

// AUTH state
let loggedIn = false;
let extendedLoaded = false;

// UI elements
const cartCount = document.getElementById('cartCount');
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartList = document.getElementById('cartList');
const cartTotalEl = document.getElementById('cartTotal');
const overlay = document.getElementById('overlay');
const closeCart = document.getElementById('closeCart');
const checkout = document.getElementById('checkout');
const clearCartBtn = document.getElementById('clearCart');

const loginBtn = document.getElementById('loginBtn');
const loginDrawer = document.getElementById('loginDrawer');
const loginForm = document.getElementById('loginForm');
const closeLogin = document.getElementById('closeLogin');
const extendedGrid = document.getElementById('extendedGrid');
const moreOptionsSection = document.getElementById('moreOptions');

// CART UI updater
function updateCartUI() {
  cartCount.textContent = cart.reduce((s, i) => s + i.qty, 0);
  cartList.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.qty * Number(item.price);
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <div class="name">${item.name} <div class="muted">x${item.qty}</div></div>
      <div class="muted">$${(item.price * item.qty).toFixed(2)}</div>
      <button class="btn remove" data-id="${item.id}">Remove</button>
    `;
    cartList.appendChild(li);
  });
  cartTotalEl.textContent = total.toFixed(2);

  const hasItems = cart.length > 0;
  checkout.setAttribute('aria-disabled', hasItems ? 'false' : 'true');
  clearCartBtn.setAttribute('aria-disabled', hasItems ? 'false' : 'true');
}
updateCartUI();

// product add buttons (uses event delegation)
document.addEventListener('click', (e) => {
  if (e.target.matches('.add-btn')) {
    const btn = e.target;
    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const price = btn.dataset.price;
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty += 1;
    else cart.push({ id, name, price: Number(price), qty: 1 });
    updateCartUI();
    showToast(`${name} added to cart`);
  }
});

// open/close cart
function openCart() {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden','false');
  overlay.classList.remove('hidden');
}
function closeCartFn() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden','true');
  overlay.classList.add('hidden');
}
cartBtn?.addEventListener('click', openCart);
closeCart?.addEventListener('click', closeCartFn);
overlay?.addEventListener('click', () => {
  closeCartFn();
  closeLoginFn();
});

// remove item (event delegation)
cartList.addEventListener('click', (e) => {
  if (e.target.matches('.remove')) {
    const id = e.target.dataset.id;
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
    showToast('Item removed');
  }
});

// clear cart
clearCartBtn.addEventListener('click', () => {
  cart = [];
  updateCartUI();
  showToast('Cart cleared');
});

// checkout (guarded)
checkout.addEventListener('click', (e) => {
  if (cart.length === 0) {
    e.preventDefault();
    showToast('Your cart is empty.');
    return;
  }
  showToast('Checkout successful (demo).');
  cart = [];
  updateCartUI();
  closeCartFn();
});

// keyboard escape closes cart/login
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCartFn();
    closeLoginFn();
  }
});

// LOGIN drawer controls
function openLogin() {
  loginDrawer.classList.add('open');
  loginDrawer.setAttribute('aria-hidden','false');
  overlay.classList.remove('hidden');
}
function closeLoginFn() {
  loginDrawer.classList.remove('open');
  loginDrawer.setAttribute('aria-hidden','true');
  if (!cartDrawer.classList.contains('open')) overlay.classList.add('hidden');
}
loginBtn?.addEventListener('click', () => {
  if (loggedIn) {
    loggedIn = false;
    loginBtn.textContent = 'Login';
    showToast('Logged out');
    moreOptionsSection.style.display = 'none';
    extendedGrid.innerHTML = '';
    extendedLoaded = false;
    return;
  }
  openLogin();
});
closeLogin?.addEventListener('click', closeLoginFn);

// handle login form (demo)
loginForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value.trim();
  if (!email || !pass) {
    showToast('Enter email and password.');
    return;
  }
  loggedIn = true;
  loginBtn.textContent = 'Logout';
  closeLoginFn();
  showToast('Signed in');
  showExtendedProducts();
  document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
});

// showExtendedProducts: appends more products and reveals options section
function showExtendedProducts() {
  if (extendedLoaded) return;
  moreOptionsSection.style.display = 'block';
  const extras = [
    { id: '4', name: 'Sushi Cat Plush', price: 24.99, img: 'https://via.placeholder.com/400x240?text=Plush' },
    { id: '5', name: 'Anime Beanie', price: 18.00, img: 'https://via.placeholder.com/400x240?text=Beanie' },
    { id: '6', name: 'Chibi Keychain Set', price: 9.50, img: 'https://via.placeholder.com/400x240?text=Keychain' },
    { id: '7', name: 'Limited Figure', price: 89.99, img: 'https://via.placeholder.com/400x240?text=Limited+Figure' },
    { id: '8', name: 'Ramen Bowl (Ceramic)', price: 29.99, img: 'https://via.placeholder.com/400x240?text=Ramen+Bowl' },
    { id: '9', name: 'Poster Mega Pack', price: 19.99, img: 'https://via.placeholder.com/400x240?text=Mega+Poster+Pack' }
  ];
  extras.forEach(p => {
    const art = document.createElement('article');
    art.className = 'card';
    art.dataset.id = p.id;
    art.dataset.name = p.name;
    art.dataset.price = p.price;
    art.innerHTML = `
      <img class="thumb" src="${p.img}" alt="${p.name}">
       <h3>${p.name}</h3>
       <p class="muted">Special item in our catalog.</p>
       <div class="card-footer">
         <span class="price">$${Number(p.price).toFixed(2)}</span>
         <button class="btn add-btn" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">Add to cart</button>
       </div>
     `;
    extendedGrid.appendChild(art);
  });
  extendedLoaded = true;

  const sortSelect = document.getElementById('sortSelect');
  sortSelect?.addEventListener('change', () => {
    const nodes = Array.from(extendedGrid.children);
    if (sortSelect.value === 'price-low') nodes.sort((a,b) => a.dataset.price - b.dataset.price);
    else if (sortSelect.value === 'price-high') nodes.sort((a,b) => b.dataset.price - a.dataset.price);
    else nodes.sort((a,b) => a.dataset.id - b.dataset.id);
    extendedGrid.innerHTML = '';
    nodes.forEach(n => extendedGrid.appendChild(n));
  });

  document.getElementById('opt-figures')?.addEventListener('change', (e) => {
    toggleFilter('Figure', e.target.checked);
  });
  document.getElementById('opt-apparel')?.addEventListener('change', (e) => {
    toggleFilter('Hoodie|Beanie', e.target.checked);
  });
  document.getElementById('opt-posters')?.addEventListener('change', (e) => {
    toggleFilter('Poster|Pack', e.target.checked);
  });
}

function toggleFilter(keywordRegex, checked) {
  const regex = new RegExp(keywordRegex, 'i');
  Array.from(extendedGrid.children).forEach(card => {
    const title = card.querySelector('h3')?.textContent || '';
    if (regex.test(title)) {
      card.style.display = checked ? '' : 'none';
    }
  });
}