import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Subject } from '../entities/subject.entity';
import { Teacher } from '../entities/teacher.entity';
import { Group } from '../entities/group.entity';
import { TeacherSubjectAssignment } from '../entities/teacher-subject-assignment.entity';
import { TeacherGroupAssignment } from '../entities/teacher-group-assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Subject,
      Teacher,
      Group,
      TeacherSubjectAssignment,
      TeacherGroupAssignment,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
