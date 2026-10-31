const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_DIR = path.resolve(__dirname, '..');
const STANDALONE_DIR = path.join(PROJECT_DIR, '.next', 'standalone');
const STATIC_DIR = path.join(PROJECT_DIR, '.next', 'static');
const PUBLIC_DIR = path.join(PROJECT_DIR, 'public');
const DIST_DIR = path.join(PROJECT_DIR, 'godaddy-dist');
const ZIP_OUTPUT = path.join(PROJECT_DIR, 'godaddy-deployment.zip');

function listPackages(modulesDir) {
  return fs.readdirSync(modulesDir)
    .filter((name) => !name.startsWith('.'))
    .flatMap((name) => (name.startsWith('@')
      ? fs.readdirSync(path.join(modulesDir, name)).map((scoped) => `${name}/${scoped}`)
      : [name]))
    .filter((name) => fs.existsSync(path.join(modulesDir, name)));
}

// pnpm links packages with junctions/symlinks, which do not survive zipping, so
// the bundle gets a flat node_modules of real files. A package whose dependency
// differs from the hoisted version keeps its own nested copy of that dependency.
function copyFlatNodeModules(srcModules, destModules) {
  const pnpmStore = path.join(srcModules, '.pnpm');
  const stores = fs.readdirSync(pnpmStore)
    .filter((name) => name !== 'node_modules')
    .map((name) => path.join(pnpmStore, name, 'node_modules'))
    .filter((dir) => fs.existsSync(dir));

  const hoisted = new Map();
  for (const dir of [srcModules, ...stores]) {
    for (const name of listPackages(dir)) {
      if (!hoisted.has(name)) hoisted.set(name, fs.realpathSync(path.join(dir, name)));
    }
  }
  for (const [name, realPath] of hoisted) {
    fs.cpSync(realPath, path.join(destModules, name), { recursive: true, dereference: true });
  }

  for (const store of stores) {
    const packages = listPackages(store);
    for (const owner of packages) {
      const ownerPath = path.join(store, owner);
      if (fs.lstatSync(ownerPath).isSymbolicLink() || fs.realpathSync(ownerPath) !== hoisted.get(owner)) continue;
      for (const dep of packages) {
        const depPath = fs.realpathSync(path.join(store, dep));
        if (dep !== owner && depPath !== hoisted.get(dep)) {
          fs.cpSync(depPath, path.join(destModules, owner, 'node_modules', dep), { recursive: true, dereference: true });
        }
      }
    }
  }
}

