'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function ToastProvider() {
	return (
		<ToastContainer
			position="bottom-right"
			autoClose={5000}
			hideProgressBar={true}
			closeOnClick
			pauseOnHover
			theme="dark"
			toastStyle={{
				width: '420px',
				minHeight: '90px'
			}}
		/>
	);
}
