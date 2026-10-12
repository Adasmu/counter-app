# Návod od instalace po odevzdání

## 1. Nainstaluj potřebné programy

Potřebuješ Visual Studio Code, Node.js 26 (včetně npm 11) a Git.
Nejde o velké Visual Studio. Android Studio ani celé Xcode nejsou pro tato webová cvičení potřeba.

Oficiální instalační stránky:

- Visual Studio Code: https://code.visualstudio.com/download
- Node.js, požadovaná řada 26: https://nodejs.org/en/download/archive/v26.0.0
- Git pro Windows: https://git-scm.com/install/windows
- Git pro macOS: https://git-scm.com/install/mac

Na Windows nainstaluj VS Code, Node.js pomocí `.msi` a Git for Windows běžnými instalátory.
Na Macu přesuň VS Code do Applications/Aplikace a nainstaluj Node.js 26 z `.pkg`.
Git na Macu získáš instalací Command Line Tools. Do systémové aplikace Terminál napiš:

```bash
xcode-select --install
```

Jestli nástroj hlásí, že už je nainstalován, nepřeinstalovávej jej.
Po instalaci programů zavři a znovu otevři VS Code i terminál.

## 2. Rozbal a otevři správnou složku

ZIP rozbal celý. Ve VS Code zvol **File > Open Folder** a otevři složku `counter-app`.
V levém panelu musí být vidět `package.json`, `angular.json`, `src` a tento návod.
Neotvírej pouze složku `src` ani samotný soubor README.

Projekt už existuje. **Nespouštěj znovu `ionic start` ani `git init`.**
Součástí složky je skrytý adresář `.git` s historií. Nemazat.

Ve VS Code otevři **Terminal > New Terminal**. Příkazy piš do terminálu, ne do zdrojového souboru.
Každý příkaz potvrď Enterem a další spouštěj, až předchozí skončí.

```bash
node --version
npm --version
git --version
git log --oneline
```

Node má začínat `v26.`, npm `11.` a Git musí vypsat historii commitů.

## 3. Nainstaluj závislosti a nastav svou variantu

```bash
npm install
npm run student
npm run format
```

První příkaz stáhne knihovny a vytvoří `package-lock.json`.
Druhý se zeptá na jméno a na univerzitní e-mail. Zadej skutečný školní e-mail,
nikoli Gmail nebo e-mail k přihlášení na GitHub. Ten určuje individuální variantu.
Ve výpisu uvidíš hash, první znak a variantu A/B/C/D. Nikam je nemusíš ručně přepisovat.

Případná doporučená rozšíření VS Code (Angular Language Service, ESLint, Prettier) můžeš nainstalovat;
nejsou podmínkou pro spuštění příkazů.

## 4. Spusť aplikaci

```bash
npm start
```

Otevři adresu vypsanou terminálem, obvykle `http://localhost:8100`.
Terminál nech běžet. Neotvírej `index.html` dvojklikem v Průzkumníku nebo Finderu.
Ulož třeba `Auta = 3`, `Návštěvníci = 5` a `Nula = 0`.
V Historii má být součet 8. Po obnovení stránky musí záznamy zůstat.
Vyzkoušej hledání, řazení, odstranění a oba výsledky potvrzovacího dialogu.

Varianta A má u uvedených dat průměr přibližně 2,67; B minimum 0 a maximum 5;
C dva kladné, nula záporných a jeden nulový; D ve filtru Kladné dva záznamy.
Zobrazena bude jen tvoje přidělená varianta.

## 5. Přečti kód a proveď vlastní úpravu

Otevři `JAK-KOD-FUNGUJE.md`. Například si uprav výchozí řazení v `tab2.page.ts`
a ověř jeho dopad. Zapiš vlastní vysvětlení do README. Nahrání kódu bez porozumění
nesplňuje podmínku kontroly uvedenou v zadání.

## 6. Spusť povinné kontroly

Server ukonči klávesami `Ctrl+C` (na Macu také Control, nikoli Command).
Potom postupně spusť:

```bash
npm run format
npm run lint
npm test -- --watch=false
npx ionic build
npm run ready
```

Bez globální instalace Ionic CLI se používá `npx ionic build`. Je to lokální spustitelný soubor Ionic CLI.
Uvnitř `npm run ready` se spouští přímo `ionic build`, protože npm lokální nástroje přidá do PATH.

