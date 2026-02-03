import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../../entities/student.entity';

@Injectable()
export class StudentOwnershipGuard implements CanActivate {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Find student by user ID
    const student = await this.studentRepository.findOne({
      where: { userId: user.userId },
    });

    if (!student) {
      throw new ForbiddenException('Only students can access this resource');
    }

    // Attach student to request for use in controller
    request.student = student;
    return true;
  }
}
