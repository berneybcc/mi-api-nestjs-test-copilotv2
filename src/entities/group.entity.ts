import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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
