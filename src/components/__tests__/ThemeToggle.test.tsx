import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeToggle } from '../ThemeToggle';

describe('ThemeToggle', () => {
  it('should toggle the theme in the Redux store when clicked', async () => {
    // Arrange: Render the component with the Redux store
    render(
      <Provider store={store}>
        <ThemeToggle />
      </Provider>
    );

    // Get the initial state (our default is 'dark')
    const initialState = store.getState().ui.theme;
    expect(initialState).toBe('dark');

    // Find the button
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    // Act: Simulate a user clicking the button
    await userEvent.click(toggleButton);

    // Assert: Check that the Redux state has updated
    expect(store.getState().ui.theme).toBe('light');

    // Act again: Click it a second time to ensure it toggles back
    await userEvent.click(toggleButton);

    // Assert again: Check that the state has returned to the default
    expect(store.getState().ui.theme).toBe('dark');
  });
});