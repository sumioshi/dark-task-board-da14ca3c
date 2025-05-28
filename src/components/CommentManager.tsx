
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, X } from 'lucide-react';
import { Comment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface CommentManagerProps {
  comments: Comment[];
  onCommentsChange: (comments: Comment[]) => void;
}

const CommentManager: React.FC<CommentManagerProps> = ({ comments, onCommentsChange }) => {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  const addComment = () => {
    if (!newComment.trim() || !user) return;
    
    const comment: Comment = {
      id: Date.now(),
      text: newComment.trim(),
      author: user.username,
      createdAt: new Date().toISOString(),
    };
    
    onCommentsChange([...comments, comment]);
    setNewComment('');
  };

  const removeComment = (id: number) => {
    onCommentsChange(comments.filter(comment => comment.id !== id));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-3">
      {comments.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {comments.map(comment => (
            <div key={comment.id} className="p-3 bg-gray-800/50 rounded border border-gray-700/50">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-gray-300">{comment.author}</span>
                  <span className="text-xs text-gray-500">{formatTime(comment.createdAt)}</span>
                </div>
                {user?.username === comment.author && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeComment(comment.id)}
                    className="h-5 w-5 p-0 text-gray-500 hover:text-red-400"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-200">{comment.text}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex gap-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Adicionar comentário..."
          className="bg-gray-800/70 border-gray-700 text-sm"
          onKeyPress={(e) => e.key === 'Enter' && addComment()}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addComment}
          className="h-10 px-3 text-gray-400 hover:text-purple-400"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CommentManager;
