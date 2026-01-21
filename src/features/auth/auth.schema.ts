import { z } from 'zod'
import { GenderEnum } from './auth.types'

export const RegisterReqSchema = z
	.object({
		email: z.string().email('Email không hợp lệ').max(255),

		fullName: z.string().min(1, 'Họ tên không được để trống').max(100),

		phoneNumber: z.string().max(20).optional(),

		gender: z.nativeEnum(GenderEnum).optional(),

		password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').max(255),

		confirmPassword: z.string().min(6).max(255),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Mật khẩu xác nhận không khớp',
		path: ['confirmPassword'],
	})

export const LoginReqSchema = z.object({
	email: z.string().email().max(255),
	password: z.string().min(6).max(255),
})
