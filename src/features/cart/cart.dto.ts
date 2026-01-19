import { z } from 'zod'
import { AddToCartSchema, UpdateCartItemSchema, RemoveCartItemSchema } from './cart.schema'

export type AddToCartDto = z.infer<typeof AddToCartSchema>

export type UpdateCartItemDto = z.infer<typeof UpdateCartItemSchema> & {
	cartItemId: number
}

export type RemoveCartItemDto = z.infer<typeof RemoveCartItemSchema>
