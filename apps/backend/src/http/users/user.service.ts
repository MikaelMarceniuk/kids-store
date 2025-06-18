import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseError } from '../../common/bases/error.base';
import { UserAlreadyExistsError } from '../../common/errors/user-already-exists.error';
import { UserNotFoundError } from '../../common/errors/user-not-found.error';
import { hashPassword } from '../../common/utils/hash-password.util';
import { PrismaService } from '../../providers/database/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { GetUsersDTO } from './dto/get-users.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { GetCurrentUserPresenter } from './presenters/get-current-user.presenter';
import { GetUsersPaginationPresenter } from './presenters/get-users-pagination.presenter';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCurrentUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return new GetCurrentUserPresenter(user);
  }

  async getUsers(filters: GetUsersDTO): Promise<GetUsersPaginationPresenter> {
    try {
      const where: Prisma.UserWhereInput = {
        name: filters.name
          ? { contains: filters.name, mode: 'insensitive' }
          : undefined,
        email: filters.email
          ? { contains: filters.email, mode: 'insensitive' }
          : undefined,
        role:
          filters.role && Array.isArray(filters.role)
            ? { in: filters.role }
            : undefined,
      };

      const totalPromise = this.prismaService.user.count({
        where,
      });
      const usersPromise = this.prismaService.user.findMany({
        where,
      });

      const [total, users] = await Promise.all([totalPromise, usersPromise]);

      return new GetUsersPaginationPresenter({ total, users });
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async getUserDetails(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async createUser(newUser: CreateUserDTO) {
    try {
      const userByEmail = await this.prismaService.user.findUnique({
        where: { email: newUser.email },
      });

      if (userByEmail) {
        throw new UserAlreadyExistsError();
      }

      await this.prismaService.user.create({
        data: {
          name: newUser.name,
          email: newUser.email,
          passwordHash: await hashPassword(newUser.password),
          role: newUser.role,
        },
      });
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async updateUser(id: string, updatedUser: UpdateUserDTO) {
    try {
      const dbUser = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!dbUser) {
        throw new UserNotFoundError();
      }

      await this.prismaService.user.update({
        where: { id },
        data: {
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      });
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async deleteUser(id: string) {
    try {
      const dbUser = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!dbUser) {
        throw new UserNotFoundError();
      }

      await this.prismaService.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
