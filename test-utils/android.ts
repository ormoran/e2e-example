import { execSync, execFileSync } from 'node:child_process';

export const PKG = 'com.dazn'; // Replace with the actual package name: adb shell pm list packages | grep -i dazn

// Run:
// adb shell cmd package query-activities --brief -a android.intent.action.MAIN -c android.intent.category.LAUNCHER com.dazn
// Select the main DAZN activity, NOT leakcanary.internal.activity.LeakLauncherActivity.

const SERIAL = process.env.ANDROID_SERIAL ?? '';

export const adb = (command: string) =>
  execSync(
    `adb ${SERIAL ? `-s ${SERIAL} ` : ''}${command}`,
    { encoding: 'utf8', stdio: 'pipe' },
  );

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// Launch the app explicitly and deterministically, bypassing LeakCanary.
const startDazn = () => adb(`shell monkey -p ${PKG} 1`);

// Clean launch: clears app data (logs out) and starts the main activity.
export const clearAndLaunchDazn = async () => {
  adb(`shell pm clear ${PKG}`);
  startDazn();
  await sleep(5_000); // Cold start wait.
};

// Restart without clearing data: preserves the logged-in session.
export const relaunchDazn = async () => {
  adb(`shell am force-stop ${PKG}`);
  startDazn();
  await sleep(5_000);
};

// Capture the current device screen as a PNG buffer.
export const screenshotPng = (): Buffer =>
  execFileSync(
    'adb',
    [...(SERIAL ? ['-s', SERIAL] : []), 'exec-out', 'screencap', '-p'],
    { maxBuffer: 50 * 1024 * 1024 },
  );