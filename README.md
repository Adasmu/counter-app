# CounterApp - AP5PM

Asistovaný výukový návrh podle dodaných README CV01-CV04.
Historie zachycuje skutečné etapy přípravy návrhu v tomto pracovním prostředí,
nikoli dřívější samostatnou práci studenta. Použití asistence musí odpovídat pravidlům kurzu.

## Prostředí
Node.js 26, npm 11, Angular 22, Ionic 9, Capacitor 8, TypeScript 6.0.

```bash
npm install
npm start
npm test -- --watch=false
npm run lint
npx ionic build
```

Balíčky v tomto prostředí nelze stáhnout z npm. Instalace, Angular/Vitest testy,
lint ani produkční build zatím nejsou ověřeny. První úspěšné `npm install`
vytvoří `package-lock.json`; tento soubor je nutné commitnout.

Aktuální etapa: CV02, tři záložky a základní počítadlo.
