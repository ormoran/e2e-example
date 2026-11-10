import { test } from '@e2e-dev/mobile';
import { registerSecret, scenario } from '../test-utils/scenario';
import { clearAndLaunchDazn, sleep } from '../test-utils/android';

scenario('DAZN: signup with new email', { timeout: 300_000 }, async (_ctx, step) => {
  const ts = Date.now();
  const email = `dazn.e2e+${ts}@dazn.test`; // Unique on every run.
  const password = `Dazn${ts}!`;
  registerSecret(email);
  registerSecret(password);

  await clearAndLaunchDazn();

  await step('Tap the "Log in", "Sign up" or "Sign in" button.');
  await step(`Enter "${email}" in the "Email address" field, then tap "Get started".`);
  await sleep(2_000);

  // Do not retry: a retry could attempt to create the same account again.
  await step(
    `On the account creation screen fill in the password "${password}" and any required fields, ` +
      'accept required terms only, then tap the button that continues. Do not enter payment details.',
    { retries: 0 },
  );
  await sleep(5_000);

  await step(
    'Verify that the account was created: either the DAZN home screen or a subscription/plan selection screen is visible, ' +
      'and no error message is shown. Do not tap Subscribe.',
  );
});