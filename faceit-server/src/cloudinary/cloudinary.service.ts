import { Inject, Injectable } from '@nestjs/common'
import { v2 as Cloudinary, UploadApiResponse } from 'cloudinary'

@Injectable()
export class CloudinaryService {
	constructor(
		@Inject('CLOUDINARY')
		private readonly cloudinary: typeof Cloudinary
	) {}

	async upload(file: Express.Multer.File) {
		return new Promise<UploadApiResponse>((resolve, reject) => {
			this.cloudinary.uploader
				.upload_stream(
					{
						folder: 'avatars',
						resource_type: 'image'
					},
					(error, result) => {
						if (error) {
							return reject(error)
						}

						resolve(result!)
					}
				)
				.end(file.buffer)
		})
	}

	async delete(publicId: string) {
		return this.cloudinary.uploader.destroy(publicId)
	}
}
