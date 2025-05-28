
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Plus, Minus } from 'lucide-react';

interface TimeTrackerProps {
  totalTime: number;
  onTimeChange: (time: number) => void;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ totalTime, onTimeChange }) => {
  const [inputTime, setInputTime] = useState('');

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const addTime = () => {
    const time = parseInt(inputTime);
    if (!isNaN(time) && time > 0) {
      onTimeChange(totalTime + time);
      setInputTime('');
    }
  };

  const subtractTime = () => {
    const time = parseInt(inputTime);
    if (!isNaN(time) && time > 0) {
      onTimeChange(Math.max(0, totalTime - time));
      setInputTime('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-200">Tempo Total:</span>
        <span className="text-sm text-purple-400 font-mono">{formatTime(totalTime)}</span>
      </div>
      
      <div className="flex gap-2">
        <Input
          type="number"
          value={inputTime}
          onChange={(e) => setInputTime(e.target.value)}
          placeholder="Minutos"
          className="bg-gray-800/70 border-gray-700 text-sm"
          min="1"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addTime}
          className="h-10 px-3 text-green-400 hover:text-green-300"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={subtractTime}
          className="h-10 px-3 text-red-400 hover:text-red-300"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TimeTracker;
