import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Project Completion',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  readonly title: string;

  @ApiProperty({
    example: 'Project Completion - This project is for completion',
    required: true,
  })
  @IsNotEmpty()
  readonly description: string;

  @IsOptional()
  userId?: string;
}

export class updateTaskDto {
  @ApiPropertyOptional({
    example: 'Project Completion',
  })
  @IsString()
  @IsOptional()
  @MinLength(4)
  readonly title: string;

  @ApiPropertyOptional({
    example: 'Project Completion - This project is for completion',
  })
  @IsOptional()
  readonly description: string;

  @ApiPropertyOptional({
    example: 'completed',
  })
  @IsOptional()
  @IsEnum(['pending', 'inProgress', 'completed'])
  status: 'pending' | 'inProgress' | 'completed';
}
