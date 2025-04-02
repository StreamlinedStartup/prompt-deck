import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { Prompt, Folder, Tag } from '../types';
import toast from 'react-hot-toast';

// Hook to fetch and manage prompts
export function usePrompts(initialFilter?: { folderId?: string; tagId?: string }) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState(initialFilter);

  const fetchPrompts = useCallback(async (currentFilter?: { folderId?: string; tagId?: string; search?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPrompts(currentFilter);
      setPrompts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch prompts');
      toast.error(err.message || 'Failed to fetch prompts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrompts(filter);
  }, [fetchPrompts, filter]); // Refetch when filter changes

  const addPrompt = (newPrompt: Prompt) => {
    setPrompts(prev => [newPrompt, ...prev]); // Add to the beginning
  };

  const updatePromptInList = (updatedPrompt: Prompt) => {
    setPrompts(prev => prev.map(p => p._id === updatedPrompt._id ? updatedPrompt : p));
  };

  const removePrompt = (promptId: string) => {
    setPrompts(prev => prev.filter(p => p._id !== promptId));
  };

  // Function to update the filter state and trigger refetch
  const applyFilter = (newFilter: { folderId?: string; tagId?: string; search?: string }) => {
    setFilter(newFilter);
  };

  return { prompts, loading, error, fetchPrompts, addPrompt, updatePromptInList, removePrompt, applyFilter, currentFilter: filter };
}

// Hook to fetch and manage folders
export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getFolders();
      setFolders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch folders');
      toast.error(err.message || 'Failed to fetch folders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const addFolder = (newFolder: Folder) => {
    setFolders(prev => [...prev, newFolder].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const removeFolder = (folderId: string) => {
    setFolders(prev => prev.filter(f => f._id !== folderId));
    // Optionally trigger prompt refetch if needed
  };

  return { folders, loading, error, fetchFolders, addFolder, removeFolder };
}

// Hook to fetch and manage tags
export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTags();
      setTags(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tags');
      toast.error(err.message || 'Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

   const addTag = (newTag: Tag) => {
    setTags(prev => [...prev, newTag].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const removeTag = (tagId: string) => {
    setTags(prev => prev.filter(t => t._id !== tagId));
     // Optionally trigger prompt refetch if needed
  };

  return { tags, loading, error, fetchTags, addTag, removeTag };
}