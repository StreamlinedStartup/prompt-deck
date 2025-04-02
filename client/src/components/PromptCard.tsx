import React from 'react';
import { Prompt } from '../types';
import ReactMarkdown from 'react-markdown';
import { Edit, Trash2, Copy } from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (promptId: string) => void;
  onCopy: (prompt: Prompt) => void; // Trigger variable modal
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onEdit, onDelete, onCopy }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 border border-gray-200 dark:border-gray-700 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{prompt.title}</h3>
        {prompt.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{prompt.description}</p>
        )}
        {/* Show a snippet or limited height preview of content */}
        <div className="prose prose-sm dark:prose-invert max-w-none max-h-24 overflow-hidden mb-3 text-gray-700 dark:text-gray-300">
           {/* Use ReactMarkdown for content display */}
           <ReactMarkdown>{prompt.content}</ReactMarkdown>
        </div>
        {/* Display Folder */}
        {prompt.folder && (
            <div className="mb-3 text-xs font-medium text-blue-600 dark:text-blue-400">
                Folder: {prompt.folder.name}
            </div>
        )}
        {/* Display Tags */}
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {prompt.tags.map(tag => (
              <span key={tag._id} className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-full">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end items-center space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
         <button
          onClick={() => onCopy(prompt)}
          title="Use Prompt"
          className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Copy size={18} />
        </button>
        <button
          onClick={() => onEdit(prompt)}
           title="Edit Prompt"
          className="p-1.5 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => onDelete(prompt._id)}
           title="Delete Prompt"
          className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default PromptCard;