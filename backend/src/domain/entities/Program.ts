import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Enrollment } from './Enrollment';

@Entity('programs')
export class Program {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.program)
  enrollments: Enrollment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}