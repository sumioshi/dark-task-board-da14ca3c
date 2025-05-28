
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, GripVertical, Calendar, User, CheckSquare, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import SubtaskManager from '../SubtaskManager';

interface DraggableTaskCardProps {
  task: Task;
  onDelete: (id: number) => void;
}

const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({ task, onDelete }) => {
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays === -1) return 'Ontem';
    if (diffDays < 0) return `${Math.abs(diffDays)} dias atrás`;
    return `${diffDays} dias`;
  };

  const isOverdue = (dateString?: string) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const completedSubtasks = subtasks.filter(s => s.completed).length;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-lg p-4 mb-3 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer border-l-4 ${getStatusColor(task.status)} ${isDragging ? 'rotate-2 scale-105' : ''}`}
        onClick={() => setShowDetails(true)}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-start space-x-2 flex-1">
            <div
              {...attributes}
              {...listeners}
              className="mt-1 text-gray-500 hover:text-gray-400 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white text-sm leading-tight mb-2">
                {task.titulo}
              </h3>
              {task.descricao && (
                <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">
                  {task.descricao}
                </p>
              )}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="h-6 w-6 p-0 text-gray-500 hover:text-red-400 hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        {/* Subtasks progress */}
        {subtasks.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <CheckSquare className="h-3 w-3" />
              <span>{completedSubtasks}/{subtasks.length}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
              <div 
                className="bg-purple-500 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-gray-500">
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${isOverdue(task.dueDate) ? 'text-red-400' : ''}`}>
                <Calendar className="h-3 w-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {task.assignedUser && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3 text-gray-500" />
                <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-[10px] font-semibold text-white">
                  {task.assignedUser.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="card-glass border-purple-500/30 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              {task.titulo}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {task.descricao && (
              <div>
                <h4 className="text-sm font-medium text-gray-200 mb-2">Descrição</h4>
                <p className="text-gray-300 text-sm">{task.descricao}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {task.assignedUser && (
                <div>
                  <h4 className="text-sm font-medium text-gray-200 mb-1">Usuário</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                      {task.assignedUser.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-300 text-sm">{task.assignedUser}</span>
                  </div>
                </div>
              )}
              
              {task.dueDate && (
                <div>
                  <h4 className="text-sm font-medium text-gray-200 mb-1">Data limite</h4>
                  <div className={`flex items-center gap-2 ${isOverdue(task.dueDate) ? 'text-red-400' : 'text-gray-300'}`}>
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{formatDate(task.dueDate)}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-200 mb-2">Subtarefas</h4>
              <SubtaskManager
                subtasks={subtasks}
                onSubtasksChange={setSubtasks}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DraggableTaskCard;
