
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileCreation from '@/components/FileCreation';
import FileAccess from '@/components/FileAccess';
import FileContent from '@/components/FileContent';
import ThemeToggle from '@/components/ThemeToggle';
import { LockKeyhole, Sparkles, KeyRound, Lock } from 'lucide-react';

const Index = () => {
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("create");

  const handleFileCreated = (fileId: string) => {
    setActiveFileId(fileId);
  };

  const handleFileAccessed = (fileId: string) => {
    setActiveFileId(fileId);
  };

  const handleExit = () => {
    setActiveFileId(null);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
      {/* Decorative Lock on left side */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden lg:block z-0 opacity-10">
        <LockKeyhole size={200} className="text-primary animate-pulse-slow" />
      </div>

      {/* Decorative Key on right side */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 hidden lg:block z-0 opacity-10">
        <KeyRound size={200} className="text-primary animate-pulse-slow" />
      </div>

      {/* Header/Hero section */}
      <div className="w-full py-10 md:py-16 px-4 z-10">
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
      <div className="flex-1 w-full px-4 pb-16 z-10">
        <div className="max-w-6xl mx-auto">
          {!activeFileId ? <>
              <Tabs 
                defaultValue="create" 
                value={activeTab}
                onValueChange={handleTabChange} 
                className="w-full max-w-md mx-auto"
              >
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="create" className="relative">
                    <div className="flex items-center gap-2">
                      <Lock size={16} className={`transition-all duration-300 ${activeTab === "create" ? "text-primary" : "text-muted-foreground"}`} />
                      <span>Create File</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="access" className="relative">
                    <div className="flex items-center gap-2">
                      <KeyRound size={16} className={`transition-all duration-300 ${activeTab === "access" ? "text-primary" : "text-muted-foreground"}`} />
                      <span>Access File</span>
                    </div>
                  </TabsTrigger>
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
      
      {/* Footer */}
      <footer className="w-full py-6 border-t z-10">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Created by Niyaz Khan, Kiran Nagre, Hariom Mane, Saurabh Khandare </p>
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
