
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: number;
          titulo: string;
          descricao: string | null;
          status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE';
          assigned_user: string | null;
          due_date: string | null;
          total_time: number;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          titulo: string;
          descricao?: string | null;
          status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE';
          assigned_user?: string | null;
          due_date?: string | null;
          total_time?: number;
          user_id: string;
        };
        Update: {
          titulo?: string;
          descricao?: string | null;
          status?: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE';
          assigned_user?: string | null;
          due_date?: string | null;
          total_time?: number;
        };
      };
      subtasks: {
        Row: {
          id: number;
          task_id: number;
          titulo: string;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          task_id: number;
          titulo: string;
          completed?: boolean;
        };
        Update: {
          titulo?: string;
          completed?: boolean;
        };
      };
      comments: {
        Row: {
          id: number;
          task_id: number;
          text: string;
          author: string;
          created_at: string;
        };
        Insert: {
          task_id: number;
          text: string;
          author: string;
        };
        Update: {
          text?: string;
        };
      };
      columns: {
        Row: {
          id: string;
          title: string;
          status: string;
          order_index: number;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id: string;
          title: string;
          status: string;
          order_index: number;
          user_id: string;
        };
        Update: {
          title?: string;
          status?: string;
          order_index?: number;
        };
      };
    };
  };
}
