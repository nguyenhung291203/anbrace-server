import { Prisma, Product } from 'src/generated/prisma/client'
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from './product.dto'

export class ProductMapper {
	static toResponse(product: Product): ProductResponseDto {
		return {
			id: product.id,
			name: product.name,
			description: product.description,
			price: Number(product.price),
			imageUrl: product.imageUrl,
			categoryId: product.categoryId,
		}
	}

	static toResponseList(products: Product[]): ProductResponseDto[] {
		return products.map((product) => this.toResponse(product))
	}

	static toCreateInput(
		dto: CreateProductDto,
	): Pick<Product, 'name' | 'description' | 'price' | 'imageUrl' | 'categoryId'> {
		return {
			name: dto.name,
			description: dto.description || null,
			price: new Prisma.Decimal(dto.price),
			imageUrl: dto.imageUrl || null,
			categoryId: dto.categoryId,
		}
	}

	static toUpdateInput(dto: UpdateProductDto): Prisma.ProductUpdateInput {
		return {
			...(dto.name !== undefined && { name: dto.name }),
			...(dto.description !== undefined && {
				description: dto.description,
			}),
			...(dto.price !== undefined && {
				price: new Prisma.Decimal(dto.price),
			}),
			...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
			...(dto.categoryId !== undefined && {
				category: { connect: { id: dto.categoryId } },
			}),
		}
	}
}
