import { readFile, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { variantFromHash } from './assignment.mjs';

try {
  if (Number(process.versions.node.split('.')[0]) !== 26) {
    throw new Error('Zadání vyžaduje Node.js 26. Zkontroluj node --version.');
  }
  const source = await readFile(new URL('../src/app/config/student.ts', import.meta.url), 'utf8');
  const match = source.match(/export const studentConfig: StudentConfig = ([\s\S]*?);\s*$/);
  if (!match) throw new Error('Konfigurace autora není v očekávaném formátu. Spusť npm run student.');
  // Prettier can convert JSON's double-quoted property names to ordinary TS keys.
  // Read the three safe generated fields without evaluating TypeScript code.
  const body = match[1];
  const name = body.match(/(?:"authorName"|authorName):\s*(['"])(.*?)\1/s)?.[2];
  const hash = body.match(/(?:"emailSha256"|emailSha256):\s*['"]([0-9a-f]{64})['"]/i)?.[1];
  const variant = body.match(/(?:"variant"|variant):\s*['"]([ABCD])['"]/)?.[1];
  if (!name || !hash || !variant || variantFromHash(hash) !== variant) {
    throw new Error('Chybí autor nebo správná varianta. Spusť npm run student.');
  }
  await access(new URL('../package-lock.json', import.meta.url)).catch(() => {
    throw new Error('Chybí package-lock.json. Nejprve dokonči npm install a lockfile commitni.');
  });
  const result = spawnSync('git', ['rev-list', '--count', 'HEAD'], {
    cwd: fileURLToPath(new URL('..', import.meta.url)), encoding: 'utf8',
  });
  if (result.status !== 0 || Number(result.stdout.trim()) < 4) {
    throw new Error('Repozitář musí mít alespoň 4 smysluplné commity.');
  }
  console.log(`Autor a varianta ${variant} jsou nastaveny; hash začíná ${hash[0]}.`);
  console.log('Teď následuje skutečný lint, testy a build. Ještě je nutná ruční kontrola aplikace.');
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
