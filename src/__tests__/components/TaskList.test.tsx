import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from '../../components/TaskList';
import * as api from '../../services/api';
import { createMockTask, renderWithQueryClient } from '../utils/testUtils';

jest.mock('../../services/api');
const mockFetchTasks = api.fetchTasks as jest.MockedFunction<typeof api.fetchTasks>;
const mockCreateTask = api.createTask as jest.MockedFunction<typeof api.createTask>;

describe('TaskList', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockFetchTasks.mockClear();
    mockCreateTask.mockClear();
  });

  describe('on mount', () => {
    it('fetches and displays tasks', async () => {
      const mockTasks = [
        createMockTask({ id: 1, description: 'Task 1' }),
        createMockTask({ id: 2, description: 'Task 2' }),
      ];
      mockFetchTasks.mockResolvedValueOnce(mockTasks);

      renderWithQueryClient(<TaskList />);

      expect(mockFetchTasks).toHaveBeenCalled();

      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
      });
    });

    it('displays loading state while fetching', () => {
      mockFetchTasks.mockImplementation(() => new Promise(() => {}));

      renderWithQueryClient(<TaskList />);

      expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
    });
  });

  describe('when a new task is created', () => {
    it('adds the task to the list', async () => {
      const initialTasks = [createMockTask({ id: 1, description: 'Existing Task' })];
      const newTask = createMockTask({ id: 2, description: 'New Task' });

      mockFetchTasks.mockResolvedValueOnce(initialTasks);
      mockCreateTask.mockResolvedValueOnce(newTask);

      renderWithQueryClient(<TaskList />);

      await waitFor(() => {
        expect(screen.getByText('Existing Task')).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('Enter task description');
      const submitButton = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, 'New Task');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('New Task')).toBeInTheDocument();
        expect(screen.getByText('Existing Task')).toBeInTheDocument();
      });
    });

    it('displays new task at the top of the list', async () => {
      const initialTasks = [createMockTask({ id: 1, description: 'First Task' })];
      const newTask = createMockTask({ id: 2, description: 'New Task' });

      mockFetchTasks.mockResolvedValueOnce(initialTasks);
      mockCreateTask.mockResolvedValueOnce(newTask);

      renderWithQueryClient(<TaskList />);

      await waitFor(() => {
        expect(screen.getByText('First Task')).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('Enter task description');
      const submitButton = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, 'New Task');
      await user.click(submitButton);

      await waitFor(() => {
        const listItems = screen.getAllByRole('listitem');
        expect(listItems[0]).toHaveTextContent('New Task');
        expect(listItems[1]).toHaveTextContent('First Task');
      });
    });
  });

  describe('when fetching tasks fails', () => {
    it('displays error message', async () => {
      mockFetchTasks.mockRejectedValueOnce(new Error('Unable to connect to the server'));

      renderWithQueryClient(<TaskList />);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Unable to connect to the server');
      });
    });
  });
});
