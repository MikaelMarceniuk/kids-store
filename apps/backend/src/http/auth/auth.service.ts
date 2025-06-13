import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { BaseError } from 'src/common/bases/error.base';
import { UserNotFoundError } from 'src/common/errors/user-not-found.error';
import { PrismaService } from 'src/providers/database/prisma.service';
import { AuthenticateDTO } from './dto/authenticate.dto';
import { RegisterDTO } from './dto/register.dto';

import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { InvalidCredentialsError } from 'src/common/errors/invalid-credentials.error';
import { JwtService } from 'src/providers/jwt/jwt.service';
import { RefreshTokenService } from 'src/providers/refresh-token/refresh-token.service';
import { SessionService } from 'src/providers/session/session.service';
import { UserService } from '../users/user.service';
import { AuthenticatePresenter } from './presenters/authenticate.presenter';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
  ) {}

  async authenticate({
    email,
    password,
  }: AuthenticateDTO): Promise<AuthenticatePresenter> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (!user) throw new UserNotFoundError();

      const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordMatch) {
        throw new InvalidCredentialsError();
      }

      const { accessToken, refreshToken, refreshTokenExpirationDate } =
        await this.createRefreshAndAccessToken(user);

      return new AuthenticatePresenter({
        accessToken,
        refreshToken,
        refreshTokenExpirationDate,
      });
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to authenticate user');
    }
  }

  async register(data: RegisterDTO): Promise<void> {
    await this.userService.createUser({ ...data, role: 'USER' });
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<AuthenticatePresenter> {
    const session =
      await this.sessionService.checkIfRefreshTokenIsValid(refreshToken);

    const {
      accessToken,
      refreshToken: newRefreshToken,
      refreshTokenExpirationDate,
    } = await this.createRefreshAndAccessToken(session.user);

    return new AuthenticatePresenter({
      accessToken,
      refreshToken: newRefreshToken,
      refreshTokenExpirationDate,
    });
  }

  async logout(refreshToken: string): Promise<void> {
    await this.sessionService.deleteSessionByToken(refreshToken);
  }

  private async createRefreshAndAccessToken(user: User) {
    const accessToken = await this.jwtService.signJwt({
      id: user.id,
      email: user.email,
    });

    const { refreshToken, refreshTokenExpirationDate } =
      await this.refreshTokenService.create(user.id);

    return {
      accessToken,
      refreshToken,
      refreshTokenExpirationDate,
    };
  }
}
