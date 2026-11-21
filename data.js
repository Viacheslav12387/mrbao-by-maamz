// Dane lokalu i menu MR BAO by Maamz (ceny z karty menu)
const MRBAO = {
  whatsapp: '48608792130',
  hours: { 1: [12, 22], 2: [12, 22], 3: [12, 22], 4: [12, 22], 5: [12, 22], 6: [12, 22], 0: null },
  lastOrder: 21 * 60 + 30,
  sauces: ['Majonez Mango', 'Majonez Miodowo-Czosnkowy', 'Pikantny Majonez', 'Majonez Ziołowy'],
  featured: ['b4', 'p2', 'b3', 'z3'],
  menu: [
    { id: 'bao', name: 'Bao', note: 'podawane z frytkami · sos do wyboru', type: 'cards', items: [
      { id: 'b1', name: 'Tofu Tango Bao', img: 'tofu-tango-bao', price: 28, sauce: true, desc: 'Bułeczki bao na parze, chrupiące tofu, ogórek, marchewka, prażona cebulka.' },
      { id: 'b2', name: 'Bang Bang Chicken Bao', price: 30, sauce: true, desc: 'Bułeczki bao na parze, chrupiący kurczak panko, ogórek, marchewka, prażona cebulka.' },
      { id: 'b3', name: 'Pulled Pork Bao', img: 'pulled-pork-bao', price: 32, sauce: true, desc: 'Bułeczki bao na parze, szarpana wieprzowina, ogórek, marchewka, prażona cebulka.' },
      { id: 'b4', name: 'Shrimply Amazing Bao', img: 'shrimply-amazing-bao', price: 32, sauce: true, desc: 'Bułeczki bao na parze, chrupiące krewetki, ogórek, marchewka, prażona cebulka.' },
      { id: 'b5', name: 'Tamarind Duck Bao', img: 'tamarind-duck-bao', price: 33, sauce: true, desc: 'Bułeczki bao na parze, kaczka w sosie tamaryndowym, ogórek, marchewka, prażona cebulka.' },
      { id: 'b6', name: 'Midnight Beef Bao', img: 'midnight-beef-bao', price: 34, sauce: true, desc: 'Bułeczki bao na parze, wołowina, ogórek, marchewka, prażona cebulka.' },
    ] },
    { id: 'bowle', name: 'Azjatyckie poke bowle', note: 'na ryżu jaśminowym', type: 'cards', items: [
      { id: 'p1', name: 'Green Garden Tofu Bowl', img: 'green-garden-tofu-bowl', price: 36, desc: 'Chrupiące tofu, ryż jaśminowy, edamame, wakame, awokado, ogórek, biała cebula, czerwona papryka, autorski sos.' },
      { id: 'p2', name: 'Firecracker Chicken Bowl', img: 'firecracker-chicken-bowl', price: 38, desc: 'Chrupiący kurczak, ryż jaśminowy, edamame, wakame, awokado, ogórek, biała cebula, czerwona papryka, autorski sos.' },
      { id: 'p3', name: 'Midnight Beef Bowl', img: 'midnight-beef-bowl', price: 44, desc: 'Wolno gotowana wołowina, ryż jaśminowy, edamame, wakame, awokado, ogórek, biała cebula, czerwona papryka, autorski sos.' },
      { id: 'p4', name: 'Power Poke Bowl', img: 'power-poke-bowl', price: 44, sauce: true, desc: 'Ryż jaśminowy, wakame, awokado, ogórek, mango, jajko gotowane, pomidorki koktajlowe, sos do wyboru.' },
    ] },
    { id: 'przystawki', name: 'Przystawki', type: 'cards', items: [
      { id: 'z1', name: 'Hammer Fries', price: 10, desc: 'Porcja frytek.' },
      { id: 'z2', name: 'Bao Special Fries', img: 'bao-special-fries', price: 12, desc: 'Frytki w stylu MR BAO.' },
      { id: 'z3', name: 'Chicken Popcorn', img: 'chicken-popcorn', price: 18, desc: 'Chrupiące kawałki kurczaka w panko z sosem.' },
      { id: 'z4', name: 'Pierożki Gyoza z Kurczakiem (6 szt.)', img: 'gyoza', price: 18, desc: 'Smażone pierożki gyoza z kurczakiem.' },
      { id: 'z5', name: 'Pierożki Gyoza z Wieprzowiną (6 szt.)', img: 'gyoza', price: 18, desc: 'Smażone pierożki gyoza z wieprzowiną.' },
      { id: 'z6', name: 'Kurczak Panko z Frytkami', img: 'kurczak-panko-fries', price: 32, desc: 'Chrupiący kurczak panko podany z frytkami.' },
      { id: 'z7', name: 'Krewetki Tempura (4 szt.)', price: 32, desc: 'Krewetki w chrupiącej tempurze.' },
    ] },
    { id: 'salatki', name: 'Sałatki', type: 'cards', items: [
      { id: 's1', name: 'Sałatka Tofu Crunch', price: 22, desc: 'Mix sałat, chrupiące tofu, ogórek, autorski dressing.' },
      { id: 's2', name: 'Azjatycka Sałatka z Kurczakiem', img: 'salatka', price: 24, desc: 'Mix sałat, chrupiący kurczak panko, pomidorki koktajlowe, ogórek, chrupiąca panierka, dressing miodowo-czosnkowy.' },
      { id: 's3', name: 'Sałatka Wołowa z Sezamem', price: 32, desc: 'Mix sałat, wolno gotowana wołowina, ogórek, autorski dressing.' },
    ] },
    { id: 'sosy', name: 'Sosy', note: 'dodatkowy sos', type: 'list', items: [
      { id: 'o1', name: 'Majonez Mango', price: 3 },
      { id: 'o2', name: 'Majonez Miodowo-Czosnkowy', price: 3 },
      { id: 'o3', name: 'Pikantny Majonez', price: 3 },
      { id: 'o4', name: 'Majonez Ziołowy', price: 3 },
    ] },
    { id: 'napoje', name: 'Napoje', type: 'list', items: [
      { id: 'n1', name: 'Coca-Cola', price: 10 },
      { id: 'n2', name: 'Coca-Cola Zero', price: 10 },
      { id: 'n3', name: 'Woda Niegazowana', price: 10 },
      { id: 'n4', name: 'Woda Gazowana', price: 10 },
      { id: 'n5', name: 'Kawa', price: 15 },
    ] },
  ],
};
