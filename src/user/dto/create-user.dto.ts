import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  email?: any;     // 🔥 เอา validator ออก

  @IsOptional()
  username?: any;  // 🔥 เอา validator ออก
}