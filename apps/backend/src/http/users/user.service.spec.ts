import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserAlreadyExistsError } from '../../common/errors/user-already-exists.error';
import { UserNotFoundError } from '../../common/errors/user-not-found.error';
import { PrismaService } from '../../providers/database/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { GetCurrentUserPresenter } from './presenters/get-current-user.presenter';
import { GetUsersPaginationPresenter } from './presenters/get-users-pagination.presenter';
import { UserService } from './user.service';

describe('user.service', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
      ],
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getCurrentUser', () => {
    it('Should return the user by id', async () => {
      const user = await prismaService.user.create({
        data: {
          name: 'John Doe',
          email: 'johndoe@email.com',
          passwordHash: 'hashedpassword',
          role: Role.USER,
        },
      });

      const result = await service.getCurrentUser(user.id);

      expect(result).toBeInstanceOf(GetCurrentUserPresenter);
      expect(result.id).toEqual(user.id);
      expect(result.name).toEqual(user.name);
      expect(result.email).toEqual(user.email);
      expect(result.role).toEqual(user.role);
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('Should throw an error if user not found', async () => {
      await expect(service.getCurrentUser('user-not-found-id')).rejects.toThrow(
        Error('User not found'),
      );
    });
  });

  describe('getUsers', () => {
    const usersArray = [
      {
        name: 'Alice',
        email: 'alice@email.com',
        passwordHash: 'hashedpassword1',
        role: Role.USER,
      },
      {
        name: 'John Doe',
        email: 'johndoe@email.com',
        passwordHash: 'hashedpassword2',
        role: Role.USER,
      },
      {
        name: 'Admin',
        email: 'admin@email.com',
        passwordHash: 'hashedpassword3',
        role: Role.ADMIN,
      },
    ];

    it('Should return a list of users with pagination', async () => {
      await prismaService.user.createMany({
        data: usersArray,
      });

      const result = await service.getUsers({});

      expect(result).toBeInstanceOf(GetUsersPaginationPresenter);
      expect(result.total).toEqual(usersArray.length);
      expect(result.users.length).toEqual(usersArray.length);
    });

    it('Should return a list of users sort by name', async () => {
      await prismaService.user.createMany({
        data: usersArray,
      });

      const result = await service.getUsers({
        name: 'Ali',
      });

      expect(result.total).toBe(1);
      expect(result.users.length).toBe(1);
      expect(result.users.every((user) => user.name.includes('Ali'))).toBe(
        true,
      );
    });

    it('Should return a list of users sort by email', async () => {
      await prismaService.user.createMany({
        data: usersArray,
      });

      const result = await service.getUsers({
        email: 'alice',
      });

      expect(result.total).toBe(1);
      expect(result.users.length).toBe(1);
      expect(result.users.every((user) => user.email.includes('ali'))).toBe(
        true,
      );
    });

    it('Should return a list of users sort by role', async () => {
      await prismaService.user.createMany({
        data: usersArray,
      });

      let result = await service.getUsers({
        role: [Role.USER],
      });

      expect(result.total).toBe(2);
      expect(result.users.length).toBe(2);
      expect(result.users.every((user) => user.role === Role.USER)).toBe(true);

      result = await service.getUsers({
        role: [Role.ADMIN],
      });

      expect(result.total).toBe(1);
      expect(result.users.length).toBe(1);
      expect(result.users.every((user) => user.role === Role.ADMIN)).toBe(true);

      result = await service.getUsers({
        role: [Role.ADMIN, Role.USER],
      });

      expect(result.total).toBe(3);
      expect(result.users.length).toBe(3);
    });
  });

  describe('createUser', () => {
    it('Should successfully create a user', async () => {
      const dto: CreateUserDTO = {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'password123',
        role: Role.USER,
      };

      await service.createUser(dto);

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
      const dto: CreateUserDTO = {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'password123',
        role: Role.USER,
      };

      await service.createUser(dto);

      await expect(service.createUser(dto)).rejects.toThrow(
        UserAlreadyExistsError,
      );
    });
  });

  describe('updateUser', () => {
    it('Should successfully update a user', async () => {
      const user = await prismaService.user.create({
        data: {
          name: 'John Doe',
          email: 'johndoe@email.com',
          passwordHash: 'password123',
          role: Role.USER,
        },
      });

      await service.updateUser(user.id, {
        name: 'Alice',
        email: 'alice@email.com',
        role: Role.ADMIN,
      });

      const updatedUser = await prismaService.user.findUnique({
        where: { id: user.id },
      });

      expect(updatedUser).toBeDefined();
      expect(updatedUser!.name).toBe('Alice');
      expect(updatedUser!.email).toBe('alice@email.com');
    });

    it('Should throw if user not found', async () => {
      await expect(
        service.updateUser('user-id-not-found', {
          name: 'Alice',
          email: 'alice@email.com',
          role: Role.ADMIN,
        }),
      ).rejects.toThrow(UserNotFoundError);
    });
  });

  describe('deleteUser', () => {
    it('Should successfully delete a user', async () => {
      const user = await prismaService.user.create({
        data: {
          name: 'John Doe',
          email: 'johndoe@email.com',
          passwordHash: 'hashedpassword',
          role: Role.USER,
        },
      });

      await service.deleteUser(user.id);

      await expect(
        prismaService.user.findUnique({ where: { id: user.id } }),
      ).resolves.toBeNull();
    });

    it('Should throw if user not found', async () => {
      await expect(service.deleteUser('user-id-not-found')).rejects.toThrow(
        UserNotFoundError,
      );
    });
  });
});
