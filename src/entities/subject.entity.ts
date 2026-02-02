import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('subjects')
export class Subject {
  @ApiProperty({ description: 'Subject ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Subject name' })
  @Column()
  nombre: string;

  @ApiProperty({ description: 'Subject code', uniqueItems: true })
  @Column({ unique: true })
  codigo: string;

  @ApiProperty({ description: 'Number of credits' })
  @Column()
  creditos: number;

  @ApiProperty({ description: 'Subject description', required: false })
  @Column({ nullable: true })
  descripcion: string;

  @ApiProperty({ description: 'Is subject active' })
  @Column({ default: true })
  activa: boolean;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn()
  fechaCreacion: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn()
  fechaActualizacion: Date;
}
