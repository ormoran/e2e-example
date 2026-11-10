import { test } from '@e2e-dev/mobile';
import { scenario } from '../test-utils/scenario';
import { loginDazn } from '../test-utils/dazn';
import { sleep } from '../test-utils/android';

scenario('DAZN: home rails are displayed and scrollable', { timeout: 600_000 }, async (_ctx, step) => {
  await loginDazn(step);
  await sleep(3_000);

  await step('Verify that the home screen shows at least one content rail: a rail title and several content tiles with images.');
  await step('Swipe the first content rail horizontally to the left once.');
  await sleep(4_000);
  await step('Verify that the first rail scrolled and shows different tiles than before, and the tile images are loaded.');
  await step('Scroll the home screen down once.');
  await sleep(1_000);
  await step('Verify that a second content rail is visible with a title and tiles, and no error message is shown.');
});