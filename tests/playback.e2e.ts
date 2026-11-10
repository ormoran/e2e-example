import { test } from '@e2e-dev/mobile';
import { scenario } from '../test-utils/scenario';
import { loginDazn } from '../test-utils/dazn';
import { sleep } from '../test-utils/android';

scenario('DAZN: first tile starts playback', { timeout: 700_000 }, async (_ctx, step) => {
  await loginDazn(step);

  await step(
    'Tap the first content tile in the first row. ' +
      'If a details page opens, tap its "Watch", "Play" or "Watch live" button. ' +
      'If a dialog appears with text "Join the Conversation with Comments & Reaction", close it.',
  );
  await sleep(10_000);

  await step(
    'Verify that playback is running: a video player shows moving video. ' +
      'There must be no error message or persistent loading spinner.',
  );
});