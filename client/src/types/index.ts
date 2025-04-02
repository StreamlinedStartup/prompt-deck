// Corresponds to Backend Models

export interface Tag {
    _id: string;
    name: string;
    color?: string;
    createdAt: string; // Dates are strings when received from JSON
  }
  
  export interface Folder {
    _id: string;
    name: string;
    description?: string;
    createdAt: string;
  }
  
  export interface Prompt {
    _id: string;
    title: string;
    content: string;
    description?: string;
    tags: Tag[]; // Populated tags
    folder?: Folder | null; // Populated folder or null
    createdAt: string;
    updatedAt: string;
  }
  
  // For API responses or form data where only IDs might be used initially
  export interface PromptInputData {
    title: string;
    content: string;
    description?: string;
    tags: string[]; // Array of tag IDs
    folder?: string | null; // Folder ID or null/empty string
  }
  
  // For react-select options
  export interface SelectOption {
      value: string;
      label: string;
  }