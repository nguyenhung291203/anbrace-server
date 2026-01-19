import { z } from 'zod'
import { CategoryQuerySchema, CreateCategorySchema, UpdateCategorySchema } from './category.schema'

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>
export type CategoryQueryDto = z.infer<typeof CategoryQuerySchema>

export interface CategoryResponseDto {
	id: number
	name: string
	description?: string | null
}
