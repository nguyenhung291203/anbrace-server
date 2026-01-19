import { API_CODE, ApiCode } from '../constants/api-code.constant'

export class ApiResponse<T> {
	code: ApiCode
	message: string
	result: T

	private constructor(code: ApiCode, message: string, result: T) {
		this.code = code
		this.message = message
		this.result = result
	}

	static success<T>(result: T, message = 'Success'): ApiResponse<T> {
		return new ApiResponse(API_CODE.SUCCESS, message, result)
	}

	static successMessage(message = 'Success'): ApiResponse<undefined> {
		return new ApiResponse(API_CODE.SUCCESS, message, undefined)
	}

	static notFound(message = 'Not Found'): ApiResponse<undefined> {
		return new ApiResponse(API_CODE.NOT_FOUND, message, undefined)
	}

	static badRequest(message = 'Bad Request'): ApiResponse<undefined> {
		return new ApiResponse(API_CODE.BAD_REQUEST, message, undefined)
	}

	static unauthorized(message = 'Unauthorized'): ApiResponse<undefined> {
		return new ApiResponse(API_CODE.UNAUTHORIZED, message, undefined)
	}

	static forbidden(message = 'Forbidden'): ApiResponse<undefined> {
		return new ApiResponse(API_CODE.FORBIDDEN, message, undefined)
	}

	static internalError(message = 'Internal Server Error'): ApiResponse<undefined> {
		return new ApiResponse(API_CODE.INTERNAL_ERROR, message, undefined)
	}
}
