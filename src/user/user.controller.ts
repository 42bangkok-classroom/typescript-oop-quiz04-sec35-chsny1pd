import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ข้อ 2
  @Get('test')
  test(): User[] {
    return this.userService.test();
  }

  // ข้อ 3
  @Get()
  findAll(): User[] {
    return this.userService.findAll();
  }

  // ข้อ 4
  @Get(':id')
  findOne(@Param('id') id: string, @Query('fields') fields?: string) {
    const fieldArray = fields ? fields.split(',') : undefined;
    return this.userService.findOne(id, fieldArray);
  }

  // ข้อ 5
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
