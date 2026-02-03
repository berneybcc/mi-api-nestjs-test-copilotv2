import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { Subject } from '../entities/subject.entity';
import { Teacher } from '../entities/teacher.entity';
import { Group } from '../entities/group.entity';
import { TeacherSubjectAssignment } from '../entities/teacher-subject-assignment.entity';
import { TeacherGroupAssignment } from '../entities/teacher-group-assignment.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('AdminService', () => {
  let service: AdminService;

  const mockSubjectRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockTeacherRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockGroupRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockTeacherSubjectAssignmentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockTeacherGroupAssignmentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(Subject),
          useValue: mockSubjectRepository,
        },
        {
          provide: getRepositoryToken(Teacher),
          useValue: mockTeacherRepository,
        },
        {
          provide: getRepositoryToken(Group),
          useValue: mockGroupRepository,
        },
        {
          provide: getRepositoryToken(TeacherSubjectAssignment),
          useValue: mockTeacherSubjectAssignmentRepository,
        },
        {
          provide: getRepositoryToken(TeacherGroupAssignment),
          useValue: mockTeacherGroupAssignmentRepository,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSubject', () => {
    it('should create a new subject', async () => {
      const createSubjectDto = {
        nombre: 'Mathematics',
        codigo: 'MATH101',
        creditos: 4,
        descripcion: 'Basic mathematics',
      };

      const subject = { id: 1, ...createSubjectDto, activa: true };

      mockSubjectRepository.findOne.mockResolvedValue(null);
      mockSubjectRepository.create.mockReturnValue(subject);
      mockSubjectRepository.save.mockResolvedValue(subject);

      const result = await service.createSubject(createSubjectDto);

      expect(result).toEqual(subject);
      expect(mockSubjectRepository.findOne).toHaveBeenCalledWith({
        where: { codigo: createSubjectDto.codigo },
      });
    });

    it('should throw ConflictException if subject code already exists', async () => {
      const createSubjectDto = {
        nombre: 'Mathematics',
        codigo: 'MATH101',
        creditos: 4,
      };

      mockSubjectRepository.findOne.mockResolvedValue({ id: 1 });

      await expect(service.createSubject(createSubjectDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findSubjectById', () => {
    it('should return a subject by id', async () => {
      const subject = { id: 1, nombre: 'Math', activa: true };
      mockSubjectRepository.findOne.mockResolvedValue(subject);

      const result = await service.findSubjectById(1);

      expect(result).toEqual(subject);
      expect(mockSubjectRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, activa: true },
      });
    });

    it('should throw NotFoundException if subject not found', async () => {
      mockSubjectRepository.findOne.mockResolvedValue(null);

      await expect(service.findSubjectById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTeacher', () => {
    it('should create a new teacher', async () => {
      const createTeacherDto = {
        nombre: 'John',
        apellido: 'Doe',
        email: 'john@university.edu',
        especialidad: 'Mathematics',
      };

      const teacher = { id: 1, ...createTeacherDto, activo: true };

      mockTeacherRepository.findOne.mockResolvedValue(null);
      mockTeacherRepository.create.mockReturnValue(teacher);
      mockTeacherRepository.save.mockResolvedValue(teacher);

      const result = await service.createTeacher(createTeacherDto);

      expect(result).toEqual(teacher);
      expect(mockTeacherRepository.findOne).toHaveBeenCalledWith({
        where: { email: createTeacherDto.email },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const createTeacherDto = {
        nombre: 'John',
        apellido: 'Doe',
        email: 'john@university.edu',
        especialidad: 'Mathematics',
      };

      mockTeacherRepository.findOne.mockResolvedValue({ id: 1 });

      await expect(service.createTeacher(createTeacherDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('assignTeacherToSubject', () => {
    it('should assign teacher to subject', async () => {
      const dto = { profesorId: 1, materiaId: 1 };
      const teacher = { id: 1, activo: true };
      const subject = { id: 1, activa: true };
      const assignment = { id: 1, ...dto, activa: true };

      mockTeacherRepository.findOne.mockResolvedValue(teacher);
      mockSubjectRepository.findOne.mockResolvedValue(subject);
      mockTeacherSubjectAssignmentRepository.findOne.mockResolvedValue(null);
      mockTeacherSubjectAssignmentRepository.create.mockReturnValue(assignment);
      mockTeacherSubjectAssignmentRepository.save.mockResolvedValue(assignment);

      const result = await service.assignTeacherToSubject(dto);

      expect(result).toEqual(assignment);
    });

    it('should throw ConflictException if assignment already exists', async () => {
      const dto = { profesorId: 1, materiaId: 1 };
      const teacher = { id: 1, activo: true };
      const subject = { id: 1, activa: true };

      mockTeacherRepository.findOne.mockResolvedValue(teacher);
      mockSubjectRepository.findOne.mockResolvedValue(subject);
      mockTeacherSubjectAssignmentRepository.findOne.mockResolvedValue({ id: 1 });

      await expect(service.assignTeacherToSubject(dto)).rejects.toThrow(ConflictException);
    });
  });
});
