
import React from 'react';
import { Task } from '../types';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: string;
  onStatusChange: (id: number, newStatus: string) => void;
  onDelete: (id: number) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ 
  title, 
  tasks, 
  status,
  onStatusChange,
  onDelete
}) => {
  const filteredTasks = tasks.filter(task => task.status === status);

  return (
    <div className="min-w-[250px] w-full bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-lg p-4 glow-border">
      <h2 className="text-lg font-semibold mb-3 text-white">{title}</h2>
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-gray-500 text-sm italic p-3 text-center border border-dashed border-gray-700 rounded-lg">
            Nenhuma tarefa
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
