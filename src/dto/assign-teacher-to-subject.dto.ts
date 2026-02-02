import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTeacherToSubjectDto {
  @ApiProperty({ description: 'Teacher ID', example: 1 })
  @IsNumber()
  profesorId: number;

  @ApiProperty({ description: 'Subject ID', example: 1 })
  @IsNumber()
  materiaId: number;
}
