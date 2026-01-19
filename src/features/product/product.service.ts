import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './product.dto'
import { ProductMapper } from './product.mapper'
import { PaginationResponse, SortOrder } from 'src/shared/dtos/pagination.dto'
import { InvalidException, NotFoundException } from 'src/shared/exceptions/api.exception'

@Injectable()
export class ProductService {
	constructor(private readonly prisma: PrismaService) {}

	private static readonly ERROR = {
		NOT_FOUND: 'Product not found',
		NAME_DUPLICATED: 'Product name already exists',
	}

	private static readonly FIELD_ERROR = {
		NAME_DUPLICATE: {
			name: 'DUPLICATE',
		},
	}

	async create(dto: CreateProductDto) {
		await this.assertNameNotDuplicated(dto.name)

		const product = await this.prisma.product.create({
			data: ProductMapper.toCreateInput(dto),
		})

		return ProductMapper.toResponse(product)
	}

	async findAll(query: ProductQueryDto) {
		const { pageNo, pageSize, keyword, categoryId, orders } = query

		const where = {
			isDeleted: false,
			...(keyword && {
				name: { contains: keyword },
			}),
			...(categoryId && { categoryId }),
		}

		const orderBy =
			orders && Object.keys(orders).length > 0
				? Object.entries(orders).map(([key, value]) => ({
						[key]: value.toLowerCase(),
					}))
				: [{ createdAt: SortOrder.DESC }]

		const [items, totalRecords] = await this.prisma.$transaction([
			this.prisma.product.findMany({
				where,
				skip: (pageNo - 1) * pageSize,
				take: pageSize,
				orderBy,
			}),
			this.prisma.product.count({ where }),
		])

		return new PaginationResponse(
			ProductMapper.toResponseList(items),
			pageNo,
			pageSize,
			totalRecords,
		)
	}

	async findById(id: number) {
		const product = await this.findExistingProduct(id)
		return ProductMapper.toResponse(product)
	}

	async update(id: number, dto: UpdateProductDto) {
		const existing = await this.findExistingProduct(id)

		if (dto.name && dto.name !== existing.name) {
			await this.assertNameNotDuplicated(dto.name, id)
		}

		const updated = await this.prisma.product.update({
			where: { id },
			data: ProductMapper.toUpdateInput(dto),
		})

		return ProductMapper.toResponse(updated)
	}

	async delete(id: number, deletedBy?: number) {
		await this.findExistingProduct(id)

		await this.prisma.product.update({
			where: { id },
			data: {
				isDeleted: true,
				deletedAt: new Date(),
				deletedBy,
			},
		})
	}

	private async findExistingProduct(id: number) {
		const product = await this.prisma.product.findFirst({
			where: { id, isDeleted: false },
		})

		if (!product) {
			throw new NotFoundException(ProductService.ERROR.NOT_FOUND)
		}

		return product
	}

	private async assertNameNotDuplicated(name: string, excludeId?: number) {
		const duplicated = await this.prisma.product.findFirst({
			where: {
				name,
				isDeleted: false,
				...(excludeId && {
					NOT: { id: excludeId },
				}),
			},
		})

		if (duplicated) {
			throw new InvalidException(
				ProductService.ERROR.NAME_DUPLICATED,
				ProductService.FIELD_ERROR.NAME_DUPLICATE,
			)
		}
	}
}
