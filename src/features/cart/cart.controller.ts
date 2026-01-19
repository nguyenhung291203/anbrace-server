import { Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ZodBody } from 'src/shared/decorators/zod-schema.decorator'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard'
import { AddToCartSchema, UpdateCartItemSchema } from './cart.schema'
import { CartService } from './cart.service'
import type { AddToCartDto, UpdateCartItemDto } from './cart.dto'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { ApiResponse } from 'src/shared/dtos/api.dto'

@UseGuards(AuthenticationGuard)
@Controller('carts')
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Get()
	@UseGuards(AuthenticationGuard)
	@Auth([AuthType.Bearer], { condition: ConditionGuard.And })
	async getCart(@ActiveUser('userId') userId: number) {
		const res = await this.cartService.getCartItems(userId)
		return ApiResponse.success(res, 'Cart retrieved successfully')
	}

	@Post()
	@UseGuards(AuthenticationGuard)
	@Auth([AuthType.Bearer], { condition: ConditionGuard.And })
	async addToCart(
		@ActiveUser('userId') userId: number,
		@ZodBody(AddToCartSchema) dto: AddToCartDto,
	) {
		await this.cartService.addToCart(userId, dto)
		return ApiResponse.success('Item added to cart successfully')
	}

	@Put()
	async updateCartItem(
		@ActiveUser('userId') userId: number,
		@ZodBody(UpdateCartItemSchema) dto: UpdateCartItemDto,
	) {
		return this.cartService.updateCartItem(userId, dto)
	}

	@Delete('item/:id')
	async removeCartItem(@ActiveUser('userId') userId: number, @Param('id') cartItemId: number) {
		return this.cartService.removeCartItem(userId, cartItemId)
	}
}
