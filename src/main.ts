import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { HandlerExceptionFilter } from './shared/filters/api-exception.filter'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.enableCors({
		origin: ['http://localhost:5173'],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	})
	app.useGlobalFilters(new HandlerExceptionFilter())

	await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
