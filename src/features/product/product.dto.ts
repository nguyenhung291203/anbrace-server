import { z } from 'zod'
import { CreateProductSchema, UpdateProductSchema, ProductQuerySchema } from './product.schema'

export type CreateProductDto = z.infer<typeof CreateProductSchema>
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>
export type ProductQueryDto = z.infer<typeof ProductQuerySchema>

export interface ProductResponseDto {
	id: number
	name: string
	description?: string | null
	price: number
	imageUrl?: string | null
	categoryId: number
}
