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
