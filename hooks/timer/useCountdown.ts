import { useState, useEffect, useCallback, useRef } from "react";

interface UseCountdownOptions {
  initialSeconds?: number;
  isRunning?: boolean;
  onTimeUpdate?: (seconds: number) => void;
  onComplete?: () => void;
  updateInterval?: number;
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

  // Use refs to store callbacks to avoid stale closures
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const onCompleteRef = useRef(onComplete);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const initializedRef = useRef(false);

  // Keep refs updated with latest callbacks
  useEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate;
  }, [onTimeUpdate]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reset timer when initialSeconds changes
  useEffect(() => {
    setSeconds(initialSeconds);
    lastUpdateTimeRef.current = 0;
    initializedRef.current = false;
  }, [initialSeconds]);

  // Initialize isPaused based on isRunning prop
  useEffect(() => {
    setIsPaused(!isRunning);
  }, [isRunning]);

  // Handle countdown timer
  useEffect(() => {
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Don't start timer if paused or completed
    if (isPaused || seconds <= 0) {
      return;
    }

    // Initial update when timer starts (only once)
    if (onTimeUpdateRef.current && !initializedRef.current) {
      onTimeUpdateRef.current(seconds);
      lastUpdateTimeRef.current = Date.now();
      initializedRef.current = true;
    }

    timerRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        const newSeconds = prevSeconds - 1;
        const now = Date.now();

        // Call onTimeUpdate based on elapsed time since last update
        if (onTimeUpdateRef.current) {
          const timeElapsed = now - lastUpdateTimeRef.current;
          const shouldUpdate = timeElapsed >= updateInterval * 1000;

          if (shouldUpdate) {
            onTimeUpdateRef.current(newSeconds);
            lastUpdateTimeRef.current = now;
          }
        }

        // Handle completion
        if (newSeconds <= 0) {
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
          return 0;
        }

        return newSeconds;
      });
    }, 1000);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPaused, seconds, updateInterval]);

  const resetTimer = useCallback(
    (newValue: number = initialSeconds) => {
      setSeconds(newValue);
      lastUpdateTimeRef.current = 0;
      initializedRef.current = false;

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Call onTimeUpdate immediately after reset
      if (onTimeUpdateRef.current) {
        onTimeUpdateRef.current(newValue);
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
      {
        return (() => {
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          return `${hours}h ${minutes} min ${seconds} sec`;
        })();
      }
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
