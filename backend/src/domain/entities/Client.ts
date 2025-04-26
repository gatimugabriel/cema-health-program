import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Enrollment } from './Enrollment';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  identificationNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column()
  gender: 'male' | 'female' | 'other';

  @Column({ type: 'text', nullable: true })
  address: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.client)
  enrollments: Enrollment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}