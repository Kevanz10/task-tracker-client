import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../services/api';
import type { Task } from '../types/task';

export function useCreateTask() {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      queryClient.setQueryData<Task[]>(['tasks'], (old) => [newTask, ...(old ?? [])]);
    },
  });

  return {
    createTask: mutate,
    isCreating: isPending,
    error: error?.message ?? null,
  };
}

