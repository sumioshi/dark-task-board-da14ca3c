
import { Task, AuthResponse } from '../types';

const API_URL = 'http://localhost:8000/api'; // We'll replace this with your actual Django API URL

// Mock data for testing without backend
const MOCK_MODE = true; // Set to false when connecting to real backend

// Auth APIs
export const registerUser = async (username: string, password: string): Promise<AuthResponse> => {
  if (MOCK_MODE) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    if (users.find((user: any) => user.username === username)) {
      throw new Error('Username already exists');
    }
    
    // Create new user
    const newUser = { username, password };
    users.push(newUser);
    localStorage.setItem('mockUsers', JSON.stringify(users));
    
    return {
      token: `mock_token_${Date.now()}`,
      username
    };
  }
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const loginUser = async (username: string, password: string): Promise<AuthResponse> => {
  if (MOCK_MODE) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check credentials
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const user = users.find((user: any) => user.username === username && user.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return {
      token: `mock_token_${Date.now()}`,
      username
    };
  }
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Task APIs
export const fetchTasks = async (token: string): Promise<Task[]> => {
  if (MOCK_MODE) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]');
    return tasks;
  }
  
  try {
    const response = await fetch(`${API_URL}/tarefas`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (token: string, task: Omit<Task, 'id'>): Promise<Task> => {
  if (MOCK_MODE) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get existing tasks
    const tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]');
    
    // Create new task with ID
    const newTask: Task = {
      ...task,
      id: Date.now() // Simple ID generation for mock
    };
    
    // Save to localStorage
    tasks.push(newTask);
    localStorage.setItem('mockTasks', JSON.stringify(tasks));
    
    return newTask;
  }
  
  try {
    const response = await fetch(`${API_URL}/tarefas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTaskStatus = async (token: string, id: number, status: string): Promise<Task> => {
  if (MOCK_MODE) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get existing tasks
    const tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]');
    
    // Find and update task
    const taskIndex = tasks.findIndex((task: Task) => task.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    tasks[taskIndex].status = status;
    localStorage.setItem('mockTasks', JSON.stringify(tasks));
    
    return tasks[taskIndex];
  }
  
  try {
    const response = await fetch(`${API_URL}/tarefas/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (token: string, id: number): Promise<void> => {
  if (MOCK_MODE) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get existing tasks
    const tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]');
    
    // Filter out the task to delete
    const filteredTasks = tasks.filter((task: Task) => task.id !== id);
    localStorage.setItem('mockTasks', JSON.stringify(filteredTasks));
    
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/tarefas/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
