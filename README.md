# CounterApp - AP5PM, CV03 a CV04

Navazující Ionic/Angular aplikace podle dodaných README CV01-CV04 a rozšířeného zadání odevzdání.

**Stav balíčku:** zdrojové řešení je připravené, ale zatím není nastaven autor a jeho přidělená varianta.
V prostředí přípravy nebylo dostupné npm ani Node.js 26, proto nejsou potvrzeny instalace závislostí,
Angular/Vitest testy, lint, produkční build ani skutečné vykreslení aplikace. Podrobnosti: `OVERENI.md`.
Nejde o tvrzení, že projekt už splnil všechny kontroly odevzdání.

## Spuštění

Požadavky podle kurzu: Node.js 26, npm 11, Git. Projekt používá Angular 22, Ionic 9,
Capacitor 8 (core/CLI alespoň 8.5), Preferences 8 a TypeScript 6.0.

```bash
npm install
npm run student
npm run format
npm start
```

`npm run student` se interaktivně zeptá na jméno a univerzitní e-mail.
Počítá SHA-256 z přesného UTF-8 vstupu bez přidaného odřádkování.
Velikost písmen nemění; mezery ve vstupu odmítne. Do `src/app/config/student.ts`
zapíše jméno, hash a variantu, nikoli samotný e-mail.

Webová aplikace běží obvykle na `http://localhost:8100`. Server ukončíš `Ctrl+C`.
Ionic CLI je lokální vývojová závislost, takže není nutná globální instalace.
`npm start` spouští `ionic serve`. Pro build z terminálu bez globálního Ionic CLI použij `npx ionic build`.

První úspěšné `npm install` vytvoří `package-lock.json`. Před odevzdáním jej commitni.
Lockfile nebyl v balíčku vymyšlen ani nahrazen neúplným souborem.

## Obsah implementace

| Část | Implementace |
| --- | --- |
| CV02 | Počítadlo, název, +1/-1, reset, tři záložky |
| CV03 | `CounterComponent`, `input()`, `output()`, typ `SavedCounter`, testy komponenty |
| CV04 | `CounterService`, sdílené signály, jednorázová inicializace, Preferences, čas vytvoření |
| Historie | Načítání, prázdný stav, datum, odstranění jedné položky nebo celé historie |
| Rozšíření 1 | Součet hodnot všech uložených záznamů |
| Rozšíření 2 | Řazení podle času, názvu a hodnoty v obou směrech |
| Rozšíření 3 | Vyhledávání podle názvu bez rozlišení velikosti písmen a diakritiky |
| Rozšíření 4 | Skutečný `ion-alert`, mazání pouze po potvrzení |
| Rozšíření 5 | `ToastController` vytvářející `ion-toast` po úspěšné operaci |
| Individuální funkce | A/B/C/D podle hashe; v Historii se zobrazí jen nastavená varianta |
| Odolnost | Validace uloženého JSON, serializace zápisů, obnova formuláře při chybě |

Základní CV03 bez bonusů je zachováno v tagu `cv03` a větvi `cv3/reusable-counter`.
Ve finální aplikaci se historie podle CV04 přesunula na druhou záložku.

## Varianta a chování statistik

| První hexadecimální znak | Varianta |
| --- | --- |
| 0-3 | A: průměr |
| 4-7 | B: minimum a maximum |
| 8-b | C: počet kladných, záporných a nulových hodnot |
| c-f | D: filtr všechny / kladné / záporné |

Dokud se nespustí `npm run student`, není zvolená žádná varianta.
Všechny varianty jsou implementovány, ale uživatelské rozhraní aktivuje jedinou podle konfigurace.
Součet a statistiky A-C se počítají z **celé historie**, ne pouze z vyhledaných položek.
U prázdné historie je součet a počet nula; průměr, minimum a maximum jsou zobrazeny jako pomlčka.
Filtr D nezahrnuje nulu mezi kladné ani mezi záporné hodnoty.

## Kontroly před odevzdáním

```bash
npm run format
npm run test:setup
npm test -- --watch=false
npm run lint
npx ionic build
npm run ready
```

`npm run ready` navíc kontroluje Node.js 26, nastavené jméno, soulad varianty s hashem,
existenci lockfilu a počet commitů. Potom skutečně spouští testy, lint a `ionic build`.
Počet commitů sám o sobě není důkaz jejich smysluplnosti ani samostatnosti práce.

`npm test` používá Angular CLI + Vitest. Testy služby mockují Preferences a nepřepisují data prohlížeče.
`npm run test:setup` používá pouze vestavěný Node test runner pro kontrolu SHA-256 a mapování variant.

Při chybě neopravuj projekt příkazem `npm audit fix --force`. Zachovej celý první chybový výpis.

## Historie a odevzdání

Historie byla vytvořena postupně při přípravě tohoto asistovaného návrhu.
Nevydává se za dřívější samostatnou práci studenta. Soubory kostry byly sestaveny podle
zadání; generátory Angular/Ionic zde kvůli nedostupným závislostem nebyly spuštěny.
Použití asistence musí odpovídat pravidlům kurzu. Student má řešení projít, upravit a umět vysvětlit.

Odevzdává se **URL veřejného Git repozitáře**, nikoli tento ZIP ani adresa localhost.
Podrobný postup obsahuje `NAVOD-OD-NULY.md`; vysvětlení implementace je v `JAK-KOD-FUNGUJE.md`.
Ruční kontrolní seznam je v `KONTROLA.md` a nejasnosti zadání v `OTAZKY-PRO-CVICENI.md`.
