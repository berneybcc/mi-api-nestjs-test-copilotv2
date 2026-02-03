import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Enrollment } from './enrollment.entity';
import { CreditTransaction } from './credit-transaction.entity';

@Entity('students')
export class Student {
  @ApiProperty({ description: 'Student ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'User ID reference' })
  @Column()
  userId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: 'First name' })
  @Column()
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  @Column()
  lastName: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({ description: 'Student ID/enrollment number' })
  @Column({ unique: true })
  studentId: string;

  @ApiProperty({ description: 'Available credits' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  availableCredits: number;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @OneToMany(() => CreditTransaction, (transaction) => transaction.student)
  creditTransactions: CreditTransaction[];

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn()
  updatedAt: Date;
}
