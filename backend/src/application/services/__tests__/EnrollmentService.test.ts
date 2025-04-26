/**
 * Enrollment unit tests
 * Tests I have covered:
 * - createEnrollment - enroll a client into a program
 * - getEnrollmentsByClientId - get all enrollments for a client
 * - getEnrollmentsByProgramId - get all enrollments for a program
 * */

import { EnrollmentService } from '../EnrollmentService';
import { IEnrollmentRepository } from '../../../domain/repositories/IEnrollmentRepository';
import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { IProgramRepository } from '../../../domain/repositories/IProgramRepository';
import { Enrollment } from '../../../domain/entities/Enrollment';
import { Client } from '../../../domain/entities/Client';
import { Program } from '../../../domain/entities/Program';
import { CreateEnrollmentDto, UpdateEnrollmentDto } from '../../dtos/EnrollmentDto';

// Mock repositories
const mockEnrollmentRepository: jest.Mocked<IEnrollmentRepository> = {
    findByClientId: jest.fn(),
    findByProgramId: jest.fn(),
    findById:  jest.fn(),
    findByClientAndProgram: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
};

const mockClientRepository: jest.Mocked<IClientRepository> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByIdentificationNumber: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    search: jest.fn()
};

const mockProgramRepository: jest.Mocked<IProgramRepository> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
};

