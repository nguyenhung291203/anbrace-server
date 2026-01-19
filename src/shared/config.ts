import { plainToInstance, Type } from 'class-transformer'
import { IsNumber, IsString, validateSync } from 'class-validator'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
config({
	path: '.env',
})
if (!fs.existsSync(path.resolve('.env'))) {
	console.warn('.env file is missing!')
	process.exit(1)
}

class ConfigSchema {
	@IsString()
	DATABASE_URL: string

	@IsString()
	SECRET_API_KEY: string

	@IsString()
	ACCESS_TOKEN_SECRET: string

	@IsNumber()
	@Type(() => Number)
	ACCESS_TOKEN_EXPIRES_IN: number

	@IsString()
	REFRESH_TOKEN_SECRET: string

	@IsNumber()
	@Type(() => Number)
	REFRESH_TOKEN_EXPIRES_IN: number

	@IsString()
	NODE_ENV: string

	@IsString()
	PORT: string
}

export const configServer = plainToInstance(ConfigSchema, process.env)
const e = validateSync(configServer)
if (e.length > 0) {
	console.error('error in validating .env file:')
	const errors = e.map((item) => ({
		property: item.property,
		constraints: item.constraints,
		value: item.value,
	}))
	// eslint-disable-next-line @typescript-eslint/only-throw-error
	throw errors
}
