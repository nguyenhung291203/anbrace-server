import { Category } from 'src/generated/prisma/client'
import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from './category.dto'

export class CategoryMapper {
	static toResponse(category: Category): CategoryResponseDto {
		return {
			id: category.id,
			name: category.name,
			description: category.description,
			imageUrl: category.imageUrl,
		}
	}

	static toResponseList(categories: Category[]): CategoryResponseDto[] {
		return categories.map((category) => this.toResponse(category))
	}

	static toCreateInput(
		dto: CreateCategoryDto,
	): Pick<Category, 'name' | 'description' | 'imageUrl'> {
		return {
			name: dto.name,
			description: dto.description || null,
			imageUrl: dto.imageUrl || null,
		}
	}

	static toUpdateInput(
		dto: UpdateCategoryDto,
	): Partial<Pick<Category, 'name' | 'description' | 'imageUrl'>> {
		return {
			...(dto.name !== undefined && { name: dto.name }),
			...(dto.description !== undefined && { description: dto.description }),
			...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
		}
	}
}
