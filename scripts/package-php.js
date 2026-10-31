const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const PROJECT_DIR = path.resolve(__dirname, '..');
const EXPORT_DIR = path.join(PROJECT_DIR, 'out');
const TARGET_DIR = path.resolve(PROJECT_DIR, '..', '..', 'godaddy-php');
const ZIP_OUTPUT = path.resolve(PROJECT_DIR, '..', '..', 'godaddy-php.zip');
// Hand-written files in godaddy-php; everything else there is regenerated.
const HAND_WRITTEN = new Set(['.htaccess', 'api', 'README_GODADDY.txt']);

console.log('[1/4] Building static export...');
fs.rmSync(EXPORT_DIR, { recursive: true, force: true });
execSync('pnpm exec next build', {
  cwd: PROJECT_DIR,
  stdio: 'inherit',
  env: { ...process.env, STATIC_EXPORT: '1' },
});

console.log('\n[2/4] Refreshing godaddy-php...');
for (const name of fs.readdirSync(TARGET_DIR)) {
  if (!HAND_WRITTEN.has(name)) {
    fs.rmSync(path.join(TARGET_DIR, name), { recursive: true, force: true });
  }
}
fs.cpSync(EXPORT_DIR, TARGET_DIR, { recursive: true });

console.log('\n[3/4] Checking api/config.php...');
const configPath = path.join(TARGET_DIR, 'api', 'config.php');
if (fs.existsSync(configPath)) {
  console.log('Keeping existing config.php');
} else {
  fs.writeFileSync(configPath, `<?php
return [
    'admin_key' => '${crypto.randomBytes(24).toString('hex')}',
    'gemini_api_key' => '',
    'gemini_model' => 'gemini-2.5-flash',
];
`);
  console.log('Created config.php with a new random admin key');
}

console.log('\n[4/4] Creating godaddy-php.zip...');
fs.rmSync(ZIP_OUTPUT, { force: true });
execSync(`tar -a -c -f "${ZIP_OUTPUT}" -C "${TARGET_DIR}" .`, { stdio: 'inherit' });

const sizeMb = (fs.statSync(ZIP_OUTPUT).size / (1024 * 1024)).toFixed(2);
console.log(`\nDone: ${ZIP_OUTPUT} (${sizeMb} MB)`);
console.log('See godaddy-php/README_GODADDY.txt for upload steps.');
