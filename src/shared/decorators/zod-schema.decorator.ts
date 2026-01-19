import { Body, Param, Query } from '@nestjs/common'
import { ZodType } from 'zod'

import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

export const ZodBody = (schema: ZodType<unknown>) => Body(new ZodValidationPipe(schema))

export const ZodQuery = (schema: ZodType<unknown>) => Query(new ZodValidationPipe(schema))

export const ZodParam = (schema: ZodType<unknown>) => Param(new ZodValidationPipe(schema))
