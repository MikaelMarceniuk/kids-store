import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { BaseError } from 'src/common/errors/base-error.error';
import { UserAlreadyExistsError } from 'src/common/errors/user-already-exists.error';
import { UserNotFoundError } from 'src/common/errors/user-not-found.error';
import { hashPassword } from 'src/common/utils/hash-password.util';
import { PrismaService } from 'src/providers/database/prisma.service';
import { AuthenticateDTO } from './dto/authenticate.dto';
import { RegisterDTO } from './dto/register.dto';

import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma';
import { InvalidCredentialsError } from 'src/common/errors/invalid-credentials.error';
import { JwtService } from 'src/providers/jwt/jwt.service';
import { RefreshTokenService } from 'src/providers/refresh-token/refresh-token.service';
import { SessionService } from 'src/providers/session/session.service';
import { AuthenticatePresenter } from './presenters/authenticate.presenter';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly sessionService: SessionService,
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

  async register({ name, email, password }: RegisterDTO): Promise<void> {
    try {
      const userByEmail = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (userByEmail) {
        throw new UserAlreadyExistsError();
      }

      const passwordHash = await hashPassword(password);

      await this.prismaService.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
      });
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to register user');
    }
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
