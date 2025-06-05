import { useState, useEffect, useCallback, useRef } from "react";

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
  const [isPaused, setIsPaused] = useState(false);
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initialSecondsRef = useRef(initialSeconds);

  // Keep the ref updated with the latest callback
  useEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate;
  }, [onTimeUpdate]);

  // Reset timer when initialSeconds changes - this is the key fix
  useEffect(() => {
    if (initialSecondsRef.current !== initialSeconds) {
      console.log(
        `Timer reset: ${initialSecondsRef.current} -> ${initialSeconds}`,
      );
      setSeconds(initialSeconds);
      initialSecondsRef.current = initialSeconds;

      // Call onTimeUpdate immediately with the new initial seconds
      if (onTimeUpdateRef.current) {
        onTimeUpdateRef.current(initialSeconds);
      }
    }
  }, [initialSeconds]);

  // Timer should run when isRunning is true AND not paused
  const shouldRun = isRunning && !isPaused;

  // Timer loop
  useEffect(() => {
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!shouldRun) return;

    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        const newValue = prev + 1;
        // Call onTimeUpdate synchronously within the state update
        if (onTimeUpdateRef.current) {
          onTimeUpdateRef.current(newValue);
        }
        return newValue;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [shouldRun]);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const resetTimer = useCallback((newValue: number = 0) => {
    setSeconds(newValue);
    setIsPaused(false);
    initialSecondsRef.current = newValue;

    // Call onTimeUpdate immediately after reset
    if (onTimeUpdateRef.current) {
      onTimeUpdateRef.current(newValue);
    }
  }, []);

  const formatTime = useCallback(
    (totalSeconds: number = seconds) => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;

      return `${hours}h ${minutes} min ${secs} sec`;
    },
    [seconds],
  );

  return {
    seconds,
    isPaused,
    isRunning: shouldRun,
    pause,
    resume,
    togglePause,
    resetTimer,
    formatTime,
  };
}
