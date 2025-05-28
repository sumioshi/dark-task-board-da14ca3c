
import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useAuth } from '@/contexts/AuthContext';
import { fetchTasks, createTask, updateTaskStatus, deleteTask } from '@/services/api';
import { Task, TaskStatus } from '@/types';
import DroppableColumn from './DroppableColumn';
import DraggableTaskCard from './DraggableTaskCard';
import BoardHeader from './BoardHeader';
import { useToast } from '@/components/ui/use-toast';

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const columns: { id: TaskStatus; title: string }[] = [
    { id: 'BACKLOG', title: 'Backlog' },
    { id: 'TODO', title: 'A Fazer' },
    { id: 'IN_PROGRESS', title: 'Em Progresso' },
    { id: 'DONE', title: 'Concluído' },
  ];

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await fetchTasks(user.token);
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast({
        title: "Erro ao carregar tarefas",
        description: "Não foi possível carregar suas tarefas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskCreate = async (newTask: Omit<Task, 'id'>) => {
    if (!user) return;
    
    try {
      const createdTask = await createTask(user.token, newTask);
      setTasks((prev) => [...prev, createdTask]);
      toast({
        title: "Tarefa criada",
        description: "Nova tarefa adicionada com sucesso.",
      });
    } catch (error) {
      console.error('Failed to create task:', error);
      toast({
        title: "Erro ao criar tarefa",
        description: "Não foi possível adicionar a nova tarefa.",
        variant: "destructive",
      });
    }
  };

  const handleTaskDelete = async (id: number) => {
    if (!user) return;
    
    try {
      await deleteTask(user.token, id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast({
        title: "Erro ao excluir tarefa",
        description: "Não foi possível excluir a tarefa.",
        variant: "destructive",
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || !user) return;

    const taskId = active.id as number;
    const newStatus = over.id as TaskStatus;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic update
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ));

    try {
      await updateTaskStatus(user.token, taskId, newStatus);
      toast({
        title: "Status atualizado",
        description: `Tarefa movida para ${columns.find(c => c.id === newStatus)?.title}`,
      });
    } catch (error) {
      // Revert on error
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: task.status } : t
      ));
      console.error('Failed to update task status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da tarefa.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-white font-medium">Carregando tarefas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <BoardHeader 
        user={user} 
        onTaskCreate={handleTaskCreate} 
        onLogout={logout} 
      />
      
      <div className="container mx-auto p-6">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
            {columns.map((column) => (
              <DroppableColumn
                key={column.id}
                title={column.title}
                tasks={tasks}
                status={column.id}
                onDelete={handleTaskDelete}
              />
            ))}
          </div>
          
          <DragOverlay>
            {activeTask ? (
              <div className="rotate-2 scale-105">
                <DraggableTaskCard
                  task={activeTask}
                  onDelete={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default TaskBoard;
