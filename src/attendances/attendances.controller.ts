import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Patch,
  Res,
} from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';

@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './attendance_image',
        filename: (req, file, cb) => {
          // Temp filename just to save the file initially
          const tempFilename = uuidv4() + extname(file.originalname);
          cb(null, tempFilename);
        },
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createAttendanceDto: CreateAttendanceDto,
  ) {
    createAttendanceDto.attendanceImage = file.filename;
    // Proceed with your service logic
    return this.attendancesService.create(createAttendanceDto);
  }
  @Get()
  findAll() {
    return this.attendancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendancesService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendancesService.update(+id, updateAttendanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendancesService.remove(+id);
  }

  @Get('/assignments/:assignmentId')
  findByAssignmentId(@Param('assignmentId') assignmentId: string) {
    return this.attendancesService.getAttendanceByAssignmentId(+assignmentId);
  }
  // getAttendanceByStatusInAssignment
  @Get('/assignments/status/:assignmentId')
  getAttendanceByStatusInAssignment(
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.attendancesService.getAttendanceByStatusInAssignment(
      +assignmentId,
    );
  }
  @Get('image/:imageFile')
  async getImageByFileName(
    @Param('imageFile') imageFile: string,
    @Res() res: Response,
  ) {
    res.sendFile(imageFile, { root: './attendance_image' });
  }

  //confirm attendance
  @Patch('confirm/:id')
  async confirmAttendance(@Param('id') id: string) {
    return this.attendancesService.confirmAttendance(+id);
  }
  //reject attendance
  @Patch('reject/:id')
  async rejectAttendance(@Param('id') id: string) {
    return this.attendancesService.rejectAttendance(+id);
  }
  // getAttendanceByCourseId
  @Get('/courses/:courseId')
  getAttendanceByCourseId(@Param('courseId') courseId: string) {
    return this.attendancesService.getAttendanceByCourseId(+courseId);
  }
  // checkAllAttendance

  @Get('/checkAllAttendance/:assigmentId')
  checkAllAttendance(@Param('assigmentId') assigmentId: string) {
    return this.attendancesService.checkAllAttendance(+assigmentId);
  }
}
