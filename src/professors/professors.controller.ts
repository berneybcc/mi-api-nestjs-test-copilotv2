import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProfessorsService } from './professors.service';
import { AssignGradeDto } from './dto/assign-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProfessorOwnershipGuard } from '../auth/guards/professor-ownership.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@ApiTags('professors')
@Controller('professors')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

  @Get('me/profile')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Get professor profile' })
  @ApiResponse({ status: 200, description: 'Returns professor profile' })
  async getProfile(@Req() req) {
    const professor = await this.professorsService.professorRepository.findOne({
      where: { userId: req.user.userId },
    });
    if (!professor) {
      return { message: 'Professor profile not found' };
    }
    return await this.professorsService.getProfessorProfile(professor.id);
  }

  @Get('me/subjects')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Get professor subjects' })
  @ApiResponse({ status: 200, description: 'Returns list of subjects' })
  async getSubjects(@Req() req) {
    const professor = await this.professorsService.professorRepository.findOne({
      where: { userId: req.user.userId },
    });
    if (!professor) {
      return [];
    }
    return await this.professorsService.getProfessorSubjects(professor.id);
  }

  @Get('me/groups')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Get professor groups' })
  @ApiResponse({ status: 200, description: 'Returns list of groups' })
  async getGroups(@Req() req) {
    const professor = await this.professorsService.professorRepository.findOne({
      where: { userId: req.user.userId },
    });
    if (!professor) {
      return [];
    }
    return await this.professorsService.getProfessorGroups(professor.id);
  }

  @Get('groups/:id/students')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Get students in a group' })
  @ApiResponse({ status: 200, description: 'Returns list of students' })
  @ApiResponse({ status: 403, description: 'Not authorized to view this group' })
  async getGroupStudents(@Req() req, @Param('id', ParseIntPipe) groupId: number) {
    const professor = await this.professorsService.professorRepository.findOne({
      where: { userId: req.user.userId },
    });
    return await this.professorsService.getGroupStudents(professor.id, groupId);
  }

  @Post('grades')
  @Roles(UserRole.PROFESSOR)
  @UseGuards(ProfessorOwnershipGuard)
  @ApiOperation({ summary: 'Assign a grade' })
  @ApiResponse({ status: 201, description: 'Grade assigned successfully' })
  @ApiResponse({ status: 403, description: 'Not authorized to assign grades for this subject' })
  async assignGrade(@Req() req, @Body() assignGradeDto: AssignGradeDto) {
    return await this.professorsService.assignGrade(req.professor.id, assignGradeDto);
  }

  @Put('grades/:id')
  @Roles(UserRole.PROFESSOR)
  @UseGuards(ProfessorOwnershipGuard)
  @ApiOperation({ summary: 'Update a grade' })
  @ApiResponse({ status: 200, description: 'Grade updated successfully' })
  @ApiResponse({ status: 403, description: 'Not authorized to update this grade' })
  async updateGrade(
    @Req() req,
    @Param('id', ParseIntPipe) gradeId: number,
    @Body() updateGradeDto: UpdateGradeDto,
  ) {
    return await this.professorsService.updateGrade(req.professor.id, gradeId, updateGradeDto);
  }

  @Get('groups/:id/grades')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Get grades for a group' })
  @ApiResponse({ status: 200, description: 'Returns list of grades' })
  @ApiResponse({ status: 403, description: 'Not authorized to view grades for this group' })
  async getGroupGrades(@Req() req, @Param('id', ParseIntPipe) groupId: number) {
    const professor = await this.professorsService.professorRepository.findOne({
      where: { userId: req.user.userId },
    });
    return await this.professorsService.getGroupGrades(professor.id, groupId);
  }

  @Get('groups/:id/statistics')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Get statistics for a group' })
  @ApiResponse({ status: 200, description: 'Returns group statistics' })
  @ApiResponse({ status: 403, description: 'Not authorized to view statistics for this group' })
  async getGroupStatistics(@Req() req, @Param('id', ParseIntPipe) groupId: number) {
    const professor = await this.professorsService.professorRepository.findOne({
      where: { userId: req.user.userId },
    });
    return await this.professorsService.getGroupStatistics(professor.id, groupId);
  }
}
