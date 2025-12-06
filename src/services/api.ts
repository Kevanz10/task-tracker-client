import type { Task } from '../types/task';

const API_BASE_URL = 'http://localhost:3000';

async function parseErrorResponse(response: Response): Promise<string> {
  const fallback = response.statusText || 'An error occurred';

  try {
    const data = await response.json();
    if (Array.isArray(data.errors)) {
      return data.errors.join(', ');
    }
    return fallback;
  } catch {
    return fallback;
  }
}

function handleNetworkError(error: unknown): never {
  if (error instanceof TypeError) {
    throw new Error('Unable to connect to the server');
  }
  throw error;
}

export async function fetchTasks(): Promise<Task[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`);

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response);
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    handleNetworkError(error);
  }
}

export async function createTask(description: string): Promise<Task> {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response);
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    handleNetworkError(error);
  }
}
