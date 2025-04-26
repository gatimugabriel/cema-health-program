/**
 * Program Service Unit tests
 * @group unit/program
 * @description: I have only tested the creation and updating logic for now (due to time limits)
 * */

import {ProgramService} from "../ProgramService";
import {Program} from "../../../domain/entities/Program";
import {CreateProgramDto, UpdateProgramDto} from "../../dtos/ProgramDto";
import {IProgramRepository} from "../../../domain/repositories/IProgramRepository";

describe('ProgramService', () => {
    let programService: ProgramService;
    let mockProgramRepository: jest.Mocked<IProgramRepository>;

    beforeEach(() => {
        mockProgramRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByName: jest.fn()
        }

        programService = new ProgramService(mockProgramRepository)
    })

    //--------- 1. CREATE PROGRAM ------------//
    describe('createProgram', () => {
        it('should create a new program', async () => {
            const programData: CreateProgramDto = {
                name: 'New program',
                description: 'Test Description',
            }

            const expectedProgram: Program = {
                id: 'uuid-uuid-uuid-uuid',
                name: programData.name,
                description: programData.description as string,
                active: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                enrollments: []
            }

            mockProgramRepository.create.mockResolvedValue(expectedProgram);

            // action
            const result = await programService.createProgram(programData)

            // assertions
            expect(mockProgramRepository.create).toHaveBeenCalledWith(programData)
            expect(result).toEqual(expectedProgram)
        })

        it('should throw error if repository fails', async () => {
            const programData: CreateProgramDto = {
                name: 'Error Program',
                description: 'error description',
            };

            const error = new Error('Database error');
            mockProgramRepository.create.mockRejectedValue(error);

            //act + assert
            await expect(programService.createProgram(programData)).rejects.toThrow('Database error');
        });
    })

    //--------- 2. UPDATE PROGRAM ------------//
    describe('updateProgram', () => {
        it('should update an existing program', async () => {

            const programId = 'uuid-uuid-uuid-uuid';
            const updateData: Partial<UpdateProgramDto> = {
                name: 'Updated Program',
                description: 'Updated description'
            };

            const existingProgram: Program = {
                id: programId,
                name: 'Original Program',
                description: 'Original description',
                active: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                enrollments: []
            };

            const updatedProgram: Program = {
                ...existingProgram,
                name: updateData.name as string,
                description: updateData.description as string,
                updatedAt: new Date()
            }

            mockProgramRepository.findById.mockResolvedValue(existingProgram);
            mockProgramRepository.update.mockResolvedValue(updatedProgram);

            //action
            const result = await programService.updateProgram(programId, updateData);

            //assertions
            expect(mockProgramRepository.findById).toHaveBeenCalledWith(programId);
            expect(mockProgramRepository.update).toHaveBeenCalledWith(programId, updateData);
            expect(result).toEqual(updatedProgram);
        });

        it('should throw error if program not found', async () => {
            const nonExistentId = '404-id';

            mockProgramRepository.findById.mockResolvedValue(null);

            await expect(programService.updateProgram(nonExistentId, {}))
                .rejects.toThrow('Program not found/ may have been deleted!');
        });
    });

})