import { Injectable } from '@nestjs/common';
import { User } from './user.interface';

@Injectable()
export class UserService {
 private users: User[] = [];
  test(): string[] {
    return [];
  }
  findAll(): User[] { 
    return this.users; 
  }
}
