
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchTasks, createTask, updateTaskStatus, deleteTask } from '@/services/api';
import { Task } from '@/types';
import TaskColumn from './TaskColumn';
import CreateTaskForm from './CreateTaskForm';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const { toast } = useToast();

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

  const handleStatusChange = async (id: number, newStatus: string) => {
    if (!user) return;
    
    try {
      const updatedTask = await updateTaskStatus(user.token, id, newStatus);
      setTasks((prev) => prev.map((task) => task.id === id ? updatedTask : task));
    } catch (error) {
      console.error('Failed to update task status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da tarefa.",
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-white font-medium">Carregando tarefas...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Quadro de Tarefas</h1>
          <p className="text-gray-400">Bem-vindo, {user?.username}</p>
        </div>
        <div className="flex space-x-4">
          <CreateTaskForm onTaskCreate={handleTaskCreate} />
          <Button 
            variant="outline" 
            onClick={logout}
            className="border-gray-700 hover:bg-gray-800"
          >
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <TaskColumn
          title="Backlog"
          tasks={tasks}
          status="BACKLOG"
          onStatusChange={handleStatusChange}
          onDelete={handleTaskDelete}
        />
        <TaskColumn
          title="A Fazer"
          tasks={tasks}
          status="TODO"
          onStatusChange={handleStatusChange}
          onDelete={handleTaskDelete}
        />
        <TaskColumn
          title="Em Progresso"
          tasks={tasks}
          status="IN_PROGRESS"
          onStatusChange={handleStatusChange}
          onDelete={handleTaskDelete}
        />
        <TaskColumn
          title="Concluído"
          tasks={tasks}
          status="DONE"
          onStatusChange={handleStatusChange}
          onDelete={handleTaskDelete}
        />
      </div>
    </div>
  );
};

export default TaskBoard;
