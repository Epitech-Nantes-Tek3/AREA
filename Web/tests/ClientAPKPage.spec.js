import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByPlaceholder('Adresse email').click();
    await page.getByPlaceholder('Adresse email').fill('test3@area.fr');
    await page.getByPlaceholder('Adresse email').press('Tab');
    await page.getByPlaceholder('Mot de passe').fill('azerty');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await page.getByRole('link', { name: 'Télécharger client.apk' }).click();
});