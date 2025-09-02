/* global XMLHttpRequest */
/* exported sendMessage, openModal, closeModal, sendOrder, openAbout, closeAbout */

let products = [];

/* ---------- بارگذاری CSV ساده ---------- */
fetch('data/products.csv')
  .then(r => r.text())
  .then(t => {
    const lines = t.trim().split('\n').slice(1); // حذف هدر
    products = lines.map(l => l.split(',').map(s => s.trim()));
  });

/* ---------- بارگذاری متن درباره‌ما ---------- */
fetch('data/about.txt')
  .then(r => r.text())
  .then(t => { document.getElementById('about-content').textContent = t; });

/* ---------- چت ---------- */
function appendChat(role, html) {
  const box = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = role;
  div.innerHTML = window.DOMPurify
    ? window.DOMPurify.sanitize(html, { ADD_ATTR: ['onclick'] })
    : html;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

/* ---------- ارسال پیام ---------- */
function sendMessage() {
  const inp = document.getElementById('chat-input');
  const q = inp.value.trim().toLowerCase();
  if (!q) return;
  appendChat('user', `<b>شما:</b> ${inp.value}`);
  inp.value = '';

  const found = products.filter(r => r[0] && r[0].toLowerCase().includes(q));
  if (found.length) {
    found.forEach(r => {
      const [name, desc, price, img] = r;
      appendChat('bot', `
        <div class="flex items-start gap-3">
          ${img ? `<img src="${img}" class="w-16 h-16 object-cover rounded">` : ''}
          <div>
            <b>${name}</b><br>${desc}<br>
            <span class="text-purple-600 font-bold">${price}</span>
            <button onclick="openModal('${name}','${desc}','${price}','${img || ''}')">سفارش</button>
          </div>
        </div>
      `);
    });
  } else {
    appendChat('bot', 'محصولی یافت نشد. لطفاً با ۰۹۳۷۰۷۶۹۱۹۱ یا ۰۹۹۲۱۳۵۲۰۸۸ تماس بگیرید.');
  }
}

/* ---------- مودال ---------- */
function openModal(n, d, p, i) {
  document.getElementById('modal-content').innerHTML = `
    ${i ? `<img src="${i}" class="w-full rounded mb-2">` : ''}
    <h3 class="text-lg font-bold">${n}</h3>
    <p class="text-sm">${d}</p>
    <p class="text-purple-600 font-bold">${p}</p>
  `;
  document.getElementById('product-modal').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('product-modal').classList.add('hidden');
}

/* ---------- ارسال سفارش ---------- */
function sendOrder(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const platform = document.getElementById('platform').value;
  const text = `سفارش جدید
نام: ${fd.get('name')}
تلفن: ${fd.get('phone')}
شهر: ${fd.get('city')}
محصول: ${fd.get('product')}`;
  const phones = ['989370769191', '989921352088'];
  switch (platform) {
    case 'wa':
      phones.forEach(n => window.open(`https://wa.me/${n}?text=${encodeURIComponent(text)}`, '_blank'));
      break;
    case 'tg':
      window.open(`https://t.me/SilinderAlaviBot?start=${encodeURIComponent(text)}`, '_blank');
      break;
    case 'rub':
      window.open(`rubika://sendmessage?text=${encodeURIComponent(text)}&phone=989370769191`, '_blank');
      break;
  }
}

/* ---------- مودال درباره ما ---------- */
function openAbout() {
  document.getElementById('about-modal').classList.remove('hidden');
}
function closeAbout() {
  document.getElementById('about-modal').classList.add('hidden');
}