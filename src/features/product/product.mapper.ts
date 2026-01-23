import { Product, Category } from 'src/generated/prisma/client'
import {
	CreateProductDto,
	UpdateProductDto,
	ProductResponseDto,
	ProductSizePriceDto,
} from './product.dto'
import { CategoryMapper } from '../category/category.mapper'

export class ProductMapper {
	static toResponse(product: Product & { category?: Category }): ProductResponseDto {
		return {
			id: product.id,
			name: product.name,
			description: product.description,

			thumbnail: product.thumbnail,
			images: (product.images as string[]) ?? [],

			category: product.category ? CategoryMapper.toResponse(product.category) : (undefined as any),

			sizes: (product.sizes as ProductSizePriceDto[]) ?? [],

			rating: product.rating,
		}
	}

	static toCreateInput(dto: CreateProductDto, thumbnail: string | null, images: string[]) {
		return {
			name: dto.name,
			description: dto.description ?? null,
			categoryId: dto.categoryId,
			sizes: dto.sizes,
			thumbnail,
			images,
		}
	}

	/**
	 * Update input
	 */
	static toUpdateInput(dto: UpdateProductDto) {
		return {
			...(dto.name !== undefined && { name: dto.name }),
			...(dto.description !== undefined && {
				description: dto.description,
			}),
			...(dto.categoryId !== undefined && {
				categoryId: dto.categoryId,
			}),
			...(dto.sizes !== undefined && {
				sizes: dto.sizes,
			}),
		}
	}
}
