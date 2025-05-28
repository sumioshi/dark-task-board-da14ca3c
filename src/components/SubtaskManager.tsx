
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { Subtask } from '@/types';

interface SubtaskManagerProps {
  subtasks: Subtask[];
  onSubtasksChange: (subtasks: Subtask[]) => void;
}

const SubtaskManager: React.FC<SubtaskManagerProps> = ({ subtasks, onSubtasksChange }) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const addSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    
    const newSubtask: Subtask = {
      id: Date.now(),
      titulo: newSubtaskTitle.trim(),
      completed: false,
    };
    
    onSubtasksChange([...subtasks, newSubtask]);
    setNewSubtaskTitle('');
  };

  const toggleSubtask = (id: number) => {
    onSubtasksChange(
      subtasks.map(subtask => 
        subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
      )
    );
  };

  const removeSubtask = (id: number) => {
    onSubtasksChange(subtasks.filter(subtask => subtask.id !== id));
  };

  return (
    <div className="space-y-2">
      {subtasks.length > 0 && (
        <div className="space-y-1">
          {subtasks.map(subtask => (
            <div key={subtask.id} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
              <Checkbox
                checked={subtask.completed}
                onCheckedChange={() => toggleSubtask(subtask.id)}
                className="border-gray-600"
              />
              <span className={`flex-1 text-xs ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                {subtask.titulo}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSubtask(subtask.id)}
                className="h-6 w-6 p-0 text-gray-500 hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex gap-2">
        <Input
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          placeholder="Adicionar subtarefa..."
          className="bg-gray-800/70 border-gray-700 text-xs"
          onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addSubtask}
          className="h-8 w-8 p-0 text-gray-400 hover:text-purple-400"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default SubtaskManager;
