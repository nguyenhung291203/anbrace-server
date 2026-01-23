import { extname } from 'path'
import { randomUUID } from 'crypto'

export const generateFileName = (originalName: string) => {
	const ext = extname(originalName)
	return `${randomUUID()}${ext}`
}
