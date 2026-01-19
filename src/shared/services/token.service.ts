import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { configServer } from '../config'
import { TokenPayload } from '../types/jwt.type'

@Injectable()
export class TokenService {
	constructor(private readonly jwtService: JwtService) {}

	signAccessToken(payload: TokenPayload) {
		return this.jwtService.sign(payload, {
			secret: configServer.ACCESS_TOKEN_SECRET,
			expiresIn: Number(configServer.ACCESS_TOKEN_EXPIRES_IN),
			algorithm: 'HS256',
		})
	}

	signRefreshToken(payload: TokenPayload) {
		return this.jwtService.sign(payload, {
			secret: configServer.REFRESH_TOKEN_SECRET,
			expiresIn: Number(configServer.REFRESH_TOKEN_EXPIRES_IN),
			algorithm: 'HS256',
		})
	}

	verifyAccessToken(token: string): TokenPayload {
		try {
			return this.jwtService.verify<TokenPayload>(token, {
				secret: configServer.ACCESS_TOKEN_SECRET,
			})
		} catch {
			throw new UnauthorizedException('Invalid or expired access token')
		}
	}

	verifyRefreshToken(token: string): TokenPayload {
		try {
			return this.jwtService.verify<TokenPayload>(token, {
				secret: configServer.REFRESH_TOKEN_SECRET,
			})
		} catch {
			throw new UnauthorizedException('Invalid or expired refresh token')
		}
	}
}
