import { Injectable } from '@nestjs/common';
import { SessionExpiredOrInvalidError } from '../../common/errors/session-expired-or-invalid.error';
import { PrismaService } from '../database/prisma.service';
import { CheckIfRefreshTokenIsValidResponse } from './types/check-if-refresh-token-is-valid-response.type';

@Injectable()
export class SessionService {
  constructor(private readonly prismaService: PrismaService) {}

  async checkIfRefreshTokenIsValid(
    refreshToken: string,
  ): Promise<CheckIfRefreshTokenIsValidResponse> {
    const session = await this.prismaService.session.findUnique({
      where: { sessionToken: refreshToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new SessionExpiredOrInvalidError();
    }

    return session;
  }

  async deleteSessionByToken(refreshToken: string): Promise<void> {
    await this.prismaService.session.deleteMany({
      where: { sessionToken: refreshToken },
    });
  }
}
