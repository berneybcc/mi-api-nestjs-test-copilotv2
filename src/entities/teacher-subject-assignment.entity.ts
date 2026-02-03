import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Teacher } from './teacher.entity';
import { Subject } from './subject.entity';

@Entity('teacher_subject_assignments')
export class TeacherSubjectAssignment {
  @ApiProperty({ description: 'Assignment ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Teacher ID' })
  @Column()
  profesorId: number;

  @ApiProperty({ description: 'Subject ID' })
  @Column()
  materiaId: number;

  @ApiProperty({ description: 'Assignment date' })
  @CreateDateColumn()
  fechaAsignacion: Date;

  @ApiProperty({ description: 'Is assignment active' })
  @Column({ default: true })
  activa: boolean;

  @ApiProperty({ type: () => Teacher })
  @ManyToOne(() => Teacher, { eager: true })
  @JoinColumn({ name: 'profesorId' })
  profesor: Teacher;

  @ApiProperty({ type: () => Subject })
  @ManyToOne(() => Subject, { eager: true })
  @JoinColumn({ name: 'materiaId' })
  materia: Subject;
}
