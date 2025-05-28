
import React from 'react';
import DroppableColumn from './board/DroppableColumn';
import { Task, TaskStatus } from '@/types';

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
  onDelete
}) => {
  return (
    <DroppableColumn
      title={title}
      tasks={tasks}
      status={status as TaskStatus}
      onDelete={onDelete}
    />
  );
};

export default TaskColumn;
