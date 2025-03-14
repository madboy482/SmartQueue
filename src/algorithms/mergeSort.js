// src/algorithms/mergeSort.js
/**
 * Merge sort implementation for sorting tasks
 * @param {Array} tasks - Array of task objects
 * @param {String} sortBy - Property to sort by (importance, time, etc.)
 * @param {Boolean} ascending - Sort order (true for ascending, false for descending)
 * @returns {Array} - Sorted array of tasks
 */
export const mergeSort = (tasks, sortBy = 'importance', ascending = false) => {
    // Base case
    if (tasks.length <= 1) return tasks;
    
    // Split array in half
    const middle = Math.floor(tasks.length / 2);
    const left = tasks.slice(0, middle);
    const right = tasks.slice(middle);
    
    // Recursive calls
    return merge(
      mergeSort(left, sortBy, ascending),
      mergeSort(right, sortBy, ascending),
      sortBy,
      ascending
    );
  };
  
  /**
   * Merge two sorted arrays
   */
  const merge = (left, right, sortBy, ascending) => {
    const result = [];
    let leftIndex = 0;
    let rightIndex = 0;
    
    while (leftIndex < left.length && rightIndex < right.length) {
      // Determine which value is smaller/larger based on sort order
      let comparison;
      if (ascending) {
        comparison = left[leftIndex][sortBy] <= right[rightIndex][sortBy];
      } else {
        comparison = left[leftIndex][sortBy] >= right[rightIndex][sortBy];
      }
      
      if (comparison) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }
    
    // Add remaining elements
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  };