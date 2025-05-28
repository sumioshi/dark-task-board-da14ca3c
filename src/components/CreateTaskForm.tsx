
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
import { Plus } from 'lucide-react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titulo.trim()) return;
    
    onTaskCreate({
      titulo,
      descricao,
      status,
    });
    
    // Reset form
    setTitulo('');
    setDescricao('');
    setStatus('BACKLOG');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="glow-border bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600">
            <Plus className="mr-1 h-4 w-4" /> Nova Tarefa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="card-glass border-purple-500/30 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Tarefa</DialogTitle>
          <DialogDescription>
            Adicione uma nova tarefa ao seu quadro.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="titulo" className="text-sm font-medium text-gray-200">
              Título
            </label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Adicione um título"
              className="bg-gray-800/70 border-gray-700 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="descricao" className="text-sm font-medium text-gray-200">
              Descrição
            </label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Adicione uma descrição..."
              className="bg-gray-800/70 border-gray-700 focus:ring-purple-500 focus:border-purple-500 min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium text-gray-200">
              Status
            </label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as TaskStatus)}
            >
              <SelectTrigger 
                id="status"
                className="bg-gray-800/70 border-gray-700 focus:ring-purple-500 focus:border-purple-500"
              >
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BACKLOG">Backlog</SelectItem>
                <SelectItem value="TODO">A Fazer</SelectItem>
                <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                <SelectItem value="DONE">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600"
            >
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskForm;
