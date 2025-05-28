
import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useAuth } from '@/contexts/AuthContext';
import { fetchTasks, createTask, updateTaskStatus, deleteTask } from '@/services/api';
import { Task, TaskStatus, Column } from '@/types';
import DroppableColumn from './DroppableColumn';
import DraggableTaskCard from './DraggableTaskCard';
import BoardHeader from './BoardHeader';
import { ColumnHeader, AddColumnButton } from './ColumnManager';
import { useToast } from '@/components/ui/use-toast';

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([
    { id: 'BACKLOG', title: 'Backlog', status: 'BACKLOG' as TaskStatus, order: 0 },
    { id: 'TODO', title: 'A Fazer', status: 'TODO' as TaskStatus, order: 1 },
    { id: 'IN_PROGRESS', title: 'Em Progresso', status: 'IN_PROGRESS' as TaskStatus, order: 2 },
    { id: 'DONE', title: 'Concluído', status: 'DONE' as TaskStatus, order: 3 },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
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
      const normalizedTasks = data.map(task => ({
        ...task,
        subtasks: task.subtasks || [],
        comments: task.comments || [],
        totalTime: task.totalTime || 0,
        createdAt: task.createdAt || new Date().toISOString(),
      }));
      setTasks(normalizedTasks);
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
      const taskWithDefaults = {
        ...newTask,
        comments: [],
        totalTime: 0,
      };
      const createdTask = await createTask(user.token, taskWithDefaults);
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

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
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

  const handleColumnRename = (id: string, newTitle: string) => {
    setColumns(prev => prev.map(col => 
      col.id === id ? { ...col, title: newTitle } : col
    ));
    toast({
      title: "Coluna renomeada",
      description: `Coluna renomeada para "${newTitle}"`,
    });
  };

  const handleColumnDelete = (id: string) => {
    const tasksInColumn = tasks.filter(task => task.status === id);
    if (tasksInColumn.length > 0) {
      toast({
        title: "Não é possível excluir",
        description: "Mova ou exclua todas as tarefas desta coluna primeiro.",
        variant: "destructive",
      });
      return;
    }

    setColumns(prev => prev.filter(col => col.id !== id));
    toast({
      title: "Coluna excluída",
      description: "Coluna removida com sucesso.",
    });
  };

  const handleAddColumn = (title: string) => {
    const newId = `CUSTOM_${Date.now()}`;
    const newColumn: Column = {
      id: newId,
      title,
      status: newId as TaskStatus,
      order: columns.length,
    };
    setColumns(prev => [...prev, newColumn]);
    toast({
      title: "Coluna criada",
      description: `Nova coluna "${title}" adicionada.`,
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.id.toString().startsWith('column-')) {
      const columnId = event.active.id.toString().replace('column-', '');
      const column = columns.find(c => c.id === columnId);
      setActiveColumn(column || null);
    } else {
      const task = tasks.find(t => t.id === event.active.id);
      setActiveTask(task || null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setActiveColumn(null);

    if (!over || !user) return;

    // Handle column reordering
    if (active.id.toString().startsWith('column-') && over.id.toString().startsWith('column-')) {
      const activeIndex = columns.findIndex(col => `column-${col.id}` === active.id);
      const overIndex = columns.findIndex(col => `column-${col.id}` === over.id);
      
      if (activeIndex !== overIndex) {
        const newColumns = arrayMove(columns, activeIndex, overIndex).map((col, index) => ({
          ...col,
          order: index,
        }));
        setColumns(newColumns);
      }
      return;
    }

    // Handle task movement
    const taskId = active.id as number;
    const newStatus = over.id as TaskStatus;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ));

    try {
      await updateTaskStatus(user.token, taskId, newStatus);
      const column = columns.find(c => c.status === newStatus);
      toast({
        title: "Status atualizado",
        description: `Tarefa movida para ${column?.title || newStatus}`,
      });
    } catch (error) {
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

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <BoardHeader 
        user={user} 
        onTaskCreate={handleTaskCreate} 
        onLogout={logout} 
      />
      
      <div className="container mx-auto p-6">
        <DndContext 
          onDragStart={handleDragStart} 
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
        >
          <div className="flex gap-6 overflow-x-auto pb-4">
            <SortableContext 
              items={sortedColumns.map(col => `column-${col.id}`)} 
              strategy={horizontalListSortingStrategy}
            >
              {sortedColumns.map((column) => (
                <div key={column.id} className="flex-shrink-0 w-80">
                  <div className="flex flex-col h-[calc(100vh-200px)] bg-gradient-to-b from-gray-600/20 to-gray-700/20 rounded-xl border border-gray-600/30 backdrop-blur-sm">
                    <ColumnHeader
                      column={column}
                      onRename={handleColumnRename}
                      onDelete={handleColumnDelete}
                    />
                    <DroppableColumn
                      title={column.title}
                      tasks={tasks}
                      status={column.status}
                      onDelete={handleTaskDelete}
                      onTaskCreate={handleTaskCreate}
                      onTaskUpdate={handleTaskUpdate}
                    />
                  </div>
                </div>
              ))}
            </SortableContext>
            
            <div className="flex-shrink-0 w-80">
              <AddColumnButton onAddColumn={handleAddColumn} />
            </div>
          </div>
          
          <DragOverlay>
            {activeTask ? (
              <div className="rotate-2 scale-105">
                <DraggableTaskCard
                  task={activeTask}
                  onDelete={() => {}}
                />
              </div>
            ) : activeColumn ? (
              <div className="w-80 h-32 bg-gradient-to-b from-gray-600/40 to-gray-700/40 rounded-xl border border-gray-600/50 backdrop-blur-sm flex items-center justify-center">
                <span className="text-gray-300 font-medium">{activeColumn.title}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default TaskBoard;
