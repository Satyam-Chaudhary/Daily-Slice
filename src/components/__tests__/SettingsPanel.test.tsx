import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { setActiveTab } from '@/store/uiSlice';
import SettingsPanel from '../SettingsPanel';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';

// Mock the 'sonner' library's toast function
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}));
const renderComponent = () => {
    return render(
      <Provider store={store}>
        <Sheet open={true}>
          <SheetContent>
            {/* 2. Add the required Header, Title, and Description */}
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
              <SheetDescription>
                Manage your content preferences here.
              </SheetDescription>
            </SheetHeader>
            <SettingsPanel />
          </SheetContent>
        </Sheet>
      </Provider>
    );
  };

describe('SettingsPanel Integration', () => {

  // Test the news settings
  it('should update news categories in the Redux store', async () => {
    // Arrange: Set the active tab to 'news' and render the component
    store.dispatch(setActiveTab('news'));
    renderComponent();
    // Get a checkbox that is not checked by default (e.g., 'sports')
    const sportsCheckbox = screen.getByLabelText(/sports/i);
    expect(sportsCheckbox).not.toBeChecked();

    // Act: Simulate checking the box and clicking save
    await userEvent.click(sportsCheckbox);
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    await userEvent.click(saveButton);

    // Assert: Check that the Redux state now includes the new category
    const finalCategories = store.getState().preferences.categories;
    expect(finalCategories).toContain('sports');
  });


  // Test the movie settings
  it('should update the movie feed type in the Redux store', async () => {
    // Arrange: Set the active tab to 'movies' and render the component
    store.dispatch(setActiveTab('movies'));
    renderComponent(); 

    // The initial state for movieFeedType is 'trending'
    expect(store.getState().preferences.movieFeedType).toBe('trending');
    
    // Find the 'Top Rated' radio button
    const topRatedRadio = screen.getByLabelText(/top rated/i);

    // Act: Click the radio button and then the save button
    await userEvent.click(topRatedRadio);
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    await userEvent.click(saveButton);

    // Assert: Check that the Redux state has been updated
    expect(store.getState().preferences.movieFeedType).toBe('top_rated');
  });

});