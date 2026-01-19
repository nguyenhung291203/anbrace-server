export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc',
}

export class PaginationRequest {
	pageNo?: number = 1
	pageSize?: number = 10
	orders?: Record<string, SortOrder> = {}
}

export class PaginationResponse<T> {
	items: T[]
	pageNo: number
	pageSize: number
	totalRecords: number
	totalPages: number

	constructor(items: T[], pageNo: number, pageSize: number, totalRecords: number) {
		this.items = items
		this.pageNo = pageNo
		this.pageSize = pageSize
		this.totalRecords = totalRecords
		this.totalPages = Math.ceil(totalRecords / pageSize)
	}
}
