import { API_CODE, ApiCode } from '../constants/api-code.constant'

export abstract class BaseErrorCode {
	code: ApiCode
	message: string
	errors?: Record<string, string>
}

export class ApiException extends Error {
	public baseErrorCode: BaseErrorCode

	constructor(baseErrorCode: BaseErrorCode) {
		super(baseErrorCode.message)
		this.baseErrorCode = baseErrorCode
	}
}

export class NotFoundException extends ApiException {
	constructor(message = 'Resource not found') {
		super({
			code: API_CODE.NOT_FOUND,
			message,
		})
	}
}

export class InvalidException extends ApiException {
	constructor(message = 'Invalid data', errors: Record<string, string> = {}) {
		super({
			code: API_CODE.INVALID,
			message,
			errors,
		})
	}
}

export class UnauthorizedException extends ApiException {
	constructor(message = 'Unauthorized') {
		super({
			code: API_CODE.UNAUTHORIZED,
			message,
		})
	}
}
