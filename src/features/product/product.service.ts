import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './product.dto'
import { PaginationResponse, SortOrder } from 'src/shared/dtos/pagination.dto'
import { InvalidException, NotFoundException } from 'src/shared/exceptions/api.exception'
import { ProductMapper } from './product.mapper'
import { UploadService } from 'src/shared/services/upload.service'

@Injectable()
export class ProductService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly uploadService: UploadService,
	) {}

	async create(
		dto: CreateProductDto,
		thumbnail?: Express.Multer.File,
		images?: Express.Multer.File[],
	) {
		const existed = await this.prisma.product.findFirst({
			where: { name: dto.name, isDeleted: false },
			select: { id: true },
		})
		const errors = {}
		if (existed) {
			errors['name'] = 'Tên sản phẩm đã tồn tại'
		}
		const category = await this.prisma.category.findFirst({
			where: { id: dto.categoryId, isDeleted: false },
			select: { id: true },
		})

		if (!category) {
			errors['categoryId'] = 'Danh mục không tồn tại'
		}

		if (Object.keys(errors).length > 0) {
			throw new InvalidException('Dữ liệu không hợp lệ', errors)
		}

		const thumbnailUrl = thumbnail ? this.uploadService.saveFile(thumbnail) : null

		const imageUrls = images?.length ? this.uploadService.saveFiles(images) : []

		await this.prisma.product.create({
			data: ProductMapper.toCreateInput(dto, thumbnailUrl, imageUrls),
		})
	}

	async update(id: number, dto: UpdateProductDto) {
		const existing = await this.findExistingProduct(id)

		if (dto.name && dto.name !== existing.name) {
			const duplicated = await this.prisma.product.findFirst({
				where: {
					name: dto.name,
					isDeleted: false,
					NOT: { id },
				},
				select: { id: true },
			})

			if (duplicated) {
				throw new InvalidException('Tên sản phẩm đã tồn tại', {
					name: 'Tên sản phẩm đã tồn tại',
				})
			}
		}

		// await this.prisma.product.update({
		// 	where: { id },
		// 	data: ProductMapper.toUpdateInput(dto),
		// })
	}

	/**
	 * Get list product (pagination + filter)
	 */
	async findAll(query: ProductQueryDto) {
		const { pageNo, pageSize, keyword, orders, categoryIds, minPrice, maxPrice, sizes } = query

		const where: any = {
			isDeleted: false,
			...(keyword && {
				name: { contains: keyword, mode: 'insensitive' },
			}),
			...(categoryIds?.length && {
				categoryId: { in: categoryIds },
			}),
		}

		const orderBy =
			orders && Object.keys(orders).length > 0
				? Object.entries(orders).map(([key, value]) => ({
						[key]: value.toLowerCase(),
					}))
				: [{ createdAt: SortOrder.DESC }]

		const items = await this.prisma.product.findMany({
			where,
			orderBy,
			include: { category: true },
		})

		const filteredItems = items.filter((product) => {
			const productSizes = product.sizes as {
				price: number
				size: number
			}[]

			return productSizes.some((s) => {
				if (minPrice !== undefined && s.price < minPrice) return false
				if (maxPrice !== undefined && s.price > maxPrice) return false
				if (sizes?.length && !sizes.includes(s.size)) return false
				return true
			})
		})

		const totalRecords = filteredItems.length
		const pagedItems = filteredItems.slice((pageNo - 1) * pageSize, pageNo * pageSize)

		return new PaginationResponse(
			pagedItems.map((item) => ProductMapper.toResponse(item)),
			pageNo,
			pageSize,
			totalRecords,
		)
	}

	async findById(id: number) {
		const product = await this.prisma.product.findFirst({
			where: {
				id,
				isDeleted: false,
			},
			include: {
				category: true,
			},
		})

		if (!product) {
			throw new NotFoundException('Sản phẩm không tồn tại')
		}

		return ProductMapper.toResponse(product)
	}

	/**
	 * Soft delete product
	 */
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

	/**
	 * Check existing product
	 */
	private async findExistingProduct(id: number) {
		const product = await this.prisma.product.findFirst({
			where: {
				id,
				isDeleted: false,
			},
		})

		if (!product) {
			throw new NotFoundException('Sản phẩm không tồn tại')
		}

		return product
	}
}
