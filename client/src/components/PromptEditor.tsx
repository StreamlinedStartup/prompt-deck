import React, { useState, useEffect } from 'react';
import Modal from './common/Modal';
import { Prompt, Tag, Folder, PromptInputData, SelectOption } from '../types';
import * as api from '../services/api';
import toast from 'react-hot-toast';
import Select from 'react-select'; // Using react-select for tags

interface PromptEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prompt: Prompt) => void; // Callback after successful save
  promptToEdit?: Prompt | null; // Prompt data if editing
  availableTags: Tag[];
  availableFolders: Folder[];
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  promptToEdit,
  availableTags,
  availableFolders,
}) => {
  const [formData, setFormData] = useState<PromptInputData>({
    title: '',
    content: '',
    description: '',
    tags: [],
    folder: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Map tags and folders for react-select
  const tagOptions: SelectOption[] = availableTags.map(tag => ({ value: tag._id, label: tag.name }));
  const folderOptions: SelectOption[] = [
    { value: '', label: 'None' }, // Option to remove folder
    ...availableFolders.map(folder => ({ value: folder._id, label: folder.name }))
  ];

  // Populate form when promptToEdit changes (for editing)
  useEffect(() => {
    if (promptToEdit) {
      setFormData({
        title: promptToEdit.title,
        content: promptToEdit.content,
        description: promptToEdit.description || '',
        tags: promptToEdit.tags.map(tag => tag._id), // Store only IDs
        folder: promptToEdit.folder?._id || null, // Store only ID or null
      });
    } else {
      // Reset form for creating new prompt
      setFormData({ title: '', content: '', description: '', tags: [], folder: null });
    }
    setErrors({}); // Clear errors when modal opens or prompt changes
  }, [promptToEdit, isOpen]); // Rerun when isOpen changes to reset form

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
     if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
    }
  };

  const handleTagChange = (selectedOptions: readonly SelectOption[]) => {
    setFormData(prev => ({ ...prev, tags: selectedOptions.map(option => option.value) }));
  };

  const handleFolderChange = (selectedOption: SelectOption | null) => {
    setFormData(prev => ({ ...prev, folder: selectedOption?.value || null }));
  };

   const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.content.trim()) newErrors.content = 'Content is required';
        // Add more validation as needed
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const toastId = toast.loading(promptToEdit ? 'Updating prompt...' : 'Creating prompt...');

    try {
      let savedPrompt: Prompt;
      if (promptToEdit) {
        savedPrompt = await api.updatePrompt(promptToEdit._id, formData);
        toast.success('Prompt updated successfully!', { id: toastId });
      } else {
        savedPrompt = await api.createPrompt(formData);
        toast.success('Prompt created successfully!', { id: toastId });
      }
      onSave(savedPrompt); // Pass the saved prompt back
      onClose(); // Close modal on success
    } catch (error: any) {
      console.error('Failed to save prompt:', error);
      toast.error(error.message || 'Failed to save prompt.', { id: toastId });
       // Optionally set form-level errors from API response if available
       if (error.errors) {
           setErrors(error.errors);
       }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find selected tag objects for react-select value prop
  const selectedTagValues = tagOptions.filter(option => formData.tags.includes(option.value));
  // Find selected folder object for react-select value prop
  const selectedFolderValue = folderOptions.find(option => option.value === formData.folder) || null;


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={promptToEdit ? 'Edit Prompt' : 'Create New Prompt'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
          />
           {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Content (Prompt Body) */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Prompt Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            rows={8} // Adjust rows as needed
            value={formData.content}
            onChange={handleInputChange}
            required
            className={`mt-1 block w-full px-3 py-2 border ${errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono`} // Monospace font can be good for code/prompts
            placeholder="Enter your prompt here. Use {{variable_name}} for variables."
          />
           {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
           <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
  {'Supports Markdown for display. Use `{{variable_name}}` format for variables.'}
</p>
        </div>

         {/* Folder Selection */}
        <div>
          <label htmlFor="folder" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Folder (Optional)
          </label>
           <Select<SelectOption> // Single select
            id="folder"
            name="folder"
            options={folderOptions}
            value={selectedFolderValue}
            onChange={handleFolderChange}
            isClearable={true}
            placeholder="Select a folder..."
            className="mt-1 react-select-container"
            classNamePrefix="react-select" // Important for applying custom styles
          />
        </div>


        {/* Tag Selection */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tags (Optional)
          </label>
          <Select<SelectOption, true> // Multi-select
            id="tags"
            name="tags"
            isMulti
            options={tagOptions}
            value={selectedTagValues}
            onChange={handleTagChange}
            placeholder="Select tags..."
            className="mt-1 react-select-container"
            classNamePrefix="react-select" // Important for applying custom styles
          />
          {/* Add functionality to create new tags if needed */}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (promptToEdit ? 'Update Prompt' : 'Create Prompt')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PromptEditor;