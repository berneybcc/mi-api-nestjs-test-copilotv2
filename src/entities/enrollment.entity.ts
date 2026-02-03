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
import { Student } from './student.entity';
import { Group } from './group.entity';
import { Grade } from './grade.entity';

export enum EnrollmentStatus {
  ACTIVE = 'active',
  WITHDRAWN = 'withdrawn',
  COMPLETED = 'completed',
}

@Entity('enrollments')
export class Enrollment {
  @ApiProperty({ description: 'Enrollment ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Student ID' })
  @Column()
  studentId: number;

  @ManyToOne(() => Student, (student) => student.enrollments)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ApiProperty({ description: 'Group ID' })
  @Column()
  groupId: number;

  @ManyToOne(() => Group, (group) => group.enrollments)
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @ApiProperty({ description: 'Enrollment status', enum: EnrollmentStatus })
  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ACTIVE,
  })
  status: EnrollmentStatus;

  @ApiProperty({ description: 'Credits used for this enrollment' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  creditsUsed: number;

  @ApiProperty({ description: 'Enrollment date' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  enrollmentDate: Date;

  @ApiProperty({ description: 'Withdrawal date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  withdrawalDate: Date;

  @OneToMany(() => Grade, (grade) => grade.enrollment)
  grades: Grade[];

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn()
  updatedAt: Date;
}
