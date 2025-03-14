import React from 'react';

const TimeSlider = ({ timeLimit, onChange, darkMode }) => {
  // Convert minutes to hours and minutes for display
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} minutes`;
    } else if (mins === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `${hours}h ${mins}m`;
    }
  };

  const handleChange = (e) => {
    onChange(parseInt(e.target.value, 10));
  };
  
  // Return an appropriate icon based on time available
  const getTimeIcon = () => {
    if (timeLimit <= 60) {
      return (
        <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else if (timeLimit <= 240) {
      return (
        <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
  };

  // Calculate width percentage for the time display indicator
  const getTimeIndicatorPosition = () => {
    const percentage = (timeLimit / 1440) * 100;
    // Constrain between 0% and 100%
    return Math.max(0, Math.min(percentage, 100));
  };

  // Quick select buttons
  const quickSelectOptions = [
    { label: '30m', value: 30 },
    { label: '1h', value: 60 },
    { label: '2h', value: 120 },
    { label: '4h', value: 240 },
    { label: '8h', value: 480 },
  ];

  return (
    <div className={`mb-6 rounded-xl shadow-sm overflow-hidden ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    }`}>
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold flex items-center">
          {getTimeIcon()}
          Available Time
        </h2>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Time Budget
          </label>
          <span className={`text-lg font-semibold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
            {formatTime(timeLimit)}
          </span>
        </div>
        
        {/* Time slider with custom styling */}
        <div className="relative mt-6 mb-8">
          <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <div 
            className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-indigo-600 shadow-md cursor-pointer"
            style={{ left: `calc(${getTimeIndicatorPosition()}% - 10px)` }}
          ></div>
          <input
            type="range"
            min="15"
            max="1440" // 24 hours in minutes
            step="15"
            className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
            value={timeLimit}
            onChange={handleChange}
          />
        </div>
        
        {/* Time markers */}
        <div className="flex justify-between text-xs mb-6">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>15m</span>
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>4h</span>
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>8h</span>
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>16h</span>
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>24h</span>
        </div>
        
        {/* Quick select buttons */}
        <div>
          <div className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Quick Select:</div>
          <div className="flex flex-wrap gap-2">
            {quickSelectOptions.map(option => (
              <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  timeLimit === option.value
                    ? 'bg-indigo-600 text-white'
                    : darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className={`mt-5 p-3 rounded-md text-sm ${
          darkMode ? 'bg-indigo-900/20 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
        }`}>
          <p className="mb-1 font-medium">Productivity Tip</p>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
            Setting realistic time limits helps you prioritize effectively and avoid burnout.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimeSlider;