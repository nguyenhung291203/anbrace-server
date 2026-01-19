import { z } from 'zod'
import { LoginReqSchema, RegisterReqSchema } from './auth.schema'

export type RegisterReqDto = z.infer<typeof RegisterReqSchema>

export type LoginReqDto = z.infer<typeof LoginReqSchema>

export class LoginResDto {
	accessToken: string
	refreshToken: string
}
