// src/utils/localStorage.js

/**
 * Save tasks to local storage
 * @param {Array} tasks - Array of task objects
 * @returns {boolean} - Success status of the operation
 */
export const saveTasks = (tasks) => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
      return false;
    }
  };
  
  /**
   * Load tasks from local storage
   * @returns {Array} - Array of task objects, or empty array if none exist
   */
  export const loadTasks = () => {
    try {
      const tasks = localStorage.getItem('tasks');
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return [];
    }
  };
  
  /**
   * Save user time limit preference to local storage
   * @param {Number} timeLimit - Time limit in minutes
   * @returns {boolean} - Success status of the operation
   */
  export const saveTimeLimit = (timeLimit) => {
    try {
      localStorage.setItem('timeLimit', timeLimit.toString());
      return true;
    } catch (error) {
      console.error('Error saving time limit to localStorage:', error);
      return false;
    }
  };
  
  /**
   * Load user time limit preference from local storage
   * @returns {Number} - Time limit in minutes, defaults to 480 (8 hours)
   */
  export const loadTimeLimit = () => {
    try {
      const timeLimit = localStorage.getItem('timeLimit');
      return timeLimit ? parseInt(timeLimit, 10) : 480; // Default: 8 hours
    } catch (error) {
      console.error('Error loading time limit from localStorage:', error);
      return 480; // Default in case of error
    }
  };
  
  /**
   * Save sort preferences to local storage
   * @param {string} sortBy - Property to sort by (importance, time, name, etc.)
   * @param {string} sortOrder - Sort direction ('asc' or 'desc')
   * @returns {boolean} - Success status of the operation
   */
  export const saveSortPreferences = (sortBy, sortOrder) => {
    try {
      const preferences = { sortBy, sortOrder };
      localStorage.setItem('sortPreferences', JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error saving sort preferences to localStorage:', error);
      return false;
    }
  };
  
  /**
   * Load sort preferences from local storage
   * @returns {Object} - Object containing sortBy and sortOrder preferences
   */
  export const loadSortPreferences = () => {
    try {
      const preferences = localStorage.getItem('sortPreferences');
      return preferences 
        ? JSON.parse(preferences) 
        : { sortBy: 'importance', sortOrder: 'desc' }; // Default preferences
    } catch (error) {
      console.error('Error loading sort preferences from localStorage:', error);
      return { sortBy: 'importance', sortOrder: 'desc' }; // Default in case of error
    }
  };
  
  /**
   * Save theme preference to local storage
   * @param {boolean} darkMode - Whether dark mode is enabled
   * @returns {boolean} - Success status of the operation
   */
  export const saveThemePreference = (darkMode) => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
      return true;
    } catch (error) {
      console.error('Error saving theme preference to localStorage:', error);
      return false;
    }
  };
  
  /**
   * Load theme preference from local storage
   * @returns {boolean} - Whether dark mode is enabled (defaults to system preference)
   */
  export const loadThemePreference = () => {
    try {
      const preference = localStorage.getItem('darkMode');
      if (preference !== null) {
        return JSON.parse(preference);
      }
      // Default to system preference if not set
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
      console.error('Error loading theme preference from localStorage:', error);
      return false; // Default to light mode in case of error
    }
  };
  
  /**
   * Clear all application data from local storage
   * @returns {boolean} - Success status of the operation
   */
  export const clearAllData = () => {
    try {
      // Only clear our app-specific keys
      localStorage.removeItem('tasks');
      localStorage.removeItem('timeLimit');
      localStorage.removeItem('sortPreferences');
      localStorage.removeItem('darkMode');
      return true;
    } catch (error) {
      console.error('Error clearing data from localStorage:', error);
      return false;
    }
  };
  
  /**
   * Check if localStorage is available and working
   * @returns {boolean} - Whether localStorage is available
   */
  export const isLocalStorageAvailable = () => {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      const result = localStorage.getItem(test) === test;
      localStorage.removeItem(test);
      return result;
    } catch (e) {
      return false;
    }
  };

  // Add these functions to your existing localStorage.js file

export const saveUserProgress = (progress) => {
  try {
    localStorage.setItem('userProgress', JSON.stringify(progress));
    return true;
  } catch (error) {
    console.error('Error saving user progress:', error);
    return false;
  }
};

export const loadUserProgress = () => {
  try {
    const data = localStorage.getItem('userProgress');
    if (data) {
      return JSON.parse(data);
    }
    // Default initial progress
    return {
      score: 0,
      level: 1,
      dailyStreak: 0,
      lastActiveDate: null,
      tasksCompleted: 0,
      highPriorityCompleted: 0,
      earlyCompletions: 0,
      totalTimeWorked: 0,
      achievements: []
    };
  } catch (error) {
    console.error('Error loading user progress:', error);
    return {
      score: 0,
      level: 1,
      dailyStreak: 0,
      lastActiveDate: null,
      tasksCompleted: 0,
      highPriorityCompleted: 0,
      earlyCompletions: 0,
      totalTimeWorked: 0,
      achievements: []
    };
  }
};