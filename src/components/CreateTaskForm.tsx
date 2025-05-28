
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, User, Calendar, FileText, Tag } from 'lucide-react';
import { Task, TaskStatus } from '@/types';

interface CreateTaskFormProps {
  onTaskCreate: (task: Omit<Task, 'id'>) => void;
  children?: React.ReactNode;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onTaskCreate, children }) => {
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState<TaskStatus>('BACKLOG');
  const [assignedUser, setAssignedUser] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titulo.trim()) return;
    
    onTaskCreate({
      titulo,
      descricao,
      status,
      assignedUser: assignedUser || undefined,
      dueDate: dueDate || undefined,
      subtasks: [],
      comments: [],
      totalTime: 0,
      createdAt: new Date().toISOString(),
    });
    
    // Reset form
    setTitulo('');
    setDescricao('');
    setStatus('BACKLOG');
    setAssignedUser('');
    setDueDate('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg">
            <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-gray-900/95 border-gray-700/50 backdrop-blur-sm sm:max-w-[500px] shadow-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-400" />
            Criar Nova Tarefa
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Adicione uma nova tarefa ao seu quadro Kanban.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <label htmlFor="titulo" className="text-sm font-medium text-gray-200 flex items-center gap-2">
              <Tag className="h-4 w-4 text-purple-400" />
              Título *
            </label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Digite o título da tarefa"
              className="bg-gray-800/70 border-gray-600 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="descricao" className="text-sm font-medium text-gray-200 flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-400" />
              Descrição
            </label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva os detalhes da tarefa..."
              className="bg-gray-800/70 border-gray-600 focus:ring-purple-500 focus:border-purple-500 min-h-[100px] text-white placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="assignedUser" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <User className="h-4 w-4 text-purple-400" />
                Responsável
              </label>
              <Input
                id="assignedUser"
                value={assignedUser}
                onChange={(e) => setAssignedUser(e.target.value)}
                placeholder="Nome do responsável"
                className="bg-gray-800/70 border-gray-600 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-400" />
                Data limite
              </label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-gray-800/70 border-gray-600 focus:ring-purple-500 focus:border-purple-500 text-white"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium text-gray-200">
              Status inicial
            </label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as TaskStatus)}
            >
              <SelectTrigger 
                id="status"
                className="bg-gray-800/70 border-gray-600 focus:ring-purple-500 focus:border-purple-500 text-white"
              >
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="BACKLOG" className="text-white focus:bg-gray-700">Backlog</SelectItem>
                <SelectItem value="TODO" className="text-white focus:bg-gray-700">A Fazer</SelectItem>
                <SelectItem value="IN_PROGRESS" className="text-white focus:bg-gray-700">Em Progresso</SelectItem>
                <SelectItem value="DONE" className="text-white focus:bg-gray-700">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="flex gap-3 pt-4">
            <Button 
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar Tarefa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskForm;
