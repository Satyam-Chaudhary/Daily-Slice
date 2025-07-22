import { test, expect } from '@playwright/test';

// 1. Create a mock API response that looks like the real thing
const mockApiResponse = {
  status: "ok",
  totalResults: 1,
  articles: [
    {
      source: { id: null, name: 'E2E Test News' },
      author: 'Test Author',
      title: 'Cypress and Playwright Are Awesome',
      description: 'A test description for our E2E test.',
      url: 'https://example.com/test-article-123',
      urlToImage: null,
      publishedAt: new Date().toISOString(),
      content: 'Test content.',
    }
  ]
};

test.describe('Favorites Journey', () => {
  test('should allow a user to favorite an item and see it on the favorites page', async ({ page }) => {
    // 2. Tell Playwright to intercept the news API call and provide our mock response
    await page.route('**/v2/top-headlines**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: mockApiResponse,
      });
    });

    // 3. Arrange: Go to the homepage
    await page.goto('/');

    // 4. Act: Click the "News" tab to make it active
    await page.getByRole('tab', { name: 'News' }).click();
    
    // Find the first article (which will be our mock article)
    const firstArticle = page.locator('article').first();
    
    // Get its title from our mock data
    const articleTitle = mockApiResponse.articles[0].title;

    // Click the favorite button inside that specific card
    await firstArticle.getByLabel('Toggle Favorite').click();

    // 5. Act: Navigate to the favorites page
    await page.getByRole('link', { name: 'Favorites' }).click();

    // 6. Assert: Verify the content on the favorites page
    await expect(page).toHaveURL(/.*favorites/);
    await expect(page.getByRole('heading', { name: 'Your Favorites' })).toBeVisible();
    
    // Check that our mock article's title is now visible on this page
    await expect(page.getByText(articleTitle)).toBeVisible();
  });
});