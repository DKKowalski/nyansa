import { expect, test } from 'e2e';

// Regression (bug bash, charter "signup-input"): a 30-digit number could be sent. Ghana mobile numbers are 9 digits after +233.
test('an overlong phone number cannot be sent', async ({ app, screen }) => {
  await app.open('/signup/contact');
  await screen.getByLabel('Phone number').fill('123456789012345678901234567890');
  await expect(screen.getByRole('button', 'Send code')).toBeDisabled();
});

// Regression (bug bash, charter "signup-input"): the local format with a leading 0 was kept after +233.
test('a number typed with a leading 0 is shown in international form', async ({ app, agent, screen }) => {
  await app.open('/signup/contact');
  await screen.getByLabel('Phone number').fill('024 123 4567');
  await agent.act('Tick the box agreeing to the Terms and Privacy Policy, then tap Send code');
  await expect(screen.getByText('Sent to +233 24 123 4567')).toBeVisible();
});
