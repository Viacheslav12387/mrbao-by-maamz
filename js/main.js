// MR BAO by Maamz — interaktywność wspólna dla wszystkich podstron
(function () {
  'use strict';

  const DAYS = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
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
      const label = d === 0 ? 'dziś' : d === 1 ? 'jutro' : DAYS[day].toLowerCase();
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
      el.querySelector('.txt').textContent = isOpen() ? `Otwarte do ${h[1]}:00` : 'Teraz zamknięte, zamówisz na później';
    });
    const hours = $('#hours');
    if (hours) {
      hours.innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => {
        const h = MRBAO.hours[d];
        return `<div class="${d === day ? 'today' : ''}"><span>${DAYS[d]}</span><span class="price">${h ? `${h[0]}:00–${h[1]}:00` : 'zamknięte'}</span></div>`;
      }).join('');
    }
  }
  renderStatus();
  setInterval(renderStatus, 60000);

  /* ---------- karty dań ---------- */
  function cardHtml(item) {
    const sauce = item.sauce
      ? `<label class="sauce">Sos<select data-sauce="${item.id}">${MRBAO.sauces.map((s) => `<option>${s}</option>`).join('')}</select></label>`
      : '';
    const photo = item.img
      ? `<button type="button" class="card-photo" data-zoom="${item.id}" aria-label="Powiększ zdjęcie: ${esc(item.name)}"><img src="${imgSrc(item.img)}" width="900" height="900" alt="${esc(item.name)}" loading="lazy"></button>`
      : `<div class="card-photo no-photo"><img src="images/logo.webp" width="170" height="170" alt="" loading="lazy"><span>Zdjęcie wkrótce</span></div>`;
    return `<article class="card" data-name="${esc(item.name.toLowerCase())} ${esc((item.desc || '').toLowerCase())}">
      ${photo}
      <div class="card-body">
        <h3>${esc(item.name)}</h3>
        <p class="desc">${esc(item.desc || '')}</p>
        ${sauce}
        <div class="card-foot"><span class="price">${zl(item.price)}</span>
          <button type="button" class="add-btn" data-add="${item.id}" aria-label="Dodaj ${esc(item.name)} do koszyka">Dodaj</button></div>
      </div></article>`;
  }

  const featured = $('#featured');
  if (featured) featured.innerHTML = MRBAO.featured.map((id) => cardHtml(ITEMS[id])).join('');

  const menuList = $('#menuList');
  if (menuList) {
    $('#tabs').innerHTML = MRBAO.menu.map((c) => `<a href="#cat-${c.id}" data-tab="cat-${c.id}">${c.name}</a>`).join('');
    menuList.innerHTML = MRBAO.menu.map((c) => {
      const inner = c.type === 'cards'
        ? `<div class="cards">${c.items.map(cardHtml).join('')}</div>`
        : `<ul class="list">${c.items.map((i) => `<li data-name="${esc(i.name.toLowerCase())}"><span class="name">${esc(i.name)}</span><span class="r"><span class="price">${zl(i.price)}</span><button type="button" class="add-btn" data-add="${i.id}" aria-label="Dodaj ${esc(i.name)} do koszyka">Dodaj</button></span></li>`).join('')}</ul>`;
      return `<section class="cat" id="cat-${c.id}"><div class="cat-head"><h2>${c.name}</h2>${c.note ? `<span>${c.note}</span>` : ''}</div>${inner}</section>`;
    }).join('') + '<p class="no-results" id="noResults" hidden>Nie znaleźliśmy takiego dania. Spróbuj innej nazwy.</p>';

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
  lightbox.innerHTML = '<button type="button" class="x" aria-label="Zamknij zdjęcie">×</button><figure><img src="" alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(lightbox);
  function openLightbox(id) {
    const item = ITEMS[id];
    $('img', lightbox).src = imgSrc(item.img);
    $('img', lightbox).alt = item.name;
    $('figcaption', lightbox).textContent = `${item.name} · ${zl(item.price)}`;
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
    <aside class="drawer" id="drawer" aria-label="Koszyk" aria-hidden="true">
      <div class="drawer-head"><h2>Twoje zamówienie</h2><button type="button" class="x" id="closeCart" aria-label="Zamknij koszyk">×</button></div>
      <div class="drawer-body" id="cartBody"></div>
      <div class="drawer-foot" id="cartFoot"></div>
    </aside>`);

  const totals = () => state.lines.reduce((t, l) => ({ sum: t.sum + ITEMS[l.id].price * l.qty, count: t.count + l.qty }), { sum: 0, count: 0 });
  function message() {
    const t = totals();
    const rows = state.lines.map((l) => `${l.qty}× ${ITEMS[l.id].name}${l.sauce ? ` (sos: ${l.sauce})` : ''} – ${zl(ITEMS[l.id].price * l.qty)}`);
    return [
      'Dzień dobry! Zamówienie ze strony MR BAO:', '', ...rows, '',
      `Razem: ${zl(t.sum)}`,
      `Odbiór: Wolska 50A / lokal 14, ${state.time || '[godzina]'}`,
      `Imię: ${state.name.trim() || '[imię]'}`,
      `Płatność: ${state.pay === 'blik' ? 'BLIK z góry' : 'przy odbiorze'}`,
      ...(state.notes.trim() ? [`Uwagi: ${state.notes.trim()}`] : []),
    ].join('\n');
  }
  const waHref = () => `https://wa.me/${MRBAO.whatsapp}?text=${encodeURIComponent(message())}`;

  function renderBadges(bump) {
    const t = totals();
    $$('.cart-badge').forEach((b) => {
      b.textContent = t.count;
      if (bump) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
    });
    const fab = $('#fab');
    fab.hidden = t.count === 0;
    $('#fabCount').textContent = `Koszyk · ${t.count} szt.`;
    $('#fabSum').textContent = zl(t.sum);
  }

  function renderCart() {
    renderBadges(false);
    const t = totals();
    const body = $('#cartBody');
    const foot = $('#cartFoot');
    if (!t.count) {
      body.innerHTML = '<p class="empty">Koszyk jest pusty. Dodaj dania z menu przyciskiem „Dodaj”.</p>';
      foot.innerHTML = '<a class="btn btn-accent" href="menu.html">Przejdź do menu</a>';
      return;
    }
    const slots = pickupSlots();
    if (!state.time || !slots.includes(state.time)) state.time = slots[0] || '';
    const nameErr = state.showErr && !state.name.trim();
    body.innerHTML = `
      <ul class="lines">${state.lines.map((l, ix) => {
        const i = ITEMS[l.id];
        return `<li>${i.img ? `<img class="thumb" src="${imgSrc(i.img)}" alt="">` : '<span class="thumb blank"></span>'}
          <span class="nm">${esc(i.name)}${l.sauce ? `<small>sos: ${esc(l.sauce)}</small>` : ''}</span>
          <span class="price">${zl(i.price * l.qty)}</span>
          <span class="stepper"><button type="button" data-dec="${ix}" aria-label="Usuń jedną sztukę">−</button><span>${l.qty}</span><button type="button" data-inc="${ix}" aria-label="Dodaj jedną sztukę">+</button></span></li>`;
      }).join('')}</ul>
      <div class="totals"><div><span>Liczba pozycji</span><span class="price">${t.count}</span></div><div class="sum"><span>Do zapłaty</span><span class="price">${zl(t.sum)}</span></div></div>
      <p class="note">Odbiór osobisty: Wolska 50A / lokal 14. Zamówienia na wynos pon–sob 12:00–21:30.</p>
      <div class="field"><label for="f-name">Imię</label><input id="f-name" autocomplete="given-name" placeholder="np. Kasia" value="${esc(state.name)}">${nameErr ? '<span class="err">Wpisz imię, żeby lokal wiedział, dla kogo jest zamówienie.</span>' : ''}</div>
      <div class="field"><label for="f-time">Godzina odbioru</label><select id="f-time">${slots.map((s) => `<option${s === state.time ? ' selected' : ''}>${s}</option>`).join('')}</select></div>
      <fieldset class="pay"><legend class="legend">Płatność</legend>
        <label><input type="radio" name="pay" value="blik"${state.pay === 'blik' ? ' checked' : ''}>BLIK z góry<small>numer podamy w odpowiedzi</small></label>
        <label><input type="radio" name="pay" value="odbior"${state.pay === 'odbior' ? ' checked' : ''}>Przy odbiorze<small>gotówka lub karta</small></label></fieldset>
      <div class="field"><label for="f-notes">Uwagi (opcjonalnie)</label><textarea id="f-notes" placeholder="np. bez kolendry">${esc(state.notes)}</textarea></div>
      <details class="preview"><summary>Podgląd wiadomości do lokalu</summary><pre class="msg" id="msg">${esc(message())}</pre></details>`;
    foot.innerHTML = `<a class="btn btn-green send" id="send" target="_blank" rel="noopener" href="${waHref()}"${state.name.trim() ? '' : ' aria-disabled="true"'}>Wyślij zamówienie przez WhatsApp</a>
      <p class="note" style="text-align:center">Zamówienie trafi do lokalu po kliknięciu „Wyślij” w WhatsAppie. Lokal potwierdzi kwotę i czas odbioru.</p>`;
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
    btn.textContent = 'Dodano ✓';
    setTimeout(() => { btn.classList.remove('is-added'); btn.textContent = 'Dodaj'; }, 1400);
    showToast(`${ITEMS[id].name} w koszyku · razem ${zl(totals().sum)}`);
  }

  /* ---------- kopiowanie numeru i e-maila ---------- */
  function copyText(btn) {
    const text = btn.dataset.copy;
    const done = () => { const old = btn.textContent; btn.textContent = 'Skopiowano'; setTimeout(() => { btn.textContent = old; }, 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => showToast('Zaznacz tekst i skopiuj ręcznie'));
    } else {
      showToast('Zaznacz tekst i skopiuj ręcznie');
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
