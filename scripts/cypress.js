const { spawnSync } = require('node:child_process');
const path = require('node:path');

delete process.env.ELECTRON_RUN_AS_NODE;

const cypressRoot = path.dirname(require.resolve('cypress/package.json'));
const cypressBin = path.join(cypressRoot, 'bin', 'cypress');
const result = spawnSync(process.execPath, [cypressBin, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: process.env,
  shell: false
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
