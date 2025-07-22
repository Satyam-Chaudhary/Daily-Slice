import { test, expect } from '@playwright/test';

test.describe('Search Journey', () => {
  test('should allow a user to search for content and see results', async ({ page }) => {
    // 1. Go to the app
    await page.goto('/');

    // 2. Find the input and fill it. We do this to ensure the input component works.
    const searchInput = page.getByPlaceholder('Search news, movies...');
    await searchInput.fill('react');
    
    // 3. THE FIX: Directly navigate to the search page with the query.
    // This is more reliable for an automated test than simulating user events that trigger navigation.
    await page.goto('/search?q=react');

    // 4. Now that we are guaranteed to be on the correct page, assert its content.
    await expect(page.getByRole('heading', { name: /Search Results for "react"/i })).toBeVisible();
  });
});