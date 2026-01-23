import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import { HashingService } from './services/hashing.service'
import { TokenService } from './services/token.service'
import { JwtModule } from '@nestjs/jwt'
import { AccessTokenGuard } from './guards/acces-token.guard'
import { APIKeyGuard } from './guards/api-key.guard'
import { AuthenticationGuard } from './guards/authentication.guard'
import { UploadService } from './services/upload.service'

const shared = [
	PrismaService,
	HashingService,
	TokenService,
	AccessTokenGuard,
	APIKeyGuard,
	AuthenticationGuard,
	UploadService,
]
@Global()
@Module({
	imports: [JwtModule],
	providers: shared,
	exports: shared,
})
export class SharedModule {}
