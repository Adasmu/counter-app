# Jak své řešení vysvětlit

Při čtení si otevři uvedené soubory. Nejde o text k naučení nazpaměť, ale o mapu kódu.

## 1. Co znamenají soubory

`*.ts` je TypeScript: stav, metody a importy komponent. `*.html` je šablona rozhraní.
`*.scss` jsou styly. `*.spec.ts` obsahuje automatické testy. `package.json` uvádí závislosti a příkazy.
`angular.json` nastavuje build, vývojový server, testy a lint.

## 2. Základní tok dat

```text
CounterComponent -- saved(counter) --> Tab1Page
Tab1Page -- add(counter) --> CounterService
CounterService -- Preferences.set(JSON) --> lokální úložiště
CounterService -- signal counters() --> Tab2Page (Historie)
```

Komponenta počítadla nezná Preferences. Stránka počítadla data pouze předává službě.
Historie data čte a vyvolává operace služby. Zápis do úložiště je soustředěn na jednom místě.

## 3. CounterComponent - počítadlo a události

Soubory jsou v `src/app/components/counter/`.

`counterName` obsahuje text názvu a `count` aktuální hodnotu.
`increment()` zvyšuje hodnotu, `decrement()` ji snižuje nejvýše na nulu a `reset()` nastavuje nulu.
Název je s formulářem propojen přes `[(ngModel)]`. Hodnota se vypisuje přes `{{ count }}`.
Tlačítka vyvolávají metody pomocí `(click)`.

`heading = input(...)` přijímá nadpis od rodiče. V šabloně se čte jako `heading()`.
`saved = output<SavedCounter>()` je typovaná událost. `save()` ořízne mezery kolem názvu,
ověří, že název není prázdný, vytvoří UUID a čas a vyvolá `saved.emit(...)`.
Rodič ji zachytí pomocí `(saved)="onSaved($event)"`.

Kontrola názvu je nejen v zakázaném tlačítku, ale i v metodě, protože metodu lze volat i z testu.
Input `saving` brání dalšímu zadávání během ukládání. Při chybě rodič přes `restore()` vrátí formulář.

## 4. Model SavedCounter

`src/app/models/saved-counter.ts` definuje čtyři položky:
`id`, `name`, `value` a `createdAt`. Typová kontrola pomáhá odhalit chybějící položky při vývoji.
Samotné TypeScript rozhraní ale neověřuje data načtená za běhu z JSON.
Proto služba používá také `isSavedCounter()`.

## 5. CounterService - sdílený stav a Preferences

`providedIn: 'root'` znamená jednu sdílenou instanci. Stránky ji získají přes `inject(CounterService)`.
Soukromý `countersState` lze měnit jen ze služby. Veřejný `counters = countersState.asReadonly()`
neposkytuje stránkám metodu `set()` nebo `update()`.

Signál se čte zavoláním `counters()`. Angular tak pozná závislost šablony a po změně stav znovu vykreslí.
Readonly signál sám o sobě není hluboké zmrazení všech objektů v poli; stránky zde data nemutují.

`initialize()` uchová první Promise. I když o inicializaci požádají dvě stránky,
`Preferences.get()` se spustí jen jednou. `await` počká na dokončení asynchronní operace.

Preferences ukládají text, ne přímo pole objektů. Proto `persist()` používá `JSON.stringify()`
a `load()` používá `JSON.parse()`. Klíč je `saved-counters`.
`clear()` volá `Preferences.remove({ key: ... })`, nikoli `Preferences.clear()`, aby nesmazal jiná nastavení aplikace.

Zápisy se řadí přes `pendingWrite`, aby pomalejší starší operace nepřepsala novější stav.
Signál se mění až po úspěšném zápisu. Když zápis selže, aplikace neoznamuje falešné úspěšné uložení.

## 6. Historie - hledání, řazení a statistiky

`src/app/tab2/tab2.page.ts` obsahuje `search`, `sortOrder` a `signFilter`.
`visibleCounters` je `computed(...)`, tedy odvozený signál. Změna uložených dat nebo filtru přepočítá seznam.
Funkce `selectCounters()` nejprve vyfiltruje kopii a pak ji seřadí. Nemění původní pořadí ve službě.

Součet i statistiky čtou všechna uložená data. Hledání jejich výsledek nemění.
`@for (...; track counter.id)` rozpozná jednotlivé řádky podle UUID.
`@if` odlišuje načítání, skutečně prázdnou historii a seznam bez výsledků hledání.

Průměr je součet dělený počtem. Prázdné pole nemá průměr ani minimum/maximum, proto se vrací `null`.
Nula je reálná uložená hodnota, nikoli označení chybějícího výsledku.
Kladné hodnoty jsou `> 0`, záporné `< 0` a nulové `=== 0`.

## 7. Dialog a toast

Tlačítko Vymazat vše pouze nastaví `alertOpen` na true. Až zavření alertu s rolí `confirm`
vyvolá mazání. Role `cancel` nebo kliknutí mimo dialog nic nemaže.
Po zavření se `alertOpen` vrací na false, aby šel dialog znovu otevřít.

`FeedbackService` vytváří `ion-toast` přes `ToastController`.
Stránky zprávu o úspěchu zobrazují až po `await` nad operací služby.
Služba pro ukládání dat sama dialogy ani toasty nezná.

## 8. Testy a jednoduchá vlastní úprava

Test služby nahrazuje Preferences mockem: určuje, jaká hodnota se načte, a kontroluje argumenty zápisu.
`beforeEach()` zajistí čistý stav pro každý test. U asynchronních metod je nutné `await`.
Testy nespoléhají na uložená data z jiného testu ani z tvého prohlížeče.

Příklad drobné úpravy: v `tab2.page.ts` změň

```typescript
readonly sortOrder = signal<SortOrder>('newest');
```

na

```typescript
readonly sortOrder = signal<SortOrder>('value-desc');
```

Po novém načtení aplikace se historie standardně seřadí od nejvyšší hodnoty.
Přepínání pomocí výběru řazení zůstane funkční. Vysvětli, že jsi změnil výchozí stav signálu,
ne data uložená v Preferences. Úpravu ověř, zkontroluj `git diff` a teprve pak commitni.
