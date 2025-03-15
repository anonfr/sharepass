
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileCreation from '@/components/FileCreation';
import FileAccess from '@/components/FileAccess';
import FileContent from '@/components/FileContent';
import { LockKeyhole, Sparkles } from 'lucide-react';

const Index = () => {
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  
  const handleFileCreated = (fileId: string) => {
    setActiveFileId(fileId);
  };
  
  const handleFileAccessed = (fileId: string) => {
    setActiveFileId(fileId);
  };
  
  const handleExit = () => {
    setActiveFileId(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative background images */}
      <div className="fixed top-0 left-0 w-1/6 h-full opacity-10 z-0 hidden md:block">
        <img 
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
          alt="Decorative background" 
          className="w-full h-1/3 object-cover object-center"
        />
        <img 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
          alt="Decorative background" 
          className="w-full h-1/3 object-cover object-center"
        />
        <img 
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
          alt="Decorative background" 
          className="w-full h-1/3 object-cover object-center"
        />
      </div>
      
      <div className="fixed top-0 right-0 w-1/6 h-full opacity-10 z-0 hidden md:block">
        <img 
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" 
          alt="Decorative background" 
          className="w-full h-1/3 object-cover object-center"
        />
        <img 
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f" 
          alt="Decorative background" 
          className="w-full h-1/3 object-cover object-center"
        />
        <img 
          src="https://images.unsplash.com/photo-1531297484001-80022131f5a1" 
          alt="Decorative background" 
          className="w-full h-1/3 object-cover object-center"
        />
      </div>
      
      {/* Main content - now with z-10 to ensure it's above the background images */}
      <div className="w-full py-10 md:py-16 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 text-primary">
              <LockKeyhole size={28} className="animate-pulse-soft" />
              <span className="text-2xl font-semibold tracking-tight">EasyAccess</span>
            </div>
          </div>
          
          {!activeFileId && <div className="text-center max-w-2xl mx-auto mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
                Share content securely with just a name & password
              </h1>
              <p className="text-lg text-muted-foreground">
                No registration required. Create a file, set a password, and share text & images instantly.
              </p>
            </div>}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 w-full px-4 pb-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {!activeFileId ? <>
              <Tabs defaultValue="create" className="w-full max-w-md mx-auto">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="create">Create File</TabsTrigger>
                  <TabsTrigger value="access">Access File</TabsTrigger>
                </TabsList>
                <TabsContent value="create">
                  <FileCreation onFileCreated={handleFileCreated} />
                </TabsContent>
                <TabsContent value="access">
                  <FileAccess onFileAccessed={handleFileAccessed} />
                </TabsContent>
              </Tabs>
              
              {/* Features section */}
              <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <FeatureCard title="No Registration" description="Jump right in without creating an account or providing personal information." />
                <FeatureCard title="Password Protected" description="Your content is secured with a password that only you and your recipients know." />
                <FeatureCard title="Text & Images" description="Share formatted text and images all in one secure, easy-to-access location." />
              </div>
            </> : <FileContent fileId={activeFileId} onExit={handleExit} />}
        </div>
      </div>
      
      {/* Additional decorative images for the bottom of the page */}
      <div className="fixed bottom-16 left-4 w-20 h-20 opacity-10 z-0 hidden lg:block">
        <img 
          src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b" 
          alt="Light bulb idea" 
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      
      <div className="fixed bottom-16 right-4 w-20 h-20 opacity-10 z-0 hidden lg:block">
        <img 
          src="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9" 
          alt="Tech device" 
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      
      {/* Footer */}
      <footer className="w-full py-6 border-t relative z-10">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Created by Dhammanand Gaikwad</p>
        </div>
      </footer>
    </div>
  );
};

// Feature card component
const FeatureCard = ({
  title,
  description
}: {
  title: string;
  description: string;
}) => {
  return <div className="glass-panel p-6 rounded-xl animate-fade-in">
      <div className="flex items-center gap-2 mb-3 text-primary">
        <Sparkles size={18} />
        <h3 className="font-medium text-lg">{title}</h3>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>;
};

export default Index;
