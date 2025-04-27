import axios from 'axios';
import programService, { Program } from '../program.service';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Program Service', () => {
  // Sample program data for testing
  const mockProgram: Program = {
    id: '1',
    name: 'Test Program',
    description: 'Test Description',
    active: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  const mockPrograms: Program[] = [mockProgram];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup axios mock instance
    mockedAxios.create.mockReturnValue(mockedAxios as any);
  });

  describe('getAllPrograms', () => {
    it('should fetch all dummyPrograms successfully', async () => {
      // Setup
      mockedAxios.get.mockResolvedValueOnce({ data: mockPrograms });

      // Execute
      const result = await programService.getAllPrograms();

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith('/dummyPrograms');
      expect(result).toEqual(mockPrograms);
    });

    it('should handle errors when fetching dummyPrograms', async () => {
      // Setup
      const errorMessage = 'Network Error';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      // Execute & Assert
      await expect(programService.getAllPrograms()).rejects.toThrow(errorMessage);
    });
  });

  describe('getProgramById', () => {
    it('should fetch a program by ID successfully', async () => {
      // Setup
      mockedAxios.get.mockResolvedValueOnce({ data: mockProgram });
      const programId = '1';

      // Execute
      const result = await programService.getProgramById(programId);

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(`/programs/${programId}`);
      expect(result).toEqual(mockProgram);
    });
  });

  describe('createProgram', () => {
    it('should create a program successfully', async () => {
      // Setup
      const newProgram = {
        name: 'New Program',
        description: 'New Description',
        active: true,
      };
      mockedAxios.post.mockResolvedValueOnce({ data: { ...mockProgram, ...newProgram } });

      // Execute
      const result = await programService.createProgram(newProgram);

      // Assert
      expect(mockedAxios.post).toHaveBeenCalledWith('/dummyPrograms', newProgram);
      expect(result).toEqual({ ...mockProgram, ...newProgram });
    });
  });

  describe('updateProgram', () => {
    it('should update a program successfully', async () => {
      // Setup
      const programId = '1';
      const updateData = {
        name: 'Updated Program',
        active: false,
      };
      mockedAxios.put.mockResolvedValueOnce({ 
        data: { ...mockProgram, ...updateData } 
      });

      // Execute
      const result = await programService.updateProgram(programId, updateData);

      // Assert
      expect(mockedAxios.put).toHaveBeenCalledWith(`/programs/${programId}`, updateData);
      expect(result).toEqual({ ...mockProgram, ...updateData });
    });
  });

  describe('deleteProgram', () => {
    it('should delete a program successfully', async () => {
      // Setup
      const programId = '1';
      mockedAxios.delete.mockResolvedValueOnce({ data: undefined });

      // Execute
      await programService.deleteProgram(programId);

      // Assert
      expect(mockedAxios.delete).toHaveBeenCalledWith(`/programs/${programId}`);
    });
  });
});