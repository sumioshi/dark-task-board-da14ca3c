
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '@/types';
import DraggableTaskCard from './DraggableTaskCard';
import { Plus } from 'lucide-react';

interface DroppableColumnProps {
  title: string;
  tasks: Task[];
  status: TaskStatus;
  onDelete: (id: number) => void;
  count?: number;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ 
  title, 
  tasks, 
  status,
  onDelete,
  count
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  const filteredTasks = tasks.filter(task => task.status === status);
  const taskIds = filteredTasks.map(task => task.id);

  const getColumnColor = (status: string) => {
    switch(status) {
      case 'BACKLOG':
        return 'from-gray-600/20 to-gray-700/20 border-gray-600/30';
      case 'TODO':
        return 'from-blue-600/20 to-blue-700/20 border-blue-600/30';
      case 'IN_PROGRESS':
        return 'from-yellow-600/20 to-yellow-700/20 border-yellow-600/30';
      case 'DONE':
        return 'from-green-600/20 to-green-700/20 border-green-600/30';
      default:
        return 'from-gray-600/20 to-gray-700/20 border-gray-600/30';
    }
  };

  const getHeaderColor = (status: string) => {
    switch(status) {
      case 'BACKLOG':
        return 'text-gray-400';
      case 'TODO':
        return 'text-blue-400';
      case 'IN_PROGRESS':
        return 'text-yellow-400';
      case 'DONE':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={`flex flex-col h-full bg-gradient-to-b ${getColumnColor(status)} rounded-xl border ${getColumnColor(status)} backdrop-blur-sm transition-all duration-200 ${isOver ? 'ring-2 ring-purple-500/50 scale-[1.02]' : ''}`}>
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center space-x-2">
          <h2 className={`font-semibold text-sm ${getHeaderColor(status)}`}>
            {title}
          </h2>
          <span className="bg-gray-700/50 text-gray-300 text-xs px-2 py-1 rounded-full">
            {filteredTasks.length}
          </span>
        </div>
        <button className="text-gray-500 hover:text-gray-400 transition-colors p-1">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div 
        ref={setNodeRef}
        className="flex-1 p-4 pt-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
        style={{ minHeight: '200px' }}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {filteredTasks.length === 0 ? (
            <div className="text-gray-500 text-sm italic p-6 text-center border border-dashed border-gray-600/50 rounded-lg bg-gray-800/20">
              <div className="text-2xl mb-2">📝</div>
              <p>Nenhuma tarefa</p>
              <p className="text-xs mt-1">Arraste tarefas aqui</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <DraggableTaskCard 
                key={task.id} 
                task={task}
                onDelete={onDelete}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default DroppableColumn;
