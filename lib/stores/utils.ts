export const loadLocalState = <T>(key: string, defaultValue: T): T => {
	if (typeof window === 'undefined') return defaultValue;

	try {
		const stored = localStorage.getItem(key);
		if (stored == null) return defaultValue;

		// Try parsing — if it's a valid JSON object/array, return parsed
		const firstChar = stored.trim()[0];
		if (firstChar === '{' || firstChar === '[') {
			return JSON.parse(stored) as T;
		}

		// Otherwise, assume it's a plain string
		return stored as T;
	} catch (err) {
		console.warn(`Failed to parse localStorage key "${key}":`, err);
		return defaultValue;
	}
};

export const saveToLocalStorage = (key: string, value: unknown) => {
	if (typeof window === 'undefined') return;

	try {
		if (typeof value === 'string') {
			localStorage.setItem(key, value);
		} else {
			localStorage.setItem(key, JSON.stringify(value));
		}
	} catch (err) {
		console.warn(`Failed to save localStorage key "${key}":`, err);
	}
};
