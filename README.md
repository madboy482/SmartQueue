<div align="center">
  
# 🚀 SmartQueue

### Intelligent Task Prioritization Powered by Algorithms

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![React](https://img.shields.io/badge/React-v18-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-95.9%25-yellow)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

[Key Features](#-key-features) • 
[Demo](#-live-demo) • 
[Technical Highlights](#-technical-highlights) • 
[Installation](#-installation) • 
[Screenshots](#-screenshots) • 
[Future Enhancements](#-future-enhancements)

</div>

---

## ✨ Overview

**SmartQueue** is not just another task manager. It's an intelligent productivity system that uses the Knapsack algorithm to automatically prioritize your tasks based on importance and available time. With real-time algorithm visualization, gamification features, and an elegant UI, SmartQueue transforms task management from a chore into an engaging experience.

> "Managing time isn't about squeezing more tasks into your day, but about prioritizing the ones that truly matter." — SmartQueue Philosophy

---

## 🎯 Key Features

- **Algorithmic Task Prioritization** - Automatically schedules your most important tasks within your available time
- **Real-time Algorithm Visualization** - Watch sorting and optimization algorithms work their magic
- **Gamification Elements** - Level up, earn badges, and stay motivated with built-in rewards
- **Deadline Management** - Set and track deadlines with intuitive visual feedback
- **Smart Time Allocation** - Optimize your available time for maximum productivity
- **Dark/Light Mode** - Easy on the eyes, any time of day
- **Productivity Analytics** - Track your performance metrics and optimization results

---

## 💻 Technical Highlights

| Feature | Implementation |
|---------|----------------|
| **Task Optimization** | Knapsack algorithm (O(n*W) complexity) for optimal task selection within time constraints |
| **Task Sorting** | Merge Sort algorithm (O(n log n) complexity) for efficient list management |
| **State Management** | React Context API for centralized gamification and user progress tracking |
| **Data Persistence** | Local storage implementation with robust error handling |
| **Performance** | Optimized rendering with React memo and callbacks |
| **Accessibility** | WCAG-compliant color schemes and keyboard navigation |

```javascript
// Example of our Knapsack algorithm implementation
const knapsackOptimization = (tasks, timeLimit) => {
  // Create DP table
  const dp = Array(n + 1).fill().map(() => Array(timeLimit + 1).fill(0));
  
  // Fill dp table (simplified)
  for (let i = 1; i <= tasks.length; i++) {
    for (let w = 0; w <= timeLimit; w++) {
      if (tasks[i-1].time <= w) {
        dp[i][w] = Math.max(
          dp[i-1][w], 
          dp[i-1][w-tasks[i-1].time] + tasks[i-1].importance
        );
      } else {
        dp[i][w] = dp[i-1][w];
      }
    }
  }
  
  // Return optimized selection
  return backtrack(dp, tasks, timeLimit);
};
```

---

## 🚀 Live Demo

Experience SmartQueue firsthand with our live demo!

🔗 [Launch Demo](https://smart-queue.netlify.app/)

---

## 📋 Installation

```bash
# Clone the repository
git clone https://github.com/madboy482/SmartQueue.git

# Navigate to the project directory
cd SmartQueue

# Install dependencies
npm install

# Start the development server
npm start
```

The application will be available at `http://localhost:3000`

---

## 📱 Screenshots

<div align="center">
  <img src="screenshots/Screenshot%20(38).png" alt="Task Dashboard" width="45%"/>
  <img src="screenshots/Screenshot%20(41).png" alt="Algorithm Visualization" width="45%"/>
</div>

---

## 🔬 Under the Hood

SmartQueue combines the power of classic computer science algorithms with modern web development practices:

- **Algorithms**: Implementation of Merge Sort for task sorting and 0/1 Knapsack for time optimization
- **Frontend**: React.js with functional components and hooks
- **Styling**: Tailwind CSS for responsive design
- **Animation**: CSS transitions and custom animation framework
- **Data Flow**: Unidirectional data flow with React Context

---

## 🚀 Future Enhancements

- [ ] Cloud synchronization
- [ ] Mobile applications
- [ ] Team collaboration features
- [ ] AI-powered task suggestions
- [ ] Advanced analytics dashboard
- [ ] Calendar integration
- [ ] Voice commands

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Added new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ by <b>Team AndroNova</b></p>
</div>
