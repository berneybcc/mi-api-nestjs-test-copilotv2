import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { UpdateSubjectDto } from '../dto/update-subject.dto';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { AssignTeacherToSubjectDto } from '../dto/assign-teacher-to-subject.dto';
import { AssignTeacherToGroupDto } from '../dto/assign-teacher-to-group.dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Subject endpoints
  @Post('subjects')
  @ApiOperation({ summary: 'Create a new subject' })
  @ApiResponse({ status: 201, description: 'Subject created successfully' })
  @ApiResponse({ status: 409, description: 'Subject with this code already exists' })
  async createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    return await this.adminService.createSubject(createSubjectDto);
  }

  @Get('subjects')
  @ApiOperation({ summary: 'Get all subjects' })
  @ApiResponse({ status: 200, description: 'Return all active subjects' })
  async getAllSubjects() {
    return await this.adminService.findAllSubjects();
  }

  @Get('subjects/:id')
  @ApiOperation({ summary: 'Get a subject by ID' })
  @ApiResponse({ status: 200, description: 'Return the subject' })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  async getSubjectById(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.findSubjectById(id);
  }

  @Put('subjects/:id')
  @ApiOperation({ summary: 'Update a subject' })
  @ApiResponse({ status: 200, description: 'Subject updated successfully' })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  @ApiResponse({ status: 409, description: 'Subject with this code already exists' })
  async updateSubject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return await this.adminService.updateSubject(id, updateSubjectDto);
  }

  @Delete('subjects/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete (deactivate) a subject' })
  @ApiResponse({ status: 204, description: 'Subject deleted successfully' })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  async deleteSubject(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.deleteSubject(id);
  }

  // Teacher endpoints
  @Post('teachers')
  @ApiOperation({ summary: 'Create a new teacher' })
  @ApiResponse({ status: 201, description: 'Teacher created successfully' })
  @ApiResponse({ status: 409, description: 'Teacher with this email already exists' })
  async createTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    return await this.adminService.createTeacher(createTeacherDto);
  }

  @Get('teachers')
  @ApiOperation({ summary: 'Get all teachers' })
  @ApiResponse({ status: 200, description: 'Return all active teachers' })
  async getAllTeachers() {
    return await this.adminService.findAllTeachers();
  }

  @Get('teachers/:id')
  @ApiOperation({ summary: 'Get a teacher by ID' })
  @ApiResponse({ status: 200, description: 'Return the teacher' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  async getTeacherById(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.findTeacherById(id);
  }

  @Put('teachers/:id')
  @ApiOperation({ summary: 'Update a teacher' })
  @ApiResponse({ status: 200, description: 'Teacher updated successfully' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  @ApiResponse({ status: 409, description: 'Teacher with this email already exists' })
  async updateTeacher(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return await this.adminService.updateTeacher(id, updateTeacherDto);
  }

  @Delete('teachers/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete (deactivate) a teacher' })
  @ApiResponse({ status: 204, description: 'Teacher deleted successfully' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  async deleteTeacher(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.deleteTeacher(id);
  }

  // Group endpoints
  @Post('groups')
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully' })
  @ApiResponse({ status: 409, description: 'Group with this code already exists' })
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    return await this.adminService.createGroup(createGroupDto);
  }

  @Get('groups')
  @ApiOperation({ summary: 'Get all groups' })
  @ApiResponse({ status: 200, description: 'Return all active groups' })
  async getAllGroups() {
    return await this.adminService.findAllGroups();
  }

  @Get('groups/:id')
  @ApiOperation({ summary: 'Get a group by ID' })
  @ApiResponse({ status: 200, description: 'Return the group' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async getGroupById(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.findGroupById(id);
  }

  @Put('groups/:id')
  @ApiOperation({ summary: 'Update a group' })
  @ApiResponse({ status: 200, description: 'Group updated successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiResponse({ status: 409, description: 'Group with this code already exists' })
  async updateGroup(@Param('id', ParseIntPipe) id: number, @Body() updateGroupDto: UpdateGroupDto) {
    return await this.adminService.updateGroup(id, updateGroupDto);
  }

  @Delete('groups/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete (deactivate) a group' })
  @ApiResponse({ status: 204, description: 'Group deleted successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async deleteGroup(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.deleteGroup(id);
  }

  // Assignment endpoints
  @Post('assignments/teacher-subject')
  @ApiOperation({ summary: 'Assign a teacher to a subject' })
  @ApiResponse({ status: 201, description: 'Assignment created successfully' })
  @ApiResponse({ status: 404, description: 'Teacher or Subject not found' })
  @ApiResponse({ status: 409, description: 'Assignment already exists' })
  async assignTeacherToSubject(@Body() dto: AssignTeacherToSubjectDto) {
    return await this.adminService.assignTeacherToSubject(dto);
  }

  @Get('assignments/teacher-subjects')
  @ApiOperation({ summary: 'Get all teacher-subject assignments' })
  @ApiResponse({ status: 200, description: 'Return all active assignments' })
  async getAllTeacherSubjectAssignments() {
    return await this.adminService.findAllTeacherSubjectAssignments();
  }

  @Delete('assignments/teacher-subject/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a teacher-subject assignment' })
  @ApiResponse({ status: 204, description: 'Assignment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  async deleteTeacherSubjectAssignment(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.deleteTeacherSubjectAssignment(id);
  }

  @Post('assignments/teacher-group')
  @ApiOperation({ summary: 'Assign a teacher to a group and subject' })
  @ApiResponse({ status: 201, description: 'Assignment created successfully' })
  @ApiResponse({ status: 404, description: 'Teacher, Group or Subject not found' })
  @ApiResponse({ status: 409, description: 'Assignment already exists' })
  async assignTeacherToGroup(@Body() dto: AssignTeacherToGroupDto) {
    return await this.adminService.assignTeacherToGroup(dto);
  }

  @Get('assignments/teacher-groups')
  @ApiOperation({ summary: 'Get all teacher-group assignments' })
  @ApiResponse({ status: 200, description: 'Return all active assignments' })
  async getAllTeacherGroupAssignments() {
    return await this.adminService.findAllTeacherGroupAssignments();
  }

  @Delete('assignments/teacher-group/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a teacher-group assignment' })
  @ApiResponse({ status: 204, description: 'Assignment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  async deleteTeacherGroupAssignment(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.deleteTeacherGroupAssignment(id);
  }
}
