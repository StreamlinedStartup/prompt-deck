import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Prompt, Folder, Tag } from '../types';
import PromptCard from './PromptCard';
import PromptEditor from './PromptEditor';
import VariableModal from './VariableModal';
import { usePrompts, useFolders, useTags } from '../hooks/useApi';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import * as api from '../services/api'; // Import API for delete

const Layout: React.FC = () => {
  const { folders, addFolder, removeFolder } = useFolders();
  const { tags, addTag, removeTag } = useTags();
  const {
      prompts,
      loading: promptsLoading,
      error: promptsError,
      addPrompt,
      updatePromptInList,
      removePrompt,
      applyFilter,
      currentFilter
    } = usePrompts(); // Use the prompts hook

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [promptToEdit, setPromptToEdit] = useState<Prompt | null>(null);
  const [isVariableModalOpen, setIsVariableModalOpen] = useState(false);
  const [promptForVariables, setPromptForVariables] = useState<Prompt | null>(null);

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [isUncategorizedSelected, setIsUncategorizedSelected] = useState<boolean>(false);


  const handleSelectFolder = (folderId: string | null) => {
    setSelectedFolderId(folderId);
    setSelectedTagId(null); // Clear tag filter when folder changes
    setIsUncategorizedSelected(false);
    applyFilter({ folderId: folderId ?? undefined }); // Pass undefined if null
  };

  const handleSelectTag = (tagId: string | null) => {
    setSelectedTagId(tagId);
    setSelectedFolderId(null); // Clear folder filter when tag changes
    setIsUncategorizedSelected(false);
    applyFilter({ tagId: tagId ?? undefined }); // Pass undefined if null
  };

   const handleSelectUncategorized = () => {
    setSelectedFolderId(null);
    setSelectedTagId(null);
    setIsUncategorizedSelected(true);
    applyFilter({ folderId: 'uncategorized' }); // Special filter value
  };

  const handleSearch = (searchTerm: string) => {
    // When searching, clear specific folder/tag selections in UI state
    // but keep them potentially in the filter if needed, or clear them too
    setSelectedFolderId(null);
    setSelectedTagId(null);
    setIsUncategorizedSelected(false);
    applyFilter({ search: searchTerm || undefined }); // Apply search term
  };


  const handleOpenEditor = (prompt: Prompt | null = null) => {
    setPromptToEdit(prompt);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setPromptToEdit(null); // Clear editing state
  };

  const handleSavePrompt = (savedPrompt: Prompt) => {
    if (promptToEdit) {
      updatePromptInList(savedPrompt); // Update existing in list
    } else {
      addPrompt(savedPrompt); // Add new to list
    }
    // Optionally refetch prompts if filtering/sorting might change order significantly
    // fetchPrompts(currentFilter);
  };

  const handleDeletePrompt = async (promptId: string) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      const toastId = toast.loading('Deleting prompt...');
      try {
        await api.deletePrompt(promptId);
        removePrompt(promptId); // Remove from local state
        toast.success('Prompt deleted successfully!', { id: toastId });
      } catch (error: any) {
        console.error('Failed to delete prompt:', error);
        toast.error(error.message || 'Failed to delete prompt.', { id: toastId });
      }
    }
  };

  const handleOpenVariableModal = (prompt: Prompt) => {
    setPromptForVariables(prompt);
    setIsVariableModalOpen(true);
  };

  const handleCloseVariableModal = () => {
    setIsVariableModalOpen(false);
    setPromptForVariables(null);
  };

  // Handle folder/tag updates from sidebar actions
    const handleFolderAdded = (folder: Folder) => {
        addFolder(folder);
    };
    const handleTagAdded = (tag: Tag) => {
        addTag(tag);
    };
    const handleFolderDeleted = (folderId: string) => {
        removeFolder(folderId);
        // If the deleted folder was selected, reset filter to 'All Prompts'
        if (selectedFolderId === folderId) {
            handleSelectFolder(null);
        }
    };
    const handleTagDeleted = (tagId: string) => {
        removeTag(tagId);
        // If the deleted tag was selected, reset filter to 'All Prompts'
        if (selectedTagId === tagId) {
            handleSelectTag(null);
        }
    };


  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        folders={folders}
        tags={tags}
        onSelectFolder={handleSelectFolder}
        onSelectTag={handleSelectTag}
        onSelectUncategorized={handleSelectUncategorized}
        onSearch={handleSearch}
        selectedFolderId={selectedFolderId}
        selectedTagId={selectedTagId}
        isUncategorizedSelected={isUncategorizedSelected}
        onFolderAdded={handleFolderAdded}
        onTagAdded={handleTagAdded}
        onFolderDeleted={handleFolderDeleted}
        onTagDeleted={handleTagDeleted}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header/Toolbar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Prompt Library</h1>
          <button
            onClick={() => handleOpenEditor()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus size={18} className="-ml-1 mr-2" />
            New Prompt
          </button>
        </header>

        {/* Prompt Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {promptsLoading && <p className="text-center text-gray-500 dark:text-gray-400">Loading prompts...</p>}
          {promptsError && <p className="text-center text-red-500">Error: {promptsError}</p>}
          {!promptsLoading && !promptsError && prompts.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">No prompts found. Create one!</p>
          )}
          {!promptsLoading && !promptsError && prompts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {prompts.map(prompt => (
                <PromptCard
                  key={prompt._id}
                  prompt={prompt}
                  onEdit={handleOpenEditor}
                  onDelete={handleDeletePrompt}
                  onCopy={handleOpenVariableModal}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Prompt Editor Modal */}
      {isEditorOpen && (
        <PromptEditor
          isOpen={isEditorOpen}
          onClose={handleCloseEditor}
          onSave={handleSavePrompt}
          promptToEdit={promptToEdit}
          availableTags={tags}
          availableFolders={folders}
        />
      )}

      {/* Variable Substitution Modal */}
      {isVariableModalOpen && promptForVariables && (
        <VariableModal
          isOpen={isVariableModalOpen}
          onClose={handleCloseVariableModal}
          promptContent={promptForVariables.content}
          promptTitle={promptForVariables.title}
        />
      )}
    </div>
  );
};

export default Layout;