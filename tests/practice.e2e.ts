import { expect, test } from 'e2e';

test('a practice set ends in a summary whose numbers agree', async ({ app, agent, screen }) => {
  await app.open('/practice/sets');
  await screen.getByRole('button', 'Start practice').click();
  await agent.act('Answer all 5 practice questions: pick an answer, check it, read the feedback, and continue until the results screen appears');
  await expect(screen.getByText('Set 2 complete')).toBeVisible();
  await agent.assert('The summary shows a score out of 5 and a number of mistakes saved to review, and the score plus the mistakes equals 5');
});
