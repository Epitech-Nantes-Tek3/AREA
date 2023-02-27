const { test, expect } = require('@playwright/test');

test('Connexion page', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Click the get started link.
    await expect(page).toHaveTitle('Area App');
})