const MAX_HISTORY_LENGTH = 5;
const HISTORY_KEY = 'recentSearches';

// get search history from local storage
export const getSearchHistory = (): string[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error("Failed to parse search history:", error);
    return [];
  }
};

// add new history to local storage
export const addSearchToHistory = (searchTerm: string) => {
  if (!searchTerm) return;
  
  let history = getSearchHistory();
  
  // Remove any existing instance of the term to move it to the top
  history = history.filter(item => item.toLowerCase() !== searchTerm.toLowerCase());
  
  // Add the new term to the beginning of the list
  history.unshift(searchTerm);
  
  // Trim the list to the maximum length
  if (history.length > MAX_HISTORY_LENGTH) {
    history = history.slice(0, MAX_HISTORY_LENGTH);
  }
  
  // Save the updated list back to localStorage
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const clearSearchHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};