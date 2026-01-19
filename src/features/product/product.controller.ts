import {
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
import { ProductService } from './product.service'
import { ZodBody } from 'src/shared/decorators/zod-schema.decorator'
import { ProductQuerySchema, CreateProductSchema, UpdateProductSchema } from './product.schema'
import type { ProductQueryDto, CreateProductDto, UpdateProductDto } from './product.dto'

@Controller('products')
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
	async create(@ZodBody(CreateProductSchema) dto: CreateProductDto) {
		const data = await this.productService.create(dto)
		return ApiResponse.success(data)
	}

	@Put(':id')
	@HttpCode(HttpStatus.OK)
	async update(
		@Param('id', ParseIntPipe) id: number,
		@ZodBody(UpdateProductSchema) dto: UpdateProductDto,
	) {
		const data = await this.productService.update(id, dto)
		return ApiResponse.success(data)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	async delete(@Param('id', ParseIntPipe) id: number) {
		await this.productService.delete(id)
		return ApiResponse.successMessage('Product deleted')
	}
}
