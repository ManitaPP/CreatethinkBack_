import { Assignment } from 'src/assignments/entities/assignment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  attendanceId: number;

  @Column({
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  attendanceDate: Date;

  @Column()
  attendanceStatus: string;

  @ManyToOne(() => User, (user) => user.attendance)
  user: User;

  @ManyToOne(() => Assignment, (assignment) => assignment.attendances)
  assignment: Assignment;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
