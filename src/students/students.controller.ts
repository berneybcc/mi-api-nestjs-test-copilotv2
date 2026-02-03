import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { EnrollGroupDto } from './dto/enroll-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { StudentOwnershipGuard } from '../auth/guards/student-ownership.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@ApiTags('students')
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('me/profile')
  @Roles(UserRole.STUDENT)
  @UseGuards(StudentOwnershipGuard)
  @ApiOperation({ summary: 'Get student profile' })
  @ApiResponse({ status: 200, description: 'Returns student profile' })
  async getProfile(@Req() req) {
    return await this.studentsService.getStudentProfile(req.student.id);
  }

  @Get('me/credits')
  @Roles(UserRole.STUDENT)
  @UseGuards(StudentOwnershipGuard)
  @ApiOperation({ summary: 'Get student credit balance' })
  @ApiResponse({ status: 200, description: 'Returns credit balance' })
  async getCredits(@Req() req) {
    return await this.studentsService.getStudentCredits(req.student.id);
  }

  @Get('me/credit-history')
  @Roles(UserRole.STUDENT)
  @UseGuards(StudentOwnershipGuard)
  @ApiOperation({ summary: 'Get credit transaction history' })
  @ApiResponse({ status: 200, description: 'Returns credit history' })
  async getCreditHistory(@Req() req) {
    return await this.studentsService.getCreditHistory(req.student.id);
  }

  @Get('me/enrollments')
  @Roles(UserRole.STUDENT)
  @UseGuards(StudentOwnershipGuard)
  @ApiOperation({ summary: 'Get student enrollments' })
  @ApiResponse({ status: 200, description: 'Returns list of enrollments' })
  async getEnrollments(@Req() req) {
    return await this.studentsService.getEnrollments(req.student.id);
  }

  @Get('me/grades')
  @Roles(UserRole.STUDENT)
  @UseGuards(StudentOwnershipGuard)
  @ApiOperation({ summary: 'Get student grades' })
  @ApiResponse({ status: 200, description: 'Returns list of grades' })
  async getGrades(@Req() req) {
    return await this.studentsService.getGrades(req.student.id);
  }

  @Post('me/enroll')
  @Roles(UserRole.STUDENT)
  @UseGuards(StudentOwnershipGuard)
  @ApiOperation({ summary: 'Enroll in a group' })
  @ApiResponse({ status: 201, description: 'Enrollment successful' })
  @ApiResponse({ status: 400, description: 'Insufficient credits or group full' })
  @ApiResponse({ status: 409, description: 'Already enrolled in this group' })
  async enrollInGroup(@Req() req, @Body() enrollGroupDto: EnrollGroupDto) {
    return await this.studentsService.enrollInGroup(req.student.id, enrollGroupDto);
  }

  @Delete('me/enroll/:id')
  @Roles(UserRole.STUDENT)
  @UseGuards(StudentOwnershipGuard)
  @ApiOperation({ summary: 'Withdraw from a group' })
  @ApiResponse({ status: 200, description: 'Withdrawal successful' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  async withdrawFromGroup(@Req() req, @Param('id', ParseIntPipe) enrollmentId: number) {
    return await this.studentsService.withdrawFromGroup(req.student.id, enrollmentId);
  }

  @Get('subjects/available')
  @Roles(UserRole.STUDENT)
  @UseGuards(StudentOwnershipGuard)
  @ApiOperation({ summary: 'Get available subjects for enrollment' })
  @ApiResponse({ status: 200, description: 'Returns list of available subjects' })
  async getAvailableSubjects(@Req() req) {
    return await this.studentsService.getAvailableSubjects(req.student.id);
  }
}
