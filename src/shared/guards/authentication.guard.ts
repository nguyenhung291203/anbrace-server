import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable, lastValueFrom } from 'rxjs'
import { AccessTokenGuard } from 'src/shared/guards/acces-token.guard'
import { APIKeyGuard } from './api-key.guard'
import { AUTH_TYPE_KEY } from '../decorators/auth.decorator'
import { AuthType, AuthTypeDecoratorPayload, ConditionGuard } from '../constants/auth.constant'

@Injectable()
export class AuthenticationGuard implements CanActivate {
	private readonly guardMap: Record<string, CanActivate>

	constructor(
		private readonly reflector: Reflector,
		private readonly accessTokenGuard: AccessTokenGuard,
		private readonly apiKeyGuard: APIKeyGuard,
	) {
		this.guardMap = {
			[AuthType.Bearer]: this.accessTokenGuard,
			[AuthType.ApiKey]: this.apiKeyGuard,
			[AuthType.None]: {
				canActivate: () => true,
			},
		}
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const authConfig = this.reflector.getAllAndOverride<AuthTypeDecoratorPayload>(AUTH_TYPE_KEY, [
			context.getHandler(),
			context.getClass(),
		])

		if (!authConfig) {
			return true
		}

		const condition = authConfig.options?.condition ?? ConditionGuard.And
		const guards = authConfig.authTypes.map((item) => this.guardMap[item])

		if (condition === ConditionGuard.Or) {
			return this.handleOrCondition(guards, context)
		}

		return this.handleAndCondition(guards, context)
	}

	private async handleOrCondition(
		guards: CanActivate[],
		context: ExecutionContext,
	): Promise<boolean> {
		for (const guard of guards) {
			try {
				const result = guard.canActivate(context)
				const canActivate = await this.resolveGuardResult(result)
				if (canActivate) return true
			} catch {
				continue
			}
		}
		throw new UnauthorizedException('All guards failed')
	}

	private async handleAndCondition(
		guards: CanActivate[],
		context: ExecutionContext,
	): Promise<boolean> {
		for (const guard of guards) {
			const result = guard.canActivate(context)
			const canActivate = await this.resolveGuardResult(result)
			if (!canActivate) {
				throw new UnauthorizedException('Authentication failed')
			}
		}
		return true
	}

	private async resolveGuardResult(
		result: boolean | Promise<boolean> | Observable<boolean>,
	): Promise<boolean> {
		if (result instanceof Observable) {
			return lastValueFrom(result)
		}
		return Promise.resolve(result)
	}
}
