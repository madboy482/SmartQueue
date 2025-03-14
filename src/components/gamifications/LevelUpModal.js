import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';

const LevelUpModal = ({ show, level, title, onClose, darkMode }) => {
  const [animationClass, setAnimationClass] = useState('');
  
  // Trigger entrance animation when modal appears
  useEffect(() => {
    if (show) {
      setAnimationClass('animate-scale-in');
      // Launch confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setAnimationClass('');
    }
  }, [show]);
  
  // Define rewards based on level
  const getLevelRewards = (level) => {
    switch (level) {
      case 2:
        return ['Unlocked theme customization', 'Bonus points for early completion'];
      case 3:
        return ['Unlocked focus mode', 'Streak multiplier increased'];
      case 4:
        return ['Unlocked custom tags', 'New achievement badges available'];
      case 5:
        return ['Unlocked task templates', 'Maximum time limit increased'];
      case 6:
        return ['Unlocked advanced statistics', 'Bonus points for difficult tasks'];
      case 7:
        return ['Unlocked priority auto-suggestion', 'Streak rewards doubled'];
      case 8:
        return ['Unlocked all features', 'Legendary status badge'];
      default:
        return ['Keep completing tasks to earn more rewards!'];
    }
  };
  
  const rewards = getLevelRewards(level);
  
  if (!show) return null;
  
  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} 
          rounded-xl shadow-xl max-w-md w-full p-6 ${animationClass}`}
      >
        <div className="text-center">
          <div className="mb-4">
            <div className={`inline-block rounded-full p-4 ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
              <svg className="w-10 h-10 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Level Up!</h2>
          
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className={`text-lg font-semibold px-3 py-1 rounded-full ${
              darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800'
            }`}>
              Level {level}
            </div>
            <span className="text-xl">•</span>
            <div className="text-lg font-medium text-indigo-500">{title}</div>
          </div>
          
          <p className="text-sm mb-6 opacity-75">
            Congratulations! Your productivity has earned you a new level.
          </p>
          
          <div className={`mb-6 rounded-lg p-4 ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <h3 className="font-medium mb-2 text-indigo-500">New Rewards Unlocked:</h3>
            <ul className="text-sm">
              {rewards.map((reward, index) => (
                <li key={index} className="flex items-center mb-2 last:mb-0">
                  <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {reward}
                </li>
              ))}
            </ul>
          </div>
          
          <button
            onClick={onClose}
            className={`w-full py-2 px-4 rounded-md font-medium ${
              darkMode 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
            } transition-colors`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LevelUpModal;