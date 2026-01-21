import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Delete,
	HttpCode,
	HttpStatus,
	Patch,
	UseGuards,
} from '@nestjs/common'
import { ApiResponse } from 'src/shared/dtos/api.dto'
import { CategoryService } from './category.service'
import { ZodBody } from 'src/shared/decorators/zod-schema.decorator'
import { CategoryQuerySchema, CreateCategorySchema, UpdateCategorySchema } from './category.schema'
import type { CategoryQueryDto, CreateCategoryDto, UpdateCategoryDto } from './category.dto'
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { AuthType } from 'src/shared/constants/auth.constant'
import { Roles } from 'src/shared/decorators/role.decorator'
import { RoleEnum } from '../auth/auth.types'

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
	@UseGuards(AuthenticationGuard)
	@Roles(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
	@Auth([AuthType.Bearer])
	async create(@ZodBody(CreateCategorySchema) dto: CreateCategoryDto) {
		await this.categoryService.create(dto)
		return ApiResponse.success('Category created')
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthenticationGuard)
	@Roles(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
	@Auth([AuthType.Bearer])
	async update(
		@Param('id', ParseIntPipe) id: number,
		@ZodBody(UpdateCategorySchema) dto: UpdateCategoryDto,
	) {
		await this.categoryService.update(id, dto)
		return ApiResponse.success('Category updated')
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthenticationGuard)
	@Roles(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
	@Auth([AuthType.Bearer])
	async delete(@Param('id', ParseIntPipe) id: number) {
		await this.categoryService.delete(id)
		return ApiResponse.successMessage('Category deleted')
	}
}
