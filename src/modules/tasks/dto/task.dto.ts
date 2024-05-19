import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;

  @IsOptional()
  userId?: string;
}

export class updateTaskDto {
  @IsString()
  @IsOptional()
  @MinLength(4)
  readonly title: string;

  @IsNotEmpty()
  @IsOptional()
  readonly description: string;

  @IsOptional()
  @IsEnum(['pending', 'inProgress', 'completed'])
  status: 'pending' | 'inProgress' | 'completed';
}
