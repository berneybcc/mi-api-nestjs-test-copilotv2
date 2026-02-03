import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('teachers')
export class Teacher {
  @ApiProperty({ description: 'Teacher ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Teacher first name' })
  @Column()
  nombre: string;

  @ApiProperty({ description: 'Teacher last name' })
  @Column()
  apellido: string;

  @ApiProperty({ description: 'Teacher email', uniqueItems: true })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Teacher phone', required: false })
  @Column({ nullable: true })
  telefono: string;

  @ApiProperty({ description: 'Teacher specialty' })
  @Column()
  especialidad: string;

  @ApiProperty({ description: 'Is teacher active' })
  @Column({ default: true })
  activo: boolean;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn()
  fechaCreacion: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn()
  fechaActualizacion: Date;
}
