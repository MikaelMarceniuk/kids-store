import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { CreateUserDTO } from './dto/create-user.dto';
import { GetUsersDTO } from './dto/get-users.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getCurrentUser(@CurrentUser() user: User) {
    return await this.userService.getCurrentUser(user.id);
  }

  @UseGuards(RoleGuard(['ADMIN', 'USER']))
  @UseGuards(JwtGuard)
  @Get()
  async getUsers(@Query() query: GetUsersDTO) {
    return await this.userService.getUsers(query);
  }

  @UseGuards(RoleGuard(['ADMIN', 'USER']))
  @UseGuards(JwtGuard)
  @Get(':id')
  async getUserDetails(@Param('id') id: string) {
    return await this.userService.getUserDetails(id);
  }

  @UseGuards(RoleGuard(['ADMIN']))
  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() body: CreateUserDTO) {
    return await this.userService.createUser(body);
  }

  @UseGuards(RoleGuard(['ADMIN', 'USER']))
  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    return await this.userService.updateUser(id, body);
  }

  @UseGuards(RoleGuard(['ADMIN']))
  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
