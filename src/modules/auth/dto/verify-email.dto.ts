import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Length,
} from 'class-validator';

export class SendVerificationDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address for registration',
  })
  @IsEmail()
  email: string;
}

export class VerifyEmailDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'OTP code (6 digits)',
  })
  @IsString()
  @Length(6, 6)
  code: string;
}
