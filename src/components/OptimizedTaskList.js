import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import { knapsackOptimization } from '../algorithms/knapsack';

const OptimizedTaskList = ({ tasks, timeLimit, onToggleComplete, onDelete, darkMode }) => {
  const [adjustedTasks, setAdjustedTasks] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    setIsCalculating(true);

    const timer = setTimeout(() => {
      // Filter out completed tasks
      const incompleteTasks = tasks.filter((task) => !task.completed);

      if (incompleteTasks.length === 0) {
        setAdjustedTasks([]);
        setTotalValue(0);
        setRemainingTime(timeLimit);
        setIsCalculating(false);
        return;
      }

      // Run knapsack optimization algorithm
      const { adjustedTasks, totalValue, remainingTime } = knapsackOptimization(
        incompleteTasks,
        timeLimit
      );

      setAdjustedTasks(adjustedTasks);
      setTotalValue(totalValue);
      setRemainingTime(remainingTime);
      setIsCalculating(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [tasks, timeLimit]);

  // Format time (convert minutes back to hours and minutes)
  const formatTime = (timeInMinutes) => {
    const minutes = Math.abs(timeInMinutes); // Handle negative values
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}m`;
    }
  };

  return (
    <div
      className={`rounded-xl shadow-sm ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}
    >
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-indigo-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Optimized Plan
        </h2>
      </div>

      <div className="p-5">
        {isCalculating ? (
          <p>Calculating...</p>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="text-sm font-medium">Summary</h3>
              <p>
                Total Importance: <strong>{totalValue.toFixed(2)}</strong>
              </p>
              <p>
                Time Remaining: <strong>{formatTime(remainingTime)}</strong>
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium">Adjusted Tasks</h3>
              {adjustedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDelete}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OptimizedTaskList;