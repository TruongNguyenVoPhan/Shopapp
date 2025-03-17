import {
    IsString,
    IsNotEmpty,
    IsPhoneNumber,
    IsDate,
} from 'class-validator';
export class RegisterDto {
    @IsString()
  address: string;

  @IsDate()
  date_of_birth: Date;

  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  retype_password: string;

  google_account_id: string;
  facebook_account_id: string;
  role_id: number = 2;
  constructor(data: any) {
    this.address = data.address;
    this.date_of_birth = new Date(data.dateOfBirth);
    this.facebook_account_id = data.facebook_account_id;
    this.fullname = data.fullName;
    this.google_account_id = data.google_account_id;
    this.password = data.password;
    this.phone_number = data.phoneNumber;
    this.retype_password = data.retypePassword;
    this.role_id = data.role || 2;
  }
} 