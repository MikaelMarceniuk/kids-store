import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../providers/database/prisma.service';
import { JwtService } from '../../providers/jwt/jwt.service';
import { RefreshTokenService } from '../../providers/refresh-token/refresh-token.service';
import { SessionService } from '../../providers/session/session.service';

import { JwtModule } from '@nestjs/jwt';

import { ConfigModule } from '@nestjs/config';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { InvalidCredentialsError } from '../../common/errors/invalid-credentials.error';
import { SessionExpiredOrInvalidError } from '../../common/errors/session-expired-or-invalid.error';
import { UserAlreadyExistsError } from '../../common/errors/user-already-exists.error';
import { UserNotFoundError } from '../../common/errors/user-not-found.error';
import { AuthService } from './auth.service';
import { AuthenticateDTO } from './dto/authenticate.dto';
import { RegisterDTO } from './dto/register.dto';
import { UserService } from '../users/user.service';

describe('auth.service', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [
        AuthService,
        PrismaService,
        JwtService,
        RefreshTokenService,
        SessionService,
        UserService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('authenticate', () => {
    it('Should successfully authenticate a user', async () => {
      const user = await prismaService.user.create({
        data: {
          name: 'John Doe',
          email: 'johndoe@email.com',
          passwordHash: await bcrypt.hash('password123', 10),
          role: Role.USER,
        },
      });

      const dto: AuthenticateDTO = {
        email: user.email,
        password: 'password123',
      };

      const { accessToken, refreshToken } = await service.authenticate(dto);

      // I want to check if the access token and refresh token are not empty
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();

      // Checking if the access token is valid
      const decodedAccessToken = await jwtService.verifyJwt(accessToken);
      expect(decodedAccessToken).toHaveProperty('userId', user.id);

      // Checking if the refresh token is valid
      const dbSession = await prismaService.session.findUnique({
        where: {
          sessionToken: refreshToken,
        },
      });
      expect(dbSession!.sessionToken).toBe(refreshToken);
      expect(dbSession!.userId).toBe(user.id);
    });

    it('Should throw if email not found', async () => {
      await prismaService.user.create({
        data: {
          name: 'John Doe',
          email: 'johndoe@email.com',
          passwordHash: await bcrypt.hash('password123', 10),
          role: Role.USER,
        },
      });

      await expect(
        service.authenticate({
          email: 'teste@email.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UserNotFoundError);
    });

    it('Should throw if password in wrong', async () => {
      await prismaService.user.create({
        data: {
          name: 'John Doe',
          email: 'johndoe@email.com',
          passwordHash: await bcrypt.hash('password123', 10),
          role: Role.USER,
        },
      });

      await expect(
        service.authenticate({
          email: 'johndoe@email.com',
          password: 'teste123',
        }),
      ).rejects.toThrow(InvalidCredentialsError);
    });
  });

  describe('register', () => {
    it('Should successfully create a user', async () => {
      const dto: RegisterDTO = {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'password123',
      };

      await service.register(dto);

      const createdUser = await prismaService.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      const isPasswordMatch = await bcrypt.compare(
        dto.password,
        createdUser!.passwordHash,
      );

      expect(createdUser!.name).toBe(dto.name);
      expect(createdUser!.email).toBe(dto.email);
      expect(isPasswordMatch).toBe(true);
      expect(createdUser!.role).toBe(Role.USER);
    });

    it('Should throw if user email already exists', async () => {
      const dto: RegisterDTO = {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'password123',
      };

      await service.register(dto);

      await expect(service.register(dto)).rejects.toThrow(
        UserAlreadyExistsError,
      );
    });
  });

  describe('refreshAccessToken', () => {
    it('Should successfully refresh access token', async () => {
      const password = 'password123';
      const user = await prismaService.user.create({
        data: {
          name: 'John Doe',
          email: 'johndoe@email.com',
          passwordHash: await bcrypt.hash(password, 10),
          role: Role.USER,
        },
      });

      const { refreshToken } = await service.authenticate({
        email: user.email,
        password,
      });

      const { refreshToken: newRefreshToken } =
        await service.refreshAccessToken(refreshToken);

      const refreshedSession = await prismaService.session.findUnique({
        where: {
          sessionToken: newRefreshToken,
        },
      });

      expect(refreshedSession!.sessionToken).toBe(newRefreshToken);
      expect(refreshedSession!.userId).toBe(user.id);
    });

    it('Should throw if refresh token is invalid', async () => {
      const password = 'password123';
      const user = await prismaService.user.create({
        data: {
          name: 'John Doe',
          email: 'johndoe@email.com',
          passwordHash: await bcrypt.hash(password, 10),
          role: Role.USER,
        },
      });

      await service.authenticate({
        email: user.email,
        password,
      });

      await expect(
        service.refreshAccessToken('invalid-refresh-token'),
      ).rejects.toThrow(SessionExpiredOrInvalidError);
    });

    it('Should throw if refresh token is expired', async () => {
      const password = 'password123';
      const user = await prismaService.user.create({
        data: {
          name: 'John Doe',
          email: 'johndoe@email.com',
          passwordHash: await bcrypt.hash(password, 10),
          role: Role.USER,
        },
      });

      await prismaService.session.create({
        data: {
          userId: user.id,
          sessionToken: 'expired-token',
          expiresAt: new Date(Date.now() - 1000 * 60), // 1min atras,
        },
      });

      await expect(service.refreshAccessToken('expired-token')).rejects.toThrow(
        SessionExpiredOrInvalidError,
      );
    });
  });

  describe('logout', () => {
    it('Should successfully delete session', async () => {
      const password = 'password123';
      const user = await prismaService.user.create({
        data: {
          name: 'John Doe',
          email: 'johndoe@email.com',
          passwordHash: await bcrypt.hash(password, 10),
          role: Role.USER,
        },
      });

      const { refreshToken } = await service.authenticate({
        email: user.email,
        password,
      });

      await service.logout(refreshToken);

      const dbSession = await prismaService.session.findUnique({
        where: {
          sessionToken: refreshToken,
        },
      });

      expect(dbSession).toBeNull();
    });
  });
});
