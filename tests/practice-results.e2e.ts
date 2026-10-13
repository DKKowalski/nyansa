import { expect, test, type TestFixtures } from 'e2e';

// Wrong answer for each of the 5 Set 2 questions, matched by the end of the option's accessible name.
const WRONG = [/x = 30$/, /x = 1\.5$/, /x = 9\.5$/, /x = 3$/, /15$/];

async function failWholeSet({ app, screen }: Pick<TestFixtures, 'app' | 'screen'>) {
  await app.open('/practice/sets');
  await screen.getByRole('button', 'Start practice').click();
  for (const [i, option] of WRONG.entries()) {
    await screen.getByRole('button', option).click();
    await screen.getByRole('button', 'Check answer').click();
    await screen.getByRole('button', i === WRONG.length - 1 ? 'See results' : 'Continue').click();
  }
  await expect(screen.getByText('Set 2 complete')).toBeVisible();
}

// Regression (bug bash, charter "practice-state"): with 0 of 5 correct the summary still said mastery went up.
test('mastery does not rise after a set with no correct answers', async ({ app, screen }) => {
  await failWholeSet({ app, screen });
  await expect(screen.getByText('Mastery 42% → 50%')).toBeHidden();
});

// Regression (bug bash, charter "practice-state"): Progress > Recent activity always reported Set 2 as 4/5.
test('recent activity shows the score of the set just finished', async ({ app, screen }) => {
  await failWholeSet({ app, screen });
  await app.open('/progress');
  await expect(screen.getByText('0/5')).toBeVisible();
});
