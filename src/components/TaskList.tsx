import { useTasks } from '../hooks/useTasks';
import { ErrorMessage } from './ErrorMessage';
import { TaskForm } from './TaskForm';
import { TaskItem } from './TaskItem';

export function TaskList() {
  const { tasks, isLoading, error } = useTasks();

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div>
      {error && <ErrorMessage message={error} />}
      <TaskForm />
      <ul>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
}
