import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CategoryQueryDto, CreateCategoryDto, UpdateCategoryDto } from './category.dto'
import { CategoryMapper } from './category.mapper'
import { PaginationResponse, SortOrder } from 'src/shared/dtos/pagination.dto'
import { InvalidException, NotFoundException } from 'src/shared/exceptions/api.exception'

@Injectable()
export class CategoryService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateCategoryDto) {
		const existed = await this.prisma.category.findFirst({
			where: {
				name: dto.name,
			},
			select: { id: true },
		})

		if (existed) {
			throw new InvalidException('Tên danh mục đã tồn tại', {
				name: 'Tên danh mục đã tồn tại',
			})
		}

		await this.prisma.category.create({
			data: CategoryMapper.toCreateInput(dto),
		})
	}

	async update(id: number, dto: UpdateCategoryDto) {
		const existing = await this.findExistingCategory(id)

		if (dto.name && dto.name !== existing.name) {
			const duplicated = await this.prisma.category.findFirst({
				where: {
					name: dto.name,
					NOT: { id },
				},
				select: { id: true },
			})

			if (duplicated) {
				throw new InvalidException('Tên danh mục đã tồn tại', {
					name: 'Tên danh mục đã tồn tại',
				})
			}
		}

		await this.prisma.category.update({
			where: { id },
			data: CategoryMapper.toUpdateInput(dto),
		})
	}

	async findAll(query: CategoryQueryDto) {
		const { pageNo, pageSize, keyword, orders } = query

		const where = {
			isDeleted: false,
			...(keyword && {
				name: { contains: keyword },
			}),
		}

		const orderBy =
			orders && Object.keys(orders).length > 0
				? Object.entries(orders).map(([key, value]) => ({
						[key]: value.toLowerCase(),
					}))
				: [{ createdAt: SortOrder.DESC }]

		const [items, totalRecords] = await this.prisma.$transaction([
			this.prisma.category.findMany({
				where,
				skip: (pageNo - 1) * pageSize,
				take: pageSize,
				orderBy,
				include: {
					_count: {
						select: {
							products: true,
						},
					},
				},
			}),
			this.prisma.category.count({ where }),
		])

		return new PaginationResponse(
			items.map((item) => {
				return {
					...CategoryMapper.toResponse(item),
					productQuantity: item._count.products,
				}
			}),
			pageNo,
			pageSize,
			totalRecords,
		)
	}

	async findById(id: number) {
		const category = await this.findExistingCategory(id)
		return CategoryMapper.toResponse(category)
	}

	async delete(id: number, deletedBy?: number) {
		await this.findExistingCategory(id)

		await this.prisma.category.update({
			where: { id },
			data: {
				isDeleted: true,
				deletedAt: new Date(),
				deletedBy,
			},
		})
	}

	private async findExistingCategory(id: number) {
		const category = await this.prisma.category.findFirst({
			where: { id, isDeleted: false },
		})

		if (!category) {
			throw new NotFoundException('Danh mục không tồn tại')
		}

		return category
	}
}
