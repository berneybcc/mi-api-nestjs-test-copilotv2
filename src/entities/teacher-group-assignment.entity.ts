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
import { Group } from './group.entity';
import { Subject } from './subject.entity';

@Entity('teacher_group_assignments')
export class TeacherGroupAssignment {
  @ApiProperty({ description: 'Assignment ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Teacher ID' })
  @Column()
  profesorId: number;

  @ApiProperty({ description: 'Group ID' })
  @Column()
  grupoId: number;

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

  @ApiProperty({ type: () => Group })
  @ManyToOne(() => Group, { eager: true })
  @JoinColumn({ name: 'grupoId' })
  grupo: Group;

  @ApiProperty({ type: () => Subject })
  @ManyToOne(() => Subject, { eager: true })
  @JoinColumn({ name: 'materiaId' })
  materia: Subject;
}
