import axios from 'axios';
import { api } from '../services';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Client', () => {
  // Sample data for testing
  const mockData = { id: 1, name: 'Test' };
  const mockUrl = '/test';
  const mockConfig = { headers: { 'Custom-Header': 'value' } };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup axios mock instance
    mockedAxios.create.mockReturnValue(mockedAxios as any);
  });

  describe('get', () => {
    it('should make a GET request and return data', async () => {
      // Setup
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      // Execute
      const result = await api.get(mockUrl);

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(mockUrl, undefined);
      expect(result).toEqual(mockData);
    });

    it('should make a GET request with config', async () => {
      // Setup
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      // Execute
      const result = await api.get(mockUrl, mockConfig);

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(mockUrl, mockConfig);
      expect(result).toEqual(mockData);
    });

    it('should handle errors in GET request', async () => {
      // Setup
      const errorMessage = 'Network Error';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      // Execute & Assert
      await expect(api.get(mockUrl)).rejects.toThrow(errorMessage);
    });
  });

  describe('post', () => {
    it('should make a POST request and return data', async () => {
      // Setup
      mockedAxios.post.mockResolvedValueOnce({ data: mockData });
      const postData = { name: 'New Test' };

      // Execute
      const result = await api.post(mockUrl, postData);

      // Assert
      expect(mockedAxios.post).toHaveBeenCalledWith(mockUrl, postData, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('put', () => {
    it('should make a PUT request and return data', async () => {
      // Setup
      mockedAxios.put.mockResolvedValueOnce({ data: mockData });
      const putData = { name: 'Updated Test' };

      // Execute
      const result = await api.put(mockUrl, putData);

      // Assert
      expect(mockedAxios.put).toHaveBeenCalledWith(mockUrl, putData, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('patch', () => {
    it('should make a PATCH request and return data', async () => {
      // Setup
      mockedAxios.patch.mockResolvedValueOnce({ data: mockData });
      const patchData = { name: 'Patched Test' };

      // Execute
      const result = await api.patch(mockUrl, patchData);

      // Assert
      expect(mockedAxios.patch).toHaveBeenCalledWith(mockUrl, patchData, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('delete', () => {
    it('should make a DELETE request and return data', async () => {
      // Setup
      mockedAxios.delete.mockResolvedValueOnce({ data: mockData });

      // Execute
      const result = await api.delete(mockUrl);

      // Assert
      expect(mockedAxios.delete).toHaveBeenCalledWith(mockUrl, undefined);
      expect(result).toEqual(mockData);
    });
  });
});