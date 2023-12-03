import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @ApiProperty({ example: 'john@doe.com', required: true })
  email: string;

  @MinLength(10)
  @ApiProperty({ required: true })
  password: string;
}
