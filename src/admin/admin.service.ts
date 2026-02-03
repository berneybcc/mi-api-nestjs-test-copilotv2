import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../entities/subject.entity';
import { Teacher } from '../entities/teacher.entity';
import { Group } from '../entities/group.entity';
import { TeacherSubjectAssignment } from '../entities/teacher-subject-assignment.entity';
import { TeacherGroupAssignment } from '../entities/teacher-group-assignment.entity';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { UpdateSubjectDto } from '../dto/update-subject.dto';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { AssignTeacherToSubjectDto } from '../dto/assign-teacher-to-subject.dto';
import { AssignTeacherToGroupDto } from '../dto/assign-teacher-to-group.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(TeacherSubjectAssignment)
    private teacherSubjectAssignmentRepository: Repository<TeacherSubjectAssignment>,
    @InjectRepository(TeacherGroupAssignment)
    private teacherGroupAssignmentRepository: Repository<TeacherGroupAssignment>,
  ) {}

  // Subject management
  async createSubject(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const existingSubject = await this.subjectRepository.findOne({
      where: { codigo: createSubjectDto.codigo },
    });

    if (existingSubject) {
      throw new ConflictException('A subject with this code already exists');
    }

    const subject = this.subjectRepository.create(createSubjectDto);
    return await this.subjectRepository.save(subject);
  }

  async findAllSubjects(): Promise<Subject[]> {
    return await this.subjectRepository.find({ where: { activa: true } });
  }

  async findSubjectById(id: number): Promise<Subject> {
    const subject = await this.subjectRepository.findOne({
      where: { id, activa: true },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    return subject;
  }

  async updateSubject(id: number, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.findSubjectById(id);

    if (updateSubjectDto.codigo && updateSubjectDto.codigo !== subject.codigo) {
      const existingSubject = await this.subjectRepository.findOne({
        where: { codigo: updateSubjectDto.codigo },
      });

      if (existingSubject) {
        throw new ConflictException('A subject with this code already exists');
      }
    }

    Object.assign(subject, updateSubjectDto);
    return await this.subjectRepository.save(subject);
  }

  async deleteSubject(id: number): Promise<void> {
    const subject = await this.findSubjectById(id);
    subject.activa = false;
    await this.subjectRepository.save(subject);
  }

  // Teacher management
  async createTeacher(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const existingTeacher = await this.teacherRepository.findOne({
      where: { email: createTeacherDto.email },
    });

    if (existingTeacher) {
      throw new ConflictException('A teacher with this email already exists');
    }

    const teacher = this.teacherRepository.create(createTeacherDto);
    return await this.teacherRepository.save(teacher);
  }

  async findAllTeachers(): Promise<Teacher[]> {
    return await this.teacherRepository.find({ where: { activo: true } });
  }

  async findTeacherById(id: number): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({
      where: { id, activo: true },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    return teacher;
  }

  async updateTeacher(id: number, updateTeacherDto: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.findTeacherById(id);

    if (updateTeacherDto.email && updateTeacherDto.email !== teacher.email) {
      const existingTeacher = await this.teacherRepository.findOne({
        where: { email: updateTeacherDto.email },
      });

      if (existingTeacher) {
        throw new ConflictException('A teacher with this email already exists');
      }
    }

    Object.assign(teacher, updateTeacherDto);
    return await this.teacherRepository.save(teacher);
  }

  async deleteTeacher(id: number): Promise<void> {
    const teacher = await this.findTeacherById(id);
    teacher.activo = false;
    await this.teacherRepository.save(teacher);
  }

  // Group management
  async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
    const existingGroup = await this.groupRepository.findOne({
      where: { codigo: createGroupDto.codigo },
    });

    if (existingGroup) {
      throw new ConflictException('A group with this code already exists');
    }

    const group = this.groupRepository.create(createGroupDto);
    return await this.groupRepository.save(group);
  }

  async findAllGroups(): Promise<Group[]> {
    return await this.groupRepository.find({ where: { activo: true } });
  }

  async findGroupById(id: number): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id, activo: true },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return group;
  }

  async updateGroup(id: number, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const group = await this.findGroupById(id);

    if (updateGroupDto.codigo && updateGroupDto.codigo !== group.codigo) {
      const existingGroup = await this.groupRepository.findOne({
        where: { codigo: updateGroupDto.codigo },
      });

      if (existingGroup) {
        throw new ConflictException('A group with this code already exists');
      }
    }

    Object.assign(group, updateGroupDto);
    return await this.groupRepository.save(group);
  }

  async deleteGroup(id: number): Promise<void> {
    const group = await this.findGroupById(id);
    group.activo = false;
    await this.groupRepository.save(group);
  }

  // Teacher-Subject assignments
  async assignTeacherToSubject(dto: AssignTeacherToSubjectDto): Promise<TeacherSubjectAssignment> {
    // Verify teacher and subject exist (throws NotFoundException if not found)
    await this.findTeacherById(dto.profesorId);
    await this.findSubjectById(dto.materiaId);

    // Check for existing active assignment
    const existingAssignment = await this.teacherSubjectAssignmentRepository.findOne({
      where: {
        profesorId: dto.profesorId,
        materiaId: dto.materiaId,
        activa: true,
      },
    });

    if (existingAssignment) {
      throw new ConflictException('This teacher is already assigned to this subject');
    }

    const assignment = this.teacherSubjectAssignmentRepository.create(dto);
    return await this.teacherSubjectAssignmentRepository.save(assignment);
  }

  async findAllTeacherSubjectAssignments(): Promise<TeacherSubjectAssignment[]> {
    return await this.teacherSubjectAssignmentRepository.find({
      where: { activa: true },
      relations: ['profesor', 'materia'],
    });
  }

  async deleteTeacherSubjectAssignment(id: number): Promise<void> {
    const assignment = await this.teacherSubjectAssignmentRepository.findOne({
      where: { id, activa: true },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    assignment.activa = false;
    await this.teacherSubjectAssignmentRepository.save(assignment);
  }

  // Teacher-Group assignments
  async assignTeacherToGroup(dto: AssignTeacherToGroupDto): Promise<TeacherGroupAssignment> {
    // Verify teacher, group and subject exist (throws NotFoundException if not found)
    await this.findTeacherById(dto.profesorId);
    await this.findGroupById(dto.grupoId);
    await this.findSubjectById(dto.materiaId);

    // Check for existing active assignment
    const existingAssignment = await this.teacherGroupAssignmentRepository.findOne({
      where: {
        profesorId: dto.profesorId,
        grupoId: dto.grupoId,
        materiaId: dto.materiaId,
        activa: true,
      },
    });

    if (existingAssignment) {
      throw new ConflictException(
        'This teacher is already assigned to this group and subject combination',
      );
    }

    const assignment = this.teacherGroupAssignmentRepository.create(dto);
    return await this.teacherGroupAssignmentRepository.save(assignment);
  }

  async findAllTeacherGroupAssignments(): Promise<TeacherGroupAssignment[]> {
    return await this.teacherGroupAssignmentRepository.find({
      where: { activa: true },
      relations: ['profesor', 'grupo', 'materia'],
    });
  }

  async deleteTeacherGroupAssignment(id: number): Promise<void> {
    const assignment = await this.teacherGroupAssignmentRepository.findOne({
      where: { id, activa: true },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    assignment.activa = false;
    await this.teacherGroupAssignmentRepository.save(assignment);
  }
}
