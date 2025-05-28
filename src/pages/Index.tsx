
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/AuthForm';
import TaskBoard from '@/components/board/TaskBoard';
import { KanbanSquare, CheckSquare, Users, Zap, Loader2 } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <KanbanSquare className="h-8 w-8 text-purple-500 animate-pulse" />
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
          </div>
          <div className="text-xl text-white font-medium">Carregando...</div>
          <div className="text-gray-400 text-sm">Verificando autenticação</div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <TaskBoard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                  <KanbanSquare className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent">
                  Kanban Board
                </h1>
              </div>
              
              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed">
                Organize suas tarefas de forma visual e eficiente
              </p>
              
              <p className="text-gray-400 text-lg max-w-2xl">
                Uma ferramenta moderna e intuitiva para gerenciar projetos, 
                inspirada no método Kanban. Organize, priorize e acompanhe 
                o progresso das suas tarefas em tempo real.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <CheckSquare className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white">Gestão Visual</h3>
                <p className="text-sm text-gray-400">Visualize o fluxo de trabalho em colunas organizadas</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white">Colaboração</h3>
                <p className="text-sm text-gray-400">Trabalhe em equipe com comentários e atribuições</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white">Tempo Real</h3>
                <p className="text-sm text-gray-400">Atualizações instantâneas e sincronização automática</p>
              </div>
            </div>
          </div>

          {/* Right side - Auth form */}
          <div className="flex justify-center">
            <AuthForm />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 Kanban Board. Feito com ❤️ para produtividade.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
