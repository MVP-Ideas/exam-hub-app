import { useEffect, useState } from 'react';

/**
 * Returns a debounced value that updates only after a delay.
 *
 * @param value The value to debounce
 * @param delay The debounce delay in milliseconds (default: 500ms)
 */
const useDebouncedValue = <T>(value: T, delay = 500): T => {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => clearTimeout(timer);
	}, [value, delay]);

	return debouncedValue;
};

export default useDebouncedValue;
