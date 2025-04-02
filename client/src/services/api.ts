import axios from 'axios';
import { Prompt, Folder, Tag, PromptInputData } from '../types';

// Use relative path because of Vite proxy
const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for handling errors globally (optional but recommended)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error or show notification
    console.error('API Error:', error.response?.data || error.message);
    // You could throw the error again or return a specific error object
    return Promise.reject(error.response?.data || { message: error.message });
  }
);

// == Prompt API ==
export const getPrompts = (params?: { folderId?: string; tagId?: string; search?: string }): Promise<Prompt[]> =>
  apiClient.get('/prompts', { params }).then(res => res.data);

export const getPromptById = (id: string): Promise<Prompt> =>
  apiClient.get(`/prompts/${id}`).then(res => res.data);

export const createPrompt = (data: PromptInputData): Promise<Prompt> =>
  apiClient.post('/prompts', data).then(res => res.data);

export const updatePrompt = (id: string, data: PromptInputData): Promise<Prompt> =>
  apiClient.put(`/prompts/${id}`, data).then(res => res.data);

export const deletePrompt = (id: string): Promise<{ message: string; promptId: string }> =>
  apiClient.delete(`/prompts/${id}`).then(res => res.data);

// == Folder API ==
export const getFolders = (): Promise<Folder[]> =>
  apiClient.get('/folders').then(res => res.data);

export const createFolder = (data: { name: string; description?: string }): Promise<Folder> =>
  apiClient.post('/folders', data).then(res => res.data);

export const updateFolder = (id: string, data: { name?: string; description?: string }): Promise<Folder> =>
    apiClient.put(`/folders/${id}`, data).then(res => res.data);

export const deleteFolder = (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/folders/${id}`).then(res => res.data);


// == Tag API ==
export const getTags = (): Promise<Tag[]> =>
  apiClient.get('/tags').then(res => res.data);

export const createTag = (data: { name: string; color?: string }): Promise<Tag> =>
  apiClient.post('/tags', data).then(res => res.data);

export const updateTag = (id: string, data: { name?: string; color?: string }): Promise<Tag> =>
    apiClient.put(`/tags/${id}`, data).then(res => res.data);

export const deleteTag = (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/tags/${id}`).then(res => res.data);

export default apiClient;