import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
  private readonly filePath = path.resolve(process.cwd(), 'data/users.json');
  test(): string[] {
    return []; // โจทย์ต้องการ empty array แบบนี้ครับ []
  }

  findAll(): User[] {
    const fileContent = fs.readFileSync(this.filePath, 'utf8');
    // จุดที่ 1: ใช้ Type Assertion 'as User[]' เพื่อบอก TypeScript ว่าข้อมูลที่ parse มาคือ Array ของ User
    const users = JSON.parse(fileContent) as User[];
    return users;
  }

  findOne(id: string, fields?: string[]): Partial<User> {
    const users = this.findAll();
    const user = users.find((u) => u.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!fields || fields.length === 0) {
      return user;
    }

    // จุดที่ 2: ระบุ Type ให้ filteredUser เป็น Partial<User> หรือ Record
    // และใช้ Type Casting (user as any)[field] เพื่อให้เข้าถึง key ด้วย string ได้โดยไม่ติด error
    const filteredUser: Partial<User> = {};
    fields.forEach((field) => {
      if ((user as any)[field] !== undefined) {
        (filteredUser as any)[field] = (user as any)[field];
      }
    });

    return filteredUser;
  }

  create(dto: CreateUserDto): User {
    const users = this.findAll();

    // จุดที่ 3: ระบุ Type ให้ parameter 'u' ใน map และใส่ radix '10' ให้ parseInt
    const lastId =
      users.length > 0
        ? Math.max(...users.map((u: User) => parseInt(u.id, 10)))
        : 0;

    const newId = (lastId + 1).toString();

    const newUser: User = {
      id: newId,
      ...dto,
    };

    users.push(newUser);
    fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2), 'utf8');

    return newUser;
  }
}
