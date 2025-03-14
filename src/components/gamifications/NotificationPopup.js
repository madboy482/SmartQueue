import React, { useEffect } from 'react';
import { useGamification } from '../../context/GamificationContext';

const NotificationPopup = ({ darkMode }) => {
  const { showNotification, dismissNotification } = useGamification();
  
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        dismissNotification();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showNotification, dismissNotification]);
  
  if (!showNotification) return null;
  
  const renderAchievementNotification = () => {
    const achievements = showNotification.items;
    return (
      <>
        <div className="text-lg font-bold mb-2">
          Achievement{achievements.length > 1 ? 's' : ''} Unlocked!
        </div>
        <div className="space-y-3">
          {achievements.map(achievement => (
            <div key={achievement.id} className="flex items-center">
              <div className="bg-indigo-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
                <span className="text-xl">{achievement.icon}</span>
              </div>
              <div>
                <div className="font-semibold">{achievement.name}</div>
                <div className="text-xs">{achievement.description}</div>
                <div className="text-xs text-indigo-400">+{achievement.points} points</div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };
  
  const renderLevelUpNotification = () => {
    const { oldLevel, newLevel } = showNotification;
    return (
      <>
        <div className="text-lg font-bold mb-2">
          Level Up!
        </div>
        <div className="flex items-center mb-3">
          <div className={`mr-2 font-bold ${oldLevel.color}`}>
            {oldLevel.level}
          </div>
          <div className="flex-1 px-4">
            <svg className="w-full h-6" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 10H40L50 0L60 20L70 10H100" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={`ml-2 font-bold ${newLevel.color}`}>
            {newLevel.level}
          </div>
        </div>
        <div>
          <div className="font-medium">You're now a {newLevel.title}!</div>
          <div className="text-xs mt-1">Unlocked: {newLevel.perk}</div>
        </div>
      </>
    );
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-fade-in-up">
      <div className={`rounded-lg shadow-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {showNotification.type === 'achievement' && renderAchievementNotification()}
            {showNotification.type === 'levelUp' && renderLevelUpNotification()}
          </div>
          <button 
            onClick={dismissNotification}
            className={`ml-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;