export const getLastActiveDate = (lastActive: Date | string | null): string => {
	if (!lastActive) return 'Never';

	const date =
		typeof lastActive === 'string' ? new Date(lastActive) : lastActive;
	if (isNaN(date.getTime())) return 'Invalid date';

	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const seconds = Math.floor(diff / 1000);

	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const weeks = Math.floor(days / 7);
	const months = Math.floor(days / 30); // approximate
	const years = Math.floor(days / 365); // approximate

	if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
	if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
	if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
	if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
	if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
	if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
	return `${years} year${years !== 1 ? 's' : ''} ago`;
};

export const getIsActive = (lastActive: Date | string | null): boolean => {
	if (!lastActive) return false;

	const date =
		typeof lastActive === 'string' ? new Date(lastActive) : lastActive;
	if (!(date instanceof Date) || isNaN(date.getTime())) return false;

	const now = new Date();
	const diffInMilliseconds = now.getTime() - date.getTime();
	const twoWeeksInMilliseconds = 14 * 24 * 60 * 60 * 1000;

	return diffInMilliseconds < twoWeeksInMilliseconds ? true : false;
};
