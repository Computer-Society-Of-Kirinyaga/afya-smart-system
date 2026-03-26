import { IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsPhoneNumber()
  phone_number: string;

  @IsString()
  @MinLength(6)
  password: string;
}
