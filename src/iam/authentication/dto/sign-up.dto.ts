import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required.' })
  @ApiProperty({ example: 'john@doe.com', required: true })
  email: string;

  @ApiProperty({ example: 'John', required: true })
  @IsNotEmpty({ message: 'First name is required.' })
  firstName: string;

  @ApiProperty({ example: 'Doe', required: true })
  @IsNotEmpty({ message: 'Last name is required.' })
  lastName: string;

  @ApiProperty({ required: true, minLength: 12 })
  @MinLength(12)
  @IsNotEmpty({ message: 'Password must be at least 12 characters long.' })
  password: string;

  @ApiProperty({ example: '+1 222 222 222', required: true })
  @IsNotEmpty({ message: 'Phone number is required.' })
  phone: string;
}
