import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Timilehin',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(3)
  readonly name: string;

  @ApiProperty({
    example: 'test@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'test1234',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}

export class UserDto {}
