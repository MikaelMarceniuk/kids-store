import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from 'generated/prisma';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getCurrentUser(@CurrentUser() user: User) {
    return await this.userService.getCurrentUser(user.id);
  }
}
