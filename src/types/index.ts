
export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Subtask {
  id: number;
  titulo: string;
  completed: boolean;
}

export interface Comment {
  id: number;
  text: string;
  author: string;
  createdAt: string;
}

export interface Task {
  id: number;
  titulo: string;
  descricao: string;
  status: TaskStatus;
  assignedUser?: string;
  dueDate?: string;
  subtasks: Subtask[];
  comments: Comment[];
  totalTime: number; // em minutos
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  status: TaskStatus;
  order: number;
}

// Remove the custom User interface to avoid conflicts with Supabase User type
export interface AuthResponse {
  token: string;
  username: string;
}
