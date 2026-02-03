import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({ description: 'Teacher first name', example: 'John' })
  @IsString()
  @MinLength(2)
  nombre: string;

  @ApiProperty({ description: 'Teacher last name', example: 'Doe' })
  @IsString()
  @MinLength(2)
  apellido: string;

  @ApiProperty({ description: 'Teacher email', example: 'john.doe@university.edu' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Teacher phone', example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ description: 'Teacher specialty', example: 'Mathematics' })
  @IsString()
  @MinLength(2)
  especialidad: string;
}
