import {
    IsString,
    IsNotEmpty,
    IsPhoneNumber,
    IsDate,
} from 'class-validator';
export class loginDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone_number: string;

  constructor(data: any) {
    this.password = data.password;
    this.phone_number = data.phoneNumber;
  }
} 