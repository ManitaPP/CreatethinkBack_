/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { Repository } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { Attendance } from 'src/attendances/entities/attendance.entity';

@Injectable()
export class AssignmentsService {
  //create constructor to inject assignmentRepository and courseRepository and roomRepository
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}
  async create(createAssignmentDto: CreateAssignmentDto) {
    try {
      //find room and course by id
      const room = await this.roomRepository.findOne({
        where: { roomId: createAssignmentDto.roomId },
      });
      const course = await this.courseRepository.findOne({
        where: { coursesId: createAssignmentDto.courseId },
      });

      if (!room || !course) {
        throw new Error('Room or Course not found');
      }

      //create new assignment
      const newAssignment = new Assignment();
      newAssignment.nameAssignment = createAssignmentDto.nameAssignment;
      newAssignment.room = room;
      newAssignment.course = course;
      newAssignment.assignMentTime = new Date();
      //save new assignment
      return this.assignmentRepository.save(newAssignment);
    } catch (error) {
      throw new Error('Error creating assignment');
    }
  }
  findAll() {
    try {
      //find all assignments
      return this.assignmentRepository.find();
    } catch (error) {
      throw new Error('Error fetching assignments');
    }
  }

  findOne(id: number) {
    try {
      //find assignment by id
      return this.assignmentRepository.findOne({ where: { assignmentId: id } });
    } catch (error) {
      throw new Error('Error fetching assignment');
    }
  }

  update(id: number, updateAssignmentDto: UpdateAssignmentDto) {
    //check if assignment exists
    const assignment = this.assignmentRepository.findOne({
      where: { assignmentId: id },
    });
    if (!assignment) {
      throw new Error('Assignment not found');
    }
    //update assignment
    return this.assignmentRepository.update(id, updateAssignmentDto);
  }

  async remove(id: number) {
    //check if assignment exists
    const assignment = this.assignmentRepository.findOne({
      where: { assignmentId: id },
    });
    if (!assignment) {
      throw new Error('Assignment not found');
    }
    //delete attendance by loop
    const attendances = await this.attendanceRepository.find({
      where: { assignment: { assignmentId: id } },
    });
    for (let i = 0; i < attendances.length; i++) {
      this.attendanceRepository.delete(attendances[i].id);
    }
    //delete assignment
    return this.assignmentRepository.delete(id);
  }
}
