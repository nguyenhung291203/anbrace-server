import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ZodBody } from 'src/shared/decorators/zod-schema.decorator'
import { LoginReqSchema, RegisterReqSchema } from './auth.schema'
import type { LoginReqDto, RegisterReqDto } from './auth.dto'
import { ApiResponse } from 'src/shared/dtos/api.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import type { TokenPayload } from 'src/shared/types/jwt.type'
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { Auth } from 'src/shared/decorators/auth.decorator'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@Post('register')
	@HttpCode(HttpStatus.OK)
	async register(@ZodBody(RegisterReqSchema) dto: RegisterReqDto) {
		await this.authService.register(dto)
		return ApiResponse.success('Registration successful')
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@ZodBody(LoginReqSchema) dto: LoginReqDto) {
		const res = await this.authService.login(dto)
		return ApiResponse.success(res, 'Login successful')
	}

	@Get('me')
	@UseGuards(AuthenticationGuard)
	@Auth([AuthType.Bearer], { condition: ConditionGuard.And })
	async me(@ActiveUser() user: TokenPayload) {
		console.log('User in me endpoint:', user)
		const res = await this.authService.getMe(user.userId)
		return ApiResponse.success(res, 'User info retrieved successfully')
	}
}
