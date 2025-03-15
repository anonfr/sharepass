
import React, { useState } from 'react';
import { z } from 'zod';
import { createFile } from '@/utils/supabaseUtils';
import CustomInput from './ui/CustomInput';
import CustomButton from './ui/CustomButton';
import { Key, FilePlus2 } from 'lucide-react';
import { toast } from 'sonner';

interface FileCreationProps {
  onFileCreated: (fileId: string) => void;
}

const fileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

const FileCreation: React.FC<FileCreationProps> = ({ onFileCreated }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; password?: string }>({});
  
  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    try {
      fileSchema.parse({ name, password });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(formattedErrors);
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      // Create empty file with name and password
      const emptyContent = JSON.stringify({ text: '', images: [] });
      const file = await createFile(name, password, emptyContent);
      
      toast.success(`File "${name}" created successfully`);
      onFileCreated(file.id);
    } catch (error) {
      console.error('Error creating file:', error);
      let errorMessage = 'Failed to create file';
      
      // Check if it's a name uniqueness error
      if (error instanceof Error && error.message.includes('unique')) {
        errorMessage = 'A file with this name already exists';
        setErrors({ name: errorMessage });
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="glass-panel p-6 rounded-xl animate-fade-in">
      <form onSubmit={handleCreateFile} className="space-y-6">
        <div className="space-y-4">
          <CustomInput
            label="File Name"
            id="name"
            value={name}
            onChange={setName}
            placeholder="Enter a unique file name"
            icon={<FilePlus2 size={18} />}
            error={errors.name}
            disabled={isLoading}
            required
          />
          
          <CustomInput
            label="Password"
            id="password"
            value={password}
            onChange={setPassword}
            placeholder="Create a password to protect your file"
            type="password"
            icon={<Key size={18} />}
            error={errors.password}
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="pt-2">
          <CustomButton 
            type="submit" 
            className="w-full"
            isLoading={isLoading}
          >
            Create Secure File
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default FileCreation;
