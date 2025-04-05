import { toast } from 'sonner';
import { Button } from '../ui/button';
import useAuth from '@/hooks/auth/useAuth';

type Props = {
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
};

export const MsalSignInButton = ({ isLoading, setIsLoading }: Props) => {
	const { handleLoginB2C } = useAuth();

	const handleLogin = async () => {
		setIsLoading(true);
		try {
			await handleLoginB2C();
		} catch {
			toast.error('Login failed. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button disabled={isLoading} onClick={handleLogin}>
			Login using Email
		</Button>
	);
};
