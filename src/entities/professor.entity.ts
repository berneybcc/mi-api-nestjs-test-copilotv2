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
import { Subject } from './subject.entity';

@Entity('professors')
export class Professor {
  @ApiProperty({ description: 'Professor ID' })
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

  @ApiProperty({ description: 'Professor specialty/department' })
  @Column()
  specialty: string;

  @ApiProperty({ description: 'Employee ID', required: false })
  @Column({ nullable: true, unique: true })
  employeeId: string;

  @OneToMany(() => Subject, (subject) => subject.professor)
  subjects: Subject[];

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn()
  updatedAt: Date;
}
