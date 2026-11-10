# DAZN mobile E2E tests

## Requirements

- Node.js 24.8 or newer (or 22.22.3 or newer).
- Android Debug Bridge and an Android device or emulator with the DAZN debug app (`com.dazn`) installed.
- A Google Gemini API key, set as `GOOGLE_GENERATIVE_AI_API_KEY`.
- A dedicated DAZN test account for the login tests.

## Setup

Install the JavaScript dependencies:

```sh
npm ci
```

Copy `.env.example` to `.env` and set `GOOGLE_GENERATIVE_AI_API_KEY` to your Gemini API key, and `DAZN_TEST_USER` and `DAZN_TEST_PASS` to dedicated test-account credentials. Do not commit `.env`, use a personal account, or enter real customer/payment data. The Android target automatically discovers booted Android devices and emulators. `ANDROID_SERIAL` can be left empty to use the default connected device.

Connect the Android device or emulator and confirm it is available with `adb devices -l`.

## Run

Run all E2E tests:

```sh
npm test
```

Run one test file:

```sh
npm test -- tests/rails.e2e.ts
```

Check the setup without running tests:

```sh
npm run test:doctor
npm run test:list
```

The signup test attempts to create a DAZN account using a generated `@dazn.test` address. Run it only against an appropriate test environment. Reports are written under `.e2e/`; generate the HTML report with `npm run test:report`.
