import { Category } from 'src/generated/prisma/client'
import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from './category.dto'

export class CategoryMapper {
	static toResponse(category: Category): CategoryResponseDto {
		return {
			id: category.id,
			name: category.name,
			description: category.description,
		}
	}

	static toResponseList(categories: Category[]): CategoryResponseDto[] {
		return categories.map((category) => this.toResponse(category))
	}

	static toCreateInput(dto: CreateCategoryDto): Pick<Category, 'name' | 'description'> {
		return {
			name: dto.name,
			description: dto.description || null,
		}
	}

	static toUpdateInput(dto: UpdateCategoryDto): Partial<Pick<Category, 'name' | 'description'>> {
		return {
			...(dto.name !== undefined && { name: dto.name }),
			...(dto.description !== undefined && { description: dto.description }),
		}
	}
}
