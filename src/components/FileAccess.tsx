
import React, { useState } from 'react';
import CustomInput from './ui/CustomInput';
import CustomButton from './ui/CustomButton';
import { Lock, File, LogIn } from 'lucide-react';
import { authenticateFile } from '@/utils/localStorage';
import { toast } from 'sonner';

interface FileAccessProps {
  onFileAccessed: (fileId: string) => void;
}

const FileAccess: React.FC<FileAccessProps> = ({ onFileAccessed }) => {
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
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return !newErrors.fileName && !newErrors.password;
  };

  const handleAccessFile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      const file = authenticateFile(fileName, password);
      toast.success(`Welcome back to "${file.name}"`);
      onFileAccessed(file.id);
      // Reset form
      setFileName('');
      setPassword('');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to access file');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-scale-in">
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-2xl font-medium mb-6 flex items-center gap-2">
          <LogIn size={20} className="text-primary" />
          Access Existing File
        </h2>
        
        <form onSubmit={handleAccessFile} className="space-y-4">
          <CustomInput
            label="File Name"
            placeholder="Enter the file name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            icon={<File size={16} />}
            error={errors.fileName}
            autoFocus
          />
          
          <CustomInput
            label="Password"
            type="password"
            placeholder="Enter the file password"
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
              Access File
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileAccess;
