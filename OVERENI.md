# Záznam ověření při přípravě

Datum: 12. 10. 2026. Toto není potvrzení splnění odevzdání.

## Skutečně provedené kontroly

- Pět testů skriptu SHA-256 prošlo přes `npm run test:setup` na Node.js 22.16.0.
- Parser TypeScriptu 5.8.3 nenašel syntaktické chyby ve 22 TypeScript souborech.
- 61 kontrol vlastní logiky prošlo v oddělené offline zkoušce skutečného přeloženého kódu.
  Pokrývaly statistiky, hledání, řazení, filtry, validaci, zápisy, chyby a základní počítadlo.
  Angular signály, dekorátory a Capacitor Preferences přitom byly nahrazeny výslovnými testovacími náhradami.
  Nešlo o skutečný běh Angularu, Capacitoru ani přiložené sady Vitest.
- Pomocné `.mjs` skripty prošly syntaktickou kontrolou `node --check`.

## Co zde nemohlo být potvrzeno

Připojení k `registry.npmjs.org` selhalo na překladu DNS. V prostředí nebyly přítomné
Angular/Ionic balíčky ani Node.js 26. Nepodařilo se je stáhnout.

Proto zde neproběhla úspěšná instalace `npm install`, skutečný `npm run lint`,
`npm test -- --watch=false` ani `ionic build`. Nebyla prověřena kompatibilita přesně rozřešených závislostí,
Angular šablonová kontrola ani uživatelské rozhraní v prohlížeči. Tyto kontroly musí proběhnout na skutečném cílovém prostředí.

`package-lock.json` vznikne první úspěšnou instalací. Osobní varianta zůstává `null`, dokud student nezadá svůj e-mail.
Veřejný vzdálený repozitář nebyl vytvořen a úkol nebyl odevzdán.

## Doplnění skutečné kontroly studentem

Po lokálním ověření doplň datum, verze a skutečný výsledek příkazů:

```text
Datum:
Node.js:
npm:
Instalace npm install:
Testy npm test -- --watch=false:
Lint npm run lint:
Build npx ionic build:
Ruční kontrola:
URL veřejného repozitáře:
```
