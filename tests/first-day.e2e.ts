import { expect, test } from 'e2e';

test('a new student signs up, takes the check-in and lands on Home with a plan', async ({ app, agent, screen }) => {
  await app.open('/welcome');
  await agent.act('Go through the welcome slides and choose to continue with a phone number');
  await agent.act('Enter the phone number 24 123 4567, send the code, and enter any 6-digit code to verify');
  await agent.act('Set up as a student named Kwame writing the BECE in JHS 3, keep all four subjects, choose 30 minutes a day, and finish setup');
  await agent.act('In the Maths check-in, pick a mood, answer all 8 questions (any answers), and build the study plan');
  await expect(screen.getByRole('heading', 'Kwame')).toBeVisible();
  await agent.assert('Home shows an "Up next" card with a Start lesson button and how many days are left until the BECE');
});
