import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useGetCurrentUser from '../users/useGetCurrentUser';

const useCheckAuthenticated = () => {
	const router = useRouter();

	const { user, isFetched } = useGetCurrentUser();
	useEffect(() => {
		console.log('User', user);

		if (isFetched) return;

		if (user) {
			router.replace('/');
		}
	}, [isFetched, router, user]);
};

export default useCheckAuthenticated;
