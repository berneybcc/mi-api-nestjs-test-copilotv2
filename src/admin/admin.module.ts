import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Subject } from '../entities/subject.entity';
import { Teacher } from '../entities/teacher.entity';
import { Group } from '../entities/group.entity';
import { TeacherSubjectAssignment } from '../entities/teacher-subject-assignment.entity';
import { TeacherGroupAssignment } from '../entities/teacher-group-assignment.entity';
import { Professor } from '../entities/professor.entity';
import { Student } from '../entities/student.entity';
import { CreditTransaction } from '../entities/credit-transaction.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Subject,
      Teacher,
      Group,
      TeacherSubjectAssignment,
      TeacherGroupAssignment,
      Professor,
      Student,
      CreditTransaction,
    ]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
