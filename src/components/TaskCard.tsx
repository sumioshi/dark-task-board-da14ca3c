
import React from 'react';
import { Task } from '../types';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: number, newStatus: string) => void;
  onDelete: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onDelete }) => {
  const { toast } = useToast();

  const handleDelete = () => {
    onDelete(task.id);
    toast({
      title: "Tarefa Excluída",
      description: `A tarefa "${task.titulo}" foi removida.`,
    });
  };

  const getNextStatus = () => {
    switch(task.status) {
      case 'BACKLOG':
        return 'TODO';
      case 'TODO':
        return 'IN_PROGRESS';
      case 'IN_PROGRESS':
        return 'DONE';
      case 'DONE':
        return 'BACKLOG'; // Loop back to start
      default:
        return 'TODO';
    }
  };

  const handleMoveForward = () => {
    const nextStatus = getNextStatus();
    onStatusChange(task.id, nextStatus);
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'BACKLOG':
        return 'Backlog';
      case 'TODO':
        return 'To Do';
      case 'IN_PROGRESS':
        return 'Em Progresso';
      case 'DONE':
        return 'Concluído';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'BACKLOG':
        return 'bg-gray-500/30 text-gray-200';
      case 'TODO':
        return 'bg-blue-500/30 text-blue-200';
      case 'IN_PROGRESS':
        return 'bg-yellow-500/30 text-yellow-200';
      case 'DONE':
        return 'bg-green-500/30 text-green-200';
      default:
        return 'bg-gray-500/30 text-gray-200';
    }
  };

  return (
    <div className="card-glass rounded-lg p-4 mb-3 animate-pulse-glow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-white">{task.titulo}</h3>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleMoveForward}
            className="h-7 w-7 p-0"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDelete}
            className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-gray-300 mb-3">{task.descricao}</p>
      
      <div className="flex justify-between items-center">
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
          {getStatusLabel(task.status)}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
