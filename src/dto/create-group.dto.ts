import { IsString, IsNumber, MinLength, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({ description: 'Group name', example: 'Group A' })
  @IsString()
  @MinLength(2)
  nombre: string;

  @ApiProperty({ description: 'Group code', example: 'GRP-A-2024', uniqueItems: true })
  @IsString()
  @MinLength(2)
  codigo: string;

  @ApiProperty({ description: 'Semester number', example: 1, minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  semestre: number;

  @ApiProperty({ description: 'Year', example: 2024 })
  @IsNumber()
  @Min(2020)
  @Max(2100)
  año: number;
}
