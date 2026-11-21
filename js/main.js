// MR BAO by Maamz — interaktywność wspólna dla wszystkich podstron
(function () {
  'use strict';

  const DAYS = t('days');
  const EN = window.LANG === 'en';
  const nameOf = (i) => (EN && MENU_EN.names[i.id]) || i.name;
  const descOf = (i) => (EN && MENU_EN.desc[i.id]) || i.desc || '';
  const sauceLabel = (s) => (EN && MENU_EN.sauces[s]) || s;
  const ITEMS = {};
  MRBAO.menu.forEach((c) => c.items.forEach((i) => { ITEMS[i.id] = i; }));

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const zl = (n) => `${n} zł`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const imgSrc = (name) => `images/${name}.webp`;

  /* ---------- czas w Warszawie ---------- */
  function warsawNow() {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Warsaw', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')), mins: (Number(get('hour')) % 24) * 60 + Number(get('minute')) };
  }
  const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  function isOpen() {
    const { day, mins } = warsawNow();
    const h = MRBAO.hours[day];
    return Boolean(h) && mins >= h[0] * 60 && mins < h[1] * 60;
  }
  function pickupSlots() {
    const now = warsawNow();
    const out = [];
    for (let d = 0; d < 8 && out.length === 0; d += 1) {
      const day = (now.day + d) % 7;
      const h = MRBAO.hours[day];
      if (!h) continue;
      let start = h[0] * 60 + 30;
      if (d === 0) start = Math.max(start, Math.ceil((now.mins + 30) / 15) * 15);
      const label = d === 0 ? t('today') : d === 1 ? t('tomorrow') : DAYS[day].toLowerCase();
      for (let m = start; m <= MRBAO.lastOrder; m += 15) out.push(`${label} ${hhmm(m)}`);
    }
    return out;
  }

  /* ---------- nagłówek, menu mobilne, przycisk do góry ---------- */
  const header = $('.header');
  const toTop = $('.to-top');
  const heroBg = $('.hero-bg');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 20);
    if (toTop) toTop.classList.toggle('is-visible', y > 600);
    if (heroBg && !reduceMotion) heroBg.style.transform = `scale(1.08) translateY(${Math.min(y * 0.25, 160)}px)`;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  const burger = $('.burger');
  const nav = $('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- status „otwarte” i godziny ---------- */
  function renderStatus() {
    const { day } = warsawNow();
    $$('[data-status]').forEach((el) => {
      const h = MRBAO.hours[day];
      el.classList.toggle('is-open', isOpen());
      el.querySelector('.txt').textContent = isOpen() ? `${t('openUntil')} ${h[1]}:00` : t('closedNow');
    });
    const hours = $('#hours');
    if (hours) {
      hours.innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => {
        const h = MRBAO.hours[d];
        return `<div class="${d === day ? 'today' : ''}"><span>${DAYS[d]}</span><span class="price">${h ? `${h[0]}:00–${h[1]}:00` : t('closed')}</span></div>`;
      }).join('');
    }
  }
  renderStatus();
  setInterval(renderStatus, 60000);

  /* ---------- karty dań ---------- */
  function cardHtml(item) {
    const sauce = item.sauce
      ? `<label class="sauce">${t('sauce')}<select data-sauce="${item.id}">${MRBAO.sauces.map((s) => `<option value="${s}">${sauceLabel(s)}</option>`).join('')}</select></label>`
      : '';
    const photo = item.img
      ? `<button type="button" class="card-photo" data-zoom="${item.id}" aria-label="${t('zoom')}: ${esc(nameOf(item))}"><img src="${imgSrc(item.img)}" width="900" height="900" alt="${esc(nameOf(item))}" loading="lazy"></button>`
      : `<div class="card-photo no-photo"><img src="images/logo.webp" width="170" height="170" alt="" loading="lazy"><span>${t('noPhoto')}</span></div>`;
    return `<article class="card" data-name="${esc(nameOf(item).toLowerCase())} ${esc(descOf(item).toLowerCase())} ${esc(item.name.toLowerCase())}">
      ${photo}
      <div class="card-body">
        <h3>${esc(nameOf(item))}</h3>
        <p class="desc">${esc(descOf(item))}</p>
        ${sauce}
        <div class="card-foot"><span class="price">${zl(item.price)}</span>
          <button type="button" class="add-btn" data-add="${item.id}" aria-label="${t('add')} ${esc(nameOf(item))} ${t('addToCart')}">${t('add')}</button></div>
      </div></article>`;
  }

  const featured = $('#featured');
  if (featured) featured.innerHTML = MRBAO.featured.map((id) => cardHtml(ITEMS[id])).join('');

  const menuList = $('#menuList');
  if (menuList) {
    $('#tabs').innerHTML = MRBAO.menu.map((c) => `<a href="#cat-${c.id}" data-tab="cat-${c.id}">${EN ? MENU_EN.categories[c.id][0] : c.name}</a>`).join('');
    menuList.innerHTML = MRBAO.menu.map((c) => {
      const inner = c.type === 'cards'
        ? `<div class="cards">${c.items.map(cardHtml).join('')}</div>`
        : `<ul class="list">${c.items.map((i) => `<li data-name="${esc(nameOf(i).toLowerCase())} ${esc(i.name.toLowerCase())}"><span class="name">${esc(nameOf(i))}</span><span class="r"><span class="price">${zl(i.price)}</span><button type="button" class="add-btn" data-add="${i.id}" aria-label="${t('add')} ${esc(nameOf(i))} ${t('addToCart')}">${t('add')}</button></span></li>`).join('')}</ul>`;
      return `<section class="cat" id="cat-${c.id}"><div class="cat-head"><h2>${EN ? MENU_EN.categories[c.id][0] : c.name}</h2>${(EN ? MENU_EN.categories[c.id][1] : c.note) ? `<span>${EN ? MENU_EN.categories[c.id][1] : c.note}</span>` : ''}</div>${inner}</section>`;
    }).join('') + `<p class="no-results" id="noResults" hidden>${t('noResults')}</p>`;

    // aktywna zakładka przy przewijaniu
    const tabs = $$('[data-tab]');
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.tab === e.target.id));
        const active = tabs.find((t) => t.dataset.tab === e.target.id);
        if (active) active.scrollIntoView({ block: 'nearest', inline: 'center' });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('.cat').forEach((s) => spy.observe(s));

    // wyszukiwarka
    const search = $('#search');
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      let any = false;
      $$('.cat').forEach((cat) => {
        let visible = 0;
        $$('.card, .list li', cat).forEach((el) => {
          const show = !q || el.dataset.name.includes(q);
          el.hidden = !show;
          if (show) visible += 1;
        });
        cat.hidden = visible === 0;
        if (visible) any = true;
      });
      $('#noResults').hidden = any;
    });
  }

  /* ---------- toast ---------- */
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  let toastTimer;
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2000);
  }

  /* ---------- lightbox ---------- */
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.hidden = true;
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.innerHTML = `<button type="button" class="x" aria-label="${t('closePhoto')}">×</button><figure><img src="" alt=""><figcaption></figcaption></figure>`;
  document.body.appendChild(lightbox);
  function openLightbox(id) {
    const item = ITEMS[id];
    $('img', lightbox).src = imgSrc(item.img);
    $('img', lightbox).alt = nameOf(item);
    $('figcaption', lightbox).textContent = `${nameOf(item)} · ${zl(item.price)}`;
    lightbox.hidden = false;
    $('.x', lightbox).focus();
  }
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox || e.target.closest('.x')) lightbox.hidden = true; });

  /* ---------- koszyk ---------- */
  const state = { lines: [], name: '', time: '', pay: 'blik', notes: '', showErr: false };
  try {
    const saved = JSON.parse(localStorage.getItem('mrbao-cart') || 'null');
    if (saved && Array.isArray(saved.lines)) state.lines = saved.lines.filter((l) => ITEMS[l.id]);
  } catch (e) { /* brak dostępu do pamięci przeglądarki */ }
  const persist = () => { try { localStorage.setItem('mrbao-cart', JSON.stringify({ lines: state.lines })); } catch (e) { /* ignoruj */ } };

  document.body.insertAdjacentHTML('beforeend', `
    <button type="button" class="fab" id="fab" data-open-cart hidden><span id="fabCount"></span><span class="price" id="fabSum"></span></button>
    <div class="backdrop" id="backdrop"></div>
    <aside class="drawer" id="drawer" aria-label="${t('cart')}" aria-hidden="true">
      <div class="drawer-head"><h2>${t('yourOrder')}</h2><button type="button" class="x" id="closeCart" aria-label="${t('closeCart')}">×</button></div>
      <div class="drawer-body" id="cartBody"></div>
      <div class="drawer-foot" id="cartFoot"></div>
    </aside>`);

  const totals = () => state.lines.reduce((t, l) => ({ sum: t.sum + ITEMS[l.id].price * l.qty, count: t.count + l.qty }), { sum: 0, count: 0 });
  function message() {
    const tot = totals();
    const rows = state.lines.map((l) => `${l.qty}× ${nameOf(ITEMS[l.id])}${l.sauce ? ` (${t('msgSauce')}: ${sauceLabel(l.sauce)})` : ''} – ${zl(ITEMS[l.id].price * l.qty)}`);
    return [
      t('msgHello'), '', ...rows, '',
      `${t('msgTotal')}: ${zl(tot.sum)}`,
      `${t('msgPickup')}, ${state.time || t('time')}`,
      `${t('msgName')}: ${state.name.trim() || t('nameMissing')}`,
      `${t('msgPay')}: ${state.pay === 'blik' ? t('msgBlik') : t('msgAtPickup')}`,
      ...(state.notes.trim() ? [`${t('msgNotes')}: ${state.notes.trim()}`] : []),
    ].join('\n');
  }
  const waHref = () => `https://wa.me/${MRBAO.whatsapp}?text=${encodeURIComponent(message())}`;

  function renderBadges(bump) {
    const tot = totals();
    $$('.cart-badge').forEach((b) => {
      b.textContent = tot.count;
      if (bump) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
    });
    const fab = $('#fab');
    fab.hidden = tot.count === 0;
    $('#fabCount').textContent = `${t('cart')} · ${tot.count} ${t('pcs')}`;
    $('#fabSum').textContent = zl(tot.sum);
  }

  function renderCart() {
    renderBadges(false);
    const tot = totals();
    const body = $('#cartBody');
    const foot = $('#cartFoot');
    if (!tot.count) {
      body.innerHTML = `<p class="empty">${t('empty')}</p>`;
      foot.innerHTML = `<a class="btn btn-accent" href="menu.html${EN ? '?lang=en' : ''}">${t('toMenu')}</a>`;
      return;
    }
    const slots = pickupSlots();
    if (!state.time || !slots.includes(state.time)) state.time = slots[0] || '';
    const nameErr = state.showErr && !state.name.trim();
    body.innerHTML = `
      <ul class="lines">${state.lines.map((l, ix) => {
        const i = ITEMS[l.id];
        return `<li>${i.img ? `<img class="thumb" src="${imgSrc(i.img)}" alt="">` : '<span class="thumb blank"></span>'}
          <span class="nm">${esc(nameOf(i))}${l.sauce ? `<small>${t('msgSauce')}: ${esc(sauceLabel(l.sauce))}</small>` : ''}</span>
          <span class="price">${zl(i.price * l.qty)}</span>
          <span class="stepper"><button type="button" data-dec="${ix}" aria-label="${t('removeOne')}">−</button><span>${l.qty}</span><button type="button" data-inc="${ix}" aria-label="${t('addOne')}">+</button></span></li>`;
      }).join('')}</ul>
      <div class="totals"><div><span>${t('items')}</span><span class="price">${tot.count}</span></div><div class="sum"><span>${t('total')}</span><span class="price">${zl(tot.sum)}</span></div></div>
      <p class="note">${t('pickupInfo')}</p>
      <div class="field"><label for="f-name">${t('name')}</label><input id="f-name" autocomplete="given-name" placeholder="${t('namePh')}" value="${esc(state.name)}">${nameErr ? `<span class="err">${t('nameErr')}</span>` : ''}</div>
      <div class="field"><label for="f-time">${t('pickupTime')}</label><select id="f-time">${slots.map((s) => `<option${s === state.time ? ' selected' : ''}>${s}</option>`).join('')}</select></div>
      <fieldset class="pay"><legend class="legend">${t('payment')}</legend>
        <label><input type="radio" name="pay" value="blik"${state.pay === 'blik' ? ' checked' : ''}>${t('blik')}<small>${t('blikNote')}</small></label>
        <label><input type="radio" name="pay" value="odbior"${state.pay === 'odbior' ? ' checked' : ''}>${t('atPickup')}<small>${t('atPickupNote')}</small></label></fieldset>
      <div class="field"><label for="f-notes">${t('notes')}</label><textarea id="f-notes" placeholder="${t('notesPh')}">${esc(state.notes)}</textarea></div>
      <details class="preview"><summary>${t('preview')}</summary><pre class="msg" id="msg">${esc(message())}</pre></details>`;
    foot.innerHTML = `<a class="btn btn-green send" id="send" target="_blank" rel="noopener" href="${waHref()}"${state.name.trim() ? '' : ' aria-disabled="true"'}>${t('send')}</a>
      <p class="note" style="text-align:center">${t('sendNote')}</p>`;
  }
  function refreshMessage() {
    const m = $('#msg');
    if (m) m.textContent = message();
    const s = $('#send');
    if (s) {
      s.href = waHref();
      if (state.name.trim()) s.removeAttribute('aria-disabled'); else s.setAttribute('aria-disabled', 'true');
    }
  }

  let lastFocus = null;
  function openCart(open) {
    if (open) renderCart();
    $('#drawer').classList.toggle('is-open', open);
    $('#drawer').setAttribute('aria-hidden', String(!open));
    $('#backdrop').classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { lastFocus = document.activeElement; setTimeout(() => $('#closeCart').focus(), 60); } else if (lastFocus) lastFocus.focus();
  }

  function addItem(id, btn) {
    const card = btn.closest('.card');
    const select = card ? $(`[data-sauce="${id}"]`, card) : null;
    const sauce = select ? select.value : null;
    const line = state.lines.find((l) => l.id === id && l.sauce === sauce);
    if (line) line.qty += 1; else state.lines.push({ id, sauce, qty: 1 });
    persist();
    renderBadges(true);
    btn.classList.add('is-added');
    btn.textContent = t('added');
    setTimeout(() => { btn.classList.remove('is-added'); btn.textContent = t('add'); }, 1400);
    showToast(`${nameOf(ITEMS[id])} ${t('inCart')} ${zl(totals().sum)}`);
  }

  /* ---------- kopiowanie numeru i e-maila ---------- */
  function copyText(btn) {
    const text = btn.dataset.copy;
    const done = () => { const old = btn.textContent; btn.textContent = t('copied'); setTimeout(() => { btn.textContent = old; }, 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => showToast(t('copyManual')));
    } else {
      showToast(t('copyManual'));
    }
  }

  /* ---------- zdarzenia ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target;
    const add = t.closest('[data-add]');
    if (add) { addItem(add.dataset.add, add); return; }
    const zoom = t.closest('[data-zoom]');
    if (zoom) { openLightbox(zoom.dataset.zoom); return; }
    const inc = t.closest('[data-inc]');
    if (inc) { state.lines[Number(inc.dataset.inc)].qty += 1; persist(); renderCart(); return; }
    const dec = t.closest('[data-dec]');
    if (dec) {
      const ix = Number(dec.dataset.dec);
      state.lines[ix].qty -= 1;
      if (state.lines[ix].qty <= 0) state.lines.splice(ix, 1);
      persist(); renderCart(); return;
    }
    if (t.closest('[data-open-cart]')) { openCart(true); return; }
    if (t.closest('#closeCart') || t.id === 'backdrop') { openCart(false); return; }
    const copy = t.closest('[data-copy]');
    if (copy) { copyText(copy); return; }
    const send = t.closest('#send');
    if (send && !state.name.trim()) {
      e.preventDefault();
      state.showErr = true;
      renderCart();
      $('#f-name').focus();
    }
  });
  document.addEventListener('input', (e) => {
    if (e.target.id === 'f-name') {
      state.name = e.target.value;
      if (state.showErr && state.name.trim()) { state.showErr = false; const er = e.target.parentNode.querySelector('.err'); if (er) er.remove(); }
      refreshMessage();
    }
    if (e.target.id === 'f-notes') { state.notes = e.target.value; refreshMessage(); }
  });
  document.addEventListener('change', (e) => {
    if (e.target.id === 'f-time') { state.time = e.target.value; refreshMessage(); }
    if (e.target.name === 'pay') { state.pay = e.target.value; refreshMessage(); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!lightbox.hidden) { lightbox.hidden = true; return; }
    openCart(false);
  });

  renderBadges(false);
})();
