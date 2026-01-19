import { PaginationRequestSchema } from 'src/shared/schemas/pagination.schema'
import { z } from 'zod'

export const CreateCategorySchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().optional(),
	imageUrl: z.string().max(255).optional(),
})

export const UpdateCategorySchema = z.object({
	name: z.string().min(1).max(100).optional(),
	description: z.string().optional(),
	imageUrl: z.string().max(255).optional(),
})

export const CategoryQuerySchema = PaginationRequestSchema.extend({
	keyword: z.string().optional(),
})
