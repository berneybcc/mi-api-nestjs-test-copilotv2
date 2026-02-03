import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGradeDto {
  @ApiProperty({ description: 'Grade value', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(20)
  value?: number;

  @ApiProperty({ description: 'Assessment type', required: false })
  @IsString()
  @IsOptional()
  assessmentType?: string;

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
