import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    JoinColumn, 
    CreateDateColumn, 
    UpdateDateColumn 
  } from 'typeorm';
import { Client } from './Client';
import { Program } from './Program';
  
  @Entity('enrollments')
  export class Enrollment {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Client, (client) => client.enrollments)
    @JoinColumn({ name: 'clientID' })
    client: Client;
  
    @Column()
    clientID: string;
  
    @ManyToOne(() => Program, (program) => program.enrollments)
    @JoinColumn({ name: 'programID' })
    program: Program;
  
    @Column()
    programID: string;
  
    @Column({ type: 'date' })
    enrollmentDate: Date;
  
    @Column({ type: 'date', nullable: true })
    exitDate: Date;
  
    @Column({ default: 'active' })
    status: 'active' | 'completed' | 'withdrawn';
  
    @Column({ type: 'text', nullable: true })
    notes: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date
  }