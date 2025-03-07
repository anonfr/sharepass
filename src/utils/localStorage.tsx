
// Type definitions for our file structure
export interface FileData {
  id: string;
  name: string;
  passwordHash: string;
  content: FileContent;
  createdAt: number;
  updatedAt: number;
}

export interface FileContent {
  text: string;
  images: string[]; // Base64 encoded images
}

// Key for storing files in localStorage
const FILES_STORAGE_KEY = 'easyaccess-files';

// Simple hash function for passwords (for demo purposes only - not secure)
export const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
};

// Get all files from localStorage
export const getAllFiles = (): FileData[] => {
  const filesJson = localStorage.getItem(FILES_STORAGE_KEY);
  if (!filesJson) return [];
  return JSON.parse(filesJson);
};

// Get a single file by ID
export const getFileById = (id: string): FileData | null => {
  const files = getAllFiles();
  return files.find(file => file.id === id) || null;
};

// Get a file by name
export const getFileByName = (name: string): FileData | null => {
  const files = getAllFiles();
  return files.find(file => file.name === name) || null;
};

// Create a new file
export const createFile = (name: string, password: string): FileData => {
  const files = getAllFiles();
  
  // Check if file with same name already exists
  if (files.find(file => file.name === name)) {
    throw new Error('A file with this name already exists');
  }
  
  const newFile: FileData = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2),
    name,
    passwordHash: hashPassword(password),
    content: {
      text: '',
      images: []
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  
  files.push(newFile);
  localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(files));
  
  return newFile;
};

// Update file content
export const updateFile = (id: string, content: FileContent): FileData => {
  const files = getAllFiles();
  const fileIndex = files.findIndex(file => file.id === id);
  
  if (fileIndex === -1) {
    throw new Error('File not found');
  }
  
  files[fileIndex].content = content;
  files[fileIndex].updatedAt = Date.now();
  
  localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(files));
  
  return files[fileIndex];
};

// Authenticate a file access
export const authenticateFile = (name: string, password: string): FileData => {
  const file = getFileByName(name);
  
  if (!file) {
    throw new Error('File not found');
  }
  
  if (file.passwordHash !== hashPassword(password)) {
    throw new Error('Incorrect password');
  }
  
  return file;
};

// Delete a file
export const deleteFile = (id: string): void => {
  let files = getAllFiles();
  files = files.filter(file => file.id !== id);
  localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(files));
};
