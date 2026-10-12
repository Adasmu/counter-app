import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { writeFile } from 'node:fs/promises';
import { createStudentConfig, renderStudentConfig } from './assignment.mjs';

const prompt = createInterface({ input: stdin, output: stdout });
try {
  console.log('Použij přesný univerzitní e-mail. Velikost písmen se automaticky nemění.');
  const name = await prompt.question('Jméno a příjmení: ');
  const email = await prompt.question('Univerzitní e-mail: ');
  const config = createStudentConfig(email, name);
  const target = new URL('../src/app/config/student.ts', import.meta.url);
  await writeFile(target, renderStudentConfig(config), 'utf8');
  console.log(`SHA-256: ${config.emailSha256}`);
  console.log(`První znak: ${config.emailSha256[0]} => varianta ${config.variant}`);
  console.log('Nastavení uloženo. E-mail nebyl zapsán do souboru.');
  console.log('Restartuj vývojový server, pokud už běží. Potom spusť npm run format.');
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  prompt.close();
}
