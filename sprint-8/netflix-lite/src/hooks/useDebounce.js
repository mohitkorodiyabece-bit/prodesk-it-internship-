import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of `value` that only updates after `delay`
 * milliseconds have passed without `value` changing. The timer resets
 * on every change, so rapid updates (e.g. keystrokes) only produce a
 * single debounced update once input settles.
 *
 * @param {*} value
 * @param {number} delay milliseconds, defaults to 500
 * @returns {*} debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timerId);
  }, [value, delay]);

  return debouncedValue;
}