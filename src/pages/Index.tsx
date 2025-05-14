
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/AuthForm';
import TaskBoard from '@/components/TaskBoard';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {isAuthenticated ? (
        <TaskBoard />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-white bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent">
              Gerenciador de Tarefas
            </h1>
            <p className="text-gray-400">
              Um mini Trello para organizar suas tarefas.
            </p>
          </div>
          <AuthForm />
        </div>
      )}
    </div>
  );
};

export default Index;
