import { supabase } from '@/integrations/supabase/client';
import { createHash } from 'crypto';

// Define types that were missing exports
export interface FileContent {
  text: string;
  images: string[];
}

export interface FileData {
  id: string;
  name: string;
  content: FileContent;
  createdAt: number;
  updatedAt: number;
}

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

// Create a new file
export const createFile = async (name: string, password: string): Promise<FileData> => {
  const passwordHash = hashPassword(password);
  
  // Check if file with same name already exists
  const { data: existingFile } = await supabase
    .from('files')
    .select('id')
    .eq('name', name)
    .maybeSingle();
    
  if (existingFile) {
    throw new Error('A file with this name already exists');
  }
  
  // Create the file in Supabase
  const { data: newFile, error } = await supabase
    .from('files')
    .insert({
      name,
      password_hash: passwordHash,
      content: ''
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating file:', error);
    throw new Error('Failed to create file');
  }
  
  return {
    id: newFile.id,
    name: newFile.name,
    passwordHash: newFile.password_hash,
    content: {
      text: newFile.content || '',
      images: []
    },
    createdAt: new Date(newFile.created_at).getTime(),
    updatedAt: new Date(newFile.updated_at).getTime()
  };
};

// Get a file by name
export const getFileByName = async (name: string): Promise<FileData | null> => {
  const { data: file, error } = await supabase
    .from('files')
    .select('*')
    .eq('name', name)
    .maybeSingle();
  
  if (error || !file) {
    return null;
  }
  
  // Get the images for the file
  const { data: images } = await supabase
    .from('file_images')
    .select('image_data')
    .eq('file_id', file.id);
  
  return {
    id: file.id,
    name: file.name,
    passwordHash: file.password_hash,
    content: {
      text: file.content || '',
      images: images ? images.map(img => img.image_data) : []
    },
    createdAt: new Date(file.created_at).getTime(),
    updatedAt: new Date(file.updated_at).getTime()
  };
};

// Get a file by ID
export const getFileById = async (id: string): Promise<FileData | null> => {
  const { data: file, error } = await supabase
    .from('files')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error || !file) {
    return null;
  }
  
  // Get the images for the file
  const { data: images } = await supabase
    .from('file_images')
    .select('image_data')
    .eq('file_id', file.id);
  
  return {
    id: file.id,
    name: file.name,
    passwordHash: file.password_hash,
    content: {
      text: file.content || '',
      images: images ? images.map(img => img.image_data) : []
    },
    createdAt: new Date(file.created_at).getTime(),
    updatedAt: new Date(file.updated_at).getTime()
  };
};

// Update file content
export const updateFile = async (id: string, content: FileContent): Promise<FileData> => {
  // Update the text content
  const { data: updatedFile, error } = await supabase
    .from('files')
    .update({
      content: content.text,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating file:', error);
    throw new Error('Failed to update file');
  }
  
  // Delete existing images
  await supabase
    .from('file_images')
    .delete()
    .eq('file_id', id);
  
  // Insert new images
  if (content.images.length > 0) {
    const imageObjects = content.images.map(imageData => ({
      file_id: id,
      image_data: imageData
    }));
    
    const { error: imageError } = await supabase
      .from('file_images')
      .insert(imageObjects);
    
    if (imageError) {
      console.error('Error updating images:', imageError);
      throw new Error('Failed to update images');
    }
  }
  
  // Get the updated images
  const { data: images } = await supabase
    .from('file_images')
    .select('image_data')
    .eq('file_id', id);
  
  return {
    id: updatedFile.id,
    name: updatedFile.name,
    passwordHash: updatedFile.password_hash,
    content: {
      text: updatedFile.content || '',
      images: images ? images.map(img => img.image_data) : []
    },
    createdAt: new Date(updatedFile.created_at).getTime(),
    updatedAt: new Date(updatedFile.updated_at).getTime()
  };
};

// Delete a file
export const deleteFile = async (id: string): Promise<void> => {
  // File images will be automatically deleted due to CASCADE
  const { error } = await supabase
    .from('files')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
};

// Authenticate a file access
export const authenticateFile = async (name: string, password: string): Promise<FileData> => {
  const file = await getFileByName(name);
  
  if (!file) {
    throw new Error('File not found');
  }
  
  if (file.passwordHash !== hashPassword(password)) {
    throw new Error('Incorrect password');
  }
  
  return file;
};
