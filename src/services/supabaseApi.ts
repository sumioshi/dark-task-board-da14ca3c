
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskStatus, Subtask, Comment } from '@/types';

// Auth APIs
export const signUpUser = async (email: string, password: string, username: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) throw error;

  if (data.user) {
    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        username,
      });

    if (profileError) throw profileError;
  }

  return data;
};

export const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Task APIs
export const fetchTasks = async (): Promise<Task[]> => {
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select(`
      *,
      subtasks (*),
      comments (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return tasks.map(task => ({
    id: task.id,
    titulo: task.titulo,
    descricao: task.descricao || '',
    status: task.status as TaskStatus,
    assignedUser: task.assigned_user,
    dueDate: task.due_date,
    subtasks: (task.subtasks || []).map((subtask: any) => ({
      id: subtask.id,
      titulo: subtask.titulo,
      completed: subtask.completed || false,
    })),
    comments: (task.comments || []).map((comment: any) => ({
      id: comment.id,
      text: comment.text,
      author: comment.author,
      createdAt: comment.created_at,
    })),
    totalTime: task.total_time || 0,
    createdAt: task.created_at,
  }));
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      titulo: task.titulo,
      descricao: task.descricao,
      status: task.status,
      assigned_user: task.assignedUser,
      due_date: task.dueDate,
      total_time: task.totalTime,
      user_id: user.user.id,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    titulo: data.titulo,
    descricao: data.descricao || '',
    status: data.status as TaskStatus,
    assignedUser: data.assigned_user,
    dueDate: data.due_date,
    subtasks: [],
    comments: [],
    totalTime: data.total_time || 0,
    createdAt: data.created_at,
  };
};

export const updateTaskStatus = async (id: number, status: TaskStatus): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
};

export const updateTask = async (id: number, updates: Partial<Task>): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update({
      titulo: updates.titulo,
      descricao: updates.descricao,
      assigned_user: updates.assignedUser,
      due_date: updates.dueDate,
      total_time: updates.totalTime,
    })
    .eq('id', id);

  if (error) throw error;
};

export const deleteTask = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Subtask APIs
export const createSubtask = async (taskId: number, titulo: string): Promise<Subtask> => {
  const { data, error } = await supabase
    .from('subtasks')
    .insert({
      task_id: taskId,
      titulo,
      completed: false,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    titulo: data.titulo,
    completed: data.completed || false,
  };
};

export const updateSubtask = async (id: number, completed: boolean): Promise<void> => {
  const { error } = await supabase
    .from('subtasks')
    .update({ completed })
    .eq('id', id);

  if (error) throw error;
};

export const deleteSubtask = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('subtasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Comment APIs
export const createComment = async (taskId: number, text: string, author: string): Promise<Comment> => {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      task_id: taskId,
      text,
      author,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    text: data.text,
    author: data.author,
    createdAt: data.created_at,
  };
};

export const deleteComment = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
