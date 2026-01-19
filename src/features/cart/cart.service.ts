import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import type { AddToCartDto, UpdateCartItemDto } from './cart.dto'

@Injectable()
export class CartService {
	constructor(private readonly prisma: PrismaService) {}

	async getCartItems(userId: number) {
		const cart = await this.prisma.cart.findFirst({
			where: { userId, isDeleted: false },
			include: {
				items: {
					where: { isDeleted: false },
					select: {
						quantity: true,
						product: {
							select: {
								id: true,
								name: true,
								description: true,
								price: true,
								imageUrl: true,
							},
						},
					},
				},
			},
		})

		if (!cart) return []

		return cart.items
	}

	async addToCart(userId: number, dto: AddToCartDto) {
		const quantity = dto.quantity ?? 1

		let cart = await this.prisma.cart.findFirst({
			where: { userId, isDeleted: false },
		})
		if (!cart) {
			cart = await this.prisma.cart.create({ data: { userId } })
		}

		const existingItem = await this.prisma.cartItem.findFirst({
			where: { cartId: cart.id, productId: dto.productId, isDeleted: false },
		})

		if (existingItem) {
			return this.prisma.cartItem.update({
				where: { id: existingItem.id },
				data: { quantity: existingItem.quantity + quantity },
				include: { product: true },
			})
		}

		await this.prisma.cartItem.create({
			data: {
				cartId: cart.id,
				productId: dto.productId,
				quantity,
			},
			include: { product: true },
		})
	}

	async updateCartItem(userId: number, dto: UpdateCartItemDto) {
		const cart = await this.prisma.cart.findFirst({
			where: { userId, isDeleted: false },
		})
		if (!cart) throw new NotFoundException('Cart not found')

		const item = await this.prisma.cartItem.findFirst({
			where: { cartId: cart.id, id: dto.cartItemId, isDeleted: false },
		})
		if (!item) throw new NotFoundException('Cart item not found')

		if ((dto.quantity ?? 0) <= 0) {
			return this.removeCartItem(userId, dto.cartItemId)
		}

		return this.prisma.cartItem.update({
			where: { id: item.id },
			data: { quantity: dto.quantity },
			include: { product: true },
		})
	}

	async removeCartItem(userId: number, cartItemId: number) {
		const cart = await this.prisma.cart.findFirst({
			where: { userId, isDeleted: false },
		})
		if (!cart) throw new NotFoundException('Cart not found')

		const item = await this.prisma.cartItem.findFirst({
			where: { cartId: cart.id, id: cartItemId, isDeleted: false },
		})
		if (!item) throw new NotFoundException('Cart item not found')

		return this.prisma.cartItem.update({
			where: { id: item.id },
			data: { isDeleted: true },
		})
	}

	async clearCart(userId: number) {
		const cart = await this.prisma.cart.findFirst({
			where: { userId, isDeleted: false },
		})
		if (!cart) return 0

		return this.prisma.cartItem.updateMany({
			where: { cartId: cart.id, isDeleted: false },
			data: { isDeleted: true },
		})
	}
}
