import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display the main headline', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Learn, practice, and master new languages with Lingo.');
  });

  test('should show the hero image', async ({ page }) => {
    await page.goto('/');
    const heroImage = page.locator('img[alt="Hero"]');
    await expect(heroImage).toBeVisible();
  });

  test('should have a Get Started button when signed out', async ({ page }) => {
    await page.goto('/');
    // Note: Clerk components might take a moment to load, but Playwright auto-waits
    const getStartedButton = page.getByRole('button', { name: /get started/i });
    await expect(getStartedButton).toBeVisible();
  });

  test('should have a Sign In button when signed out', async ({ page }) => {
    await page.goto('/');
    const signInButton = page.getByRole('button', { name: /already have an account/i });
    await expect(signInButton).toBeVisible();
  });
});
