import { Injectable } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from 'src/shared/services/token.service'
import { LoginReqDto, LoginResDto, RegisterReqDto } from './auth.dto'
import { InvalidException, UnauthorizedException } from 'src/shared/exceptions/api.exception'

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly hashingService: HashingService,
		private readonly tokenService: TokenService,
	) {}
	async register(dto: RegisterReqDto) {
		const existed = await this.prismaService.user.findUnique({
			where: { email: dto.email },
		})

		if (existed) {
			throw new InvalidException('Email already exists', {
				email: 'EMAIL_DUPLICATED',
			})
		}

		const hashed = await this.hashingService.hash(dto.password)

		await this.prismaService.user.create({
			data: {
				email: dto.email,
				fullName: dto.fullName,
				password: hashed,
			},
		})
	}
	async login(req: LoginReqDto): Promise<LoginResDto> {
		const user = await this.prismaService.user.findUnique({
			where: { email: req.email },
		})

		if (!user) {
			throw new UnauthorizedException()
		}

		const isPasswordValid = await this.hashingService.compare(req.password, user.password)
		if (!isPasswordValid) {
			throw new InvalidException('Invalid credentials', {
				password: 'INCORRECT',
				email: 'INCORRECT',
			})
		}

		const tokens = this.generateTokens({ userId: user.id })

		await this.prismaService.token.create({
			data: {
				userId: user.id,
				type: 'REFRESH',
				token: tokens.refreshToken,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			},
		})

		return tokens
	}

	private generateTokens(payload: { userId: number }): LoginResDto {
		return {
			accessToken: this.tokenService.signAccessToken(payload),
			refreshToken: this.tokenService.signRefreshToken(payload),
		}
	}

	async getMe(userId: number) {
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				email: true,
				fullName: true,
			},
		})

		if (!user) {
			throw new UnauthorizedException()
		}

		return user
	}
}
