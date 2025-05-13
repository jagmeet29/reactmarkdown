import { useState, useEffect, useRef } from 'react';

export function useDelayedLoading(initialState = true, delay = 1000) {
  const [loading, setLoading] = useState(initialState);
  const startTime = useRef(Date.now());

  const stopLoading = () => {
    const elapsed = Date.now() - startTime.current;
    const waitTime = delay - elapsed;
    if (waitTime > 0) {
      setTimeout(() => setLoading(false), waitTime);
    } else {
      setLoading(false);
    }
  };

  const startLoading = () => {
    startTime.current = Date.now();
    setLoading(true);
  };

  return [loading, stopLoading, startLoading];
}
