# MR BAO by Maamz – strona z zamówieniami online

Prezentacja nowej strony restauracji MR BAO by Maamz (Wolska 50A, Warszawa Wola): 4 podstrony, menu z kartami dań, koszyk z kalkulacją i wysyłką zamówienia przez WhatsApp.

## Podstrony
- `index.html` – strona główna (hero, polecane dania, jak zamówić, adres i godziny)
- `menu.html` – pełne menu z cenami, wyszukiwarka, zakładki kategorii, wybór sosu
- `o-nas.html` – historia lokalu
- `kontakt.html` – adres, telefon, e-mail, godziny z podświetlonym dniem

## Interaktywność (JS)
- koszyk wspólny dla wszystkich podstron (localStorage), liczy sumę, zmiana ilości
- zamówienie: imię, godzina odbioru (tylko w godzinach przyjmowania zamówień), płatność BLIK lub przy odbiorze, uwagi → gotowa wiadomość na WhatsApp
- status „Otwarte / zamknięte” liczony na żywo dla strefy Europe/Warsaw
- wyszukiwarka dań, aktywna zakładka kategorii przy przewijaniu
- powiększanie zdjęć (lightbox), komunikat „dodano do koszyka”, przycisk „do góry”
- nagłówek zmniejsza się przy przewijaniu, efekt paralaksy w hero, menu mobilne
- kopiowanie telefonu i e-maila

## Struktura
```
index.html, menu.html, o-nas.html, kontakt.html
css/styles.css
js/data.js   – menu, ceny, godziny, numer WhatsApp
js/main.js   – cała logika
images/      – zdjęcia dań (WebP)
```

## Jak zmienić menu lub ceny
Edytuj `js/data.js`: każde danie ma `name`, `price`, `desc` i opcjonalnie `img` (nazwa pliku z `images/` bez rozszerzenia).

## Uwagi
- Zdjęcia dań: oryginalne zdjęcia lokalu (images/), Bang Bang Chicken Bao i kilka przystawek nie ma jeszcze zdjęcia.
- Płatność nie odbywa się na stronie: lokal potwierdza zamówienie na WhatsAppie i podaje numer do BLIK.
- Projekt i wykonanie: WebDesignStudio.digital

## Wersja demo
To jest prezentacja dla klienta, nie strona produkcyjna. Wszystkie podstrony mają `noindex`, a `robots.txt` blokuje roboty, żeby demo nie konkurowało w Google z mrbaobymaamz.pl.
