import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTeacherToGroupDto {
  @ApiProperty({ description: 'Teacher ID', example: 1 })
  @IsNumber()
  profesorId: number;

  @ApiProperty({ description: 'Group ID', example: 1 })
  @IsNumber()
  grupoId: number;

  @ApiProperty({ description: 'Subject ID', example: 1 })
  @IsNumber()
  materiaId: number;
}
