import { expect, test } from 'e2e';

test('a mock exam can be answered, flagged, submitted and graded', async ({ app, agent, screen }) => {
  await app.open('/mocks');
  await screen.getByRole('button', 'Start exam').click();
  await expect(screen.getByText('Maths Mock 1')).toBeVisible();
  await agent.act('Answer question 1, flag it for review, go to question 2 and answer it, then submit the exam');
  await expect(screen.getByText('BECE Maths Mock 1 · results')).toBeVisible();
  await agent.assert('The results show a BECE grade between 1 and 9 and a mark out of 100');
});
