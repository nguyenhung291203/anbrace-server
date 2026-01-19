import { PaginationRequestSchema } from 'src/shared/schemas/pagination.schema'
import { z } from 'zod'

export const CreateProductSchema = z.object({
	name: z.string().min(1, 'Tên sản phẩm là bắt buộc').max(150, 'Tên sản phẩm tối đa 150 ký tự'),
	description: z.string().optional(),
	price: z.number().positive('Giá sản phẩm phải lớn hơn 0'),
	imageUrl: z.string().max(255, 'Đường dẫn hình ảnh tối đa 255 ký tự').optional(),
	categoryId: z.number().int('Danh mục không hợp lệ').positive('Danh mục không hợp lệ'),
})

export const UpdateProductSchema = z.object({
	name: z
		.string()
		.min(1, 'Tên sản phẩm không được để trống')
		.max(150, 'Tên sản phẩm tối đa 150 ký tự')
		.optional(),
	description: z.string().optional(),
	price: z.number().positive('Giá sản phẩm phải lớn hơn 0').optional(),
	imageUrl: z.string().max(255, 'Đường dẫn hình ảnh tối đa 255 ký tự').optional(),
	categoryId: z.number().int('Danh mục không hợp lệ').positive('Danh mục không hợp lệ').optional(),
})

export const ProductQuerySchema = PaginationRequestSchema.extend({
	keyword: z.string().optional(),
	categoryId: z.number().int('Danh mục không hợp lệ').positive('Danh mục không hợp lệ').optional(),
	minPrice: z.number().positive('Giá tối thiểu phải lớn hơn 0').optional(),
	maxPrice: z.number().positive('Giá tối đa phải lớn hơn 0').optional(),
}).refine((data) => !data.minPrice || !data.maxPrice || data.minPrice <= data.maxPrice, {
	message: 'Giá tối thiểu không được lớn hơn giá tối đa',
	path: ['minPrice'],
})
