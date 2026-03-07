const STORAGE_KEY = 'pageBuilderInstances';

/**
 * Save component instances to localStorage
 * @param {Array} instances
 */
export function saveToStorage(instances) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(instances));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

/**
 * Load component instances from localStorage
 * @returns {Array}
 */
export function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
    return [];
  }
}

/**
 * Clear all data from localStorage
 */
export function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear localStorage:', e);
  }
}
