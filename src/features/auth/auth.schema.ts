import { z } from 'zod'

export const RegisterReqSchema = z.object({
	email: z.string().email().max(255),
	fullName: z.string().min(1).max(100),
	password: z.string().min(6).max(255),
})

export const LoginReqSchema = z.object({
	email: z.string().email().max(255),
	password: z.string().min(6).max(255),
})
