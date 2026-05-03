# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing.spec.ts >> Landing Page >> should display the main headline
- Location: e2e\landing.spec.ts:4:7

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
        - button "Sign In" [ref=e8] [cursor=pointer]
    - main [ref=e9]:
      - generic [ref=e10]:
        - img "Hero" [ref=e12]
        - generic [ref=e13]:
          - heading "Learn, practice, and master new languages with Lingo." [level=1] [ref=e14]
          - generic [ref=e15]:
            - button "Get Started" [ref=e16] [cursor=pointer]
            - button "Already have an account" [ref=e17] [cursor=pointer]
    - contentinfo [ref=e18]:
      - generic [ref=e19]:
        - button "Uzbek Uzbek" [ref=e20] [cursor=pointer]:
          - img "Uzbek" [ref=e21]
          - text: Uzbek
        - button "Spanish Spanish" [ref=e22] [cursor=pointer]:
          - img "Spanish" [ref=e23]
          - text: Spanish
        - button "French French" [ref=e24] [cursor=pointer]:
          - img "French" [ref=e25]
          - text: French
        - button "Italian Italian" [ref=e26] [cursor=pointer]:
          - img "Italian" [ref=e27]
          - text: Italian
        - button "Japan Japan" [ref=e28] [cursor=pointer]:
          - img "Japan" [ref=e29]
          - text: Japan
  - button "Open Next.js Dev Tools" [ref=e35] [cursor=pointer]:
    - img [ref=e36]
  - alert [ref=e40]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Landing Page', () => {
  4  |   test('should display the main headline', async ({ page }) => {
  5  |     await page.goto('/');
> 6  |     await expect(page.locator('h1')).toContainText('Learn, practice, and master new languages with Lingo.');
     |                                      ^ Error: expect(locator).toContainText(expected) failed
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
  19 |     await expect(getStartedButton).toBeVisible();
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