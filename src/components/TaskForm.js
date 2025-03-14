import React, { useState } from 'react';

const TaskForm = ({ onAddTask, darkMode }) => {
  const [taskName, setTaskName] = useState('');
  const [importance, setImportance] = useState(5); // Range 1-10
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [isExpanded, setIsExpanded] = useState(false);
  const [formError, setFormError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!taskName.trim()) {
      setFormError('Task name cannot be empty');
      return;
    }
    
    // Reset error if validation passes
    setFormError('');
    
    // Calculate time in minutes
    const timeInMinutes = (hours * 60) + parseInt(minutes, 10);
    
    const newTask = {
      id: Date.now(),
      name: taskName,
      importance: parseInt(importance, 10),
      time: timeInMinutes,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    onAddTask(newTask);
    
    // Reset form
    setTaskName('');
    setImportance(5);
    setHours(0);
    setMinutes(30);
    setIsExpanded(false);
  };
  
  // Get color based on importance value
  const getImportanceColor = (value) => {
    if (value >= 8) return 'bg-red-500';
    if (value >= 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  return (
    <div className={`mb-6 rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    }`}>
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Task
        </h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`text-sm font-medium ${
            darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
          }`}
        >
          {isExpanded ? 'Minimize' : 'Show Options'}
        </button>
      </div>
      
      <div className="p-5">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex">
              <input
                type="text"
                className={`flex-1 rounded-l-lg px-4 py-3 outline-none ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                } border border-r-0 focus:ring-2 focus:ring-indigo-500`}
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="What needs to be done?"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-r-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Add
              </button>
            </div>
            {formError && (
              <p className="mt-2 text-sm text-red-500">{formError}</p>
            )}
          </div>
          
          <div className={`space-y-4 transition-all duration-300 overflow-hidden ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div>
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Importance: <span className="font-bold">{importance}/10</span>
              </label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">1</span>
                <div className="flex-1 relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`absolute h-full ${getImportanceColor(importance)}`} style={{ width: `${(importance / 10) * 100}%` }}></div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={importance}
                    onChange={(e) => setImportance(parseInt(e.target.value))}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-sm text-gray-500">10</span>
              </div>
              <div className="flex justify-between text-xs mt-1 text-gray-500">
                <span>Low Priority</span>
                <span>Medium</span>
                <span>High Priority</span>
              </div>
            </div>
            
            <div>
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Estimated Time
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hours" className={`block mb-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Hours
                  </label>
                  <div className="flex">
                    <button
                      type="button"
                      onClick={() => setHours(h => Math.max(0, h - 1))}
                      className={`px-3 py-2 rounded-l-lg ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 border-gray-600' 
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                      } border border-r-0`}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      className={`w-full px-3 py-2 text-center ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      } border-y`}
                      value={hours}
                      onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                    />
                    <button
                      type="button"
                      onClick={() => setHours(h => h + 1)}
                      className={`px-3 py-2 rounded-r-lg ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 border-gray-600' 
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                      } border border-l-0`}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="minutes" className={`block mb-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Minutes
                  </label>
                  <div className="flex">
                    <button
                      type="button"
                      onClick={() => setMinutes(m => Math.max(0, m - 5))}
                      className={`px-3 py-2 rounded-l-lg ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 border-gray-600' 
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                      } border border-r-0`}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      step="5"
                      className={`w-full px-3 py-2 text-center ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      } border-y`}
                      value={minutes}
                      onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                    />
                    <button
                      type="button"
                      onClick={() => setMinutes(m => Math.min(55, m + 5))}
                      className={`px-3 py-2 rounded-r-lg ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 border-gray-600' 
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                      } border border-l-0`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;