import { z } from 'zod'
import {
	CreateProductSchema,
	UpdateProductSchema,
	ProductQuerySchema,
	ProductSizePriceSchema,
} from './product.schema'
import { CategoryResponseDto } from '../category/category.dto'

export type CreateProductDto = z.infer<typeof CreateProductSchema>

export type UpdateProductDto = z.infer<typeof UpdateProductSchema>

export type ProductQueryDto = z.infer<typeof ProductQuerySchema>

export type ProductSizePriceDto = z.infer<typeof ProductSizePriceSchema>

export class ProductResponseDto {
	id: number
	name: string
	description?: string | null

	thumbnail: string | null
	images: string[]

	category: CategoryResponseDto

	sizes: ProductSizePriceDto[]

	rating: number
}
