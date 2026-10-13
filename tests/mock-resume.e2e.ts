import { expect, test } from 'e2e';

// Regression (bug bash, charter "mock"): leaving an exam and tapping Start exam again wiped the answers and restarted the timer,
// although the toast says "Your answers are saved. The timer keeps running."
test('leaving a mock exam and coming back keeps the answers', async ({ app, screen }) => {
  await app.open('/mocks');
  await screen.getByRole('button', 'Start exam').click();
  await screen.getByRole('button', /5⁄7$/).click();
  await expect(screen.getByText('Paper 1 · 1 of 12 answered')).toBeVisible();
  await screen.getByRole('button', 'Leave the exam').click();
  await expect(screen.getByRole('heading', 'Mock exams')).toBeVisible();
  await screen.getByRole("button", /^(Start|Continue) exam/).click();
  await expect(screen.getByText('Paper 1 · 1 of 12 answered')).toBeVisible();
});
