# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> General Smoke Tests >> landing page renders and has call to action
- Location: e2e\smoke.spec.ts:4:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1')
Expected substring: "Learn, practice, and master new languages with Lingo."
Error: strict mode violation: locator('h1') resolved to 2 elements:
    1) <h1 class="text-2xl font-extrabold tracking-wide text-green-600">Lingo</h1> aka getByRole('heading', { name: 'Lingo', exact: true })
    2) <h1 class="max-w[480px] text-center text-xl font-bold text-neutral-600 lg:text-3xl">Learn, practice, and master new languages with Li…</h1> aka getByRole('heading', { name: 'Learn, practice, and master' })

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('h1')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - region "Notifications alt+T"
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - img "Mascot" [ref=e6]
          - heading "Lingo" [level=1] [ref=e7]
        - img [ref=e8]
    - main [ref=e17]:
      - generic [ref=e18]:
        - img "Hero" [ref=e20]
        - generic [ref=e21]:
          - heading "Learn, practice, and master new languages with Lingo." [level=1] [ref=e22]
          - img [ref=e24]
    - contentinfo [ref=e33]:
      - generic [ref=e34]:
        - button "Uzbek Uzbek" [ref=e35] [cursor=pointer]:
          - img "Uzbek"
          - text: Uzbek
        - button "Spanish Spanish" [ref=e36] [cursor=pointer]:
          - img "Spanish"
          - text: Spanish
        - button "French French" [ref=e37] [cursor=pointer]:
          - img "French"
          - text: French
        - button "Italian Italian" [ref=e38] [cursor=pointer]:
          - img "Italian"
          - text: Italian
        - button "Japan Japan" [ref=e39] [cursor=pointer]:
          - img "Japan"
          - text: Japan
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('General Smoke Tests', () => {
  4  |   test('landing page renders and has call to action', async ({ page }) => {
  5  |     await page.goto('/');
> 6  |     await expect(page.locator('h1')).toContainText('Learn, practice, and master new languages with Lingo.');
     |                                      ^ Error: expect(locator).toContainText(expected) failed
  7  |     await expect(page.getByRole('button', { name: /get started/i })).toBeVisible();
  8  |   });
  9  | 
  10 |   test('navigation to protected routes redirects to home/clerk', async ({ page }) => {
  11 |     // Attempting to go to /learn without auth should redirect or show clerk
  12 |     await page.goto('/learn');
  13 |     // Depending on clerk config, it might redirect to sign-in or stay on learn with clerk loading
  14 |     // But since we are not logged in, it shouldn't show the learn content
  15 |     await expect(page.url()).not.toContain('/learn'); 
  16 |   });
  17 | 
  18 |   test('admin page is not accessible to non-admins', async ({ page }) => {
  19 |     await page.goto('/admin');
  20 |     // Should redirect away from /admin (to sign-in or home)
  21 |     await expect(page.url()).not.toContain('/admin');
  22 |   });
  23 | 
  24 |   test('leaderboard page renders', async ({ page }) => {
  25 |     await page.goto('/leaderboard');
  26 |     // It should at least render the title or redirect if no auth
  27 |     // Since we are unauthenticated in this test, it should redirect
  28 |     await expect(page.url()).not.toContain('/leaderboard');
  29 |   });
  30 | });
  31 | 
```