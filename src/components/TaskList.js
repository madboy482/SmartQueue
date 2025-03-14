import React from 'react';
import TaskItem from './TaskItem';
const TaskList = ({ tasks, onToggleComplete, onDelete, title = "All Tasks" }) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4 text-black">{title}</h2>
        <p className="text-black">No tasks available.</p>
      </div>
    );
  }
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 text-black">{title}</h2>
      <div>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            className="text-black" // Apply black text to each task
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;