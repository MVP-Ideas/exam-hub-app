import { useState, useEffect, useCallback, useRef } from "react";

interface UseCountdownOptions {
  initialSeconds?: number;
  isRunning?: boolean;
  onTimeUpdate?: (seconds: number) => void;
  onComplete?: () => void;
  updateInterval?: number; // How often to call onTimeUpdate (in seconds)
}

export default function useCountdown({
  initialSeconds = 60,
  isRunning = true,
  onTimeUpdate,
  onComplete,
  updateInterval = 1, // Default to update every second
}: UseCountdownOptions = {}) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(!isRunning);
  const lastUpdateTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);

  // Reset timer when initialSeconds changes
  useEffect(() => {
    setSeconds(initialSeconds);
    lastUpdateTimeRef.current = 0;
    initializedRef.current = false;
  }, [initialSeconds]);

  // Handle countdown timer
  useEffect(() => {
    // Clear existing interval if not running or completed
    if (isPaused || seconds <= 0) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    // Skip if we already have an active interval
    if (timerIntervalRef.current) return;

    // Initial update when timer starts (only once)
    if (onTimeUpdate && !initializedRef.current) {
      onTimeUpdate(seconds);
      lastUpdateTimeRef.current = Date.now();
      initializedRef.current = true;
    }

    timerIntervalRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        const newSeconds = prevSeconds - 1;
        const now = Date.now();

        // Call onTimeUpdate based on elapsed time since last update
        if (onTimeUpdate) {
          const timeElapsed = now - lastUpdateTimeRef.current;
          const shouldUpdate = timeElapsed >= updateInterval * 1000;

          if (shouldUpdate) {
            onTimeUpdate(newSeconds);
            lastUpdateTimeRef.current = now;
          }
        }

        if (newSeconds <= 0) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          if (onComplete) {
            onComplete();
          }
          return 0;
        }
        return newSeconds;
      });
    }, 1000);

    // Cleanup
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isPaused, seconds, onTimeUpdate, onComplete, updateInterval]);

  // Initialize isPaused based on isRunning prop
  useEffect(() => {
    setIsPaused(!isRunning);
  }, [isRunning]);

  const resetTimer = useCallback(
    (newValue: number = initialSeconds) => {
      setSeconds(newValue);
      lastUpdateTimeRef.current = 0;
      initializedRef.current = false;

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    },
    [initialSeconds],
  );

  const setPaused = useCallback((paused: boolean) => {
    setIsPaused(paused);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
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

  const isComplete = seconds <= 0;

  return {
    seconds,
    resetTimer,
    formatTime,
    isComplete,
    isPaused,
    setPaused,
    togglePause,
  };
}
