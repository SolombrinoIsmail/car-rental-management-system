import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page successfully', async ({ page }) => {
    await page.goto('/');

    // Check that the page loads
    await expect(page).toHaveTitle(/Car Rental Management/i);

    // Check for key elements
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check mobile-specific elements
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle dark mode toggle', async ({ page }) => {
    await page.goto('/');

    // Look for dark mode toggle (if implemented)
    const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"]');
    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click();
      // Verify dark mode is applied
      await expect(page.locator('html')).toHaveClass(/dark/);
    }
  });
});
