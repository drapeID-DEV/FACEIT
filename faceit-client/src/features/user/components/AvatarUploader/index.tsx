'use client';

import { FormButton } from '@/shared/components/ui/FormButton';
import { Loader } from '@/shared/components/ui/Loader';
import { notification } from '@/shared/utils/notifications';
import { useUploadAvatarMutation } from '@/store/api/userApi';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export function AvatarUploader() {
	const [preview, setPreview] = useState<string>('');
	const [avatar, setAvatar] = useState<File | null>(null);
	const [upload, { isLoading }] = useUploadAvatarMutation();

	useEffect(() => {
		return () => {
			if (preview) {
				URL.revokeObjectURL(preview);
			}
		};
	}, [preview]);

	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		const file = acceptedFiles[0];

		if (!file) {
			notification.error('Unable to load the file!');
			return;
		}

		setPreview(URL.createObjectURL(file));
		setAvatar(file);
	}, []);

	const handleUpload = async () => {
		if (!avatar) {
			notification.error('Select an avatar first!');
			return;
		}

		const formData = new FormData();
		formData.append('avatar', avatar);

		try {
			await upload(formData).unwrap();

			notification.info('Avatar uploaded successfully!');

			setAvatar(null);
			setPreview('');
		} catch (error) {
			notification.error('Failed to upload avatar.');
		}
	};

	const { getRootProps, getInputProps, isDragActive, fileRejections } =
		useDropzone({
			onDrop,
			multiple: false,
			maxSize: 5 * 1024 * 1024,
			accept: {
				'image/*': ['.png', '.jpg', '.jpeg', '.webp']
			}
		});

	return (
		<div className="flex flex-col items-center gap-5">
			<div
				{...getRootProps()}
				className={`
		group relative
		size-80
		overflow-hidden
		rounded-3xl
		border-2 border-dashed border-accent
		bg-primary
		cursor-pointer
		transition-colors
		${isDragActive ? 'border-orange-500 bg-orange-500/10' : ''}
		${isLoading ? 'pointer-events-none opacity-70' : ''}
	`}
			>
				<input {...getInputProps()} disabled={isLoading} />

				{preview ? (
					<>
						<img
							src={preview}
							alt="Avatar preview"
							className="h-full w-full object-cover"
						/>

						<div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
							<span className="text-lg font-medium text-white">
								Change avatar
							</span>
						</div>
					</>
				) : (
					<div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
						{isLoading ? (
							<Loader />
						) : (
							<>
								<p className="text-2xl font-semibold text-white">
									{isDragActive
										? 'Drop avatar here'
										: 'Browse or drop avatar'}
								</p>

								<p className="text-sm text-gray-400">
									PNG, JPG, WEBP • Max 5 MB
								</p>
							</>
						)}
					</div>
				)}
			</div>
			<FormButton
				title={isLoading ? 'Uploading...' : 'Update avatar'}
				disabled={isLoading || !avatar}
				onClick={handleUpload}
			/>
		</div>
	);
}
