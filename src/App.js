import React, { useState, useEffect, useRef, useMemo } from 'react';
import TaskForm from './components/TaskForm';
// import TaskList from './components/TaskList';
import TaskItem from './components/TaskItem';
import TimeSlider from './components/TimeSlider';
import OptimizedTaskList from './components/OptimizedTaskList';
import { mergeSort } from './algorithms/mergeSort';
import { 
  saveTasks, 
  loadTasks, 
  saveTimeLimit, 
  loadTimeLimit,
  saveSortPreferences,
  loadSortPreferences,
  saveThemePreference,
  loadThemePreference
} from './utils/localStorage';

// Import gamification components
import ProductivityScore from './components/gamifications/ProductivityScore';
import AchievementBadges from './components/gamifications/AchievementBadges';
import NotificationPopup from './components/gamifications/NotificationPopup';
import LevelUpModal from './components/gamifications/LevelUpModal';
import TaskTimer from './components/gamifications/TaskTimer';

// Import GamificationContext
import { GamificationProvider, useGamification } from './context/GamificationContext';

function AppContent() {
  const [tasks, setTasks] = useState([]);
  const [timeLimit, setTimeLimit] = useState(480); // Default: 8 hours
  const [sortBy, setSortBy] = useState('importance');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [darkMode, setDarkMode] = useState(loadThemePreference());
  
  // State for active task timer
  const [activeTask, setActiveTask] = useState(null);
  
  // State for level up modal
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState(null);
  
  // Gamification context
  const { currentLevel, progress } = useGamification();
  
  // New state variables for algorithm visualization and metrics
  const [currentAlgorithm, setCurrentAlgorithm] = useState('mergeSort');
  const [visualizationSpeed, setVisualizationSpeed] = useState(2);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [algorithmSteps, setAlgorithmSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [comparisonsCount, setComparisonsCount] = useState(0);
  const [executionTime, setExecutionTime] = useState(0);
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState(false);
  
  // Reference to animation interval
  const animationIntervalRef = useRef(null);

  // Load data from local storage on initial render
  useEffect(() => {
    setTasks(loadTasks());
    setTimeLimit(loadTimeLimit());
    
    const { sortBy: savedSortBy, sortOrder: savedSortOrder } = loadSortPreferences();
    setSortBy(savedSortBy);
    setSortOrder(savedSortOrder);
    
    setIsFirstLoad(false);
  }, []);

  // Clean up animation interval on unmount
  useEffect(() => {
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, []);

  // Save tasks to local storage when they change
  useEffect(() => {
    if (!isFirstLoad) {
      saveTasks(tasks);
    }
  }, [tasks, isFirstLoad]);

  // Save time limit to local storage when it changes
  useEffect(() => {
    if (!isFirstLoad) {
      saveTimeLimit(timeLimit);
    }
  }, [timeLimit, isFirstLoad]);
  
  // Save sort preferences when they change
  useEffect(() => {
    if (!isFirstLoad) {
      saveSortPreferences(sortBy, sortOrder);
    }
  }, [sortBy, sortOrder, isFirstLoad]);
  
  // Save theme preference when it changes
  useEffect(() => {
    if (!isFirstLoad) {
      saveThemePreference(darkMode);
    }
  }, [darkMode, isFirstLoad]);

  // Add a new task
  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  // Toggle task completion status
  const handleToggleComplete = (taskId) => {
    const taskToComplete = tasks.find(task => task.id === taskId);
    
    if (taskToComplete && !taskToComplete.completed) {
      // Start the task timer if not completed
      setActiveTask(taskToComplete);
    } else {
      // Regular toggle without timer
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    }
  };
  
  // Handle task completion from timer
  const handleTaskCompletion = (taskId, completionData) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
    
    // Clear active task
    setActiveTask(null);
    
    // Check if user leveled up
    if (completionData && completionData.levelUp) {
      setLevelUpInfo(completionData.levelUp);
      setShowLevelUpModal(true);
    }
  };

  // Delete a task
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    
    // Clear active task if it's being deleted
    if (activeTask && activeTask.id === taskId) {
      setActiveTask(null);
    }
  };

  // Handle time limit change
  const handleTimeChange = (newTime) => {
    setTimeLimit(newTime);
  };

  // Clear completed tasks
  const handleClearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Compute sorted tasks and metrics using useMemo to avoid unnecessary recalculations
  const sortedTasksData = useMemo(() => {
    const incompleteTasks = tasks.filter((task) => !task.completed);
    const completedTasks = tasks.filter((task) => task.completed);
    
    // Start timing the execution
    const startTime = performance.now();
    let comparisons = 0;
    
    // Sort incomplete tasks with instrumentation
    const sortedIncompleteTasks = mergeSort(
      incompleteTasks,
      sortBy,
      sortOrder === 'asc',
      (count) => { comparisons += count; }  // Callback to count comparisons
    );
    
    // Sort completed tasks (always by completion date, newest first)
    const sortedCompletedTasks = mergeSort(completedTasks, 'id', true);
    
    // End timing
    const endTime = performance.now();
    
    return {
      tasks: [...sortedIncompleteTasks, ...sortedCompletedTasks],
      comparisons,
      executionTime: Math.round(endTime - startTime)
    };
  }, [tasks, sortBy, sortOrder]);

  // Calculate the optimized tasks using 0/1 knapsack algorithm
  const optimizedTasks = useMemo(() => {
    const incompleteTasks = tasks.filter(task => !task.completed);
    
    // Skip calculation if there are no incomplete tasks
    if (incompleteTasks.length === 0) return [];
    
    // Implementation of 0/1 knapsack algorithm
    const n = incompleteTasks.length;
    const W = timeLimit;
    
    // Create a 2D array for the knapsack DP table
    const dp = Array(n + 1).fill().map(() => Array(W + 1).fill(0));
    
    // Fill the dp table
    for (let i = 1; i <= n; i++) {
      const task = incompleteTasks[i - 1];
      const taskTime = Math.min(W, Math.max(1, Math.floor(task.time))); // Ensure time is valid
      const taskValue = task.importance;
      
      for (let w = 0; w <= W; w++) {
        if (taskTime <= w) {
          dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - taskTime] + taskValue);
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }
    
    // Backtrack to find the selected tasks
    const selectedTasks = [];
    let remainingWeight = W;
    
    for (let i = n; i > 0; i--) {
      const task = incompleteTasks[i - 1];
      const taskTime = Math.min(W, Math.max(1, Math.floor(task.time)));
      
      if (dp[i][remainingWeight] !== dp[i - 1][remainingWeight]) {
        selectedTasks.push(task);
        remainingWeight -= taskTime;
      }
    }
    
    return selectedTasks;
  }, [tasks, timeLimit]);

  // Update metrics after render
  useEffect(() => {
    if (!isFirstLoad) {
      setComparisonsCount(sortedTasksData.comparisons);
      setExecutionTime(sortedTasksData.executionTime);
    }
  }, [sortedTasksData, optimizedTasks, isFirstLoad]);

  // Start algorithm visualization
  const handleStartVisualization = () => {
    // Clear any existing animation
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }

    setIsVisualizing(true);
    setCurrentStep(0);
    
    // Generate visualization steps based on current algorithm
    let steps = [];
    const itemsToSort = tasks.filter((task) => !task.completed).slice(0, 8); // Limit to 8 items for visualization
    
    if (currentAlgorithm === 'mergeSort') {
      // Generate merge sort visualization steps
      steps = generateMergeSortSteps(itemsToSort, sortBy, sortOrder === 'asc');
    } else if (currentAlgorithm === 'knapsack') {
      // Generate knapsack algorithm visualization steps
      steps = generateKnapsackSteps(itemsToSort, timeLimit);
    }
    
    setAlgorithmSteps(steps);
    
    // Animate through the steps
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex >= steps.length) {
        clearInterval(interval);
        setIsVisualizing(false);
        return;
      }
      
      setCurrentStep(stepIndex);
      stepIndex++;
    }, 1000 / visualizationSpeed);

    // Save reference to interval for cleanup
    animationIntervalRef.current = interval;
  };
  
  // Helper function for merge sort visualization
  const generateMergeSortSteps = (items, sortBy, isAscending) => {
    if (items.length <= 1) {
      return [{ type: 'final', arrays: [items] }];
    }
    
    const steps = [];
    
    // Initial array
    steps.push({ type: 'initial', arrays: [[...items]] });
    
    // Function to recursively generate merge sort steps
    const mergeSortWithSteps = (arr) => {
      if (arr.length <= 1) {
        return arr;
      }
      
      const middle = Math.floor(arr.length / 2);
      const left = arr.slice(0, middle);
      const right = arr.slice(middle);
      
      // Add step showing the division
      steps.push({ 
        type: 'split', 
        arrays: [[...left], [...right]] 
      });
      
      // Recursively sort left and right
      const sortedLeft = mergeSortWithSteps(left);
      const sortedRight = mergeSortWithSteps(right);
      
      // Add step showing the sorted halves before merge
      steps.push({ 
        type: 'beforeMerge', 
        arrays: [[...sortedLeft], [...sortedRight]] 
      });
      
      // Merge the halves
      const result = [];
      let leftIndex = 0;
      let rightIndex = 0;
      
      while (leftIndex < sortedLeft.length && rightIndex < sortedRight.length) {
        const comparison = isAscending ? 
          (sortedLeft[leftIndex][sortBy] <= sortedRight[rightIndex][sortBy]) : 
          (sortedLeft[leftIndex][sortBy] >= sortedRight[rightIndex][sortBy]);
        
        if (comparison) {
          result.push(sortedLeft[leftIndex]);
          leftIndex++;
        } else {
          result.push(sortedRight[rightIndex]);
          rightIndex++;
        }
      }
      
      // Add remaining elements
      while (leftIndex < sortedLeft.length) {
        result.push(sortedLeft[leftIndex]);
        leftIndex++;
      }
      
      while (rightIndex < sortedRight.length) {
        result.push(sortedRight[rightIndex]);
        rightIndex++;
      }
      
      // Add step showing the merged result
      steps.push({ 
        type: 'merge', 
        arrays: [[...result]] 
      });
      
      return result;
    };
    
    mergeSortWithSteps([...items]);
    
    // Final result
    const sortedItems = [...items].sort((a, b) => 
      isAscending ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
    );
    
    steps.push({ type: 'final', arrays: [[...sortedItems]] });
    
    return steps;
  };
  
  // Helper function to generate steps for knapsack algorithm visualization
  const generateKnapsackSteps = (items, capacity) => {
    if (items.length === 0) return [];
    
    // Initialize steps array
    const steps = [{ type: 'initialize', items, capacity }];
    
    // Create value/weight arrays for DP algorithm
    const values = items.map(task => task.importance);
    const weights = items.map(task => task.time);
    const n = items.length;
    
    // Create DP table
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    const selected = Array(n + 1).fill().map(() => Array(capacity + 1).fill(false));
    
    // Fill dp table
    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        if (weights[i-1] <= w) {
          // Can include this item
          const includeValue = values[i-1] + dp[i-1][w-weights[i-1]];
          const excludeValue = dp[i-1][w];
          
          if (includeValue > excludeValue) {
            dp[i][w] = includeValue;
            selected[i][w] = true;
            steps.push({ 
              type: 'consider', 
              item: items[i-1],
              included: true,
              reason: `Value ${includeValue} > ${excludeValue}`,
              currentValue: includeValue,
              capacityLeft: w - weights[i-1]
            });
          } else {
            dp[i][w] = excludeValue;
            selected[i][w] = false;
            steps.push({ 
              type: 'consider', 
              item: items[i-1],
              included: false,
              reason: `Value ${includeValue} <= ${excludeValue}`,
              currentValue: excludeValue,
              capacityLeft: w
            });
          }
        } else {
          // Cannot include this item (too heavy/time-consuming)
          dp[i][w] = dp[i-1][w];
          steps.push({ 
            type: 'consider', 
            item: items[i-1],
            included: false,
            reason: `Time ${weights[i-1]} > available ${w}`,
            currentValue: dp[i-1][w],
            capacityLeft: w
          });
        }
      }
    }
    
    // Backtrack to find the solution
    const optimalItems = [];
    let i = n;
    let w = capacity;
    
    while (i > 0 && w > 0) {
      if (selected[i][w]) {
        optimalItems.push(items[i-1]);
        w -= weights[i-1];
      }
      i--;
    }
    
    // Add final solution step
    steps.push({
      type: 'solution',
      selected: optimalItems,
      totalValue: dp[n][capacity],
      totalWeight: optimalItems.reduce((sum, item) => sum + item.time, 0)
    });
    
    // Return a subset of steps to make visualization cleaner
    const filteredSteps = [steps[0]];
    
    // Add meaningful consideration steps (limit to avoid too many steps)
    const considerationSteps = steps.filter(s => s.type === 'consider')
                                  .filter((_, i) => i % Math.ceil(steps.length / 10) === 0);
    
    return [...filteredSteps, ...considerationSteps, steps[steps.length - 1]];
  };

  // Algorithm information text
  const getAlgorithmInfo = () => {
    if (currentAlgorithm === 'mergeSort') {
      return {
        name: "Merge Sort",
        description: "A divide-and-conquer algorithm that splits the array into halves, recursively sorts them, then merges them back. It has a stable O(n log n) time complexity regardless of input data.",
        complexity: "O(n log n)",
        space: "O(n)"
      };
    } else if (currentAlgorithm === 'knapsack') {
      return {
        name: "0/1 Knapsack Algorithm",
        description: "A dynamic programming algorithm that selects items to maximize value while staying within a capacity constraint. Used here to prioritize tasks based on importance and time available.",
        complexity: "O(n * W)", // where W is the time limit
        space: "O(n * W)"
      };
    }
  };

  const sortedTasks = sortedTasksData.tasks;
  const hasCompletedTasks = tasks.some(task => task.completed);
  const algorithmInfo = getAlgorithmInfo();

  // Visual element that shows the current algorithm's pattern
  const AlgorithmVisualization = ({ algorithm, step }) => {
    if (!step) return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">Click "Visualize" to see the algorithm in action</p>
      </div>
    );
    
    if (algorithm === 'mergeSort') {
      return (
        <div className="p-4 h-full flex flex-col">
          {step.arrays && step.arrays.map((array, i) => (
            <div key={i} className="flex flex-wrap mb-4 justify-center">
              {array.map((item, j) => (
                <div 
                  key={j} 
                  className={`m-1 p-2 rounded text-xs flex items-center justify-center transition-all duration-300 ${
                    step.type === 'final' 
                      ? 'bg-green-100 dark:bg-green-900' 
                      : 'bg-indigo-100 dark:bg-indigo-900'
                  }`} 
                  style={{ 
                    width: '60px', 
                    height: '60px',
                    transform: step.type === 'merge' ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <div className="text-center">
                    <div className="font-bold">{item.name.substring(0, 6)}</div>
                    <div className="text-xs mt-1">{item[sortBy]}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div className="text-center text-sm mt-auto">
            {step.type === 'initial' && <p>Initial array</p>}
            {step.type === 'split' && <p>Dividing arrays</p>}
            {step.type === 'beforeMerge' && <p>Before merging</p>}
            {step.type === 'merge' && <p>Merging sorted arrays</p>}
            {step.type === 'final' && <p>Final sorted array</p>}
          </div>
        </div>
      );
    } else if (algorithm === 'knapsack') {
      return (
        <div className="flex flex-col h-full">
          {step.type === 'initialize' && (
            <div className="flex flex-col h-full">
              <h3 className="text-center text-sm font-medium mb-2">
                Available Tasks (Value/Time)
              </h3>
              <div className="flex flex-wrap justify-center">
                {step.items.map((item, i) => (
                  <div key={i} className="m-1 p-2 rounded bg-blue-100 dark:bg-blue-900 text-xs" 
                       style={{ width: '60px', height: '60px' }}>
                    <div className="text-center">
                      <div className="font-bold">{item.name.substring(0, 6)}</div>
                      <div className="text-xs mt-1">{item.importance}/{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-sm text-center">
                Time Limit: {step.capacity} minutes
              </p>
            </div>
          )}
          
          {step.type === 'consider' && (
            <div className="flex flex-col h-full">
              <div className="text-center mb-2">
                <div className="text-sm font-medium">
                  Task: {step.item.name}
                </div>
                <div className={`text-sm ${step.included ? "text-green-500 font-medium" : "text-red-500"}`}>
                  {step.included ? "Including" : "Excluding"}
                </div>
                <div className="text-xs mt-1">
                  {step.reason}
                </div>
              </div>
              
              <div className="flex justify-center items-center">
                <div className={`m-2 p-2 rounded ${
                  step.included ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900'
                } text-xs`} style={{ width: '60px', height: '60px' }}>
                  <div className="text-center">
                    <div className="font-bold">{step.item.name.substring(0, 6)}</div>
                    <div className="text-xs mt-1">Value: {step.item.importance}</div>
                    <div className="text-xs">Time: {step.item.time}</div>
                  </div>
                </div>
                
                <div className="text-center mx-2">
                  <div className="text-xs">Current Value: {step.currentValue}</div>
                  <div className="text-xs">Capacity Left: {step.capacityLeft}</div>
                </div>
              </div>
            </div>
          )}
          
          {step.type === 'solution' && (
            <div className="flex flex-col h-full">
              <h3 className="text-center text-sm font-medium mb-2">
                Optimal Solution (Total Value: {step.totalValue})
              </h3>
              <div className="flex flex-wrap justify-center">
                {step.selected.map((item, i) => (
                  <div key={i} className="m-1 p-2 rounded bg-green-100 dark:bg-green-900 text-xs"
                       style={{ width: '60px', height: '60px' }}>
                    <div className="text-center">
                      <div className="font-bold">{item.name.substring(0, 6)}</div>
                      <div className="text-xs mt-1">{item.importance}/{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-center">
                Total Time: {step.totalWeight} / {step.capacity} minutes
              </p>
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <nav className={`sticky top-0 z-10 backdrop-blur-lg ${darkMode ? 'bg-gray-900/90 border-gray-700' : 'bg-white/90 border-gray-200'} border-b shadow-sm`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4H18V6H20V8H18V10H16V8H14V6H16V4Z" fill="currentColor" />
              <path d="M6 8H10V6H6V8Z" fill="currentColor" />
              <path d="M8 10V14H6V10H8Z" fill="currentColor" />
              <path d="M10 12V16H8V12H10Z" fill="currentColor" />
              <path d="M8 18V20H10V18H8Z" fill="currentColor" />
              <path fillRule="evenodd" clipRule="evenodd" d="M2 2H22V22H2V2ZM4 4H20V20H4V4Z" fill="currentColor" />
            </svg>
            <h1 className="text-xl md:text-2xl font-bold">TaskOptimize</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center">
              <span className="text-xs mr-2">
                {tasks.length} tasks · {tasks.filter(t => t.completed).length} completed
              </span>
              <span className="text-xs border-l pl-2 border-gray-300 dark:border-gray-700">
                <span className="font-medium text-indigo-600 dark:text-indigo-400">LVL {currentLevel.level}</span> · {progress.score} pts
              </span>
            </div>
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-300' : 'bg-gray-100 text-gray-600'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <TaskForm onAddTask={handleAddTask} darkMode={darkMode} />
            
            {/* If there's an active task, show the timer */}
            {activeTask && (
              <div className="mb-6">
                <TaskTimer 
                  task={activeTask} 
                  onComplete={(completionData) => handleTaskCompletion(activeTask.id, completionData)} 
                  darkMode={darkMode} 
                />
              </div>
            )}
            
            {/* Gamification Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ProductivityScore darkMode={darkMode} />
              <AchievementBadges darkMode={darkMode} />
            </div>
            
                          {/* Algorithm Selection Panel */}
                          <div className={`mb-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold">Algorithm Selection</h2>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setCurrentAlgorithm('mergeSort')}
                      className={`px-4 py-2 rounded-full font-medium text-sm transition ${
                        currentAlgorithm === 'mergeSort' 
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Merge Sort
                    </button>
                    <button 
                      onClick={() => setCurrentAlgorithm('knapsack')}
                      className={`px-4 py-2 rounded-full font-medium text-sm transition ${
                        currentAlgorithm === 'knapsack' 
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Knapsack Algorithm
                    </button>
                  </div>
                </div>
              </div>

              {/* Algorithm Visualization */}
              <div className={`mb-6 rounded-xl shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Algorithm Visualization</h2>
                  <button 
                    onClick={() => setShowAlgorithmInfo(!showAlgorithmInfo)}
                    className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
                
                {showAlgorithmInfo && (
                  <div className={`p-4 ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'} border-b dark:border-gray-700`}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <svg className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>
                          About {algorithmInfo.name}
                        </h3>
                        <div className={`mt-1 text-sm ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>
                          <p>{algorithmInfo.description}</p>
                          <p className="mt-2">
                            <span className="font-medium">Time Complexity:</span> {algorithmInfo.complexity} · 
                            <span className="font-medium ml-2">Space Complexity:</span> {algorithmInfo.space}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="h-64 relative bg-white/5">
                  <AlgorithmVisualization 
                    algorithm={currentAlgorithm} 
                    step={algorithmSteps[currentStep]}
                  />
                </div>
                
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div className="flex items-center">
                    <label className="text-sm mr-2">Speed:</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      value={visualizationSpeed}
                      onChange={(e) => setVisualizationSpeed(parseInt(e.target.value))}
                      className="w-24"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    {currentStep > 0 && (
                      <span className="text-xs mr-3">
                        Step {currentStep + 1} of {algorithmSteps.length}
                      </span>
                    )}
                    <button 
                      onClick={handleStartVisualization}
                      disabled={isVisualizing || tasks.filter(t => !t.completed).length === 0}
                      className={`px-4 py-1 rounded-md text-white text-sm ${
                        isVisualizing || tasks.filter(t => !t.completed).length === 0
                          ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {isVisualizing ? 'Visualizing...' : 'Visualize'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Algorithm Performance Metrics */}
              <div className={`mb-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold">Algorithm Performance</h2>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Time Complexity</p>
                      <p className="font-mono text-lg font-bold">
                        {currentAlgorithm === 'mergeSort' ? 'O(n log n)' : 'O(n * W)'}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Comparisons</p>
                      <p className="font-mono text-lg font-bold">{comparisonsCount}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Execution Time</p>
                      <p className="font-mono text-lg font-bold">{executionTime} ms</p>
                    </div>
                  </div>
                  
                  {currentAlgorithm === 'knapsack' && (
                    <div className="mt-4">
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>
                        <div className="flex justify-between items-center">
                          <p className={`text-sm font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>
                            Time used by optimized tasks:
                          </p>
                          <p className="font-mono font-bold">
                            {optimizedTasks.reduce((sum, task) => sum + task.time, 0)} / {timeLimit} min
                          </p>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (optimizedTasks.reduce((sum, task) => sum + task.time, 0) / timeLimit) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Task List */}
              <div className={`mb-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">All Tasks</h2>
                  
                  {hasCompletedTasks && (
                    <button
                      onClick={handleClearCompleted}
                      className={`text-xs px-3 py-1 rounded-full ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      Clear Completed
                    </button>
                  )}
                </div>
                
                <div className="p-5">
                  {tasks.length === 0 ? (
                    <div className="text-center py-6">
                      <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No tasks yet. Add your first task above!</p>
                    </div>
                  ) : (
                    <div>
                      {sortedTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggleComplete={handleToggleComplete}
                          onDelete={handleDeleteTask}
                          darkMode={darkMode}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sorting controls */}
              <div className={`mb-6 p-5 rounded-xl shadow-sm flex items-center justify-between ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
              }`}>
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`rounded border py-1 px-2 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="importance">Priority</option>
                    <option value="time">Time Required</option>
                    <option value="name">Name</option>
                    <option value="id">Date Added</option>
                  </select>
                </div>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className={`flex items-center py-1 px-3 rounded ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-1 text-sm">{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {sortOrder === 'asc' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    )}
                  </svg>
                </button>
              </div>
          </div>
          
          <div className="lg:col-span-4">
            <TimeSlider timeLimit={timeLimit} onChange={handleTimeChange} darkMode={darkMode} />
            
            <OptimizedTaskList
              tasks={tasks}
              timeLimit={timeLimit}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>
      
      {/* Notification Popup */}
      <NotificationPopup darkMode={darkMode} />
      
      {/* Level Up Modal */}
      {levelUpInfo && (
        <LevelUpModal 
          show={showLevelUpModal} 
          level={levelUpInfo.level}
          title={levelUpInfo.title}
          onClose={() => setShowLevelUpModal(false)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <GamificationProvider>
      <AppContent />
    </GamificationProvider>
  );
}

export default App;