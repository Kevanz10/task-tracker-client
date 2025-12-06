import { renderHook, waitFor } from '@testing-library/react';
import { useTasks } from '../../hooks/useTasks';
import * as api from '../../services/api';
import { createMockTask, createQueryWrapper } from '../utils/testUtils';

jest.mock('../../services/api');
const mockFetchTasks = api.fetchTasks as jest.MockedFunction<typeof api.fetchTasks>;

describe('useTasks', () => {
  beforeEach(() => {
    mockFetchTasks.mockClear();
  });

  it('fetches tasks on initial render', async () => {
    const mockTasks = [createMockTask({ id: 1, description: 'Task 1' })];
    mockFetchTasks.mockResolvedValueOnce(mockTasks);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchTasks).toHaveBeenCalledTimes(1);
    expect(result.current.tasks).toEqual(mockTasks);
  });

  it('sets loading state while fetching', () => {
    mockFetchTasks.mockImplementation(() => new Promise(() => {}));

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useTasks(), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });

  it('sets error on fetch failure', async () => {
    mockFetchTasks.mockRejectedValueOnce(new Error('Network error'));

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.tasks).toEqual([]);
  });
});
