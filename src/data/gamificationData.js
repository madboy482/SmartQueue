export const ACHIEVEMENTS = [
    {
      id: "task_newbie",
      name: "Task Newbie",
      description: "Complete your first 5 tasks",
      icon: "🎯",
      progress: {
        required: 5,
        current: 0
      },
      unlocked: false,
      points: 50
    },
    {
      id: "productivity_beast",
      name: "Productivity Beast",
      description: "Complete 50 tasks",
      icon: "🦁",
      progress: {
        required: 50,
        current: 0
      },
      unlocked: false,
      points: 200
    },
    {
      id: "prioritization_master",
      name: "Priority Master",
      description: "Complete 20 high-priority tasks",
      icon: "⭐",
      progress: {
        required: 20,
        current: 0
      },
      unlocked: false,
      points: 150
    },
    {
      id: "early_bird",
      name: "Early Bird",
      description: "Complete 10 tasks ahead of schedule",
      icon: "⏱️",
      progress: {
        required: 10,
        current: 0
      },
      unlocked: false,
      points: 100
    },
    {
      id: "streak_master",
      name: "Streak Master",
      description: "Maintain a 7-day task completion streak",
      icon: "🔥",
      progress: {
        required: 7,
        current: 0
      },
      unlocked: false,
      points: 150
    },
    {
      id: "time_optimizer",
      name: "Time Optimizer",
      description: "Complete tasks totaling 24 hours of work",
      icon: "⌛",
      progress: {
        required: 1440, // Minutes (24 hours)
        current: 0
      },
      unlocked: false,
      points: 180
    }
  ];
  
  export const LEVELS = [
    { level: 1, threshold: 0, title: "Beginner", color: "text-gray-600", perk: "Basic features" },
    { level: 2, threshold: 100, title: "Novice", color: "text-blue-500", perk: "Dark mode" },
    { level: 3, threshold: 300, title: "Apprentice", color: "text-green-500", perk: "Custom theme colors" },
    { level: 4, threshold: 600, title: "Adept", color: "text-yellow-500", perk: "Advanced analytics" },
    { level: 5, threshold: 1000, title: "Expert", color: "text-orange-500", perk: "Timer countdown" },
    { level: 6, threshold: 1500, title: "Master", color: "text-red-500", perk: "Pomodoro timer" },
    { level: 7, threshold: 2500, title: "Grandmaster", color: "text-purple-500", perk: "Priority suggestions" },
    { level: 8, threshold: 4000, title: "Legend", color: "text-indigo-500", perk: "AI task recommendations" }
  ];
  
  export const calculateTaskScore = (task, completionData) => {
    // Base score based on importance (1-10 scale)
    let score = task.importance * 10;
    
    // Bonus for task complexity based on estimated time
    score += Math.min(task.time / 10, 20); // Max +20 for time
    
    // Bonus for early completion
    if (completionData && completionData.early) {
      score += completionData.bonus;
    }
    
    return Math.round(score);
  };