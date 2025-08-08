import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests @visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage visual snapshot @visual', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('login page visual snapshot @visual', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('dashboard visual snapshot @visual', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveScreenshot('dashboard.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
