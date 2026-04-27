import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const AuctionTimer = ({ duration = 15, onTimerEnd, isActive = false, onDurationChange }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [status, setStatus] = useState('waiting'); // waiting, active, ended

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration);
      setStatus('waiting');
      return;
    }

    setStatus('active');
    setTimeLeft(duration);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('ended');
          if (onTimerEnd) onTimerEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, duration, onTimerEnd]);

  const progressPercentage = (timeLeft / duration) * 100;
  
  let progressColorClass = 'progress-green';
  if (progressPercentage <= 30) progressColorClass = 'progress-red';
  else if (progressPercentage <= 60) progressColorClass = 'progress-yellow';

  return (
    <div className="w-full space-y-4 bg-card p-4 rounded-xl border border-border shadow-sm">
      {!isActive && status !== 'ended' && onDurationChange && (
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm font-medium">Timer Duration</Label>
          <Select value={duration.toString()} onValueChange={(v) => onDurationChange(parseInt(v))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10s</SelectItem>
              <SelectItem value="15">15s</SelectItem>
              <SelectItem value="20">20s</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="text-center">
        {status === 'ended' ? (
          <div className="text-2xl font-bold text-destructive uppercase tracking-wider">
            Auction Ended
          </div>
        ) : (
          <>
            <div className="text-4xl font-extrabold tabular-nums tracking-tight mb-2">
              {timeLeft}s
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-3 w-full bg-muted overflow-hidden"
              indicatorClassName={`transition-all duration-1000 ease-linear ${progressColorClass}`}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AuctionTimer;
