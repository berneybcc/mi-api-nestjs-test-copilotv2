import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Student } from '../entities/student.entity';
import { Enrollment, EnrollmentStatus } from '../entities/enrollment.entity';
import { Group } from '../entities/group.entity';
import { Subject } from '../entities/subject.entity';
import { Grade } from '../entities/grade.entity';
import { CreditTransaction, TransactionType } from '../entities/credit-transaction.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { EnrollGroupDto } from './dto/enroll-group.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    @InjectRepository(Grade)
    private gradeRepository: Repository<Grade>,
    @InjectRepository(CreditTransaction)
    private creditTransactionRepository: Repository<CreditTransaction>,
    private dataSource: DataSource,
  ) {}

  async createStudent(createStudentDto: CreateStudentDto): Promise<Student> {
    const existingStudent = await this.studentRepository.findOne({
      where: { studentId: createStudentDto.studentId },
    });

    if (existingStudent) {
      throw new ConflictException('Student with this ID already exists');
    }

    const defaultCredits = parseFloat(process.env.DEFAULT_STUDENT_CREDITS || '50');
    const initialCredits = createStudentDto.initialCredits || defaultCredits;

    const student = this.studentRepository.create({
      ...createStudentDto,
      availableCredits: initialCredits,
    });

    const savedStudent = await this.studentRepository.save(student);

    // Create initial credit transaction
    if (initialCredits > 0) {
      await this.creditTransactionRepository.save({
        studentId: savedStudent.id,
        type: TransactionType.CREDIT,
        amount: initialCredits,
        balanceAfter: initialCredits,
        description: 'Initial credit allocation',
      });
    }

    return savedStudent;
  }

  async getStudentProfile(studentId: number) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      relations: ['user'],
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async getStudentCredits(studentId: number) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      select: ['id', 'availableCredits'],
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return {
      studentId: student.id,
      availableCredits: student.availableCredits,
    };
  }

  async getCreditHistory(studentId: number) {
    const transactions = await this.creditTransactionRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });

    return transactions;
  }

  async getEnrollments(studentId: number) {
    const enrollments = await this.enrollmentRepository.find({
      where: { studentId },
      relations: ['group', 'group.subject', 'group.subject.professor'],
      order: { enrollmentDate: 'DESC' },
    });

    return enrollments;
  }

  async getGrades(studentId: number) {
    const enrollments = await this.enrollmentRepository.find({
      where: { studentId },
      relations: ['grades', 'group', 'group.subject'],
    });

    const gradesWithContext = enrollments.map((enrollment) => ({
      subject: enrollment.group.subject.nombre,
      subjectCode: enrollment.group.subject.codigo,
      group: enrollment.group.nombre,
      grades: enrollment.grades,
    }));

    return gradesWithContext;
  }

  async enrollInGroup(studentId: number, enrollGroupDto: EnrollGroupDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get student
      const student = await queryRunner.manager.findOne(Student, {
        where: { id: studentId },
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      // Get group with subject
      const group = await queryRunner.manager.findOne(Group, {
        where: { id: enrollGroupDto.groupId, activo: true },
        relations: ['subject'],
      });

      if (!group) {
        throw new NotFoundException('Group not found or inactive');
      }

      // Check if already enrolled
      const existingEnrollment = await queryRunner.manager.findOne(Enrollment, {
        where: {
          studentId,
          groupId: enrollGroupDto.groupId,
          status: EnrollmentStatus.ACTIVE,
        },
      });

      if (existingEnrollment) {
        throw new ConflictException('Already enrolled in this group');
      }

      // Check credits
      const creditsRequired = group.subject.creditos;
      if (student.availableCredits < creditsRequired) {
        throw new BadRequestException(
          `Insufficient credits. Required: ${creditsRequired}, Available: ${student.availableCredits}`,
        );
      }

      // Check max students
      const enrollmentCount = await queryRunner.manager.count(Enrollment, {
        where: { groupId: group.id, status: EnrollmentStatus.ACTIVE },
      });

      if (enrollmentCount >= group.maxStudents) {
        throw new BadRequestException('Group is full');
      }

      // Deduct credits
      student.availableCredits = parseFloat(student.availableCredits.toString()) - creditsRequired;
      await queryRunner.manager.save(Student, student);

      // Create enrollment
      const enrollment = queryRunner.manager.create(Enrollment, {
        studentId,
        groupId: enrollGroupDto.groupId,
        creditsUsed: creditsRequired,
        status: EnrollmentStatus.ACTIVE,
      });
      await queryRunner.manager.save(Enrollment, enrollment);

      // Create credit transaction
      const transaction = queryRunner.manager.create(CreditTransaction, {
        studentId,
        type: TransactionType.DEBIT,
        amount: creditsRequired,
        balanceAfter: student.availableCredits,
        description: `Enrollment in ${group.subject.nombre} - ${group.nombre}`,
        enrollmentId: enrollment.id,
      });
      await queryRunner.manager.save(CreditTransaction, transaction);

      await queryRunner.commitTransaction();

      return {
        message: 'Enrollment successful',
        enrollment: {
          id: enrollment.id,
          subject: group.subject.nombre,
          group: group.nombre,
          creditsUsed: creditsRequired,
          remainingCredits: student.availableCredits,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async withdrawFromGroup(studentId: number, enrollmentId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const enrollment = await queryRunner.manager.findOne(Enrollment, {
        where: { id: enrollmentId, studentId, status: EnrollmentStatus.ACTIVE },
        relations: ['group', 'group.subject'],
      });

      if (!enrollment) {
        throw new NotFoundException('Enrollment not found or already withdrawn');
      }

      const student = await queryRunner.manager.findOne(Student, {
        where: { id: studentId },
      });

      // Calculate refund based on withdrawal date
      const refundDays = parseInt(process.env.CREDIT_REFUND_DAYS || '7');
      const enrollmentDate = new Date(enrollment.enrollmentDate);
      const currentDate = new Date();
      const daysSinceEnrollment = Math.floor(
        (currentDate.getTime() - enrollmentDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      let refundAmount = 0;
      if (daysSinceEnrollment <= refundDays) {
        refundAmount = parseFloat(enrollment.creditsUsed.toString());
      } else {
        refundAmount = parseFloat(enrollment.creditsUsed.toString()) * 0.5; // 50% refund after deadline
      }

      // Update enrollment status
      enrollment.status = EnrollmentStatus.WITHDRAWN;
      enrollment.withdrawalDate = currentDate;
      await queryRunner.manager.save(Enrollment, enrollment);

      // Refund credits
      student.availableCredits = parseFloat(student.availableCredits.toString()) + refundAmount;
      await queryRunner.manager.save(Student, student);

      // Create credit transaction
      const transaction = queryRunner.manager.create(CreditTransaction, {
        studentId,
        type: TransactionType.REFUND,
        amount: refundAmount,
        balanceAfter: student.availableCredits,
        description: `Refund for withdrawal from ${enrollment.group.subject.nombre} - ${enrollment.group.nombre}`,
        enrollmentId: enrollment.id,
      });
      await queryRunner.manager.save(CreditTransaction, transaction);

      await queryRunner.commitTransaction();

      return {
        message: 'Withdrawal successful',
        refundAmount,
        remainingCredits: student.availableCredits,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAvailableSubjects(studentId: number) {
    const subjects = await this.subjectRepository.find({
      where: { activa: true },
      relations: ['groups', 'professor'],
    });

    // Get student's current enrollments
    const enrollments = await this.enrollmentRepository.find({
      where: { studentId, status: EnrollmentStatus.ACTIVE },
      relations: ['group'],
    });

    const enrolledGroupIds = enrollments.map((e) => e.groupId);

    // Filter subjects and groups
    const availableSubjects = subjects.map((subject) => ({
      id: subject.id,
      name: subject.nombre,
      code: subject.codigo,
      credits: subject.creditos,
      description: subject.descripcion,
      professor: subject.professor
        ? `${subject.professor.firstName} ${subject.professor.lastName}`
        : 'Not assigned',
      groups: subject.groups
        .filter((group) => group.activo && !enrolledGroupIds.includes(group.id))
        .map((group) => ({
          id: group.id,
          name: group.nombre,
          code: group.codigo,
          semester: group.semestre,
          year: group.año,
          maxStudents: group.maxStudents,
        })),
    }));

    return availableSubjects.filter((subject) => subject.groups.length > 0);
  }
}