Když kontrola skončí chybou, projekt zatím neodevzdávej. Ulož celý výpis od první chyby.
Nedělej nahodilé downgrady, nemaž lockfile a nepoužívej `npm audit fix --force`.

## 7. Ulož svoje skutečné změny do Gitu

Pokud GitHub účet ještě nemáš, vytvoř si jej. Následující zástupné hodnoty
nahraď vlastním jménem a e-mailem pro Git commity:

```bash
git config user.name "Tvoje jmeno a prijmeni"
git config user.email "TVUJ-EMAIL-PRO-GIT"
git status
git diff
```

E-mail v commitu bude veřejný. Můžeš místo osobního e-mailu použít svou adresu `noreply`
z GitHub **Settings > Emails**. Nemusí to být stejná adresa jako školní e-mail pro hash.

Zkontroluj změny a pak je ulož:

```bash
git add .
git commit -m "Nastaveni autora, pridelene varianty a vlastni upravy"
git log --oneline
git status
```

`package-lock.json` patří do commitu. `node_modules` a `www` se automaticky ignorují.
Pokud jsi aplikaci ještě neověřil, netvrď v commitu, že byly kontroly úspěšné.
Průběžné commity přiloženého návrhu mají jasně označené asistované autorství.
Nejsou dokladem tvé předchozí samostatné práce. O přípustnosti asistence rozhodují pravidla kurzu.

## 8. Zveřejni repozitář přímo z VS Code

Otevři paletu příkazů: na Macu `Cmd+Shift+P`, na Windows `Ctrl+Shift+P`.
Vyhledej **Publish to GitHub**. Přihlas se do svého GitHub účtu,
zadej název například `counter-app-ap5pm` a zvol **Public**, nikoli Private.
Tato akce vytvoří veřejný repozitář a odešle jeho commity.

Hlavní větev `main` obsahuje finální kód i celou posloupnost commitů.
Další uložené větve a tagy můžeš po zveřejnění odeslat takto:

```bash
git push origin --all
git push origin --tags
```

Nahrání souborů jen přes webové **Upload files** nezachová přiloženou historii Gitu.
Pro tento úkol použij publikování celého lokálního repozitáře.

## 9. Odevzdej URL

Otevři repozitář na GitHubu. Zkontroluj, že kořen obsahuje `package.json`, `package-lock.json`,
`src` a README a že v historii vidíš alespoň čtyři smysluplné commity.
Otevři tutéž adresu v anonymním okně: repozitář musí být vidět i bez přihlášení.

Do odevzdávacího pole k zadání vlož adresu například:

```text
https://github.com/TVUJ-UCET/counter-app-ap5pm
```

Neodevzdává se ZIP, screenshot, samotný `.ts` soubor ani `http://localhost:8100`.
Z dodaného zadání není znám termín ani konkrétní odevzdávací platforma; řiď se stránkou úkolu.

## Když se něco nedaří

**`node` nebo `npm` není nalezen:** po instalaci Node.js zavři celé VS Code a znovu jej otevři.

**Windows hlásí blokovaný `npm.ps1`:** ve VS Code změň profil terminálu na Command Prompt
(šipka vedle tlačítka pro nový terminál) nebo používej `npm.cmd` a `npx.cmd`.
Nemusíš kvůli tomu plošně snižovat zabezpečení PowerShellu.

**`ENOENT ... package.json`:** terminál není ve složce `counter-app`. Otevři správnou složku a nový terminál.

**`ionic` není nalezen:** nejprve dokonči `npm install`, pak použij `npm start` nebo `npx ionic build`.

**Git po rozbalení nevidí repozitář:** nepřidávej falešné prázdné commity. V balíčku je
záloha `counter-app.bundle`. Otevři v terminálu nadřazenou složku balíčku a spusť:

```bash
git clone counter-app.bundle counter-app-obnoveno
cd counter-app-obnoveno
git remote remove origin
```

Pak otevři ve VS Code `counter-app-obnoveno`, nastav své jméno/e-mail pro Git a pokračuj krokem 3.
Lokální `origin` se odstraňuje proto, aby bylo možné přes Publish to GitHub přidat skutečný online repozitář.
