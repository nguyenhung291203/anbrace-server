import { Injectable } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from 'src/shared/services/token.service'
import { LoginReqDto, LoginResDto, RegisterReqDto } from './auth.dto'
import { InvalidException, UnauthorizedException } from 'src/shared/exceptions/api.exception'
import { RoleEnum } from './auth.types'

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly hashingService: HashingService,
		private readonly tokenService: TokenService,
	) {}
	async register(dto: RegisterReqDto) {
		const existed = await this.prismaService.account.findUnique({
			where: { email: dto.email.toLowerCase() },
		})

		if (existed) {
			throw new InvalidException('Email đã được sử dụng', {
				email: 'Email đã được sử dụng',
			})
		}

		const hashedPassword = await this.hashingService.hash(dto.password)

		await this.prismaService.account.create({
			data: {
				email: dto.email.toLowerCase(),
				fullName: dto.fullName,
				phoneNumber: dto.phoneNumber,
				gender: dto.gender,
				password: hashedPassword,
				role: RoleEnum.CLIENT,
			},
		})
	}

	async login(req: LoginReqDto): Promise<LoginResDto> {
		const user = await this.prismaService.account.findUnique({
			where: { email: req.email },
		})

		if (!user) {
			throw new InvalidException('Thông tin đăng nhập không hợp lệ', {
				password: 'Email hoặc mật khẩu không đúng',
				email: 'Email hoặc mật khẩu không đúng',
			})
		}

		const isPasswordValid = await this.hashingService.compare(req.password, user.password)
		if (!isPasswordValid) {
			throw new InvalidException('Thông tin đăng nhập không hợp lệ', {
				password: 'Mật khẩu không đúng',
				email: 'Email hoặc mật khẩu không đúng',
			})
		}

		const tokens = this.generateTokens({ userId: user.id, role: user.role })

		await this.prismaService.token.create({
			data: {
				accountId: user.id,
				type: 'REFRESH',
				token: tokens.refreshToken,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			},
		})

		return tokens
	}

	private generateTokens(payload: { userId: number; role: string }): LoginResDto {
		return {
			accessToken: this.tokenService.signAccessToken(payload),
			refreshToken: this.tokenService.signRefreshToken(payload),
		}
	}

	async getMe(userId: number) {
		const user = await this.prismaService.account.findUnique({
			where: { id: userId },
			select: {
				id: true,
				email: true,
				fullName: true,
				phoneNumber: true,
				gender: true,
				role: true,
			},
		})

		if (!user) {
			throw new UnauthorizedException()
		}

		return user
	}

	async logout(userId: number) {
		await this.prismaService.token.deleteMany({
			where: {
				accountId: userId,
			},
		})
	}
}
