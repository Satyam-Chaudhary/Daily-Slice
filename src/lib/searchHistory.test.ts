import { getSearchHistory, addSearchToHistory, clearSearchHistory } from './searchHistory';

// Mock localStorage for the Jest/Node.js environment
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});


// A test suite for our search history functions
describe('searchHistory', () => {
  // Before each test, clear localStorage to ensure a clean slate
  beforeEach(() => {
    localStorage.clear();
  });

  // Test case 1: Adding a single item
  it('should add a new search term to the history', () => {
    addSearchToHistory('react');
    const history = getSearchHistory();
    expect(history).toEqual(['react']);
  });

  // Test case 2: Adding a duplicate item
  it('should move an existing term to the top if added again', () => {
    addSearchToHistory('react');
    addSearchToHistory('nextjs');
    addSearchToHistory('react'); // Add 'react' again
    const history = getSearchHistory();
    expect(history).toEqual(['react', 'nextjs']);
  });

  // Test case 3: Checking the length limit
  it('should not store more than the max limit of terms', () => {
    addSearchToHistory('term1');
    addSearchToHistory('term2');
    addSearchToHistory('term3');
    addSearchToHistory('term4');
    addSearchToHistory('term5');
    addSearchToHistory('term6'); // This is the 6th term
    const history = getSearchHistory();
    expect(history.length).toBe(5);
    expect(history[0]).toBe('term6'); // The newest term should be at the top
  });

  // Test case 4: Clearing the history
  it('should clear the history', () => {
    addSearchToHistory('react');
    clearSearchHistory();
    const history = getSearchHistory();
    expect(history).toEqual([]);
  });
});