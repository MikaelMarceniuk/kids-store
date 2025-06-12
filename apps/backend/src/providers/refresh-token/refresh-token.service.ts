import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../database/prisma.service';
import { CreateRefreshTokenPresenter } from './presenters/create-refresh-token.presenter';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string) {
    const refreshToken = randomBytes(64).toString('hex');
    const sevenDaysExpiration = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    await this.prismaService.session.create({
      data: {
        sessionToken: refreshToken,
        expiresAt: sevenDaysExpiration,
        userId,
      },
    });

    return new CreateRefreshTokenPresenter({
      refreshToken,
      refreshTokenExpirationDate: sevenDaysExpiration,
    });
  }
}
