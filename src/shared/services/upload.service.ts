import { Injectable } from '@nestjs/common'
import type { Express } from 'express'
import { existsSync, mkdirSync } from 'fs'
import { extname } from 'path'
import { randomUUID } from 'crypto'
import { UPLOAD_DIR } from '../constants/upload.constant'

@Injectable()
export class UploadService {
	constructor() {
		if (!existsSync(UPLOAD_DIR)) {
			mkdirSync(UPLOAD_DIR, { recursive: true })
		}
	}

	static filename(
		_: any,
		file: Express.Multer.File,
		cb: (error: Error | null, filename: string) => void,
	) {
		const ext = extname(file.originalname)
		cb(null, `${randomUUID()}${ext}`)
	}

	saveFile(file: Express.Multer.File): string {
		return `/uploads/${file.filename}`
	}

	saveFiles(files: Express.Multer.File[]): string[] {
		return files.map((file) => `/uploads/${file.filename}`)
	}
}
