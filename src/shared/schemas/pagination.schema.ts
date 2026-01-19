import { z } from 'zod'

import {
	DEFAULT_PAGE_NO,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	MIN_PAGE_NO,
	MIN_PAGE_SIZE,
} from '../constants/pagination.constant'
import { SortOrder } from '../dtos/pagination.dto'

export const PaginationRequestSchema = z.object({
	pageNo: z.coerce
		.number()
		.min(1, { message: `Số trang phải >= ${MIN_PAGE_NO}` })
		.default(DEFAULT_PAGE_NO),
	pageSize: z.coerce
		.number()
		.min(1, { message: `Số lượng mỗi trang phải >= ${MIN_PAGE_SIZE}` })
		.max(100, { message: `Số lượng mỗi trang không được > ${MAX_PAGE_SIZE}` })
		.default(DEFAULT_PAGE_SIZE),
	orders: z.record(z.string(), z.enum([SortOrder.ASC, SortOrder.DESC])).optional(),
})

export type PaginationRequestDto = z.infer<typeof PaginationRequestSchema>
