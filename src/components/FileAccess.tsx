
import React, { useState } from 'react';
import { z } from 'zod';
import { authenticateFile } from '@/utils/supabaseUtils';
import CustomInput from './ui/CustomInput';
import CustomButton from './ui/CustomButton';
import { File, Key } from 'lucide-react';
import { toast } from 'sonner';

interface FileAccessProps {
  onFileAccessed: (fileId: string) => void;
}

const accessSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(1, 'Password is required'),
});

const FileAccess: React.FC<FileAccessProps> = ({ onFileAccessed }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; password?: string }>({});
  
  const handleAccessFile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    try {
      accessSchema.parse({ name, password });
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
      const file = await authenticateFile(name, password);
      toast.success(`Access granted to "${name}"`);
      onFileAccessed(file.id);
    } catch (error) {
      console.error('Error accessing file:', error);
      
      let errorMessage = 'Failed to access file';
      let errorField: 'name' | 'password' = 'name';
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          errorMessage = 'File not found';
          errorField = 'name';
        } else if (error.message.includes('password')) {
          errorMessage = 'Incorrect password';
          errorField = 'password';
        }
      }
      
      setErrors({ [errorField]: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="glass-panel p-6 rounded-xl animate-fade-in">
      <form onSubmit={handleAccessFile} className="space-y-6">
        <div className="space-y-4">
          <CustomInput
            label="File Name"
            id="name"
            value={name}
            onChange={setName}
            placeholder="Enter the file name"
            icon={<File size={18} />}
            error={errors.name}
            disabled={isLoading}
            required
          />
          
          <CustomInput
            label="Password"
            id="password"
            value={password}
            onChange={setPassword}
            placeholder="Enter the file password"
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
            Access File
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default FileAccess;