function assertNoLinks(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Link left in deployment bundle: ${entryPath}`);
    if (entry.isDirectory()) assertNoLinks(entryPath);
  }
}

console.log('====================================================');
console.log('🚀 Starting GoDaddy Server Package Generation');
console.log('====================================================');

// Step 1: Ensure project is built
console.log('\n[1/5] Checking Next.js build artifacts...');
if (!fs.existsSync(STANDALONE_DIR)) {
  console.log('Standalone build not found. Running Next.js build...');
  execSync('npx next build', { cwd: PROJECT_DIR, stdio: 'inherit' });
} else {
  console.log('✓ Found standalone build in .next/standalone');
}

// Step 2: Prepare clean godaddy-dist directory
console.log('\n[2/5] Creating clean deployment directory: godaddy-dist...');
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

// Step 3: Copy standalone files
console.log('\n[3/5] Copying standalone application files...');
const STANDALONE_MODULES = path.join(STANDALONE_DIR, 'node_modules');
fs.cpSync(STANDALONE_DIR, DIST_DIR, {
  recursive: true,
  dereference: true,
  filter: (src) => src !== STANDALONE_MODULES,
});
copyFlatNodeModules(STANDALONE_MODULES, path.join(DIST_DIR, 'node_modules'));
assertNoLinks(DIST_DIR);

// Copy .next/static into godaddy-dist/.next/static
const distNextStatic = path.join(DIST_DIR, '.next', 'static');
if (fs.existsSync(STATIC_DIR)) {
  console.log('✓ Bundling .next/static into deployment...');
  fs.cpSync(STATIC_DIR, distNextStatic, { recursive: true });
} else {
  console.warn('⚠️ Warning: .next/static not found!');
}

// Copy public directory
const distPublic = path.join(DIST_DIR, 'public');
if (fs.existsSync(PUBLIC_DIR)) {
  console.log('✓ Bundling public folder into deployment...');
  fs.cpSync(PUBLIC_DIR, distPublic, { recursive: true });
} else {
  fs.mkdirSync(distPublic, { recursive: true });
}

// Step 4: Add GoDaddy cPanel compatibility files
console.log('\n[4/5] Adding GoDaddy cPanel configuration files...');

// 4a. app.js (cPanel Passenger startup alias)
const appJsContent = `// GoDaddy cPanel Passenger Startup Entry
// Redirects execution to Next.js standalone server
require('./server.js');
`;
fs.writeFileSync(path.join(DIST_DIR, 'app.js'), appJsContent);

// 4b. .htaccess for cPanel Apache / Passenger
const htaccessContent = `# ========================================================
# GoDaddy cPanel Apache & Phusion Passenger Configuration
# ========================================================

# Enable Gzip / Deflate Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json application/xml
</IfModule>

# Browser Caching for Next.js Static Assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Phusion Passenger (cPanel Node.js Selector)
<IfModule mod_passenger.c>
  PassengerAppRoot "."
  PassengerBaseURI "/"
  PassengerAppType node
  PassengerStartupFile server.js
</IfModule>

# Clean rewrite rules
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
</IfModule>
`;
fs.writeFileSync(path.join(DIST_DIR, '.htaccess'), htaccessContent);

// 4c. .env configuration
const envSampleContent = `# GoDaddy Production Environment Variables
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# Gemini AI Integration (Required for /api/ai-respond)
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
`;
fs.writeFileSync(path.join(DIST_DIR, '.env.production.sample'), envSampleContent);

const localEnvPath = path.join(PROJECT_DIR, '.env.local');
if (fs.existsSync(localEnvPath)) {
  fs.copyFileSync(localEnvPath, path.join(DIST_DIR, '.env'));
  console.log('✓ Copied .env.local -> godaddy-dist/.env');
} else {
  fs.writeFileSync(path.join(DIST_DIR, '.env'), envSampleContent);
}

// 4d. README_GODADDY.txt
const readmeContent = `========================================================================
HOW TO HOST THIS NEXT.JS APPLICATION ON GODADDY SERVER (cPanel)
========================================================================

Follow these exact steps:

STEP 1: Log in to GoDaddy cPanel
--------------------------------
1. Log into your GoDaddy account and open your cPanel Hosting dashboard.

STEP 2: Setup Node.js App in cPanel
-----------------------------------
1. Under the "Software" section, click "Setup Node.js App".
2. Click the "Create Application" button.
3. Configure the settings:
   - Node.js version: Choose 20.9 or newer (Next.js 16 does not run on 18.x)
   - Application mode: Production
   - Application root: app (or the folder where you will upload the files)
   - Application URL: yourdomain.com
   - Application startup file: server.js (or app.js)
4. Click "Create" (in the top right).
5. Stop the app temporarily while uploading files.

STEP 3: Upload Application Files
--------------------------------
1. Go back to cPanel Home and click "File Manager".
2. Navigate to the folder you set as your Application Root (e.g., /home/username/app or /home/username/public_html).
3. Click "Upload" at the top.
4. Select "godaddy-deployment.zip" (the zip created by this build).
5. Once 100% uploaded, select the zip file and click "Extract".
6. Ensure the extracted files (server.js, app.js, .next, node_modules, public, .env) are in the application root folder.

STEP 4: Set Environment Variables
---------------------------------
1. Open the .env file in File Manager (or configure environment variables in "Setup Node.js App"):
   GEMINI_API_KEY=your_actual_gemini_api_key
   PORT=3000
   NODE_ENV=production

STEP 5: Start the Application
-----------------------------
1. Go back to "Setup Node.js App" in cPanel.
2. Click "Restart" or "Start App".
3. Open your domain in your browser. Your Next.js app is now live!
========================================================================
`;
fs.writeFileSync(path.join(DIST_DIR, 'README_GODADDY.txt'), readmeContent);

// Step 5: Fast ZIP creation using tar or PowerShell
console.log('\n[5/5] Creating godaddy-deployment.zip...');
if (fs.existsSync(ZIP_OUTPUT)) {
  fs.rmSync(ZIP_OUTPUT, { force: true });
}

let zipCreated = false;
try {
  // Try tar first (available on modern Windows and Linux, much faster than PowerShell Compress-Archive)
  execSync(`tar -a -c -f "${ZIP_OUTPUT}" -C "${DIST_DIR}" .`, { stdio: 'pipe' });
  zipCreated = true;
} catch {
  try {
    const psCommand = `powershell -NoProfile -Command "Compress-Archive -Path '${DIST_DIR}\\*' -DestinationPath '${ZIP_OUTPUT}' -Force"`;
    execSync(psCommand, { stdio: 'inherit' });
    zipCreated = true;
  } catch (psErr) {
    console.warn('Could not automatically create zip. The godaddy-dist/ folder is ready for manual upload.');
  }
}

if (zipCreated && fs.existsSync(ZIP_OUTPUT)) {
  const stats = fs.statSync(ZIP_OUTPUT);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`🎉 SUCCESS! Generated: godaddy-deployment.zip (${sizeMb} MB)`);
  console.log(`📁 Deployment folder: ${DIST_DIR}`);
}

console.log('\n====================================================');
console.log('✅ GoDaddy Build Ready!');
console.log('Upload "godaddy-deployment.zip" to GoDaddy cPanel File Manager.');
console.log('See "godaddy-dist/README_GODADDY.txt" for full instructions.');
console.log('====================================================\n');
