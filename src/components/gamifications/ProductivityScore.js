import React from 'react';
import { useGamification } from '../../context/GamificationContext';

const ProductivityScore = ({ darkMode }) => {
  const { progress, currentLevel, nextLevel } = useGamification();
  
  // Calculate progress to next level
  const progressToNext = nextLevel ? 
    Math.min(100, Math.round(((progress.score - currentLevel.threshold) / 
      (nextLevel.threshold - currentLevel.threshold)) * 100)) : 100;
  
  return (
    <div className={`rounded-xl shadow-sm mb-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Your Productivity Stats
        </h2>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Score</div>
            <div className="text-2xl font-bold text-indigo-500">{progress.score}</div>
          </div>
          <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Level</div>
            <div className={`text-2xl font-bold ${currentLevel.color}`}>
              {currentLevel.level} <span className="text-sm font-normal">({currentLevel.title})</span>
            </div>
          </div>
          <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Streak</div>
            <div className="text-2xl font-bold text-amber-500">
              {progress.dailyStreak}{' '}
              <span className="text-sm">
                {progress.dailyStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Progress to next level */}
        {nextLevel && (
          <div className="mt-4">
            <div className="flex justify-between items-center text-xs mb-1">
              <span>Level {currentLevel.level}</span>
              <span>Level {nextLevel.level}</span>
            </div>
            <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className="h-2 rounded-full bg-indigo-500"
                style={{ width: `${progressToNext}%` }}
              ></div>
            </div>
            <div className="text-xs text-center mt-1">
              {progress.score} / {nextLevel.threshold} points to next level
            </div>
          </div>
        )}
        
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-xs text-gray-500">Tasks Completed</div>
            <div className="font-semibold">{progress.tasksCompleted}</div>
          </div>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-xs text-gray-500">Time Worked</div>
            <div className="font-semibold">
              {Math.floor(progress.totalTimeWorked / 60)}h {progress.totalTimeWorked % 60}m
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityScore;