import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { configServer } from '../config'

@Injectable()
export class APIKeyGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest()
		const xAPIKey = request.headers['x-api-key']
		console.log('Request Headers:', request.headers)
		console.log('xAPIKey', xAPIKey)
		if (xAPIKey !== configServer.SECRET_API_KEY) {
			throw new UnauthorizedException()
		}
		return true
	}
}
