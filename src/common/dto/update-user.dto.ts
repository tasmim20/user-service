// /* eslint-disable @typescript-eslint/no-unsafe-call */
// import { IsEmail, IsOptional, IsString, IsPhoneNumber } from 'class-validator';

// export class UpdateUserDto {
//   @IsOptional()
//   @IsString()
//   firstName?: string;

//   @IsOptional()
//   @IsString()
//   lastName?: string;

//   @IsOptional()
//   @IsEmail()
//   email?: string;

//   @IsOptional()
//   @IsPhoneNumber(undefined) // 'null' allows any country code
//   mobileNumber?: string;

//   @IsOptional()
//   @IsString()
//   password?: string;

//   @IsOptional()
//   @IsString()
//   profilePhoto?: string;

//   @IsOptional()
//   @IsString()
//   bio?: string; // New field for bio

//   @IsOptional()
//   @IsString()
//   address?: string; // New field for address
// }

import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
