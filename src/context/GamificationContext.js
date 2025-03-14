import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { saveUserProgress, loadUserProgress } from '../utils/localStorage';
import { ACHIEVEMENTS, LEVELS, calculateTaskScore } from '../data/gamificationData';

const GamificationContext = createContext();

export const GamificationProvider = ({ children }) => {
  const [progress, setProgress] = useState(loadUserProgress());
  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const [showNotification, setShowNotification] = useState(null);
  
  // Wrap updateProgress in useCallback to avoid dependency cycles
  const updateProgress = useCallback((updates) => {
    setProgress(prev => {
      const newProgress = { ...prev, ...updates };
      saveUserProgress(newProgress);
      return newProgress;
    });
    
    // Check for achievements will be handled in a separate effect
  }, []);

  // Check for achievements after progress updates
  const checkForAchievements = useCallback(() => {
    const newlyUnlocked = [];
    
    achievements.forEach(achievement => {
      if (!achievement.unlocked && 
          achievement.progress.current >= achievement.progress.required &&
          !progress.achievements.includes(achievement.id)) {
        // Unlock achievement
        newlyUnlocked.push(achievement);
        setProgress(prev => ({
          ...prev,
          achievements: [...prev.achievements, achievement.id],
          score: prev.score + achievement.points
        }));
      }
    });
    
    if (newlyUnlocked.length > 0) {
      // Show notification for new achievements
      setShowNotification({
        type: 'achievement',
        items: newlyUnlocked
      });
      
      // Return the new achievements for any additional processing
      return newlyUnlocked;
    }
    
    return [];
  }, [achievements, progress.achievements]);
  
  // Update achievements with current progress
  useEffect(() => {
    const updatedAchievements = achievements.map(achievement => {
      // Update progress based on user data
      let current = 0;
      
      switch (achievement.id) {
        case 'task_newbie':
        case 'productivity_beast':
          current = progress.tasksCompleted;
          break;
          
        case 'prioritization_master':
          current = progress.highPriorityCompleted;
          break;
          
        case 'early_bird':
          current = progress.earlyCompletions;
          break;
          
        case 'streak_master':
          current = progress.dailyStreak;
          break;
          
        case 'time_optimizer':
          current = progress.totalTimeWorked; // In minutes
          break;
          
        default:
          break;
      }
      
      // Check if unlocked
      const unlocked = progress.achievements.includes(achievement.id);
      
      return {
        ...achievement,
        progress: {
          ...achievement.progress,
          current
        },
        unlocked
      };
    });
    
    setAchievements(updatedAchievements);
  }, [progress, achievements]); // Added achievements as dependency
  
  // Check for streak maintenance
  useEffect(() => {
    // Check if a day was missed
    if (progress.lastActiveDate) {
      const lastActive = new Date(progress.lastActiveDate);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Same day - do nothing
      if (lastActive.toDateString() === today.toDateString()) {
        // Already updated today
      }
      // If last active was yesterday, maintain streak
      else if (lastActive.toDateString() === yesterday.toDateString()) {
        updateProgress({
          lastActiveDate: today.toISOString()
        });
      }
      // Otherwise, streak is broken
      else {
        updateProgress({
          dailyStreak: 0,
          lastActiveDate: today.toISOString()
        });
      }
    }
  }, [progress.lastActiveDate, updateProgress]); // Added missing dependencies
  
  const getCurrentLevel = useCallback((score) => {
    // Find the highest level the user has reached
    const currentLevel = LEVELS.reduce((highest, level) => {
      if (score >= level.threshold && level.level > highest.level) {
        return level;
      }
      return highest;
    }, LEVELS[0]);
    
    return currentLevel;
  }, []);
  
  // Modified updateProgress with useCallback
  const handleProgressUpdate = useCallback((updates) => {
    updateProgress(updates);
    
    // Check for achievements after progress update
    const newlyUnlocked = checkForAchievements();
    
    // Check for level up - only if there wasn't already an achievement notification
    if (newlyUnlocked.length === 0) {
      const currentLevel = getCurrentLevel(progress.score);
      const newScore = progress.score + (updates.score || 0);
      const newLevel = getCurrentLevel(newScore);
      
      if (newLevel.level > currentLevel.level) {
        // Level up notification
        setShowNotification({
          type: 'levelUp',
          oldLevel: currentLevel,
          newLevel: newLevel
        });
      }
    }
  }, [checkForAchievements, getCurrentLevel, progress.score, updateProgress]);
  
  const completeTask = useCallback((task, completionData = {}) => {
    // Calculate score
    const scoreGained = calculateTaskScore(task, completionData);
    
    // Calculate time worked (in minutes)
    const timeWorked = completionData.timeSpent 
      ? Math.round(completionData.timeSpent / 60) 
      : task.time;
    
    // Update various progress metrics
    handleProgressUpdate({
      score: progress.score + scoreGained,
      tasksCompleted: progress.tasksCompleted + 1,
      highPriorityCompleted: progress.highPriorityCompleted + 
        (task.importance >= 8 ? 1 : 0),
      dailyStreak: progress.dailyStreak + 1,
      lastActiveDate: new Date().toISOString(),
      earlyCompletions: progress.earlyCompletions + 
        (completionData.early ? 1 : 0),
      totalTimeWorked: (progress.totalTimeWorked || 0) + timeWorked
    });
    
    return {
      scoreGained,
      currentLevel: getCurrentLevel(progress.score + scoreGained)
    };
  }, [getCurrentLevel, handleProgressUpdate, progress]);
  
  const dismissNotification = useCallback(() => {
    setShowNotification(null);
  }, []);
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = {
    progress,
    achievements,
    currentLevel: getCurrentLevel(progress.score),
    nextLevel: LEVELS.find(l => l.level === getCurrentLevel(progress.score).level + 1) || null,
    completeTask,
    showNotification,
    dismissNotification
  };
  
  return (
    <GamificationContext.Provider value={contextValue}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => useContext(GamificationContext);