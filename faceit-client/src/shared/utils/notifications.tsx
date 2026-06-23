import { toast } from 'react-toastify';
import { ToastMessage } from '../components/ui/ToastMessage';

export const notification = {
	success: (message: string) =>
		toast.success(<ToastMessage content={message} />),

	error: (message: string) => toast.error(<ToastMessage content={message} />),

	info: (message: string) => toast.info(<ToastMessage content={message} />),

	warning: (message: string) =>
		toast.warning(<ToastMessage content={message} />)
};
