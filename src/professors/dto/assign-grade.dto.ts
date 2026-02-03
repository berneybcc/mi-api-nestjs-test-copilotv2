import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignGradeDto {
  @ApiProperty({ description: 'Enrollment ID' })
  @IsNumber()
  @IsNotEmpty()
  enrollmentId: number;

  @ApiProperty({ description: 'Grade value' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(20)
  value: number;

  @ApiProperty({ description: 'Assessment type (e.g., Exam, Quiz, Project)' })
  @IsString()
  @IsNotEmpty()
  assessmentType: string;

  @ApiProperty({ description: 'Assessment description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Weight/percentage', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  weight?: number;

  @ApiProperty({ description: 'Comments', required: false })
  @IsString()
  @IsOptional()
  comments?: string;
}
