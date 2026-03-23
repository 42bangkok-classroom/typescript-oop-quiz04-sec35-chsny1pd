import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
  private readonly filePath = path.resolve(process.cwd(), 'data/users.json');
  test(): string[] {
    return [];
  }

  // สร้าง method findAll() เพื่ออ่านข้อมูลจากไฟล์
  findAll(): User[] {
    // กำหนด path ของไฟล์ (ย้อนกลับไปที่ root folder แล้วเข้าหา data/users.json)
    const filePath = path.resolve(process.cwd(), 'data/users.json');
    
    // อ่านไฟล์แบบ Sync
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // แปลง JSON string เป็น JavaScript Object (Array of IUser)
    const users: User[] = JSON.parse(fileContent);
    
    return users;
  }
  findOne(id: string, fields?: string[]): Partial<User> {
    const users = this.findAll();
    const user = users.find((u) => u.id === id);

    // 1. ถ้าไม่พบ user ให้ throw error 404
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. ถ้าไม่ได้ระบุ fields ให้ส่งคืน user ทั้งหมด
    if (!fields || fields.length === 0) {
      return user;
    }

    // 3. ถ้าระบุ fields ให้เลือกเฉพาะ key ที่ต้องการ
    const filteredUser = {};
    fields.forEach((field) => {
      if (user[field] !== undefined) {
        filteredUser[field] = user[field];
      }
    });

    return filteredUser;
  }

  create(dto: CreateUserDto): User {
    const users = this.findAll();

    // 1. Generate ID ใหม่ (เอา ID ตัวสุดท้าย + 1)
    const lastId = users.length > 0 ? Math.max(...users.map(u => parseInt(u.id))) : 0;
    const newId = (lastId + 1).toString();

    // 2. สร้าง User Object ใหม่
    const newUser: User = {
      id: newId,
      ...dto,
    };

    // 3. เพิ่มเข้า Array และเขียนลงไฟล์
    users.push(newUser);
    fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2), 'utf8');

    return newUser;
  }
}
