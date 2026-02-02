import { IsString, IsNumber, IsOptional, MinLength, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty({ description: 'Subject name', example: 'Mathematics' })
  @IsString()
  @MinLength(2)
  nombre: string;

  @ApiProperty({ description: 'Subject code', example: 'MATH101', uniqueItems: true })
  @IsString()
  @MinLength(2)
  codigo: string;

  @ApiProperty({ description: 'Number of credits', example: 4, minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  creditos: number;

  @ApiProperty({
    description: 'Subject description',
    example: 'Introduction to Calculus',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
