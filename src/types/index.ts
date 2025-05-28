
export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Subtask {
  id: number;
  titulo: string;
  completed: boolean;
}

export interface Task {
  id: number;
  titulo: string;
  descricao: string;
  status: TaskStatus;
  assignedUser?: string;
  dueDate?: string;
  subtasks: Subtask[];
  createdAt: string;
}

export interface User {
  username: string;
  token: string;
}

export interface AuthResponse {
  token: string;
  username: string;
}
