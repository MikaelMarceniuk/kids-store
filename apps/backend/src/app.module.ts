import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './http/auth/auth.module';
import { StatsModule } from './http/stats/stats.module';
import { UserModule } from './http/users/user.module';
import { PrismaModule } from './providers/database/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '/.env',
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    StatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
