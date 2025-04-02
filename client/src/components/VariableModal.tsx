import React, { useState, useEffect, useMemo } from 'react';
import Modal from './common/Modal';
import { extractVariables, substituteVariables } from '../utils/variableUtils';
import { ClipboardCopy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface VariableModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptContent: string;
  promptTitle: string;
}

const VariableModal: React.FC<VariableModalProps> = ({ isOpen, onClose, promptContent, promptTitle }) => {
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [previewContent, setPreviewContent] = useState<string>(promptContent);
  const [isCopied, setIsCopied] = useState(false);

  const variables = useMemo(() => extractVariables(promptContent), [promptContent]);

  // Reset state when modal opens or prompt changes
  useEffect(() => {
    if (isOpen) {
      const initialValues: Record<string, string> = {};
      variables.forEach(v => initialValues[v] = '');
      setVariableValues(initialValues);
      // Set initial preview to the raw content with placeholders
      setPreviewContent(promptContent);
      setIsCopied(false);
    }
  }, [isOpen, promptContent, variables]); // Added promptContent and variables dependency

  // Update preview whenever variable values change
  useEffect(() => {
    // Create an object containing only the variables that have non-empty values
    const filledValues: Record<string, string> = {};
    for (const variable in variableValues) {
      // Check if the value exists and is not just whitespace
      if (variableValues[variable] && variableValues[variable].trim() !== '') {
        filledValues[variable] = variableValues[variable];
      }
    }
    // Generate the preview by substituting only the filled variables into the original prompt content
    setPreviewContent(substituteVariables(promptContent, filledValues));

  }, [variableValues, promptContent]); // Depends on values and original content

  const handleInputChange = (variableName: string, value: string) => {
    setVariableValues(prev => ({ ...prev, [variableName]: value }));
  };

  const handleCopyToClipboard = async () => {
    // IMPORTANT: For the final copy, use the original substituteVariables logic
    // which replaces *all* variables (including empty ones with '')
    const finalPromptText = substituteVariables(promptContent, variableValues);
    try {
      await navigator.clipboard.writeText(finalPromptText);
      setIsCopied(true);
      toast.success('Prompt copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy prompt.');
    }
  };

  // ... rest of the component remains the same (JSX structure) ...

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Use Prompt: ${promptTitle}`} size="lg">
      {/* ... (No changes needed in the JSX structure below) ... */}
      {variables.length === 0 ? (
        // ... no variables case ...
         <div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">This prompt has no variables.</p>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-4 max-h-60 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">{promptContent}</pre>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleCopyToClipboard} // Still uses the correct final text
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isCopied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150`}
            >
              {isCopied ? <Check size={18} className="mr-2" /> : <ClipboardCopy size={18} className="mr-2" />}
              {isCopied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        </div>
      ) : (
        // ... case with variables ...
        <div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Fill in the variables below:</p>
          <div className="space-y-4 mb-6">
            {variables.map(variable => (
              <div key={variable}>
                <label htmlFor={variable} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {variable}
                </label>
                <input
                  type="text"
                  id={variable}
                  name={variable}
                  value={variableValues[variable] || ''}
                  onChange={(e) => handleInputChange(variable, e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder={`Enter value for ${variable}`}
                />
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">Preview:</h4>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md max-h-60 overflow-y-auto">
              {/* This previewContent is now correctly updated by the modified useEffect */}
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">{previewContent}</pre>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCopyToClipboard} // Still uses the correct final text
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isCopied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150`}
            >
              {isCopied ? <Check size={18} className="mr-2" /> : <ClipboardCopy size={18} className="mr-2" />}
              {isCopied ? 'Copied!' : 'Copy Final Prompt'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default VariableModal;