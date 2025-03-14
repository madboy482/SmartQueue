import React, { useState } from 'react';

const TaskItem = ({ task, onToggleComplete, onDelete, darkMode }) => {
  const [isHovering, setIsHovering] = useState(false);

  // Format time (convert minutes back to hours and minutes)
  const formatTime = (timeInMinutes) => {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;

    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };

  // Different background colors based on importance
  const getImportanceStyle = (importance) => {
    if (task.completed) {
      return darkMode 
        ? 'border-gray-700 bg-gray-800/50' 
        : 'border-gray-200 bg-gray-50';
    }

    if (importance >= 8) {
      return darkMode 
        ? 'border-red-800 bg-red-900/20 text-red-400' 
        : 'border-red-300 bg-red-100 text-red-700';
    }
    if (importance >= 5) {
      return darkMode 
        ? 'border-yellow-700 bg-yellow-900/20 text-yellow-400' 
        : 'border-yellow-300 bg-yellow-100 text-yellow-700';
    }
    return darkMode 
      ? 'border-green-700 bg-green-900/20 text-green-400' 
      : 'border-green-300 bg-green-100 text-green-700';
  };

  // Get color for importance indicator
  const getImportanceColor = (importance) => {
    if (task.completed) {
      return darkMode ? 'bg-gray-600' : 'bg-gray-300';
    }

    if (importance >= 8) return 'bg-red-500';
    if (importance >= 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div 
      className={`group relative mb-3 p-4 border rounded-lg transition-all duration-200 ${getImportanceStyle(task.importance)} ${
        isHovering ? (darkMode ? 'shadow-md shadow-black/20' : 'shadow-md') : ''
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Colored importance indicator */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${getImportanceColor(task.importance)}`}
      ></div>

      <div className="flex items-start">
        <div 
          className={`mt-1 mr-3 flex-shrink-0 h-5 w-5 rounded border ${
            task.completed 
              ? (darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-200') 
              : (darkMode ? 'border-gray-600' : 'border-gray-300')
          }`}
          onClick={() => onToggleComplete(task.id)}
        >
          {task.completed && (
            <svg className="h-full w-full text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        <div className={`flex-grow ${task.completed ? 'opacity-60' : ''}`}>
          <h3 className={`text-base font-semibold ${task.completed ? 'line-through text-gray-500' : darkMode ? 'text-white' : 'text-black'}`}>
            {task.name}
          </h3>

          <div className="flex flex-wrap items-center mt-2 gap-3">
            <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {formatTime(task.time)}
            </div>

            <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Priority: <span className="font-medium">{task.importance}</span>/10</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className={`ml-2 p-1 rounded-full transition-opacity duration-200 ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          } ${isHovering ? 'opacity-100' : 'opacity-0'}`}
        >
          <svg className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskItem;