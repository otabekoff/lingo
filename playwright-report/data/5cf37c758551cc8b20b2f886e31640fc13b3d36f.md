# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing.spec.ts >> Landing Page >> should have a Get Started button when signed out
- Location: e2e\landing.spec.ts:15:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /get started/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: /get started/i })

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
          - img "Uzbek" [ref=e36]
          - text: Uzbek
        - button "Spanish Spanish" [ref=e37] [cursor=pointer]:
          - img "Spanish" [ref=e38]
          - text: Spanish
        - button "French French" [ref=e39] [cursor=pointer]:
          - img "French" [ref=e40]
          - text: French
        - button "Italian Italian" [ref=e41] [cursor=pointer]:
          - img "Italian" [ref=e42]
          - text: Italian
        - button "Japan Japan" [ref=e43] [cursor=pointer]:
          - img "Japan" [ref=e44]
          - text: Japan
  - button "Open Next.js Dev Tools" [ref=e50] [cursor=pointer]:
    - generic [ref=e53]:
      - text: Compiling
      - generic [ref=e54]:
        - generic [ref=e55]: .
        - generic [ref=e56]: .
        - generic [ref=e57]: .
  - alert [ref=e58]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Landing Page', () => {
  4  |   test('should display the main headline', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await expect(page.locator('h1')).toContainText('Learn, practice, and master new languages with Lingo.');
  7  |   });
  8  | 
  9  |   test('should show the hero image', async ({ page }) => {
  10 |     await page.goto('/');
  11 |     const heroImage = page.locator('img[alt="Hero"]');
  12 |     await expect(heroImage).toBeVisible();
  13 |   });
  14 | 
  15 |   test('should have a Get Started button when signed out', async ({ page }) => {
  16 |     await page.goto('/');
  17 |     // Note: Clerk components might take a moment to load, but Playwright auto-waits
  18 |     const getStartedButton = page.getByRole('button', { name: /get started/i });
> 19 |     await expect(getStartedButton).toBeVisible();
     |                                    ^ Error: expect(locator).toBeVisible() failed
  20 |   });
  21 | 
  22 |   test('should have a Sign In button when signed out', async ({ page }) => {
  23 |     await page.goto('/');
  24 |     const signInButton = page.getByRole('button', { name: /already have an account/i });
  25 |     await expect(signInButton).toBeVisible();
  26 |   });
  27 | });
  28 | 
```