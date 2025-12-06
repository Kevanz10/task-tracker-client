import { renderHook, waitFor } from '@testing-library/react';
import { useCreateTask } from '../../hooks/useCreateTask';
import * as api from '../../services/api';
import { createMockTask, createQueryWrapper } from '../utils/testUtils';

jest.mock('../../services/api');
const mockCreateTask = api.createTask as jest.MockedFunction<typeof api.createTask>;

describe('useCreateTask', () => {
  beforeEach(() => {
    mockCreateTask.mockClear();
  });

  it('creates a task and calls the API', async () => {
    mockCreateTask.mockResolvedValueOnce(createMockTask({ description: 'New Task' }));

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCreateTask(), { wrapper });

    result.current.createTask('New Task');

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalled();
      expect(mockCreateTask.mock.calls[0][0]).toBe('New Task');
    });
  });

  it('sets error on mutation failure', async () => {
    mockCreateTask.mockRejectedValueOnce(new Error('Server error'));

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCreateTask(), { wrapper });

    result.current.createTask('New Task');

    await waitFor(() => {
      expect(result.current.error).toBe('Server error');
    });
  });

  it('updates tasks cache on success', async () => {
    const newTask = createMockTask({ id: 2, description: 'New Task' });
    mockCreateTask.mockResolvedValueOnce(newTask);

    const { wrapper, queryClient } = createQueryWrapper();
    queryClient.setQueryData(['tasks'], [createMockTask({ id: 1, description: 'Existing' })]);

    const { result } = renderHook(() => useCreateTask(), { wrapper });

    result.current.createTask('New Task');

    await waitFor(() => {
      const tasks = queryClient.getQueryData<typeof newTask[]>(['tasks']);
      expect(tasks?.[0]).toEqual(newTask);
    });
  });
});
