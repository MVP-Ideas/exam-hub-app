import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useGetCurrentUser from '../users/useGetCurrentUser';

const useCheckAuthenticated = () => {
	const router = useRouter();

	const { user, isFetched, isError } = useGetCurrentUser();
	useEffect(() => {
		if (!isFetched) return;

		if (!isError && isFetched && user) {
			if (user.role.toLowerCase() === 'admin') {
				router.push('/admin');
			} else {
				router.push('/');
			}
		}
	}, [isError, isFetched, router, user]);
};

export default useCheckAuthenticated;
