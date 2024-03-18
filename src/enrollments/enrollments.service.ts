/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { Enrollment } from './entities/enrollment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}
  create(createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentRepository.save(createEnrollmentDto);
  }

  findAll() {
    return this.enrollmentRepository.find();
  }

  async findOne(id: number) {
    const enrollment = await this.enrollmentRepository.findOneBy({ id: id });
    if (!enrollment) {
      throw new NotFoundException('enrollment not found');
    } else {
      return enrollment;
    }
  }

  async update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    const enrollment = await this.enrollmentRepository.findOneBy({ id: id });
    if (!enrollment) {
      throw new NotFoundException('enrollment not found');
    }
    return await this.enrollmentRepository.save({
      ...enrollment,
      ...updateEnrollmentDto,
    });
  }

  async remove(id: number) {
    const enrollment = await this.enrollmentRepository.findOneBy({ id: id });
    if (!enrollment) {
      throw new NotFoundException('course not found');
    }
    return this.enrollmentRepository.softRemove(enrollment);
  }
}