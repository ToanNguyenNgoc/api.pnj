import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ default: 'super_admin@gmail.com' })
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty({ default: '111111' })
  readonly password: string;
}
export class RegisterProfileDTO {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  fullname: string;

  @ApiProperty()
  @IsOptional()
  telephone: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  gender: boolean;
}

export class UpdateProfileDTO {
  @ApiProperty()
  @IsOptional()
  fullname: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  telephone: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  gender: boolean;

  @ApiProperty()
  @IsOptional()
  media_id: number;
}

export class ChangePasswordDTO {
  @ApiProperty()
  password: string;

  @ApiProperty()
  new_password: string;
}
export class VerificationRegisterDTO {
  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  recaptcha: string;
}
export class ResendMailVerificationDTO {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  recaptcha: string;
}
