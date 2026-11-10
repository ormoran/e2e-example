import 'dotenv/config';
import { mobile } from '@e2e-dev/mobile';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { ASSUMPTIONS_PROMPT } from './test-utils/assumptions';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? 'xxxxx',
});

export default {
  agents: {
    default: {
      model: google('gemini-3-flash-preview'),
      system: `You are a thorough QA agent. Verify every outcome.\n\n${ASSUMPTIONS_PROMPT}`,
    },
  },
  targets: [{ name: 'android', engine: mobile({ platform: 'android' }), app: { bundleId: 'com.dazn' } }],

  workers: 1,
  timeout: 960000,
};