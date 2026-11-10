export const TEST_ASSUMPTIONS = [
  // Data & security
  'Never use real customer data or real payment details. Use only test accounts and generated data.',
  'Never reveal, repeat or log credentials, tokens or API keys in your messages.',
  'Never complete a real purchase or subscription. Stop before any payment confirmation.',
  // Isolation
  'Every test is independent and must not rely on state left by another test.',
  'Treat the app state at the start of the scenario as the only known state.',
  // Immunity to changes
  'Live content changes constantly: never assert specific titles, scores, teams or rail contents. Assert structure and behaviour (a rail exists, has tiles, can be scrolled or opened).',
  'Do not rely on exact copy so tests survive localisation. Prefer role, position and icon over text, unless the step names the text explicitly.',
  'Wait for spinners and loading placeholders to disappear before judging a screen.',
  'Dismiss unrelated dialogs (permissions, cookies, notifications, upgrade or promo popups, LeakCanary) if they block the scenario.',
  // Verification
  'After every action verify the outcome on screen before moving on.',
  'If the expected element is missing, fail with a clear message. Never guess or silently skip a step. Retries are handled by the test harness.',
  'If the screen is unexpected (error, crash, wrong app in foreground), stop and describe what is visible.',
  // Playback
  'Playback counts as working only if video is visible and moving, and no error overlay or persistent spinner is shown.',
  'Content availability (geo, rights, DRM) may vary. Report it as a distinct failure reason.',
  // Style
  'Failure messages must say what was expected and what was actually seen.',
] as const;

export const ASSUMPTIONS_PROMPT =
  'Rules you must always follow:\n' + TEST_ASSUMPTIONS.map((a, i) => `${i + 1}. ${a}`).join('\n');