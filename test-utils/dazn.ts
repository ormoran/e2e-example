import { clearAndLaunchDazn, sleep } from './android';
import type { Step } from './scenario';

const required = (key: string) => {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env ${key}. Copy .env.example to .env and load it (see README).`);
  return v;
};

export const loginDazn = async (step: Step) => {
  const user = required('DAZN_TEST_USER');
  const pass = required('DAZN_TEST_PASS');

  await clearAndLaunchDazn();
  await step('Make sure DAZN-prod-debug is launched. If LeakCanary is in the foreground, dismiss it and launch DAZN-prod-debug.');
  await step('Tap the "Log in" button.');
  await step(`Enter "${user}" in the "Email address" field, then tap "Get started".`);
  await sleep(2_000);
  await step(`Enter "${pass}" in the password field, then tap the button that submits the login.`, { retries: 0 });
  await sleep(5_000);
  await step('If an upgrade popup is visible, close it with its X button.');
};