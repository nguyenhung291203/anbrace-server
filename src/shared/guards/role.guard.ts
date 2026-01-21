import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { REQUEST_USER_KEY } from '../constants/auth.constant'
import { TokenPayload } from '../types/jwt.type'
import { ROLES_KEY } from '../decorators/role.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		])

		console.log('Required roles for this route:', requiredRoles)

		if (!requiredRoles || requiredRoles.length === 0) {
			return true
		}

		const request = context.switchToHttp().getRequest()
		const user = request[REQUEST_USER_KEY] as TokenPayload

		if (!user || !requiredRoles.includes(user.role)) {
			throw new ForbiddenException('Không có quyền truy cập')
		}

		return true
	}
}
