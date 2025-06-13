import { Module } from '@nestjs/common';
import { JwtModule } from 'src/providers/jwt/jwt.module';
import { StatusController } from './stats.controller';
import { StatusService } from './stats.service';

@Module({
  imports: [JwtModule],
  controllers: [StatusController],
  providers: [StatusService],
})
export class StatsModule {}
