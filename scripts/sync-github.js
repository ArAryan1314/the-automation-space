// Commits local changes and pushes them to GitHub. The repository is public, so
// the run stops without committing if a private file or secret would be included.
//
//   node scripts/sync-github.js          commit and push
//   node scripts/sync-github.js --check  report what would be committed, change nothing
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BRANCH = 'main';
const LOG_FILE = path.join(ROOT, '.git', 'github-sync.log');
const MAX_LOG_BYTES = 1024 * 1024;
const MAX_SCAN_BYTES = 5 * 1024 * 1024;
const CHECK_ONLY = process.argv.includes('--check');

const BLOCKED_PATHS = [
  /(^|\/)\.env(?!\.example$)/,
  /^\.data\//,
  /^godaddy-dist\//,
  /\.(zip|pem|key|p12|pfx)$/i,
];

const SECRET_PATTERNS = [
  { name: 'Google API key', pattern: /AIza[0-9A-Za-z_-]{30,}/ },
  { name: 'GitHub token', pattern: /\b(ghp|gho|ghu|ghs|ghr)_[0-9A-Za-z]{30,}|github_pat_[0-9A-Za-z_]{30,}/ },
  { name: 'private key', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
];

function git(...args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function log(message) {
  const line = `${new Date().toISOString()} ${message}`;
  console.log(line);
  if (CHECK_ONLY) return;
  if (fs.existsSync(LOG_FILE) && fs.statSync(LOG_FILE).size > MAX_LOG_BYTES) fs.rmSync(LOG_FILE);
  fs.appendFileSync(LOG_FILE, `${line}\n`);
}

// The real values in .env.local are checked too, in case one is pasted into a source file.
function localSecretValues() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return [];
  return fs.readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*[A-Z0-9_]*(KEY|HASH|SECRET|PASSWORD|TOKEN)[A-Z0-9_]*\s*=\s*"?([^"\s]{8,})"?\s*$/))
    .filter(Boolean)
    .map((match) => match[2]);
}

function findProblems(paths) {
  const secrets = localSecretValues();
  const problems = [];
  for (const file of paths) {
    if (BLOCKED_PATHS.some((pattern) => pattern.test(file))) {
      problems.push(`${file}: private file`);
      continue;
    }
    const fullPath = path.join(ROOT, file);
    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).size > MAX_SCAN_BYTES) continue;
    const content = fs.readFileSync(fullPath, 'utf8');
    for (const { name, pattern } of SECRET_PATTERNS) {
      if (pattern.test(content)) problems.push(`${file}: looks like a ${name}`);
    }
    if (secrets.some((value) => content.includes(value))) problems.push(`${file}: contains a value from .env.local`);
  }
  return problems;
}

function main() {
  const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
  if (branch !== BRANCH) throw new Error(`on branch "${branch}", expected "${BRANCH}"`);
  if (fs.existsSync(path.join(ROOT, '.git', 'rebase-merge')) || fs.existsSync(path.join(ROOT, '.git', 'MERGE_HEAD'))) {
    throw new Error('a merge or rebase is in progress');
  }

  git('add', '-A');
  const changed = git('diff', '--cached', '--name-only', '--diff-filter=ACMR').split('\n').filter(Boolean);
  const removed = git('diff', '--cached', '--name-only', '--diff-filter=D').split('\n').filter(Boolean);
  const problems = findProblems(changed);

  if (problems.length > 0 || CHECK_ONLY) git('reset', '-q');
  if (problems.length > 0) throw new Error(`nothing sent. Blocked:\n  ${problems.join('\n  ')}`);

  if (CHECK_ONLY) {
    log(`check passed: ${changed.length} changed, ${removed.length} removed`);
    return;
  }

  if (changed.length + removed.length > 0) {
    git('commit', '-q', '-m', `Auto-sync: ${changed.length + removed.length} file(s) updated`);
  }

  git('fetch', '-q', 'origin', BRANCH);
  try {
    git('rebase', '-q', `origin/${BRANCH}`);
  } catch (error) {
    git('rebase', '--abort');
    throw new Error(`GitHub has changes that conflict with local ones. Resolve them by hand. ${error.message}`);
  }

  const ahead = Number(git('rev-list', '--count', `origin/${BRANCH}..HEAD`));
  if (ahead === 0) return; // Quiet when idle, so the log only records real syncs.
  git('push', '-q', 'origin', BRANCH);
  log(`pushed ${ahead} commit(s), now at ${git('rev-parse', '--short', 'HEAD')}`);
}

try {
  main();
} catch (error) {
  log(`FAILED: ${error.message}`);
  process.exitCode = 1;
}
