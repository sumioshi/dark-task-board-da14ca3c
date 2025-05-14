
export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: number;
  titulo: string;
  descricao: string;
  status: TaskStatus;
}

export interface User {
  username: string;
  token: string;
}

export interface AuthResponse {
  token: string;
  username: string;
}
