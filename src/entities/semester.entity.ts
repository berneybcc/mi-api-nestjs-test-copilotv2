import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('semesters')
export class Semester {
  @ApiProperty({ description: 'Semester ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Semester name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Semester code', uniqueItems: true })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ description: 'Year' })
  @Column()
  year: number;

  @ApiProperty({ description: 'Semester period (1 or 2)' })
  @Column()
  period: number;

  @ApiProperty({ description: 'Start date' })
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty({ description: 'End date' })
  @Column({ type: 'date' })
  endDate: Date;

  @ApiProperty({ description: 'Is current semester' })
  @Column({ default: false })
  isCurrent: boolean;

  @ApiProperty({ description: 'Is semester active' })
  @Column({ default: true })
  active: boolean;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn()
  updatedAt: Date;
}
