// Creates or replaces the admin login. Usage: pnpm admin:create [username] [password]
// Without a password a strong one is generated. It is printed once and only its hash is saved, to .env.local.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PROJECT_DIR = path.resolve(__dirname, '..');
const ENV_FILE = path.join(PROJECT_DIR, '.env.local');
const ITERATIONS = 600000;

const username = process.argv[2] || 'admin';
const password = process.argv[3] || crypto.randomBytes(15).toString('base64url');

if (!/^[A-Za-z0-9._@-]{3,64}$/.test(username)) {
  console.error('Username must be 3-64 characters: letters, numbers, dot, underscore, @ or hyphen.');
  process.exit(1);
}
if (password.length < 12) {
  console.error('Password must be at least 12 characters.');
  process.exit(1);
}

const salt = crypto.randomBytes(16);
const derived = crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');
const hash = `pbkdf2:${ITERATIONS}:${salt.toString('hex')}:${derived.toString('hex')}`;

const existing = fs.existsSync(ENV_FILE) ? fs.readFileSync(ENV_FILE, 'utf8') : '';
const kept = existing.split(/\r?\n/).filter((line) => !/^ADMIN_(USERNAME|PASSWORD_HASH)=/.test(line));
while (kept.length && kept[kept.length - 1].trim() === '') kept.pop();
fs.writeFileSync(ENV_FILE, [...kept, `ADMIN_USERNAME=${username}`, `ADMIN_PASSWORD_HASH=${hash}`, ''].join('\n'));
console.log('Saved to .env.local');

console.log(`\nUsername: ${username}\nPassword: ${password}\n\nStore the password now; it cannot be recovered.`);
