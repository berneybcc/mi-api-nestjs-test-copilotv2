import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Subject } from './subject.entity';
import { Enrollment } from './enrollment.entity';

@Entity('groups')
export class Group {
  @ApiProperty({ description: 'Group ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Group name' })
  @Column()
  nombre: string;

  @ApiProperty({ description: 'Group code', uniqueItems: true })
  @Column({ unique: true })
  codigo: string;

  @ApiProperty({ description: 'Semester number' })
  @Column()
  semestre: number;

  @ApiProperty({ description: 'Year' })
  @Column()
  año: number;

  @ApiProperty({ description: 'Subject ID' })
  @Column()
  subjectId: number;

  @ManyToOne(() => Subject, (subject) => subject.groups)
  @JoinColumn({ name: 'subjectId' })
  subject: Subject;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.group)
  enrollments: Enrollment[];

  @ApiProperty({ description: 'Maximum number of students' })
  @Column({ default: 30 })
  maxStudents: number;

  @ApiProperty({ description: 'Is group active' })
  @Column({ default: true })
  activo: boolean;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn()
  fechaCreacion: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn()
  fechaActualizacion: Date;
}
