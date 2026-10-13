import { expect, test } from 'e2e';

// No agent steps: this runs without a model.
test('the tutor quizzes the student and accepts a typed answer', async ({ app, screen }) => {
  await app.open('/tutor');
  await screen.getByRole('button', 'Test me').click();
  await expect(screen.getByText('Try this one: solve 6x − 4 = 20. Type your answer below.')).toBeVisible();
  await screen.getByLabel('Message').fill('4');
  await screen.getByLabel('Message').press('Enter');
  await expect(screen.getByText('Yes! 6 × 4 − 4 = 20. Nicely done.')).toBeVisible();
});
