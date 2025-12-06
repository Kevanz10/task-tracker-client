import { fetchTasks, createTask } from '../../services/api';
import type { Task } from '../../types/task';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Service', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
  
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('fetchTasks', () => {
    it('should fetch and return tasks successfully', async () => {
      const mockTasks: Task[] = [
        { id: 1, description: 'Task 1', created_at: '2024-01-01T00:00:00Z' },
        { id: 2, description: 'Task 2', created_at: '2024-01-02T00:00:00Z' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      } as Response);

      const result = await fetchTasks();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/tasks');
      expect(result).toEqual(mockTasks);
    });
  });

  describe('createTask', () => {
    it('should create a task and return it successfully', async () => {
      const newTask: Task = {
        id: 1,
        description: 'New Task',
        created_at: '2024-01-01T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => newTask,
      } as Response);

      const result = await createTask('New Task');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: 'New Task' }),
      });
      expect(result).toEqual(newTask);
    });
  });
});

