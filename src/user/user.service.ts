import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private filePath = join(process.cwd(), 'data', 'users.json');

  // ข้อ 2
  test():User[] {
    return [];
  }

  // ข้อ 3
  findAll(): User[] {
    const data = readFileSync(this.filePath, 'utf-8');
    return JSON.parse(data) as User[]; // ✅ แก้ any
  }

  // ข้อ 4
  findOne(id: string, fields?: string[]): Partial<User> {
    const users = this.findAll();
    const user = users.find((u) => u.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!fields || fields.length === 0) {
      return user;
    }

    const result: Partial<User> = {};

    fields.forEach((field) => {
      if (field in user) {
        result[field as keyof User] = user[field as keyof User];
      }
    });

    return result;
  }

  // ข้อ 5
  create(dto: CreateUserDto): User {
    const users = this.findAll();

    const newUser: User = {
      id: (users.length + 1).toString(),
      ...dto,
    };

    users.push(newUser);

    writeFileSync(this.filePath, JSON.stringify(users, null, 2));

    return newUser;
  }
}
