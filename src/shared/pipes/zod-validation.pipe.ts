import { PipeTransform, BadRequestException } from '@nestjs/common'
import { ZodError, ZodType } from 'zod'
import { InvalidException } from '../exceptions/api.exception'

export class ZodValidationPipe<T> implements PipeTransform {
	constructor(private schema: ZodType<T>) {}

	transform(value: unknown) {
		try {
			return this.schema.parse(value)
		} catch (err) {
			if (err instanceof ZodError) {
				const flattened = err.flatten()
				const errors: Record<string, string> = Object.fromEntries(
					Object.entries(flattened.fieldErrors).map(([key, val]) => [key, val?.[0] ?? '']),
				)

				throw new InvalidException('Invalid data', errors)
			}

			throw new BadRequestException('Validation failed')
		}
	}
}
