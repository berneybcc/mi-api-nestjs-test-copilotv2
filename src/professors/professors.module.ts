import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessorsController } from './professors.controller';
import { ProfessorsService } from './professors.service';
import { Professor } from '../entities/professor.entity';
import { Subject } from '../entities/subject.entity';
import { Group } from '../entities/group.entity';
import { Enrollment } from '../entities/enrollment.entity';
import { Grade } from '../entities/grade.entity';
import { Student } from '../entities/student.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Professor,
      Subject,
      Group,
      Enrollment,
      Grade,
      Student,
    ]),
    AuthModule,
  ],
  controllers: [ProfessorsController],
  providers: [ProfessorsService],
  exports: [ProfessorsService],
})
export class ProfessorsModule {}
