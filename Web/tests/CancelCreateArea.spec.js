import { test, expect } from '@playwright/test';

test('ClickOnNextAndPrevious', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByPlaceholder('Adresse email').click();
  await page.getByPlaceholder('Adresse email').fill('test4@area.fr');
  await page.getByPlaceholder('Adresse email').press('Tab');
  await page.getByPlaceholder('Mot de passe').fill('azerty');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await page.getByRole('img', { name: 'addArea' }).click();
  await page.getByText('suivant =>').click();
  await page.getByText('suivant =>').click();
  await page.getByText('<= précédent').click();
  await page.getByText('<= précédent').click();
  await page.getByText('<= précédent').click();
});
