
import React, { useState } from 'react';
import CustomInput from './ui/CustomInput';
import CustomButton from './ui/CustomButton';
import { Lock, FileText, Plus } from 'lucide-react';
import { createFile } from '@/utils/supabaseUtils';
import { toast } from 'sonner';

interface FileCreationProps {
  onFileCreated: (fileId: string) => void;
}

const FileCreation: React.FC<FileCreationProps> = ({ onFileCreated }) => {
  const [fileName, setFileName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    fileName: '',
    password: ''
  });

  const validate = (): boolean => {
    const newErrors = {
      fileName: '',
      password: ''
    };

    if (!fileName.trim()) {
      newErrors.fileName = 'File name is required';
    } else if (fileName.length < 3) {
      newErrors.fileName = 'File name must be at least 3 characters';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return !newErrors.fileName && !newErrors.password;
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      const newFile = await createFile(fileName, password);
      toast.success('File created successfully');
      onFileCreated(newFile.id);
      // Reset form
      setFileName('');
      setPassword('');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create file');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-scale-in">
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-2xl font-medium mb-6 flex items-center gap-2">
          <Plus size={20} className="text-primary" />
          Create New File
        </h2>
        
        <form onSubmit={handleCreateFile} className="space-y-4">
          <CustomInput
            label="File Name"
            placeholder="Enter a unique file name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            icon={<FileText size={16} />}
            error={errors.fileName}
            autoFocus
          />
          
          <CustomInput
            label="Password"
            type="password"
            placeholder="Create a secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={16} />}
            error={errors.password}
          />
          
          <div className="pt-2">
            <CustomButton
              type="submit"
              className="w-full"
              isLoading={isLoading}
              size="lg"
            >
              Create Secure File
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileCreation;
