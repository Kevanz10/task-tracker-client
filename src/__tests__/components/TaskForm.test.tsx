import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from '../../components/TaskForm';
import * as api from '../../services/api';
import { createMockTask, renderWithQueryClient } from '../utils/testUtils';

jest.mock('../../services/api');
const mockCreateTask = api.createTask as jest.MockedFunction<typeof api.createTask>;

describe('TaskForm', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockCreateTask.mockClear();
  });

  it('renders input and submit button', () => {
    renderWithQueryClient(<TaskForm />);

    expect(screen.getByPlaceholderText('Enter task description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Task' })).toBeInTheDocument();
  });

  it('allows user to type in the input', async () => {
    renderWithQueryClient(<TaskForm />);

    const input = screen.getByPlaceholderText('Enter task description') as HTMLInputElement;
    await user.type(input, 'Buy groceries');

    expect(input.value).toBe('Buy groceries');
  });

  describe('on form submission', () => {
    it('creates task', async () => {
      mockCreateTask.mockResolvedValueOnce(createMockTask({ description: 'Buy groceries' }));

      renderWithQueryClient(<TaskForm />);

      const input = screen.getByPlaceholderText('Enter task description');
      const submitButton = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, 'Buy groceries');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCreateTask).toHaveBeenCalled();
        expect(mockCreateTask.mock.calls[0][0]).toBe('Buy groceries');
      });
    });

    it('resets form after successful submission', async () => {
      mockCreateTask.mockResolvedValueOnce(createMockTask({ description: 'Buy groceries' }));

      renderWithQueryClient(<TaskForm />);

      const input = screen.getByPlaceholderText('Enter task description') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, 'Buy groceries');
      await user.click(submitButton);

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });

    it('shows loading state during submission', async () => {
      mockCreateTask.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(createMockTask()), 100))
      );

      renderWithQueryClient(<TaskForm />);

      const input = screen.getByPlaceholderText('Enter task description');
      const submitButton = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, 'Buy groceries');
      await user.click(submitButton);

      expect(screen.getByRole('button', { name: 'Adding...' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Adding...' })).toBeDisabled();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Add Task' })).toBeInTheDocument();
      });
    });
  });

  describe('when task creation fails', () => {
    it('displays error message', async () => {
      mockCreateTask.mockRejectedValueOnce(new Error('Server error'));

      renderWithQueryClient(<TaskForm />);

      const input = screen.getByPlaceholderText('Enter task description');
      const submitButton = screen.getByRole('button', { name: 'Add Task' });

      await user.type(input, 'Buy groceries');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Server error');
      });
    });
  });
});
