import { expect, test } from 'e2e';

// Regression (confirm run, charters "mock-fix" and "practice-fix"): Next keeps recent routes mounted, so a new attempt
// reopened at the question the last one ended on. Every new attempt must start at question 1.

const RIGHT = [/x = 7$/, /x = 24$/, /x = 6$/, /x = 7$/, /12$/];

test('practising Set 2 again starts at question 1 and scores every answer', async ({ app, screen }) => {
  await app.open('/practice/sets');
  for (let run = 0; run < 2; run++) {
    await screen.getByRole('button', run === 0 ? 'Start practice' : 'Practise Set 2 again').click();
    await expect(screen.getByRole('progressbar', 'Question 1 of 5')).toBeVisible();
    for (const [i, option] of RIGHT.entries()) {
      await screen.getByRole('button', option).click();
      await screen.getByRole('button', 'Check answer').click();
      await screen.getByRole('button', i === RIGHT.length - 1 ? 'See results' : 'Continue').click();
    }
    await expect(screen.getByText('Set 2 complete')).toBeVisible();
    await expect(screen.getByText('Mastery 42% → 70%')).toBeVisible();
    await app.open('/practice/sets');
  }
});

test('a new mock attempt starts at question 1', async ({ app, screen }) => {
  await app.open('/mocks');
  await screen.getByRole('button', 'Start exam').click();
  await screen.getByRole('button', 'Next').click();
  await screen.getByRole('button', 'Next').click();
  await expect(screen.getByRole('progressbar', 'Question 3 of 12')).toBeVisible();
  await screen.getByRole('button', 'Leave the exam').click();
  await screen.getByRole('button', 'Start a new attempt').click();
  await expect(screen.getByRole('progressbar', 'Question 1 of 12')).toBeVisible();
});

// Regression (confirm run, charter "mock-fix"): a new attempt opened with the timer above 2:30:00 (stale app clock).
test('a new mock attempt never shows more than 2 h 30 min', async ({ app, screen }) => {
  await app.open('/mocks');
  await new Promise((r) => setTimeout(r, 3000)); // let the app's load-time clock go stale
  await screen.getByRole('button', 'Start exam').click();
  await expect(screen.getByText('Maths Mock 1')).toBeVisible();
  // Read once, right away: the wrong value only lasted until the first tick, so a retrying matcher would miss it.
  const shown = await screen.getByRole('button', 'Hide timer').textContent();
  const [h, m, sec] = (shown ?? '').trim().split(':').map(Number);
  expect(h * 3600 + m * 60 + sec).toBeLessThanOrEqual(2 * 3600 + 30 * 60);
});

// Regression (confirm run, replay of "mock-exam"): submitting remounted the exam screen, which restarted the exam and
// wiped the answers just before results were read, so every mock scored 0/40 on Paper 1.
test('a submitted mock exam keeps its answers', async ({ app, screen }) => {
  await app.open('/mocks');
  await screen.getByRole('button', 'Start exam').click();
  await screen.getByRole('button', /1 5⁄12$/).click(); // question 1, correct
  await expect(screen.getByText('Paper 1 · 1 of 12 answered')).toBeVisible();
  await screen.getByRole('button', /^(Finish and submit now|Submit exam)$/).click();
  await expect(screen.getByText('BECE Maths Mock 1 · results')).toBeVisible();
  await expect(screen.getByText('3/40')).toBeVisible(); // 1 of 12 right → 3 of 40 marks
});
