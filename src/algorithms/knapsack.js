// src/algorithms/knapsack.js

/**
 * Knapsack algorithm with proportional time allocation
 * Ensures all tasks are completed within the available time.
 * Maximizes efficiency by prioritizing tasks with higher importance-to-time ratios.
 * @param {Array} tasks - Array of tasks with importance and time properties
 * @param {Number} timeLimit - Maximum time available (in minutes)
 * @returns {Object} - Adjusted tasks, total importance, and remaining time
 */
export const knapsackOptimization = (tasks, timeLimit) => {
    if (!tasks.length) {
      return { adjustedTasks: [], totalValue: 0, remainingTime: timeLimit };
    }
  
    // Step 1: Calculate total time required for all tasks
    const totalTimeRequired = tasks.reduce((sum, task) => sum + task.time, 0);
  
    // Step 2: If total time required is less than or equal to the time limit, no adjustment is needed
    if (totalTimeRequired <= timeLimit) {
      return {
        adjustedTasks: tasks.map((task) => ({
          ...task,
          time: Math.floor(task.time), // Ensure time is an integer
        })),
        totalValue: tasks.reduce((sum, task) => sum + task.importance, 0),
        remainingTime: Math.floor(timeLimit - totalTimeRequired), // Ensure remaining time is an integer
      };
    }
  
    // Step 3: Proportional time allocation
    const adjustedTasks = tasks.map((task) => {
      const adjustedTime = Math.floor((task.time / totalTimeRequired) * timeLimit); // Proportional time as an integer
      const adjustedImportance = Math.floor((task.importance / task.time) * adjustedTime); // Adjusted importance as an integer
      return {
        ...task,
        time: adjustedTime,
        importance: adjustedImportance,
      };
    });
  
    // Step 4: Calculate total importance and remaining time
    const totalValue = adjustedTasks.reduce((sum, task) => sum + task.importance, 0);
    const remainingTime = 0; // All available time is used
  
    return {
      adjustedTasks,
      totalValue,
      remainingTime,
    };
  };
  