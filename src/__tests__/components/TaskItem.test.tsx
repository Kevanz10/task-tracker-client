import { render, screen } from '@testing-library/react';
import { TaskItem } from '../../components/TaskItem';
import { createMockTask } from '../utils/testUtils';

describe('TaskItem', () => {
  it('renders task description', () => {
    const task = createMockTask({ description: 'Buy groceries' });

    render(<TaskItem task={task} />);

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('renders as a list item', () => {
    const { container } = render(<TaskItem task={createMockTask()} />);

    expect(container.querySelector('li')).toBeInTheDocument();
  });
});
