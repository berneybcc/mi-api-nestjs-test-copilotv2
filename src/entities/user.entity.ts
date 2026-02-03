import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export enum UserRole {
  ADMIN = 'admin',
  PROFESSOR = 'professor',
  STUDENT = 'student',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'User ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Email address', uniqueItems: true })
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @ApiProperty({ description: 'Is user active' })
  @Column({ default: true })
  active: boolean;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn()
  updatedAt: Date;
}
