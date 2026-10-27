import { expect, test } from 'e2e';

test('a student under 18 cannot send the parent code until the parent agrees', async ({ app, agent, screen }) => {
  await app.open('/signup/level');
  await agent.act('Choose SHS, enter the name Abena Owusu and the date of birth 5 May 2010, and continue');
  await agent.act('Enter the parent Kojo Owusu, choose Father and the phone number 24 555 0192, but do not tick the agreement box');
  await expect(screen.getByRole('button', 'Send Kojo a code')).toBeDisabled();
  await agent.act('Tick the box agreeing on your behalf');
  await expect(screen.getByRole('button', 'Send Kojo a code')).toBeEnabled();
});

test('a student 18 or over can sign up with an email and no phone number', async ({ app, agent }) => {
  await app.open('/signup/level');
  await agent.act('Choose Tertiary, enter the name Efua Asante and the date of birth 3 July 2005, and continue');
  await agent.act('Choose Email, enter efua@gmail.com, leave the phone number empty, agree to the terms, send the code and verify with any 6 digits');
  await agent.assert('The screen asks for a username and password');
});

test('a parent signs up and gets a login card for their child', async ({ app, agent }) => {
  await app.open('/welcome');
  await agent.act('Skip the slides and choose "I\'m a parent or guardian"');
  await agent.act('Enter the phone number 20 123 4567, agree to the terms, send the code and verify with any 6 digits');
  await agent.act('Enter the name Akosua Mensah and the password cocoa1234, then add a child named Ama writing the BECE in JHS 2');
  await agent.assert('A login card shows a username and a password for Ama');
  await agent.act('Go to the dashboard');
  await agent.assert('The parent dashboard lists Ama under "Your children" with her username');
});
