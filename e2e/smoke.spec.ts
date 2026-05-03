import { test, expect } from '@playwright/test';

test.describe('General Smoke Tests', () => {
  test('landing page renders and has call to action', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Learn, practice, and master new languages with Lingo.');
    await expect(page.getByRole('button', { name: /get started/i })).toBeVisible();
  });

  test('navigation to protected routes redirects to home/clerk', async ({ page }) => {
    // Attempting to go to /learn without auth should redirect or show clerk
    await page.goto('/learn');
    // Depending on clerk config, it might redirect to sign-in or stay on learn with clerk loading
    // But since we are not logged in, it shouldn't show the learn content
    await expect(page.url()).not.toContain('/learn'); 
  });

  test('admin page is not accessible to non-admins', async ({ page }) => {
    await page.goto('/admin');
    // Should redirect away from /admin (to sign-in or home)
    await expect(page.url()).not.toContain('/admin');
  });

  test('leaderboard page renders', async ({ page }) => {
    await page.goto('/leaderboard');
    // It should at least render the title or redirect if no auth
    // Since we are unauthenticated in this test, it should redirect
    await expect(page.url()).not.toContain('/leaderboard');
  });
});
