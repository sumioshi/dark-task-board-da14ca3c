
import React from 'react';
import DraggableTaskCard from './board/DraggableTaskCard';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: number, newStatus: string) => void;
  onDelete: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  return <DraggableTaskCard task={task} onDelete={onDelete} />;
};

export default TaskCard;
