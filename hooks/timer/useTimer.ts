import { useState, useEffect, useCallback } from "react";

interface UseTimerOptions {
  initialSeconds?: number;
  isRunning?: boolean;
  onTimeUpdate?: (seconds: number) => void;
}

export default function useTimer({
  initialSeconds = 0,
  isRunning = true,
  onTimeUpdate,
}: UseTimerOptions = {}) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        const newSeconds = prevSeconds + 1;
        if (onTimeUpdate) {
          onTimeUpdate(newSeconds);
        }
        return newSeconds;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUpdate]);

  const resetTimer = useCallback((newValue = 0) => {
    setSeconds(newValue);
  }, []);

  const formatTime = useCallback(
    (totalSeconds: number = seconds) => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;

      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    },
    [seconds],
  );

  return {
    seconds,
    resetTimer,
    formatTime,
  };
}
