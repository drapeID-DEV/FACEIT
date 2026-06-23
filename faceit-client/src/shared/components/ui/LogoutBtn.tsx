import { useLogoutMutation } from '@/store/api/authApi';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LogoutBtn() {
	const [logout, { isLoading }] = useLogoutMutation();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await logout().unwrap();

			router.push('/auth/login');
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<button
			disabled={isLoading}
			onClick={handleLogout}
			className="flex items-center gap-3 mx-4 px-4 py-2 hover:bg-accent duration-300 rounded-xl text-neutral-400"
		>
			<LogOut size={24} />
			<p className="text-xl">Logout</p>
		</button>
	);
}
