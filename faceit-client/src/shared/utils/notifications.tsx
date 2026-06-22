import { toast } from 'react-toastify';
import { ToastMessage } from '../components/ui/ToastMessage';

export const notification = {
	success: (title: string, description?: string) =>
		toast.success(<ToastMessage title={title} description={description} />),

	error: (title: string, description?: string) =>
		toast.error(<ToastMessage title={title} description={description} />),

	info: (title: string, description?: string) =>
		toast.info(<ToastMessage title={title} description={description} />),

	warning: (title: string, description?: string) =>
		toast.warning(<ToastMessage title={title} description={description} />)
};
