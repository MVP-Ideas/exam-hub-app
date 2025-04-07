import { toast } from 'sonner';
import { Button } from '../ui/button';
import useAuth from '@/hooks/auth/useAuth';
import Image from 'next/image';

type Props = {
	providerUrl: string | null;
	providerName: string;
	image: string;
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
};

export const MsalSignInButton = ({
	providerUrl,
	providerName,
	image,
	isLoading,
	setIsLoading,
}: Props) => {
	const { handleLoginB2C } = useAuth();

	const handleLogin = async () => {
		setIsLoading(true);
		try {
			await handleLoginB2C(providerUrl);
		} catch {
			toast.error('Login failed. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			className="
			bg-background text-foreground border border-muted hover:bg-muted hover:text-foreground transition-colors duration-200 ease-in-out"
			disabled={isLoading}
			onClick={handleLogin}
		>
			<div className="flex flex-row w-full gap-2">
				<Image src={image} alt="Google" width={20} height={20} />
				Login using {providerName}
			</div>
		</Button>
	);
};
