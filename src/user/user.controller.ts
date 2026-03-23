import { Controller, Get, Param, Query, Post, Body, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import type { User } from './user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('test')
  test(): string[] {
    return this.userService.test();
  }

  @Get()
  getAllUsers(): User[] {
    return this.userService.findAll();
  }

  @Get(':id')
  // แก้ไข: ระบุ Return Type เป็น Partial<User> หรือ any (ถ้ามีการ filter fields)
  // และระบุให้ชัดเจนว่า method นี้คืนค่าอะไร
  getUserById(
    @Param('id') id: string,
    @Query('fields') fieldsString?: string,
  ): Partial<User> | User {
    const fields = fieldsString ? fieldsString.split(',') : undefined;
    return this.userService.findOne(id, fields);
  }

  @Post()
  // แก้ไข: ระบุ Return Type เป็น User เพื่อให้ตรงกับที่ Service ส่งกลับมา
  createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto): User {
    return this.userService.create(createUserDto);
  }
}
