import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  const mockAdminService = {
    createSubject: jest.fn(),
    findAllSubjects: jest.fn(),
    findSubjectById: jest.fn(),
    updateSubject: jest.fn(),
    deleteSubject: jest.fn(),
    createTeacher: jest.fn(),
    findAllTeachers: jest.fn(),
    findTeacherById: jest.fn(),
    updateTeacher: jest.fn(),
    deleteTeacher: jest.fn(),
    createGroup: jest.fn(),
    findAllGroups: jest.fn(),
    findGroupById: jest.fn(),
    updateGroup: jest.fn(),
    deleteGroup: jest.fn(),
    assignTeacherToSubject: jest.fn(),
    findAllTeacherSubjectAssignments: jest.fn(),
    deleteTeacherSubjectAssignment: jest.fn(),
    assignTeacherToGroup: jest.fn(),
    findAllTeacherGroupAssignments: jest.fn(),
    deleteTeacherGroupAssignment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createSubject', () => {
    it('should create a subject', async () => {
      const createSubjectDto = {
        nombre: 'Mathematics',
        codigo: 'MATH101',
        creditos: 4,
      };

      const subject = { id: 1, ...createSubjectDto, activa: true };
      mockAdminService.createSubject.mockResolvedValue(subject);

      const result = await controller.createSubject(createSubjectDto);

      expect(result).toEqual(subject);
      expect(service.createSubject).toHaveBeenCalledWith(createSubjectDto);
    });
  });

  describe('getAllSubjects', () => {
    it('should return all subjects', async () => {
      const subjects = [
        { id: 1, nombre: 'Math', activa: true },
        { id: 2, nombre: 'Science', activa: true },
      ];

      mockAdminService.findAllSubjects.mockResolvedValue(subjects);

      const result = await controller.getAllSubjects();

      expect(result).toEqual(subjects);
      expect(service.findAllSubjects).toHaveBeenCalled();
    });
  });

  describe('getSubjectById', () => {
    it('should return a subject by id', async () => {
      const subject = { id: 1, nombre: 'Math', activa: true };
      mockAdminService.findSubjectById.mockResolvedValue(subject);

      const result = await controller.getSubjectById(1);

      expect(result).toEqual(subject);
      expect(service.findSubjectById).toHaveBeenCalledWith(1);
    });
  });

  describe('createTeacher', () => {
    it('should create a teacher', async () => {
      const createTeacherDto = {
        nombre: 'John',
        apellido: 'Doe',
        email: 'john@university.edu',
        especialidad: 'Mathematics',
      };

      const teacher = { id: 1, ...createTeacherDto, activo: true };
      mockAdminService.createTeacher.mockResolvedValue(teacher);

      const result = await controller.createTeacher(createTeacherDto);

      expect(result).toEqual(teacher);
      expect(service.createTeacher).toHaveBeenCalledWith(createTeacherDto);
    });
  });

  describe('assignTeacherToSubject', () => {
    it('should assign teacher to subject', async () => {
      const dto = { profesorId: 1, materiaId: 1 };
      const assignment = { id: 1, ...dto, activa: true };

      mockAdminService.assignTeacherToSubject.mockResolvedValue(assignment);

      const result = await controller.assignTeacherToSubject(dto);

      expect(result).toEqual(assignment);
      expect(service.assignTeacherToSubject).toHaveBeenCalledWith(dto);
    });
  });
});
