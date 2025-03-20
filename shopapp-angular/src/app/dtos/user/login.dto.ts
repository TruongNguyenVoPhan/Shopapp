import {
    IsString,
    IsNotEmpty,
    IsPhoneNumber,
    IsDate,
} from 'class-validator';
export class LoginDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone_number: string;

  role_id: number;
  constructor(data: any) {
    this.password = data.password;
    this.phone_number = data.phoneNumber;
    this.role_id = data.role_id;
  }
} 