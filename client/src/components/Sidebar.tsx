import React, { useState } from 'react';
import { Folder as FolderIcon, Tag as TagIcon, PlusCircle, Trash2, Edit2, Inbox, Search, X } from 'lucide-react';
import { Folder, Tag } from '../types';
import * as api from '../services/api'; // Import API functions
import toast from 'react-hot-toast';

interface SidebarProps {
  folders: Folder[];
  tags: Tag[];
  onSelectFolder: (folderId: string | null) => void; // null for 'All Prompts'
  onSelectTag: (tagId: string | null) => void; // null for 'All Prompts'
  onSelectUncategorized: () => void;
  onSearch: (searchTerm: string) => void;
  selectedFolderId?: string | null;
  selectedTagId?: string | null;
  isUncategorizedSelected?: boolean;
  onFolderAdded: (folder: Folder) => void; // Callback when folder is added
  onTagAdded: (tag: Tag) => void; // Callback when tag is added
  onFolderDeleted: (folderId: string) => void; // Callback when folder is deleted
  onTagDeleted: (tagId: string) => void; // Callback when tag is deleted
}

const Sidebar: React.FC<SidebarProps> = ({
  folders,
  tags,
  onSelectFolder,
  onSelectTag,
  onSelectUncategorized,
  onSearch,
  selectedFolderId,
  selectedTagId,
  isUncategorizedSelected,
  onFolderAdded,
  onTagAdded,
  onFolderDeleted,
  onTagDeleted,
}) => {
  const [showAddFolderInput, setShowAddFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showAddTagInput, setShowAddTagInput] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Folder name cannot be empty.');
      return;
    }
    const toastId = toast.loading('Adding folder...');
    try {
      const newFolder = await api.createFolder({ name: newFolderName });
      onFolderAdded(newFolder); // Update state in parent
      setNewFolderName('');
      setShowAddFolderInput(false);
      toast.success('Folder added!', { id: toastId });
    } catch (error: any) {
      console.error('Failed to add folder:', error);
      toast.error(error.message || 'Failed to add folder.', { id: toastId });
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      toast.error('Tag name cannot be empty.');
      return;
    }
    const toastId = toast.loading('Adding tag...');
    try {
      const newTag = await api.createTag({ name: newTagName });
      onTagAdded(newTag); // Update state in parent
      setNewTagName('');
      setShowAddTagInput(false);
      toast.success('Tag added!', { id: toastId });
    } catch (error: any) {
      console.error('Failed to add tag:', error);
      toast.error(error.message || 'Failed to add tag.', { id: toastId });
    }
  };

   const handleDeleteFolder = async (folderId: string, folderName: string) => {
        if (window.confirm(`Are you sure you want to delete the folder "${folderName}"? Prompts inside will become uncategorized.`)) {
            const toastId = toast.loading('Deleting folder...');
            try {
                await api.deleteFolder(folderId);
                onFolderDeleted(folderId); // Update state in parent
                toast.success('Folder deleted!', { id: toastId });
            } catch (error: any) {
                console.error('Failed to delete folder:', error);
                toast.error(error.message || 'Failed to delete folder.', { id: toastId });
            }
        }
    };

    const handleDeleteTag = async (tagId: string, tagName: string) => {
        if (window.confirm(`Are you sure you want to delete the tag "${tagName}"? It will be removed from all associated prompts.`)) {
            const toastId = toast.loading('Deleting tag...');
            try {
                await api.deleteTag(tagId);
                onTagDeleted(tagId); // Update state in parent
                toast.success('Tag deleted!', { id: toastId });
            } catch (error: any) {
                console.error('Failed to delete tag:', error);
                toast.error(error.message || 'Failed to delete tag.', { id: toastId });
            }
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        // Debounce search or search on enter/button click for better performance
        // For simplicity, searching immediately here
        onSearch(e.target.value);
    };

    const clearSearch = () => {
        setSearchTerm('');
        onSearch('');
    };


  // Determine if 'All Prompts' should be active
  const isAllPromptsActive = !selectedFolderId && !selectedTagId && !isUncategorizedSelected;

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-y-auto">
      {/* Search Bar */}
       <div className="relative mb-4">
            <input
                type="text"
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-8 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchTerm && (
                <button onClick={clearSearch} className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <X size={16} />
                </button>
            )}
        </div>

      {/* All Prompts */}
      <nav className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Library</h3>
        <ul>
          <li>
            <button
              onClick={() => { onSelectFolder(null); onSelectTag(null); }} // Clear both filters
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                isAllPromptsActive
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Inbox size={18} className="mr-3" />
              All Prompts
            </button>
          </li>
           <li>
            <button
              onClick={onSelectUncategorized}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                isUncategorizedSelected
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Inbox size={18} className="mr-3 opacity-50" /> {/* Slightly different icon/style? */}
              Uncategorized
            </button>
          </li>
        </ul>
      </nav>

      {/* Folders Section */}
      <nav className="mb-6 flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Folders</h3>
          <button
            onClick={() => setShowAddFolderInput(!showAddFolderInput)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Add Folder"
          >
            <PlusCircle size={16} />
          </button>
        </div>
        {showAddFolderInput && (
          <div className="mb-3 flex items-center space-x-1">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="New folder name"
              className="flex-grow px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddFolder()}
            />
            <button onClick={handleAddFolder} className="p-1 text-blue-500 hover:text-blue-700">✓</button>
            <button onClick={() => setShowAddFolderInput(false)} className="p-1 text-red-500 hover:text-red-700">✕</button>
          </div>
        )}
        <ul>
          {folders.map(folder => (
            <li key={folder._id} className="group flex items-center justify-between">
              <button
                onClick={() => onSelectFolder(folder._id)}
                className={`w-full text-left flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                  selectedFolderId === folder._id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <FolderIcon size={18} className="mr-3 flex-shrink-0" />
                <span className="truncate flex-grow">{folder.name}</span>
              </button>
               <button
                    onClick={() => handleDeleteFolder(folder._id, folder.name)}
                    title="Delete Folder"
                    className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1 flex-shrink-0"
                >
                    <Trash2 size={14} />
                </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Tags Section */}
      <nav>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tags</h3>
           <button
            onClick={() => setShowAddTagInput(!showAddTagInput)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Add Tag"
          >
            <PlusCircle size={16} />
          </button>
        </div>
         {showAddTagInput && (
          <div className="mb-3 flex items-center space-x-1">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="New tag name"
              className="flex-grow px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <button onClick={handleAddTag} className="p-1 text-blue-500 hover:text-blue-700">✓</button>
            <button onClick={() => setShowAddTagInput(false)} className="p-1 text-red-500 hover:text-red-700">✕</button>
          </div>
        )}
        <ul className="space-y-1">
          {tags.map(tag => (
            <li key={tag._id} className="group flex items-center justify-between">
              <button
                onClick={() => onSelectTag(tag._id)}
                className={`w-full text-left flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 ${
                  selectedTagId === tag._id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <TagIcon size={16} className="mr-2 flex-shrink-0" />
                <span className="truncate flex-grow">{tag.name}</span>
              </button>
               <button
                    onClick={() => handleDeleteTag(tag._id, tag.name)}
                    title="Delete Tag"
                    className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1 flex-shrink-0"
                >
                    <Trash2 size={14} />
                </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;