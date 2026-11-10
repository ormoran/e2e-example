import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = '.e2e/results';
const esc = (s = '') =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const results = existsSync(DIR)
  ? readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(join(DIR, f), 'utf8')))
  : [];

const passed = results.filter((r) => r.status === 'passed').length;
const failed = results.length - passed;

const rows = results.map((r) => {
  const img = r.screenshot && existsSync(r.screenshot)
    ? `<img src="data:image/png;base64,${readFileSync(r.screenshot).toString('base64')}" style="max-width:320px;border:1px solid #ccc">`
    : '';
  const steps = (r.steps ?? []).map((s) =>
    `<li>${esc(s.instruction)}${s.attempts > 1 ? ` <em>(attempts: ${s.attempts})</em>` : ''}${s.error ? `<pre>${esc(s.error)}</pre>` : ''}</li>`,
  ).join('');
  return `<section class="${r.status}">
    <h2>${r.status === 'passed' ? '✅' : '❌'} ${esc(r.name)} <small>${(r.durationMs / 1000).toFixed(1)}s</small></h2>
    ${r.message ? `<pre>${esc(r.message)}</pre>` : ''}
    ${img}
    <details><summary>Steps</summary><ol>${steps}</ol></details>
  </section>`;
}).join('\n');

mkdirSync('.e2e', { recursive: true });
writeFileSync('.e2e/report.html', `<!doctype html><meta charset="utf-8"><title>E2E report</title>
<style>body{font-family:sans-serif;max-width:900px;margin:2em auto}section{border-left:6px solid #2a2;padding:0 1em;margin:1em 0}
section.failed{border-color:#c22}pre{background:#f5f5f5;padding:.5em;white-space:pre-wrap}small{color:#777}</style>
<h1>E2E report</h1><p>${new Date().toISOString()} · passed: ${passed} · failed: ${failed}</p>${rows}`);
console.log(`Report: .e2e/report.html (${passed} passed, ${failed} failed)`);