import { Module } from '@nestjs/common';
import { JwtModule } from 'src/providers/jwt/jwt.module';
import { RefreshTokenService } from 'src/providers/refresh-token/refresh-token.service';
import { SessionService } from 'src/providers/session/session.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenService, SessionService],
})
export class AuthModule {}
