import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from './shared/shared.module'
import { CategoryModule } from './features/category/category.module'
import { AuthModule } from './features/auth/auth.module'
import { ProductModule } from './features/product/product.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

const features = [CategoryModule, ProductModule, AuthModule]
@Module({
	imports: [
		SharedModule,
		...features,
		ServeStaticModule.forRoot({
			rootPath: join(process.cwd(), 'uploads'),
			serveRoot: '/api/v1/uploads',
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
