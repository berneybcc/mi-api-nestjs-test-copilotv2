import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollGroupDto {
  @ApiProperty({ description: 'Group ID to enroll in' })
  @IsNumber()
  @IsNotEmpty()
  groupId: number;
}
