import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('test')
  test(): string[] {
    return this.userService.test();
  }

  @Get() // จัดการคำขอแบบ GET /users
  getAllUsers(): User[] {
    return this.userService.findAll();
  }
}
