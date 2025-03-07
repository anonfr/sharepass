
import React, { useState, useEffect, useRef } from 'react';
import { getFileById, updateFile, deleteFile, FileData, FileContent } from '@/utils/localStorage';
import CustomButton from './ui/CustomButton';
import { Save, Trash2, RefreshCw, LogOut, Image, X } from 'lucide-react';
import { toast } from 'sonner';

interface FileContentProps {
  fileId: string;
  onExit: () => void;
}

const FileContent: React.FC<FileContentProps> = ({ fileId, onExit }) => {
  const [file, setFile] = useState<FileData | null>(null);
  const [textContent, setTextContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load file data
  useEffect(() => {
    const loadFile = () => {
      const fileData = getFileById(fileId);
      if (!fileData) {
        toast.error('File not found');
        onExit();
        return;
      }
      
      setFile(fileData);
      setTextContent(fileData.content.text);
      setImages(fileData.content.images);
    };
    
    loadFile();
  }, [fileId, onExit]);

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [textContent, images]);

  const handleSave = () => {
    if (!file) return;
    
    setIsLoading(true);
    try {
      const updatedContent: FileContent = {
        text: textContent,
        images: images
      };
      
      const updatedFile = updateFile(file.id, updatedContent);
      setFile(updatedFile);
      toast.success('File saved successfully');
    } catch (error) {
      toast.error('Failed to save file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (!file) return;
    
    const refreshedFile = getFileById(file.id);
    if (refreshedFile) {
      setFile(refreshedFile);
      setTextContent(refreshedFile.content.text);
      setImages(refreshedFile.content.images);
      toast.success('File refreshed');
    } else {
      toast.error('Failed to refresh file');
    }
  };

  const handleDelete = () => {
    if (!file) return;
    
    if (window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      try {
        deleteFile(file.id);
        toast.success('File deleted successfully');
        onExit();
      } catch (error) {
        toast.error('Failed to delete file');
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    
    const file = files[0];
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size exceeds 5MB limit');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        const newImages = [...images, event.target.result];
        setImages(newImages);
        
        // Auto save when image is added
        if (file) {
          const updatedContent: FileContent = {
            text: textContent,
            images: newImages
          };
          updateFile(file.id, updatedContent);
        }
      }
    };
    reader.readAsDataURL(file);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    // Auto save when image is removed
    if (file) {
      const updatedContent: FileContent = {
        text: textContent,
        images: newImages
      };
      updateFile(file.id, updatedContent);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!file) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-up">
      <div className="glass-panel rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-medium mb-1">{file.name}</h2>
            <p className="text-xs text-muted-foreground">
              Created: {formatDate(file.createdAt)} • Last updated: {formatDate(file.updatedAt)}
            </p>
          </div>
          
          <div className="flex gap-2">
            <CustomButton
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              icon={<RefreshCw size={14} />}
            >
              Reload
            </CustomButton>
            
            <CustomButton
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              icon={<Image size={14} />}
            >
              Add Image
            </CustomButton>
            
            <CustomButton
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              icon={<Trash2 size={14} />}
            >
              Delete
            </CustomButton>
            
            <CustomButton
              variant="ghost"
              size="sm"
              onClick={onExit}
              icon={<LogOut size={14} />}
            >
              Exit
            </CustomButton>
          </div>
        </div>
        
        {/* Content Area */}
        <div 
          ref={contentRef}
          className="p-4 sm:p-6 max-h-[calc(100vh-20rem)] overflow-y-auto"
        >
          {/* Text content */}
          {textContent && (
            <div className="whitespace-pre-wrap mb-6">
              {textContent}
            </div>
          )}
          
          {/* Images */}
          {images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={img} 
                    alt={`Shared image ${index + 1}`} 
                    className="w-full h-auto rounded-lg shadow-sm object-cover border"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Empty state */}
          {!textContent && images.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                This file is empty. Add some text or images to get started.
              </p>
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <div className="p-4 sm:p-6 border-t">
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Type your content here..."
            className="w-full min-h-[100px] p-3 bg-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
          
          <div className="mt-4 flex justify-end">
            <CustomButton
              onClick={handleSave}
              isLoading={isLoading}
              icon={<Save size={16} />}
            >
              Save Changes
            </CustomButton>
          </div>
          
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default FileContent;
