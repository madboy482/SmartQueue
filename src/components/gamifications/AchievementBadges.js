import React from 'react';
import { useGamification } from '../../context/GamificationContext';

const AchievementBadges = ({ darkMode }) => {
  const { achievements } = useGamification();
  
  return (
    <div className={`rounded-xl shadow-sm mb-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
          </svg>
          Your Achievements
        </h2>
        
        <div className="text-xs">
          <span className="font-medium">{achievements.filter(a => a.unlocked).length}</span>/{achievements.length}
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {achievements.map(achievement => (
            <div 
              key={achievement.id}
              className={`p-3 rounded-lg ${achievement.unlocked 
                ? (darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50') 
                : (darkMode ? 'bg-gray-700/50' : 'bg-gray-100')}`}
            >
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 mb-2 flex items-center justify-center rounded-full ${
                  achievement.unlocked 
                    ? 'bg-indigo-500 text-white' 
                    : (darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500')
                }`}>
                  <span className="text-xl">{achievement.icon}</span>
                </div>
                <div className={`text-xs font-medium text-center ${
                  achievement.unlocked 
                    ? (darkMode ? 'text-indigo-300' : 'text-indigo-600') 
                    : (darkMode ? 'text-gray-400' : 'text-gray-500')
                }`}>
                  {achievement.name}
                </div>
                {achievement.unlocked ? (
                  <div className="text-xs text-center text-green-500 mt-1">Unlocked!</div>
                ) : (
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    {achievement.progress.current}/{achievement.progress.required}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementBadges;