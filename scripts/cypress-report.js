#!/usr/bin/env node

const cypress = require('cypress');
const fs = require('fs');
const path = require('path');

const REPORT_DIR = path.join(__dirname, '..', 'reports', 'latest');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function parseCliArgs(argv) {
  const args = argv.slice(2);
  const config = {};

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];

    if (!token.startsWith('--')) {
      continue;
    }

    const key = token.slice(2);
    const next = args[index + 1];

    if (!next || next.startsWith('--')) {
      config[key] = true;
      continue;
    }

    config[key] = next;
    index += 1;
  }

  return config;
}

function toSummary(run) {
  const runs = (run.runs || []).map((specRun) => ({
    spec: specRun.spec && specRun.spec.relative,
    stats: specRun.stats || {},
    tests: (specRun.tests || []).map((test) => ({
      title: test.title,
      state: test.state,
      attempts: test.attempts,
      displayError: test.displayError || null,
    })),
  }));

  return {
    status: run.status,
    startedTestsAt: run.startedTestsAt,
    endedTestsAt: run.endedTestsAt,
    browserName: run.browserName,
    browserVersion: run.browserVersion,
    osName: run.osName,
    osVersion: run.osVersion,
    cypressVersion: run.cypressVersion,
    totalDuration: run.totalDuration,
    totalTests: run.totalTests,
    totalPassed: run.totalPassed,
    totalFailed: run.totalFailed,
    totalPending: run.totalPending,
    totalSkipped: run.totalSkipped,
    runs,
  };
}

function buildHtml(summary) {
  const specRows = summary.runs.map((run) => `
    <tr>
      <td>${run.spec || ''}</td>
      <td>${run.stats.tests || 0}</td>
      <td>${run.stats.passes || 0}</td>
      <td>${run.stats.failures || 0}</td>
      <td>${run.stats.pending || 0}</td>
      <td>${run.stats.duration || 0} ms</td>
    </tr>
  `).join('');

  const failedTests = summary.runs
    .flatMap((run) => (run.tests || []).filter((test) => test.state === 'failed').map((test) => ({
      spec: run.spec,
      title: test.title.join(' > '),
      error: test.displayError || 'No error message available',
    })));

  const failureMarkup = failedTests.length === 0
    ? '<p class="good">No failed tests.</p>'
    : failedTests.map((failure) => `
      <div class="failure">
        <h3>${failure.spec}</h3>
        <p><strong>${failure.title}</strong></p>
        <pre>${failure.error}</pre>
      </div>
    `).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cypress Test Report</title>
  <style>
    :root {
      --bg: #f4efe6;
      --panel: #fffdf8;
      --ink: #1f2933;
      --muted: #64748b;
      --accent: #0f766e;
      --danger: #b91c1c;
      --border: #e7dcc9;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 32px;
      font-family: Georgia, "Times New Roman", serif;
      background: radial-gradient(circle at top, #fff7ed 0%, var(--bg) 55%);
      color: var(--ink);
    }
    .wrap {
      max-width: 1100px;
      margin: 0 auto;
    }
    .hero, .panel {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 18px;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
    }
    .hero {
      padding: 28px;
      margin-bottom: 24px;
    }
    h1, h2, h3 { margin-top: 0; }
    .meta {
      color: var(--muted);
      margin-top: 8px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 16px;
      margin-top: 24px;
    }
    .stat {
      padding: 18px;
      border-radius: 14px;
      background: #fffbf3;
      border: 1px solid var(--border);
    }
    .stat strong {
      display: block;
      font-size: 28px;
      color: var(--accent);
    }
    .panel {
      padding: 24px;
      margin-bottom: 24px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }
    th { color: var(--muted); }
    .failure {
      padding: 16px;
      border: 1px solid #fecaca;
      background: #fff1f2;
      border-radius: 12px;
      margin-bottom: 16px;
    }
    .good {
      color: var(--accent);
      font-weight: 700;
    }
    pre {
      white-space: pre-wrap;
      word-break: break-word;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <section class="hero">
      <h1>Cypress Test Report</h1>
      <p class="meta">Status: ${summary.status} | Cypress ${summary.cypressVersion} | ${summary.browserName} ${summary.browserVersion}</p>
      <p class="meta">${summary.osName} ${summary.osVersion}</p>
      <div class="stats">
        <div class="stat"><span>Total Tests</span><strong>${summary.totalTests}</strong></div>
        <div class="stat"><span>Passed</span><strong>${summary.totalPassed}</strong></div>
        <div class="stat"><span>Failed</span><strong>${summary.totalFailed}</strong></div>
        <div class="stat"><span>Pending</span><strong>${summary.totalPending}</strong></div>
        <div class="stat"><span>Skipped</span><strong>${summary.totalSkipped}</strong></div>
        <div class="stat"><span>Duration</span><strong>${summary.totalDuration} ms</strong></div>
      </div>
    </section>

    <section class="panel">
      <h2>Spec Results</h2>
      <table>
        <thead>
          <tr>
            <th>Spec</th>
            <th>Tests</th>
            <th>Passed</th>
            <th>Failed</th>
            <th>Pending</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>${specRows}</tbody>
      </table>
    </section>

    <section class="panel">
      <h2>Failures</h2>
      ${failureMarkup}
    </section>
  </div>
</body>
</html>`;
}

async function main() {
  ensureDir(REPORT_DIR);

  const cliOptions = parseCliArgs(process.argv);
  const runOptions = {
    headless: true,
    ...cliOptions,
  };

  const result = await cypress.run(runOptions);
  const summary = toSummary(result);

  fs.writeFileSync(
    path.join(REPORT_DIR, 'results.json'),
    JSON.stringify(result, null, 2),
    'utf8',
  );
  fs.writeFileSync(
    path.join(REPORT_DIR, 'summary.json'),
    JSON.stringify(summary, null, 2),
    'utf8',
  );
  fs.writeFileSync(
    path.join(REPORT_DIR, 'index.html'),
    buildHtml(summary),
    'utf8',
  );

  if (summary.totalFailed > 0 || summary.status === 'failed') {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
