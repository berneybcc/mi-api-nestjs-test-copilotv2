import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Enrollment } from './enrollment.entity';
import { Professor } from './professor.entity';

@Entity('grades')
export class Grade {
  @ApiProperty({ description: 'Grade ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Enrollment ID' })
  @Column()
  enrollmentId: number;

  @ManyToOne(() => Enrollment, (enrollment) => enrollment.grades)
  @JoinColumn({ name: 'enrollmentId' })
  enrollment: Enrollment;

  @ApiProperty({ description: 'Professor ID who assigned the grade' })
  @Column()
  professorId: number;

  @ManyToOne(() => Professor)
  @JoinColumn({ name: 'professorId' })
  professor: Professor;

  @ApiProperty({ description: 'Grade value' })
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  value: number;

  @ApiProperty({ description: 'Assessment type (e.g., Exam, Quiz, Project)' })
  @Column()
  assessmentType: string;

  @ApiProperty({ description: 'Assessment description', required: false })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Weight/percentage of this grade' })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100 })
  weight: number;

  @ApiProperty({ description: 'Comments from professor', required: false })
  @Column({ type: 'text', nullable: true })
  comments: string;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn()
  updatedAt: Date;
}
