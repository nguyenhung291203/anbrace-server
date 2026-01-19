import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from './shared/shared.module'
import { CategoryModule } from './features/category/category.module'
import { AuthModule } from './features/auth/auth.module'
import { ProductModule } from './features/product/product.module'
import { CartModule } from './features/cart/cart.module'

const features = [CategoryModule, ProductModule, AuthModule, CartModule]
@Module({
	imports: [SharedModule, ...features],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
