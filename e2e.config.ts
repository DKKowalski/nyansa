import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';
import { chatgpt } from 'e2e/oauth/chatgpt';

// Agent e2e tests (TesterArmy e2e). Run against a production build: `npm run build && npm run start:e2e`,
// then `npx e2e run`. Models come from the ChatGPT login stored by `npx e2e login openai`.
const app = { url: process.env.APP_URL ?? 'http://127.0.0.1:3124' };

/** What the agents must know so placeholders are not reported as bugs. */
export const context =
  'Nyansa is a BECE/WASSCE exam-prep web app for Ghanaian students in a UI-only build: there is no backend, no real SMS and no AI. ' +
  'All data is sample content saved in this browser (localStorage). Any 6-digit SMS code is accepted. ' +
  'Mathematics is the only subject with sample content. Buttons that show a short toast such as "... comes later" or "... comes in the build" are intended placeholders. ' +
  'The tutor replies are scripted. The mock exam timer starts at 2 h 30 min. On screens under 900px wide the app uses a phone layout with a bottom tab bar; wider screens get a side menu.';

export default {
  tests: ['tests/**/*.e2e.ts'],
  targets: [
    // Most students use cheap Android phones: Chromium at a small phone size is the main target.
    { name: 'android', engine: web({ viewport: { width: 360, height: 780 } }), app },
    { name: 'iphone', engine: web({ browser: 'webkit', viewport: { width: 390, height: 844 } }), app },
    { name: 'laptop', engine: web({ viewport: { width: 1280, height: 800 } }), app },
  ],
  agents: {
    default: {
      model: chatgpt(process.env.E2E_MODEL ?? 'gpt-6-luna'),
      system: 'You are a 14-year-old JHS 3 student in Ghana preparing for the BECE on an inexpensive Android phone. Verify every outcome you expect.',
      context,
    },
  },
} satisfies E2EConfig;
