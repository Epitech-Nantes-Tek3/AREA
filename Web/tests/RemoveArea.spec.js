import { test, expect } from '@playwright/test';
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  retries: process.env.CI ? 2 : 0, // set to 2 when running on CI
  use: {
    trace: 'on-first-retry', // record traces on first retry of each test
  },
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByPlaceholder('Adresse email').click();
  await page.getByPlaceholder('Adresse email').fill('thoprudhomme@gmail.com');
  await page.getByPlaceholder('Adresse email').press('Tab');
  await page.getByPlaceholder('Mot de passe').fill('azerty');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await page.getByRole('img', { name: 'trash image' }).click();
});