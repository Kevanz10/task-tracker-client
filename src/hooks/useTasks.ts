import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '../services/api';

export function useTasks() {
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  return {
    tasks,
    isLoading,
    error: error?.message ?? null,
  };
}
