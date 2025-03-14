import React, { useState, useEffect, useRef } from 'react';
import { useGamification } from '../../context/GamificationContext';

const TaskTimer = ({ task, onComplete, darkMode }) => {
  const [timeRemaining, setTimeRemaining] = useState(task.time * 60); // Convert minutes to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [completionStats, setCompletionStats] = useState({ show: false, early: false, bonus: 0 });
  const timerRef = useRef(null);
  const { completeTask } = useGamification();
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [isRunning]);
  
// In TaskTimer.js
const handleComplete = () => {
    const remaining = timeRemaining > 0;
    clearInterval(timerRef.current);
    setIsRunning(false);
    
    // Calculate bonus based on time remaining
    const totalTime = task.time * 60;
    const percentRemaining = timeRemaining / totalTime;
    const bonus = Math.round(percentRemaining * task.importance * 10);
    
    const completionData = {
      taskId: task.id,
      early: remaining,
      bonus: bonus,
      timeSpent: totalTime - timeRemaining
    };
    
    // Update gamification system
    const result = completeTask(task, completionData);
    
    // Show completion stats
    setCompletionStats({
      show: true,
      early: remaining,
      bonus: bonus,
      scoreGained: result.scoreGained // Extract just the score value
    });
    
    // Notify parent component
    setTimeout(() => {
      onComplete(completionData);
    }, 2000);
  };
  
  // Progress percentage
  const progressPercentage = (timeRemaining / (task.time * 60)) * 100;
  
  // Color based on remaining time
  const getTimerColor = () => {
    if (progressPercentage > 60) return 'text-green-500';
    if (progressPercentage > 30) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  if (completionStats.show) {
    return (
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'} text-center animate-pulse`}>
        <div className="font-bold mb-1">Task Completed!</div>
        <div className="flex justify-center items-center my-2">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-sm">
          {completionStats.early ? (
            <span className="font-medium text-indigo-600 dark:text-indigo-300">
              Early completion! +{completionStats.bonus} bonus points
            </span>
          ) : (
            <span>Completed on time</span>
          )}
        </div>
        <div className="mt-2 font-medium">
          +{completionStats.scoreGained} points earned
        </div>
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Time spent: {Math.round((task.time * 60 - timeRemaining) / 60)} minutes
        </div>
      </div>
    );
  }
  
  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium">{task.name}</div>
        <div className={`text-lg font-bold font-mono ${getTimerColor()}`}>
          {formatTime(timeRemaining)}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${
            progressPercentage > 60 ? 'bg-green-500' : 
            progressPercentage > 30 ? 'bg-yellow-500' : 
            'bg-red-500'
          }`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-3 py-1 rounded text-sm ${
            isRunning
              ? (darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-600')
              : (darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600')
          }`}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={handleComplete}
          disabled={!isRunning && timeRemaining === task.time * 60}
          className={`px-3 py-1 rounded text-sm ${
            !isRunning && timeRemaining === task.time * 60
              ? (darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400')
              : (darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-600')
          }`}
        >
          Complete Task
        </button>
      </div>
    </div>
  );
};

export default TaskTimer;