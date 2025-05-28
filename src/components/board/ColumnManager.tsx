
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import { Column, TaskStatus } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ColumnHeaderProps {
  column: Column;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({ column, onRename, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `column-${column.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== column.title) {
      onRename(column.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(column.title);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(column.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div 
        ref={setNodeRef}
        style={style}
        className="flex items-center justify-between p-4 pb-2"
      >
        <div className="flex items-center space-x-2 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="text-gray-500 hover:text-gray-400 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              onBlur={handleSave}
              className="text-sm font-semibold bg-gray-800 border-gray-600 h-8"
              autoFocus
            />
          ) : (
            <h2 className="font-semibold text-sm text-gray-300 flex-1">
              {column.title}
            </h2>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {!isEditing && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 p-0 text-gray-500 hover:text-gray-400"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="h-6 w-6 p-0 text-gray-500 hover:text-red-400"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </div>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="card-glass border-purple-500/30">
          <DialogHeader>
            <DialogTitle>Excluir Coluna</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-4">
              Tem certeza que deseja excluir a coluna "{column.title}"? 
              Todas as tarefas desta coluna serão perdidas.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Excluir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface AddColumnButtonProps {
  onAddColumn: (title: string) => void;
}

const AddColumnButton: React.FC<AddColumnButtonProps> = ({ onAddColumn }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (title.trim()) {
      onAddColumn(title.trim());
      setTitle('');
      setShowDialog(false);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full bg-gradient-to-b from-gray-600/20 to-gray-700/20 rounded-xl border border-dashed border-gray-600/50 backdrop-blur-sm">
        <Button
          variant="ghost"
          onClick={() => setShowDialog(true)}
          className="h-full min-h-[200px] flex flex-col items-center justify-center text-gray-500 hover:text-gray-400 hover:border-gray-500/50"
        >
          <Plus className="h-8 w-8 mb-2" />
          <span className="text-sm">Adicionar Coluna</span>
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="card-glass border-purple-500/30">
          <DialogHeader>
            <DialogTitle>Nova Coluna</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome da coluna..."
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="ghost" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdd}>
                Criar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { ColumnHeader, AddColumnButton };
