import { test } from '@e2e-dev/mobile';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { screenshotPng } from './android';

const RESULTS_DIR = '.e2e/results';
const SHOTS_DIR = '.e2e/screenshots';
const DEFAULT_RETRIES = Number(process.env.STEP_RETRIES ?? 1);

// Values to redact from reports and logs.
// Ignore empty and very short values to avoid redacting single characters.
const SECRETS = [process.env.DAZN_TEST_USER, process.env.DAZN_TEST_PASS].filter(
  (v): v is string => !!v && v.length >= 4,
);
export const registerSecret = (value: string) => {
  if (value.length >= 4 && !SECRETS.includes(value)) SECRETS.push(value);
};
const redact = (s: string) => SECRETS.reduce((acc, v) => acc.split(v).join('***'), s);

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export type Step = (instruction: string, opts?: { retries?: number }) => Promise<unknown>;

type StepRecord = { instruction: string; attempts: number; error?: string };

function saveScreenshot(name: string): string | undefined {
  try {
    mkdirSync(SHOTS_DIR, { recursive: true });
    const file = join(SHOTS_DIR, `${slug(name)}-${Date.now()}.png`);
    writeFileSync(file, screenshotPng());
    return file;
  } catch {
    return undefined; // A missing screenshot must not obscure the real error.
  }
}

export function scenario(
  name: string,
  options: { timeout?: number },
  fn: (ctx: any, step: Step) => Promise<void>,
) {
  test(name, options, async (ctx: any) => {
    const started = Date.now();
    const steps: StepRecord[] = [];

    const step: Step = async (instruction, opts) => {
      const retries = opts?.retries ?? DEFAULT_RETRIES;
      // The agent receives the original instruction; only the report is redacted.
      const rec: StepRecord = { instruction: redact(instruction), attempts: 0 };
      steps.push(rec);
      for (let i = 0; i <= retries; i++) {
        rec.attempts++;
        try {
          const result = await ctx.agent.act(instruction);
          delete rec.error;
          return result;
        } catch (e: any) {
          rec.error = redact(String(e?.message ?? e));
          console.warn(`[retry] "${rec.instruction}" failed (attempt ${i + 1}/${retries + 1})`);
          if (i === retries) throw e;
        }
      }
    };

    const save = (extra: object) => {
      mkdirSync(RESULTS_DIR, { recursive: true });
      writeFileSync(
        join(RESULTS_DIR, `${slug(name)}.json`),
        JSON.stringify({ name, durationMs: Date.now() - started, steps, ...extra }, null, 2),
      );
    };

    try {
      await fn(ctx, step);
      save({ status: 'passed' });
    } catch (e: any) {
      save({
        status: 'failed',
        message: redact(String(e?.message ?? e)),
        screenshot: saveScreenshot(name),
      });
      throw e;
    }
  });
}