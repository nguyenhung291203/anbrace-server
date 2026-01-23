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
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common'
import { ApiResponse } from 'src/shared/dtos/api.dto'
import { ProductService } from './product.service'
import { ZodBody } from 'src/shared/decorators/zod-schema.decorator'
import { ProductQuerySchema, CreateProductSchema, UpdateProductSchema } from './product.schema'
import type { ProductQueryDto, CreateProductDto, UpdateProductDto } from './product.dto'
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { AuthType } from 'src/shared/constants/auth.constant'
import { Roles } from 'src/shared/decorators/role.decorator'
import { RoleEnum } from '../auth/auth.types'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { multerOptions } from 'src/shared/configs/multer.config'

@Controller('api/v1/products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post('filter')
	@HttpCode(HttpStatus.OK)
	async findAll(@ZodBody(ProductQuerySchema) query: ProductQueryDto) {
		const data = await this.productService.findAll(query)
		return ApiResponse.success(data)
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async findById(@Param('id', ParseIntPipe) id: number) {
		const data = await this.productService.findById(id)
		return ApiResponse.success(data)
	}

	@Post()
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthenticationGuard)
	@Roles(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
	@Auth([AuthType.Bearer])
	@UseInterceptors(
		FileFieldsInterceptor(
			[
				{ name: 'thumbnail', maxCount: 1 },
				{ name: 'images', maxCount: 10 },
			],
			multerOptions,
		),
	)
	async create(
		@ZodBody(CreateProductSchema) dto: CreateProductDto,
		@UploadedFiles()
		files: {
			thumbnail?: Express.Multer.File[]
			images?: Express.Multer.File[]
		},
	) {
		await this.productService.create(dto, files.thumbnail?.[0], files.images)

		return ApiResponse.success('Product created')
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthenticationGuard)
	@Roles(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
	@Auth([AuthType.Bearer])
	async update(
		@Param('id', ParseIntPipe) id: number,
		@ZodBody(UpdateProductSchema) dto: UpdateProductDto,
	) {
		await this.productService.update(id, dto)
		return ApiResponse.success('Product updated')
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthenticationGuard)
	@Roles(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
	@Auth([AuthType.Bearer])
	async delete(@Param('id', ParseIntPipe) id: number) {
		await this.productService.delete(id)
		return ApiResponse.successMessage('Product deleted')
	}
}
