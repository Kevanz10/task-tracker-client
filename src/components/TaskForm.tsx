import { useState, FormEvent } from 'react';
import { useCreateTask } from '../hooks/useCreateTask';
import { ErrorMessage } from './ErrorMessage';

export function TaskForm() {
  const [description, setDescription] = useState('');
  const { createTask, isCreating, error } = useCreateTask();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTask(description.trim(), {
      onSuccess: () => setDescription(''),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      {error && <ErrorMessage message={error} />}
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter task description"
        disabled={isCreating}
      />
      <button type="submit" disabled={isCreating || !description.trim()}>
        {isCreating ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}
