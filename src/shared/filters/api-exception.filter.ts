import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common'
import { Response } from 'express'

import { ApiException } from '../exceptions/api.exception'

@Catch(ApiException)
export class HandlerExceptionFilter implements ExceptionFilter {
	catch(exception: ApiException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const { code, message, errors } = exception.baseErrorCode

		return response.status(HttpStatus.OK).json({
			code,
			message,
			errors,
		})
	}
}
