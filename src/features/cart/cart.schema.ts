import { z } from 'zod'
import { ProductResponseDto } from '../product/product.dto'

export const AddToCartSchema = z.object({
	productId: z.number().int().min(1, { message: 'Vui lòng chọn sản phẩm hợp lệ' }),
	quantity: z.number().int().min(1, { message: 'Số lượng phải lớn hơn hoặc bằng 1' }).optional(),
})

export const UpdateCartItemSchema = z.object({
	quantity: z.number().int().min(1, { message: 'Số lượng phải lớn hơn hoặc bằng 1' }),
})

export const RemoveCartItemSchema = z.object({
	cartItemId: z.number().int().min(1, { message: 'Vui lòng chọn sản phẩm hợp lệ để xóa' }),
})

export interface CartItemResponseDto {
	id: number
	quantity: number
	product: ProductResponseDto
}
