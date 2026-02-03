import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from './student.entity';

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
  REFUND = 'refund',
}

@Entity('credit_transactions')
export class CreditTransaction {
  @ApiProperty({ description: 'Transaction ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Student ID' })
  @Column()
  studentId: number;

  @ManyToOne(() => Student, (student) => student.creditTransactions)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ApiProperty({ description: 'Transaction type', enum: TransactionType })
  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @ApiProperty({ description: 'Amount of credits' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'Balance after transaction' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  balanceAfter: number;

  @ApiProperty({ description: 'Transaction description' })
  @Column()
  description: string;

  @ApiProperty({ description: 'Reference to enrollment if applicable', required: false })
  @Column({ nullable: true })
  enrollmentId: number;

  @ApiProperty({ description: 'Reference to admin user who made transaction', required: false })
  @Column({ nullable: true })
  createdBy: number;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn()
  createdAt: Date;
}
