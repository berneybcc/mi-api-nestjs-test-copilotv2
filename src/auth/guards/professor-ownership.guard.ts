import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professor } from '../../entities/professor.entity';
import { Grade } from '../../entities/grade.entity';
import { Enrollment } from '../../entities/enrollment.entity';

@Injectable()
export class ProfessorOwnershipGuard implements CanActivate {
  constructor(
    @InjectRepository(Professor)
    private professorRepository: Repository<Professor>,
    @InjectRepository(Grade)
    private gradeRepository: Repository<Grade>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const gradeId = request.params.id;
    const enrollmentId = request.body?.enrollmentId;

    // Find professor by user ID
    const professor = await this.professorRepository.findOne({
      where: { userId: user.userId },
    });

    if (!professor) {
      throw new ForbiddenException('Only professors can manage grades');
    }

    // If updating a grade, check ownership
    if (gradeId) {
      const grade = await this.gradeRepository.findOne({
        where: { id: parseInt(gradeId) },
        relations: ['enrollment', 'enrollment.group', 'enrollment.group.subject'],
      });

      if (!grade) {
        throw new ForbiddenException('Grade not found');
      }

      // Check if professor is assigned to the subject
      if (grade.enrollment.group.subject.professorId !== professor.id) {
        throw new ForbiddenException('You can only modify grades for your assigned subjects');
      }
    }

    // If creating a grade, check if professor owns the subject
    if (enrollmentId && !gradeId) {
      const enrollment = await this.enrollmentRepository.findOne({
        where: { id: enrollmentId },
        relations: ['group', 'group.subject'],
      });

      if (!enrollment) {
        throw new ForbiddenException('Enrollment not found');
      }

      if (enrollment.group.subject.professorId !== professor.id) {
        throw new ForbiddenException('You can only create grades for your assigned subjects');
      }
    }

    // Attach professor to request for use in controller
    request.professor = professor;
    return true;
  }
}
