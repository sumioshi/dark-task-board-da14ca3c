
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { LogOut, Plus } from 'lucide-react';
import CreateTaskForm from '../CreateTaskForm';
import { SparklesCore } from '@/components/ui/sparkles';

interface BoardHeaderProps {
  user: User | null;
  username: string | null;
  onTaskCreate: (task: any) => void;
  onLogout: () => void;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({ user, username, onTaskCreate, onLogout }) => {
  return (
    <div className="sticky top-0 z-10 relative overflow-hidden bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-lg border-b border-gray-700/50 p-6">
      {/* Sparkles Background */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="kanban-header-sparkles"
          background="transparent"
          minSize={0.3}
          maxSize={1.2}
          particleDensity={80}
          className="w-full h-full"
          particleColor="#8b5cf6"
          speed={0.8}
        />
      </div>
      
      {/* Gradient overlay to soften the sparkles */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-800/80"></div>
      
      {/* Content */}
      <div className="container mx-auto flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Quadro de Tarefas
            </h1>
            <p className="text-gray-400 text-sm">Bem-vindo, {username || 'Usuário'}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <CreateTaskForm onTaskCreate={onTaskCreate}>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </CreateTaskForm>
          
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="border-gray-600 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BoardHeader;
