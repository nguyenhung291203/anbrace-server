import { z } from 'zod'
import { PaginationRequestSchema } from 'src/shared/schemas/pagination.schema'

export const ProductSizePriceSchema = z.object({
	size: z.number().positive('Size phải lớn hơn 0'),
	price: z.number().nonnegative('Giá không được nhỏ hơn 0'),
	stock: z
		.number()
		.int('Số lượng tồn kho phải là số nguyên')
		.nonnegative('Số lượng tồn kho không được nhỏ hơn 0'),
})

export const CreateProductSchema = z.object({
	name: z
		.string()
		.min(1, 'Tên sản phẩm không được để trống')
		.max(255, 'Tên sản phẩm tối đa 255 ký tự'),

	description: z.string().optional(),

	categoryId: z.coerce.number().positive('Danh mục không hợp lệ'),

	sizes: z.preprocess(
		(val) => {
			if (typeof val === 'string') {
				try {
					return JSON.parse(val)
				} catch {
					return val
				}
			}
			return val
		},
		z.array(ProductSizePriceSchema).min(1, 'Sản phẩm phải có ít nhất 1 size'),
	),

	thumbnail: z.any().optional(),

	images: z.array(z.any()).optional(),
})

export const UpdateProductSchema = z.object({
	name: z
		.string()
		.min(1, 'Tên sản phẩm không được để trống')
		.max(255, 'Tên sản phẩm tối đa 255 ký tự')
		.optional(),
	description: z.string().optional(),
	categoryId: z.number().positive('Danh mục không hợp lệ').nullable().optional(),
	sizes: z.array(ProductSizePriceSchema).optional(),
	thumbnail: z.any().optional(),
	images: z.array(z.any()).optional(),
})

export const ProductQuerySchema = PaginationRequestSchema.extend({
	keyword: z.string().optional(),
	categoryIds: z.array(z.number()).optional(),
	minPrice: z.coerce.number().nonnegative('minPrice không được nhỏ hơn 0').optional(),
	maxPrice: z.coerce.number().nonnegative('maxPrice không được nhỏ hơn 0').optional(),
})
