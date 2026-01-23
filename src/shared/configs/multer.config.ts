import { diskStorage } from 'multer'
import type { Express } from 'express'
import { UploadService } from '../services/upload.service'
import { IMAGE_MIME_TYPES, MAX_IMAGE_SIZE, UPLOAD_DIR } from '../constants/upload.constant'

export const multerOptions = {
	storage: diskStorage({
		destination: UPLOAD_DIR,
		filename: UploadService.filename,
	}),
	fileFilter: (
		_: any,
		file: Express.Multer.File,
		cb: (error: Error | null, acceptFile: boolean) => void,
	) => {
		if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
			return cb(new Error('File không đúng định dạng ảnh'), false)
		}
		cb(null, true)
	},
	limits: {
		fileSize: MAX_IMAGE_SIZE,
	},
}
