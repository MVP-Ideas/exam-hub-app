import { useState, useEffect, useCallback, useRef } from "react";

interface UseExamTimerOptions {
  maxTimeSeconds?: number;
  initialTimeSpentSeconds?: number;
  isRunning?: boolean;
  onTimeUpdate?: (timeSpentSeconds: number) => void;
  onComplete?: () => void;
  updateInterval?: number;
}

export default function useExamTimer({
  maxTimeSeconds,
  initialTimeSpentSeconds = 0,
  isRunning = true,
  onTimeUpdate,
  onComplete,
  updateInterval = 10,
}: UseExamTimerOptions = {}) {
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(
    initialTimeSpentSeconds,
  );
  const [isPaused, setIsPaused] = useState(!isRunning);

  // Refs to avoid stale closures
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const onCompleteRef = useRef(onComplete);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const initializedRef = useRef(false);

  // Keep refs updated
  useEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate;
  }, [onTimeUpdate]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reset when initial values change
  useEffect(() => {
    setTimeSpentSeconds(initialTimeSpentSeconds);
    lastUpdateTimeRef.current = 0;
    initializedRef.current = false;
  }, [initialTimeSpentSeconds, maxTimeSeconds]);

  // Initialize isPaused based on isRunning prop
  useEffect(() => {
    setIsPaused(!isRunning);
  }, [isRunning]);

  // Computed values
  const hasTimeLimit = maxTimeSeconds !== undefined && maxTimeSeconds > 0;
  const timeRemainingSeconds = hasTimeLimit
    ? Math.max(0, maxTimeSeconds - timeSpentSeconds)
    : undefined;
  const isComplete = hasTimeLimit && timeRemainingSeconds === 0;

  // Main timer effect
  useEffect(() => {
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Don't start timer if paused or completed
    if (isPaused || isComplete) {
      return;
    }

    // Initial update when timer starts (only once)
    if (onTimeUpdateRef.current && !initializedRef.current) {
      onTimeUpdateRef.current(timeSpentSeconds);
      lastUpdateTimeRef.current = Date.now();
      initializedRef.current = true;
    }

    timerRef.current = setInterval(() => {
      setTimeSpentSeconds((prevTimeSpent) => {
        const newTimeSpent = prevTimeSpent + 1;
        const now = Date.now();

        // Call onTimeUpdate based on elapsed time since last update
        if (onTimeUpdateRef.current) {
          const timeElapsed = now - lastUpdateTimeRef.current;
          const shouldUpdate = timeElapsed >= updateInterval * 1000;

          if (shouldUpdate) {
            onTimeUpdateRef.current(newTimeSpent);
            lastUpdateTimeRef.current = now;
          }
        }

        // Handle completion for timed exams
        if (hasTimeLimit && newTimeSpent >= maxTimeSeconds) {
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
          return maxTimeSeconds; // Cap at max time
        }

        return newTimeSpent;
      });
    }, 1000);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    isPaused,
    isComplete,
    hasTimeLimit,
    maxTimeSeconds,
    updateInterval,
    timeSpentSeconds,
  ]);

  const resetTimer = useCallback((newTimeSpent: number = 0) => {
    setTimeSpentSeconds(newTimeSpent);
    lastUpdateTimeRef.current = 0;
    initializedRef.current = false;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Call onTimeUpdate immediately after reset
    if (onTimeUpdateRef.current) {
      onTimeUpdateRef.current(newTimeSpent);
    }
  }, []);

  const setPaused = useCallback((paused: boolean) => {
    setIsPaused(paused);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const formatTime = useCallback((totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes} min ${seconds} sec`;
  }, []);

  const formatTimeSpent = useCallback(() => {
    return formatTime(timeSpentSeconds);
  }, [timeSpentSeconds, formatTime]);

  const formatTimeRemaining = useCallback(() => {
    if (!hasTimeLimit || timeRemainingSeconds === undefined) {
      return formatTime(timeSpentSeconds);
    }
    return formatTime(timeRemainingSeconds);
  }, [hasTimeLimit, timeRemainingSeconds, timeSpentSeconds, formatTime]);

  const getTimerLabel = useCallback(() => {
    return hasTimeLimit ? "Time Remaining" : "Tzime Spent";
  }, [hasTimeLimit]);

  return {
    // Time values
    timeSpentSeconds,
    timeRemainingSeconds,
    hasTimeLimit,
    isComplete,

    // State
    isPaused,

    // Controls
    setPaused,
    togglePause,
    resetTimer,

    // Formatters
    formatTimeSpent,
    formatTimeRemaining,
    formatTime,
    getTimerLabel,
  };
}
