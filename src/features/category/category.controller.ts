import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Delete,
	HttpCode,
	HttpStatus,
} from '@nestjs/common'
import { ApiResponse } from 'src/shared/dtos/api.dto'
import { CategoryService } from './category.service'
import { ZodBody } from 'src/shared/decorators/zod-schema.decorator'
import { CategoryQuerySchema, CreateCategorySchema, UpdateCategorySchema } from './category.schema'
import type { CategoryQueryDto, CreateCategoryDto, UpdateCategoryDto } from './category.dto'

@Controller('api/v1/categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Post('filter')
	@HttpCode(HttpStatus.OK)
	async findAll(@ZodBody(CategoryQuerySchema) query: CategoryQueryDto) {
		const data = await this.categoryService.findAll(query)
		return ApiResponse.success(data)
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async findById(@Param('id', ParseIntPipe) id: number) {
		const data = await this.categoryService.findById(id)
		return ApiResponse.success(data)
	}

	@Post()
	@HttpCode(HttpStatus.OK)
	async create(@ZodBody(CreateCategorySchema) dto: CreateCategoryDto) {
		const data = await this.categoryService.create(dto)
		return ApiResponse.success(data)
	}

	@Put(':id')
	@HttpCode(HttpStatus.OK)
	async update(
		@Param('id', ParseIntPipe) id: number,
		@ZodBody(UpdateCategorySchema) dto: UpdateCategoryDto,
	) {
		const data = await this.categoryService.update(id, dto)
		return ApiResponse.success(data)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	async delete(@Param('id', ParseIntPipe) id: number) {
		await this.categoryService.delete(id)
		return ApiResponse.successMessage('Category deleted')
	}
}
