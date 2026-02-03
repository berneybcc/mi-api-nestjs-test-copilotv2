import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professor } from '../entities/professor.entity';
import { Subject } from '../entities/subject.entity';
import { Group } from '../entities/group.entity';
import { Enrollment, EnrollmentStatus } from '../entities/enrollment.entity';
import { Grade } from '../entities/grade.entity';
import { Student } from '../entities/student.entity';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { AssignGradeDto } from './dto/assign-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Injectable()
export class ProfessorsService {
  constructor(
    @InjectRepository(Professor)
    private professorRepository: Repository<Professor>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Grade)
    private gradeRepository: Repository<Grade>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async createProfessor(createProfessorDto: CreateProfessorDto): Promise<Professor> {
    if (createProfessorDto.employeeId) {
      const existingProfessor = await this.professorRepository.findOne({
        where: { employeeId: createProfessorDto.employeeId },
      });

      if (existingProfessor) {
        throw new ConflictException('Professor with this employee ID already exists');
      }
    }

    const professor = this.professorRepository.create(createProfessorDto);
    return await this.professorRepository.save(professor);
  }

  async getProfessorProfile(professorId: number) {
    const professor = await this.professorRepository.findOne({
      where: { id: professorId },
      relations: ['user'],
    });

    if (!professor) {
      throw new NotFoundException('Professor not found');
    }

    return professor;
  }

  async getProfessorSubjects(professorId: number) {
    const subjects = await this.subjectRepository.find({
      where: { professorId, activa: true },
      relations: ['groups'],
    });

    return subjects.map((subject) => ({
      id: subject.id,
      name: subject.nombre,
      code: subject.codigo,
      credits: subject.creditos,
      description: subject.descripcion,
      groupCount: subject.groups.filter((g) => g.activo).length,
    }));
  }

  async getProfessorGroups(professorId: number) {
    const subjects = await this.subjectRepository.find({
      where: { professorId, activa: true },
      relations: ['groups'],
    });

    const groups = [];
    for (const subject of subjects) {
      for (const group of subject.groups.filter((g) => g.activo)) {
        const enrollmentCount = await this.enrollmentRepository.count({
          where: { groupId: group.id, status: EnrollmentStatus.ACTIVE },
        });

        groups.push({
          id: group.id,
          name: group.nombre,
          code: group.codigo,
          subject: subject.nombre,
          subjectCode: subject.codigo,
          semester: group.semestre,
          year: group.año,
          studentCount: enrollmentCount,
          maxStudents: group.maxStudents,
        });
      }
    }

    return groups;
  }

  async getGroupStudents(professorId: number, groupId: number) {
    // Verify professor owns this group's subject
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['subject'],
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.subject.professorId !== professorId) {
      throw new ForbiddenException('You can only view students from your assigned groups');
    }

    const enrollments = await this.enrollmentRepository.find({
      where: { groupId, status: EnrollmentStatus.ACTIVE },
      relations: ['student', 'grades'],
    });

    return enrollments.map((enrollment) => ({
      enrollmentId: enrollment.id,
      studentId: enrollment.student.studentId,
      firstName: enrollment.student.firstName,
      lastName: enrollment.student.lastName,
      enrollmentDate: enrollment.enrollmentDate,
      gradesCount: enrollment.grades.length,
    }));
  }

  async assignGrade(professorId: number, assignGradeDto: AssignGradeDto) {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id: assignGradeDto.enrollmentId, status: EnrollmentStatus.ACTIVE },
      relations: ['group', 'group.subject'],
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found or inactive');
    }

    if (enrollment.group.subject.professorId !== professorId) {
      throw new ForbiddenException('You can only assign grades to your assigned subjects');
    }

    const grade = this.gradeRepository.create({
      enrollmentId: assignGradeDto.enrollmentId,
      professorId,
      value: assignGradeDto.value,
      assessmentType: assignGradeDto.assessmentType,
      description: assignGradeDto.description,
      weight: assignGradeDto.weight || 100,
      comments: assignGradeDto.comments,
    });

    return await this.gradeRepository.save(grade);
  }

  async updateGrade(professorId: number, gradeId: number, updateGradeDto: UpdateGradeDto) {
    const grade = await this.gradeRepository.findOne({
      where: { id: gradeId },
      relations: ['enrollment', 'enrollment.group', 'enrollment.group.subject'],
    });

    if (!grade) {
      throw new NotFoundException('Grade not found');
    }

    if (grade.enrollment.group.subject.professorId !== professorId) {
      throw new ForbiddenException('You can only update grades for your assigned subjects');
    }

    Object.assign(grade, updateGradeDto);
    return await this.gradeRepository.save(grade);
  }

  async getGroupGrades(professorId: number, groupId: number) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['subject'],
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.subject.professorId !== professorId) {
      throw new ForbiddenException('You can only view grades from your assigned groups');
    }

    const enrollments = await this.enrollmentRepository.find({
      where: { groupId, status: EnrollmentStatus.ACTIVE },
      relations: ['student', 'grades'],
    });

    return enrollments.map((enrollment) => ({
      studentId: enrollment.student.studentId,
      studentName: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
      grades: enrollment.grades.map((grade) => ({
        id: grade.id,
        value: grade.value,
        assessmentType: grade.assessmentType,
        description: grade.description,
        weight: grade.weight,
        comments: grade.comments,
        createdAt: grade.createdAt,
        updatedAt: grade.updatedAt,
      })),
    }));
  }

  async getGroupStatistics(professorId: number, groupId: number) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['subject'],
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.subject.professorId !== professorId) {
      throw new ForbiddenException('You can only view statistics from your assigned groups');
    }

    const enrollments = await this.enrollmentRepository.find({
      where: { groupId, status: EnrollmentStatus.ACTIVE },
      relations: ['grades'],
    });

    const totalStudents = enrollments.length;
    const studentsWithGrades = enrollments.filter((e) => e.grades.length > 0).length;

    let allGrades = [];
    enrollments.forEach((enrollment) => {
      allGrades = [...allGrades, ...enrollment.grades.map((g) => parseFloat(g.value.toString()))];
    });

    const averageGrade = allGrades.length > 0
      ? allGrades.reduce((sum, grade) => sum + grade, 0) / allGrades.length
      : 0;

    const minGrade = allGrades.length > 0 ? Math.min(...allGrades) : 0;
    const maxGrade = allGrades.length > 0 ? Math.max(...allGrades) : 0;

    return {
      groupId,
      groupName: group.nombre,
      subject: group.subject.nombre,
      totalStudents,
      studentsWithGrades,
      totalGrades: allGrades.length,
      averageGrade: parseFloat(averageGrade.toFixed(2)),
      minGrade,
      maxGrade,
    };
  }
}
