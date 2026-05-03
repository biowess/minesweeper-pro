import { useEffect, useState } from 'react';
import { useGameStore } from '../state/useGameStore';

export function useTimer() {
  const { status, startTime, endTime, firstMoveMade } = useGameStore();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: number;

    if (status === 'playing' && startTime) {
      interval = window.setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 100);
    } else if (status === 'won' || status === 'lost') {
      if (startTime && endTime) {
        setElapsed(Math.floor((endTime - startTime) / 1000));
      }
    } else if (status === 'idle') {
      setElapsed(0);
    }

    return () => clearInterval(interval);
  }, [status, startTime, endTime]);

  return elapsed;
}