describe('EnrollmentService', () => {
    let enrollmentService: EnrollmentService;
    
    beforeEach(() => {
        jest.clearAllMocks();
        enrollmentService = new EnrollmentService(
            mockEnrollmentRepository,
            mockClientRepository,
            mockProgramRepository
        );
    });

    describe('createEnrollment', () => {
        it('should create a new enrollment when client and program exist and client is not already enrolled', async () => {
            const enrollmentDto: CreateEnrollmentDto = {
                clientID: 'uuid-uuid-uuid-uuid',
                programID: 'uuid-uuid-uuid-uuid',
                enrollmentDate: new Date('2023-01-01')
            };
            
            const client: Client = {
                id: 'uuid-uuid-uuid-uuid',
                firstName: 'John',
                lastName: 'Doe',
                identificationNumber: '222111333',
                dateOfBirth: new Date('1990-01-01'),
                gender: 'male',
                createdAt: new Date(),
                updatedAt: new Date(),
                enrollments: [],
                email: '',
                phone: '',
                address: '',
                validateContactInfo: function (): void {
                    throw new Error('Function not implemented.');
                }
            };
            
            const program: Program = {
                id: 'uuid-uuid-uuid-uuid',
                name: 'HIV Program',
                description: 'HIV Prevention and Treatment',
                active: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                enrollments: []
            };
            
            const createdEnrollment: Enrollment = {
                id: 'uuid-uuid-uuid',
                clientID: 'uuid-uuid-uuid',
                programID: 'uuid-uuid-uuid',
                client: client,
                program: program,
                enrollmentDate: new Date('2023-01-01'),
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date(),
                exitDate: null,
                notes: ''
            };
            
            mockClientRepository.findById.mockResolvedValue(client);
            mockProgramRepository.findById.mockResolvedValue(program);
            mockEnrollmentRepository.findByClientAndProgram.mockResolvedValue(null);
            mockEnrollmentRepository.create.mockResolvedValue(createdEnrollment);
            
            const result = await enrollmentService.createEnrollment(enrollmentDto);
            
            expect(mockClientRepository.findById).toHaveBeenCalledWith('uuid-uuid-uuid-uuid');
            expect(mockProgramRepository.findById).toHaveBeenCalledWith('uuid-uuid-uuid-uuid');
            expect(mockEnrollmentRepository.findByClientAndProgram).toHaveBeenCalledWith('uuid-uuid-uuid-uuid', 'uuid-uuid-uuid-uuid');
            expect(mockEnrollmentRepository.create).toHaveBeenCalledWith(enrollmentDto);
            expect(result).toEqual(createdEnrollment);
        });

        it('should throw an error when client does not exist', async () => {
            // Arrange
            const enrollmentDto: CreateEnrollmentDto = {
                clientID: '999',
                programID: '1',
                enrollmentDate: new Date('2023-01-01')
            };
            
            mockClientRepository.findById.mockResolvedValue(null);
            
            // Act & Assert
            await expect(enrollmentService.createEnrollment(enrollmentDto)).rejects.toThrow("Client with this ID not found!");
            expect(mockProgramRepository.findById).not.toHaveBeenCalled();
            expect(mockEnrollmentRepository.create).not.toHaveBeenCalled();
        });

        it('should throw an error when program does not exist', async () => {
            // Arrange
            const enrollmentDto: CreateEnrollmentDto = {
                clientID: '1',
                programID: '999',
                enrollmentDate: new Date('2023-01-01')
            };
            
            const client: Client = {
                id: 'uuid-uuid-uuid-uuxx',
                firstName: 'John',
                lastName: 'Doe',
                identificationNumber: '222111333',
                dateOfBirth: new Date('1990-01-01'),
                gender: 'male',
                createdAt: new Date(),
                updatedAt: new Date(),
                enrollments: [],
                email: '',
                phone: '',
                address: '',
                validateContactInfo: function (): void {
                    throw new Error('Function not implemented.');
                }
            };
            
            mockClientRepository.findById.mockResolvedValue(client);
            mockProgramRepository.findById.mockResolvedValue(null);
            
            await expect(enrollmentService.createEnrollment(enrollmentDto)).rejects.toThrow('Program not found!');
            expect(mockEnrollmentRepository.create).not.toHaveBeenCalled();
        });

        it('should throw an error when client is already enrolled in the program', async () => {

            const enrollmentDto: CreateEnrollmentDto = {
                clientID: 'uuid-uuid-uuid-uuid',
                programID: 'uuid-uuid-uuid-uuid',
                enrollmentDate: new Date('2023-01-01')
            };
            
            const client: Client = {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                identificationNumber: '222111333',
                dateOfBirth: new Date('1990-01-01'),
                gender: 'male',
                createdAt: new Date(),
                updatedAt: new Date(),
                enrollments: [],
                email: '',
                phone: '',
                address: '',
                validateContactInfo: function (): void {
                    throw new Error('Function not implemented.');
                }
            };
            
            const program: Program = {
                id: 'uuid-uuid-uuid-uuid',
                name: 'HIV Program',
                description: 'HIV Prevention and Treatment',
                active: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                enrollments: []
            };
            
            const existingEnrollment: Enrollment = {
                id: 'uuid-uuid-uuid-uuid',
                clientID: 'uuid-uuid-uuid-uuid',
                programID: 'uuid-uuid-uuid-uuid',
                client: client,
                program: program,
                enrollmentDate: new Date('2022-01-01'),
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date(),
                exitDate: null,
                notes: ''
            };
            
            mockClientRepository.findById.mockResolvedValue(client);
            mockProgramRepository.findById.mockResolvedValue(program);
            mockEnrollmentRepository.findByClientAndProgram.mockResolvedValue(existingEnrollment);
            
            await expect(enrollmentService.createEnrollment(enrollmentDto)).rejects.toThrow(
                'Client is already enrolled in this program!'
            );
            expect(mockEnrollmentRepository.create).not.toHaveBeenCalled();
        });
    });

    describe('getEnrollmentsByClientId', () => {
        it('should return enrollments when client exists', async () => {
            const clientId = 'uuid-uuid-uuid-uuid';
            const client: Client = {
                id: 'uuid-uuid-uuid-uuid',
                firstName: 'John',
                lastName: 'Doe',
                identificationNumber: '222111333',
                dateOfBirth: new Date('1990-01-01'),
                gender: 'male',
                createdAt: new Date(),
                updatedAt: new Date(),
                enrollments: [],
                email: '',
                phone: '',
                address: '',
                validateContactInfo: function (): void {
                    throw new Error('Function not implemented.');
                }
            };
            
            const enrollments: Enrollment[] = [
                {
                    id: 'uuid-uuid-uuid',
                    clientID: 'uuid-uuid-uuid',
                    programID: 'uuid-uuid-uuid',
                    client: client,
                    program: {
                        id: 'uuid-uuid-uuid',
                        name: 'HIV Program',
                        description: 'HIV Prevention and Treatment',
                        active: true,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        enrollments: []
                    },
                    enrollmentDate: new Date('2023-01-01'),
                    status: 'active',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    exitDate: null,
                    notes: ''
                }
            ];
            
            mockClientRepository.findById.mockResolvedValue(client);
            mockEnrollmentRepository.findByClientId.mockResolvedValue(enrollments);
            
            const result = await enrollmentService.getEnrollmentsByClientId(clientId);
            
            expect(mockClientRepository.findById).toHaveBeenCalledWith(clientId);
            expect(mockEnrollmentRepository.findByClientId).toHaveBeenCalledWith(clientId);
            expect(result).toEqual(enrollments);
        });

        it('should throw an error when client does not exist', async () => {
            const clientId = 'abcd-uuid-uuid-uuid';
            mockClientRepository.findById.mockResolvedValue(null);
            
            await expect(enrollmentService.getEnrollmentsByClientId(clientId)).rejects.toThrow("Client with this ID not found!");
            expect(mockEnrollmentRepository.findByClientId).not.toHaveBeenCalled();
        });
    });

    describe('getEnrollmentByProgramId', () => {
        it('should return enrollments when program exists', async () => {
            const programId = 'uuid-uuid-uuid-uuid';
            const program: Program = {
                id: 'uuid-uuid-uuid-uuid',
                name: 'HIV Program',
                description: 'HIV Prevention and Treatment',
                active: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                enrollments: []
            };

            const enrollments: Enrollment[] = [
                {
                    id: 'uuid-uuid-uuid',
                    clientID: 'uuid-uuid-uuid',
                    programID: 'uuid-uuid-uuid',
                    client: {
                        id: 'uuid-uuid-uuid',
                        firstName: 'John',
                        lastName: 'Doe',
                        identificationNumber: '222111333',
                        dateOfBirth: new Date('1990-01-01'),
                        gender: 'male',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        enrollments: [],
                        email: '',
                        phone: '',
                        address: '',
                        validateContactInfo: function (): void {
                            throw new Error('Function not implemented.');
                        }
                    },
                    program: program,
                    enrollmentDate: new Date('2023-01-01'),
                    status: 'active',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    exitDate: null,
                    notes: ''
                }
            ];

            mockProgramRepository.findById.mockResolvedValue(program);
            mockEnrollmentRepository.findByProgramId.mockResolvedValue(enrollments);

            const result = await enrollmentService.getEnrollmentsByProgramId(programId);

            expect(mockProgramRepository.findById).toHaveBeenCalledWith(programId);
            expect(mockEnrollmentRepository.findByProgramId).toHaveBeenCalledWith(programId);
            expect(result).toEqual(enrollments);
        });

        it('should throw an error when program does not exist', async () => {
            const programId = 'abcd-uuid-uuid-uuid';
            mockProgramRepository.findById.mockResolvedValue(null);

            await expect(enrollmentService.getEnrollmentsByProgramId(programId)).rejects.toThrow('Program with given ID not found!');
            expect(mockEnrollmentRepository.findByProgramId).not.toHaveBeenCalled();
        });
    })
});