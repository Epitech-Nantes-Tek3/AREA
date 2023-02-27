import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByPlaceholder('Adresse email').click();
  await page.getByPlaceholder('Adresse email').fill('thoprudhomme@gmail.com');
  await page.getByPlaceholder('Adresse email').press('Tab');
  await page.getByPlaceholder('Mot de passe').fill('azerty');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await page.getByRole('img', { name: 'addArea' }).click();
  await page.getByText('Si l\'utilisateur écoute de la musique').click();
  await page.getByText('suivant =>').click();
  await page.getByText('Pause la musique en cours').click();
  await page.getByText('suivant =>').click();
  await page.getByText('Créer l\'Area').click();
});