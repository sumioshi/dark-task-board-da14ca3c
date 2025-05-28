
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { X, GripVertical, Calendar, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface DraggableTaskCardProps {
  task: Task;
  onDelete: (id: number) => void;
}

const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({ task, onDelete }) => {
  const { toast } = useToast();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = () => {
    onDelete(task.id);
    toast({
      title: "Tarefa Excluída",
      description: `A tarefa "${task.titulo}" foi removida.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'BACKLOG':
        return 'border-l-gray-500';
      case 'TODO':
        return 'border-l-blue-500';
      case 'IN_PROGRESS':
        return 'border-l-yellow-500';
      case 'DONE':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-lg p-4 mb-3 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer border-l-4 ${getStatusColor(task.status)} ${isDragging ? 'rotate-2 scale-105' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start space-x-2 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="mt-1 text-gray-500 hover:text-gray-400 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm leading-tight mb-2">
              {task.titulo}
            </h3>
            <p className="text-gray-300 text-xs leading-relaxed">
              {task.descricao}
            </p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDelete}
          className="h-6 w-6 p-0 text-gray-500 hover:text-red-400 hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>Hoje</span>
        </div>
        <div className="flex items-center space-x-1">
          <User className="h-3 w-3 text-gray-500" />
          <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-[10px] font-semibold text-white">
            U
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraggableTaskCard;
