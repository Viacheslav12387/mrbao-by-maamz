// Wersje językowe PL / EN. Język: ?lang=en w adresie, potem zapamiętany wybór, domyślnie polski.
(function () {
  'use strict';

  let lang = 'pl';
  try {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl === 'en' || fromUrl === 'pl') localStorage.setItem('mrbao-lang', fromUrl);
    lang = localStorage.getItem('mrbao-lang') || 'pl';
  } catch (e) {
    lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'pl';
  }
  if (lang !== 'en') lang = 'pl';
  window.LANG = lang;
  document.documentElement.lang = lang;

  // teksty używane w js/main.js
  const T = {
    pl: {
      days: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
      openUntil: 'Otwarte do', closedNow: 'Teraz zamknięte, zamówisz na później', closed: 'zamknięte',
      today: 'dziś', tomorrow: 'jutro', sauce: 'Sos', zoom: 'Powiększ zdjęcie', add: 'Dodaj', added: 'Dodano ✓',
      addToCart: 'do koszyka', noPhoto: 'Zdjęcie wkrótce', noResults: 'Nie znaleźliśmy takiego dania. Spróbuj innej nazwy.',
      closePhoto: 'Zamknij zdjęcie', cart: 'Koszyk', pcs: 'szt.', yourOrder: 'Twoje zamówienie', closeCart: 'Zamknij koszyk',
      empty: 'Koszyk jest pusty. Dodaj dania z menu przyciskiem „Dodaj”.', toMenu: 'Przejdź do menu',
      items: 'Liczba pozycji', total: 'Do zapłaty', pickupInfo: 'Odbiór osobisty: Wolska 50A / lokal 14. Zamówienia na wynos pon–sob 12:00–21:30.',
      name: 'Imię', namePh: 'np. Kasia', nameErr: 'Wpisz imię, żeby lokal wiedział, dla kogo jest zamówienie.',
      pickupTime: 'Godzina odbioru', payment: 'Płatność', blik: 'BLIK z góry', blikNote: 'numer podamy w odpowiedzi',
      atPickup: 'Przy odbiorze', atPickupNote: 'gotówka lub karta', notes: 'Uwagi (opcjonalnie)', notesPh: 'np. bez kolendry',
      preview: 'Podgląd wiadomości do lokalu', send: 'Wyślij zamówienie przez WhatsApp',
      sendNote: 'Zamówienie trafi do lokalu po kliknięciu „Wyślij” w WhatsAppie. Lokal potwierdzi kwotę i czas odbioru.',
      removeOne: 'Usuń jedną sztukę', addOne: 'Dodaj jedną sztukę', inCart: 'w koszyku · razem', copied: 'Skopiowano',
      copyManual: 'Zaznacz tekst i skopiuj ręcznie',
      msgHello: 'Dzień dobry! Zamówienie ze strony MR BAO:', msgTotal: 'Razem', msgPickup: 'Odbiór: Wolska 50A / lokal 14',
      msgName: 'Imię', msgPay: 'Płatność', msgBlik: 'BLIK z góry', msgAtPickup: 'przy odbiorze', msgNotes: 'Uwagi',
      msgSauce: 'sos', time: '[godzina]', nameMissing: '[imię]',
    },
    en: {
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      openUntil: 'Open until', closedNow: 'Closed now, you can order for later', closed: 'closed',
      today: 'today', tomorrow: 'tomorrow', sauce: 'Sauce', zoom: 'Enlarge photo', add: 'Add', added: 'Added ✓',
      addToCart: 'to cart', noPhoto: 'Photo coming soon', noResults: 'No dish found. Try another name.',
      closePhoto: 'Close photo', cart: 'Cart', pcs: 'items', yourOrder: 'Your order', closeCart: 'Close cart',
      empty: 'Your cart is empty. Add dishes from the menu with the “Add” button.', toMenu: 'Go to menu',
      items: 'Items', total: 'Total', pickupInfo: 'Pickup: Wolska 50A / unit 14. Takeaway orders Mon–Sat 12:00–21:30.',
      name: 'Name', namePh: 'e.g. Kate', nameErr: 'Enter your name so we know who the order is for.',
      pickupTime: 'Pickup time', payment: 'Payment', blik: 'BLIK in advance', blikNote: 'we will send the number',
      atPickup: 'At pickup', atPickupNote: 'cash or card', notes: 'Notes (optional)', notesPh: 'e.g. no coriander',
      preview: 'Preview of the message', send: 'Send order on WhatsApp',
      sendNote: 'The order reaches us after you tap “Send” in WhatsApp. We will confirm the total and pickup time.',
      removeOne: 'Remove one', addOne: 'Add one', inCart: 'in cart · total', copied: 'Copied',
      copyManual: 'Select the text and copy it manually',
      msgHello: 'Hello! Order from the MR BAO website:', msgTotal: 'Total', msgPickup: 'Pickup: Wolska 50A / unit 14',
      msgName: 'Name', msgPay: 'Payment', msgBlik: 'BLIK in advance', msgAtPickup: 'at pickup', msgNotes: 'Notes',
      msgSauce: 'sauce', time: '[time]', nameMissing: '[name]',
    },
  };
  window.t = (key) => T[lang][key];

  // menu po angielsku
  window.MENU_EN = {
    categories: {
      bao: ['Bao', 'served with fries · sauce of your choice'],
      bowle: ['Asian poke bowls', 'on jasmine rice'],
      przystawki: ['Starters', ''],
      salatki: ['Salads', ''],
      sosy: ['Sauces', 'extra sauce'],
      napoje: ['Drinks', ''],
    },
    sauces: { 'Majonez Mango': 'Mango mayo', 'Majonez Miodowo-Czosnkowy': 'Honey-garlic mayo', 'Pikantny Majonez': 'Spicy mayo', 'Majonez Ziołowy': 'Herb mayo' },
    names: {
      z4: 'Chicken Gyoza (6 pcs)', z5: 'Pork Gyoza (6 pcs)', z6: 'Panko Chicken with Fries', z7: 'Tempura Shrimp (4 pcs)',
      s1: 'Tofu Crunch Salad', s2: 'Asian Chicken Salad', s3: 'Sesame Beef Salad',
      o1: 'Mango mayo', o2: 'Honey-garlic mayo', o3: 'Spicy mayo', o4: 'Herb mayo',
      n3: 'Still water', n4: 'Sparkling water', n5: 'Coffee',
    },
    desc: {
      b1: 'Steamed bao buns, crispy tofu, cucumber, carrot, fried onion.',
      b2: 'Steamed bao buns, crispy panko chicken, cucumber, carrot, fried onion.',
      b3: 'Steamed bao buns, pulled pork, cucumber, carrot, fried onion.',
      b4: 'Steamed bao buns, crispy shrimp, cucumber, carrot, fried onion.',
      b5: 'Steamed bao buns, duck in tamarind sauce, cucumber, carrot, fried onion.',
      b6: 'Steamed bao buns, beef, cucumber, carrot, fried onion.',
      p1: 'Crispy tofu, jasmine rice, edamame, wakame, avocado, cucumber, white onion, red pepper, house sauce.',
      p2: 'Crispy chicken, jasmine rice, edamame, wakame, avocado, cucumber, white onion, red pepper, house sauce.',
      p3: 'Slow-cooked beef, jasmine rice, edamame, wakame, avocado, cucumber, white onion, red pepper, house sauce.',
      p4: 'Jasmine rice, wakame, avocado, cucumber, mango, boiled egg, cherry tomatoes, sauce of your choice.',
      z1: 'A portion of fries.', z2: 'Fries MR BAO style.', z3: 'Crispy panko chicken bites with sauce.',
      z4: 'Pan-fried chicken gyoza dumplings.', z5: 'Pan-fried pork gyoza dumplings.',
      z6: 'Crispy panko chicken served with fries.', z7: 'Shrimp in crispy tempura.',
      s1: 'Mixed greens, crispy tofu, cucumber, house dressing.',
      s2: 'Mixed greens, crispy panko chicken, cherry tomatoes, cucumber, crunchy coating, honey-garlic dressing.',
      s3: 'Mixed greens, slow-cooked beef, cucumber, house dressing.',
    },
  };

  // stałe teksty na stronach
  const STATIC = {
    '✨ Świeże Bao i azjatycki street food w Warszawie': '✨ Fresh Bao and Asian street food in Warsaw',
    'Strona główna': 'Home', 'O nas': 'About us', 'Kontakt': 'Contact',
    'Sprawdzam godziny…': 'Checking opening hours…',
    'Polecamy': 'Recommended', 'Ulubione dania gości': 'Guests’ favourites',
    'Dodaj do koszyka od razu tutaj albo przejdź do pełnego menu. Kliknij zdjęcie, żeby je powiększyć.': 'Add to cart right here or go to the full menu. Tap a photo to enlarge it.',
    'Całe menu': 'Full menu', 'Zamówienia na wynos': 'Takeaway orders', 'Jak zamówić': 'How to order',
    'Wybierz dania': 'Choose your dishes',
    'Dodaj dania do koszyka. Do bao wybierz sos, koszyk sam policzy sumę.': 'Add dishes to your cart. Pick a sauce for bao, the cart adds up the total.',
    'Wyślij przez WhatsApp': 'Send on WhatsApp',
    'Podaj imię, godzinę odbioru i sposób płatności. Gotowa wiadomość otworzy się w WhatsAppie.': 'Enter your name, pickup time and payment. A ready message opens in WhatsApp.',
    'Odbierz na Wolskiej': 'Pick up on Wolska',
    'Potwierdzimy zamówienie i czas. Zapłacisz BLIK-iem z góry albo przy odbiorze.': 'We confirm your order and time. Pay by BLIK in advance or at pickup.',
    'Adres': 'Address', 'Godziny': 'Hours', 'Poniedziałek – sobota 12:00–22:00': 'Monday – Saturday 12:00–22:00',
    'Zamówienia na wynos do 21:30': 'Takeaway orders until 21:30', 'Wolska 50A / lokal 14': 'Wolska 50A / unit 14',
    '01-187 Warszawa': '01-187 Warsaw', 'Zobacz Menu': 'See the Menu', 'Zobacz menu': 'See the menu',
    'Warszawa Wolska 50A/Lokal 14': 'Warsaw, Wolska 50A/Unit 14',
    '© MR BAO by Maamz · Wolska 50A / lokal 14, 01-187 Warszawa': '© MR BAO by Maamz · Wolska 50A / unit 14, 01-187 Warsaw',
    'Menu MR BAO: bao i poke bowls na Woli': 'MR BAO Menu: Bao & Poke Bowls in Warsaw',
    'Smak, do którego chce się wracać. Wybierz dania, dodaj do koszyka i wyślij zamówienie na wynos przez WhatsApp.': 'A taste you’ll want to come back to. Pick your dishes, add them to the cart and send your takeaway order on WhatsApp.',
    'Nasza historia': 'Our story',
    'Azjatycki street food – Świeże składniki – Wyrazisty smak.': 'Asian street food – Fresh ingredients – Bold flavour.',
    'Azjatyckie inspiracje. Nowoczesne podejście.': 'Asian inspiration. A modern approach.',
    'Mr Bao by Maamz powstało z pasji do wyrazistych azjatyckich smaków, świeżych składników i gotowania z sercem.': 'Mr Bao by Maamz was born out of a passion for bold Asian flavours, fresh ingredients and cooking with heart.',
    'Łączymy charakter azjatyckiego street foodu z nowoczesnym podejściem do kuchni. W naszym menu znajdziesz między innymi autorskie bao, świeże poke bowle, chrupiące przekąski i wyjątkowe, domowe sosy.': 'We combine the character of Asian street food with a modern approach to cooking. Our menu features signature bao, fresh poke bowls, crispy snacks and unique house-made sauces.',
    'Świeże składniki': 'Fresh ingredients', 'Każde danie przygotowujemy na bieżąco.': 'Every dish is made to order.',
    'Wyraziste smaki': 'Bold flavours', 'Autorskie sosy i marynaty.': 'House sauces and marinades.', 'Z pasją': 'With passion',
    'Restauracja na Woli: zapraszamy na MR BAO': 'Restaurant in Wola: welcome to MR BAO',
    'Wpadnij na świeże bao, poke bowle i chrupiącego kurczaka albo zamów na wynos przez stronę.': 'Drop in for fresh bao, poke bowls and crispy chicken, or order takeaway online.',
    'Pokaż na mapie': 'Show on map', 'Telefon i e-mail': 'Phone and e-mail', 'Kopiuj': 'Copy',
    'Napisz na WhatsApp': 'Message us on WhatsApp', 'Godziny otwarcia': 'Opening hours',
    'Zamówienia na wynos przyjmujemy do 21:30.': 'We take takeaway orders until 21:30.',
    'Lokal 14, Wolska 50A: tu odbierzesz zamówienie.': 'Unit 14, Wolska 50A: pick up your order here.',
    'Zamów online': 'Order online',
  };
  const ATTRS = {
    'MR BAO by Maamz, strona główna': 'MR BAO by Maamz, home page', 'Główna nawigacja': 'Main navigation',
    'Otwórz koszyk': 'Open cart', 'Pokaż menu nawigacji': 'Show navigation menu', 'Wróć na górę strony': 'Back to top',
    'Kategorie menu': 'Menu categories', 'Szukaj w menu': 'Search the menu', 'Szukaj, np. kurczak': 'Search, e.g. chicken',
    'Adres i godziny': 'Address and hours', 'Kucharz smaży w woku nad wysokim płomieniem': 'Chef stir-frying in a wok over a high flame',
    'Lada MR BAO z logo lokalu i menu na ścianie': 'MR BAO counter with the logo and the menu on the wall',
  };
  const TITLES = {
    'MR BAO by Maamz – Bao i Poke Bowls, Warszawa Wola': 'MR BAO by Maamz – Bao & Poke Bowls, Warsaw',
    'Menu – MR BAO by Maamz': 'Menu – MR BAO by Maamz', 'O nas – MR BAO by Maamz': 'About us – MR BAO by Maamz',
    'Kontakt – MR BAO by Maamz': 'Contact – MR BAO by Maamz',
  };

  function translatePage() {
    if (lang !== 'en') return;
    if (TITLES[document.title]) document.title = TITLES[document.title];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => {
      const key = n.nodeValue.trim();
      if (STATIC[key]) n.nodeValue = n.nodeValue.replace(key, STATIC[key]);
    });
    document.querySelectorAll('a[href$=".html"]').forEach((a) => { a.setAttribute('href', `${a.getAttribute('href')}?lang=en`); });
    document.querySelectorAll('[aria-label],[placeholder],[alt]').forEach((el) => {
      ['aria-label', 'placeholder', 'alt'].forEach((a) => {
        const v = el.getAttribute(a);
        if (v && ATTRS[v]) el.setAttribute(a, ATTRS[v]);
      });
    });
  }

  function addSwitch() {
    const actions = document.querySelector('.header-actions');
    if (!actions) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lang-btn';
    btn.textContent = lang === 'en' ? 'PL' : 'EN';
    btn.setAttribute('aria-label', lang === 'en' ? 'Zmień język na polski' : 'Switch to English');
    btn.addEventListener('click', () => {
      const next = lang === 'en' ? 'pl' : 'en';
      try { localStorage.setItem('mrbao-lang', next); } catch (e) { /* ignoruj */ }
      const url = new URL(location.href);
      url.searchParams.set('lang', next);
      location.href = url.toString();
    });
    actions.insertBefore(btn, actions.firstChild);
  }

  window.translatePage = translatePage;
  document.addEventListener('DOMContentLoaded', () => { translatePage(); addSwitch(); });
})();
