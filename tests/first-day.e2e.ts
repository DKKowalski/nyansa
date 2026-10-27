import { expect, test } from 'e2e';

test('a new student under 18 signs up with a parent, takes the check-in and lands on Home with a plan', async ({ app, agent, screen }) => {
  await app.open('/welcome');
  await agent.act('Go through the welcome slides and choose "I\'m a student"');
  await agent.act('Choose JHS, then enter the name Kwame Mensah and the date of birth 12 March 2012, and continue');
  await agent.act('As the parent, enter Akosua Mensah, choose Mother, enter the phone number 24 555 0192, tick the box agreeing on your behalf, and send the code');
  await agent.act('Enter any 6-digit code to verify, then create the username SwiftSunbird24 with the password mango2024');
  await agent.act('Choose JHS 3, keep all four subjects, choose 30 minutes a day, and finish setup');
  await agent.act('In the Maths check-in, pick a mood, answer all 8 questions (any answers), and build the study plan');
  await expect(screen.getByRole('heading', 'Kwame')).toBeVisible();
  await agent.assert('Home shows an "Up next" card with a Start lesson button and how many days are left until the BECE');
});
