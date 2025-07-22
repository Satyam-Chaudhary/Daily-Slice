import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import ContentCard from '../ContentCard';
import { Article } from '@/store/newsApiSlice';

// Create a mock article to use for the test
const mockArticle: Article = {
  source: { id: null, name: 'Test Source' },
  author: 'Test Author',
  title: 'This is a Test Article',
  description: 'A test description.',
  url: 'https://example.com/test-article',
  urlToImage: null,
  publishedAt: new Date().toISOString(),
  content: 'Test content.',
};

describe('ContentCard - Favorites Integration', () => {
  it('should add and remove an article from favorites when the heart icon is clicked', async () => {
    // Arrange: Render the component wrapped in the Redux Provider
    render(
      <Provider store={store}>
        <ContentCard article={mockArticle} />
      </Provider>
    );

    // Assert: Check that the favorites list is initially empty
    expect(store.getState().favoritesNews.articles).toHaveLength(0);

    // Find the favorite button by its accessible name
    const favoriteButton = screen.getByLabelText(/toggle favorite/i);

    // Act 1: Simulate a user clicking to add a favorite
    await userEvent.click(favoriteButton);

    // Assert 1: Check that the article was added to the Redux store
    let favoritesState = store.getState().favoritesNews.articles;
    expect(favoritesState).toHaveLength(1);
    expect(favoritesState[0].url).toBe(mockArticle.url);

    // Act 2: Simulate a second click to remove the favorite
    await userEvent.click(favoriteButton);

    // Assert 2: Check that the article was removed from the Redux store
    favoritesState = store.getState().favoritesNews.articles;
    expect(favoritesState).toHaveLength(0);
  });
});